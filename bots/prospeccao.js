const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'))
const DISPAROS_FILE = path.join(__dirname, '..', 'dados', 'disparos.json')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function detectarNicho(nome, categoria = '') {
  const texto = (nome + ' ' + categoria).toLowerCase()
  for (const [nicho, palavras] of Object.entries(CONFIG.nichos)) {
    if (palavras.some(p => texto.includes(p))) return nicho
  }
  return 'default'
}

function montarMensagem(lead, nicho) {
  const template = CONFIG.mensagens[nicho] || CONFIG.mensagens.default
  const preview = CONFIG.previews[nicho] || CONFIG.previews.default
  return template
    .replace(/{nome}/g, lead.name || lead.nome || 'vocês')
    .replace(/{nota}/g, lead.rating || lead.nota || '?')
    .replace(/{avaliacoes}/g, lead.reviews || lead.avaliacoes || '?')
    .replace(/{preview}/g, preview)
}

function lerLeads(arquivo) {
  const conteudo = fs.readFileSync(arquivo, 'utf8')
  const linhas = conteudo.trim().split('\n')
  const cabecalho = linhas[0].split(',').map(c => c.trim().replace(/"/g, ''))
  return linhas.slice(1).map(linha => {
    const valores = linha.split(',').map(v => v.trim().replace(/"/g, ''))
    return Object.fromEntries(cabecalho.map((c, i) => [c, valores[i] || '']))
  })
}

function registrarDisparo(lead, nicho, preview, ok) {
  let disparos = []
  if (fs.existsSync(DISPAROS_FILE)) {
    try { disparos = JSON.parse(fs.readFileSync(DISPAROS_FILE, 'utf8')) } catch {}
  }
  disparos.push({
    data: new Date().toISOString(),
    nome: lead.name || lead.nome,
    numero: lead.phone || lead.telefone,
    nicho, preview, enviado: ok
  })
  fs.mkdirSync(path.dirname(DISPAROS_FILE), { recursive: true })
  fs.writeFileSync(DISPAROS_FILE, JSON.stringify(disparos, null, 2), 'utf8')
}

async function main() {
  const arquivo = process.argv[2] || path.join(__dirname, '..', 'dados', 'leads.csv')
  if (!fs.existsSync(arquivo)) {
    console.log(`Arquivo não encontrado: ${arquivo}`)
    console.log('Uso: node prospeccao.js caminho/leads.csv')
    process.exit(1)
  }

  const leads = lerLeads(arquivo).filter(l => l.phone || l.telefone)
  console.log(`=== Bot de Prospecção — ${leads.length} leads ===\n`)

  const { state, saveCreds } = await useMultiFileAuthState('sessao-whatsapp')
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: require('pino')({ level: 'silent' })
  })

  sock.ev.on('creds.update', saveCreds)

  await new Promise(resolve => {
    sock.ev.on('connection.update', ({ connection, qr }) => {
      if (qr) {
        console.log('\n📱 Escaneie o QR code com seu WhatsApp Business:\n')
        qrcode.generate(qr, { small: true })
      }
      if (connection === 'open') {
        console.log('✅ WhatsApp conectado!\n')
        resolve()
      }
    })
  })

  let enviados = 0
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i]
    const nome = lead.name || lead.nome || ''
    const telefone = (lead.phone || lead.telefone || '').replace(/\D/g, '')
    const numero = (telefone.startsWith('55') ? telefone : '55' + telefone) + '@s.whatsapp.net'

    const nicho = detectarNicho(nome, lead.category || lead.categoria || '')
    const preview = CONFIG.previews[nicho] || CONFIG.previews.default
    const mensagem = montarMensagem(lead, nicho)

    console.log(`[${i + 1}/${leads.length}] ${nome} | ${nicho} | ${telefone}`)

    try {
      await sock.sendMessage(numero, { text: mensagem })
      registrarDisparo(lead, nicho, preview, true)
      enviados++
      console.log(`  ✅ enviado\n`)
    } catch (e) {
      registrarDisparo(lead, nicho, preview, false)
      console.log(`  ❌ falhou: ${e.message}\n`)
    }

    if (i < leads.length - 1) {
      const pausa = 60000 + Math.random() * 60000 // 60-120s
      console.log(`  ⏳ aguardando ${Math.round(pausa / 1000)}s...\n`)
      await sleep(pausa)
    }
  }

  console.log(`\n=== Concluído: ${enviados}/${leads.length} enviadas ===`)
  console.log(`Registro em: ${DISPAROS_FILE}`)
  process.exit(0)
}

main()
