const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const qrcode = require('qrcode-terminal')
const Groq = require('groq-sdk')
const fs = require('fs')
const path = require('path')

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'))
const groq = new Groq({ apiKey: CONFIG.groq_api_key })

// histórico de conversa por número (RAM)
const historicos = {}

function detectarNicho(texto) {
  texto = texto.toLowerCase()
  for (const [nicho, palavras] of Object.entries(CONFIG.nichos)) {
    if (palavras.some(p => texto.includes(p))) return nicho
  }
  return 'default'
}

function interesseClaro(texto) {
  const sinais = ['quero', 'quanto custa', 'valor', 'preço', 'quando pode', 'pode fazer', 'topei', 'fechado', 'bora', 'vamos', 'aceito', 'combinado']
  return sinais.some(s => texto.toLowerCase().includes(s))
}

async function responderComIA(numero, mensagem) {
  if (!historicos[numero]) historicos[numero] = []
  historicos[numero].push({ role: 'user', content: mensagem })

  // limita a 10 pares de mensagens
  if (historicos[numero].length > 20) historicos[numero] = historicos[numero].slice(-20)

  try {
    const resp = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 250,
      messages: [
        { role: 'system', content: CONFIG.system_prompt },
        ...historicos[numero]
      ]
    })
    const resposta = resp.choices[0].message.content.trim()
    historicos[numero].push({ role: 'assistant', content: resposta })
    return resposta
  } catch (e) {
    console.error('Erro Groq:', e.message)
    return 'Oi! Tive um probleminha técnico aqui. Pode chamar de novo em instantes? 😅'
  }
}

async function conectar() {
  const { state, saveCreds } = await useMultiFileAuthState('sessao-whatsapp')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: require('pino')({ level: 'silent' })
  })

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('\n📱 Escaneie o QR code com seu WhatsApp Business:\n')
      qrcode.generate(qr, { small: true })
    }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('Conexão fechada. Reconectando:', shouldReconnect)
      if (shouldReconnect) conectar()
    }
    if (connection === 'open') {
      console.log('✅ WhatsApp conectado!')
      console.log('Bot rodando. Aguardando mensagens...\n')
    }
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (const msg of messages) {
      if (msg.key.fromMe) continue // ignora mensagens próprias
      const numero = msg.key.remoteJid
      if (!numero || numero.includes('@g.us')) continue // ignora grupos

      const texto = (
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        ''
      ).trim()

      if (!texto) continue

      const numeroLimpo = numero.split('@')[0]
      console.log(`[${new Date().toLocaleTimeString()}] ${numeroLimpo}: ${texto.substring(0, 60)}`)

      const resposta = await responderComIA(numeroLimpo, texto)
      await sock.sendMessage(numero, { text: resposta })
      console.log(`  → Bot: ${resposta.substring(0, 60)}\n`)

      // notifica Gabriel se houver interesse claro
      if (interesseClaro(texto) && CONFIG.gabriel_whatsapp !== '5511XXXXXXXXX') {
        const aviso = `🔔 Lead com interesse!\nNúmero: ${numeroLimpo}\nDisse: ${texto.substring(0, 100)}`
        await sock.sendMessage(CONFIG.gabriel_whatsapp + '@s.whatsapp.net', { text: aviso })
      }
    }
  })
}

console.log('🤖 Iniciando bot WhatsApp...')
console.log('Pressione Ctrl+C para parar\n')
conectar()
