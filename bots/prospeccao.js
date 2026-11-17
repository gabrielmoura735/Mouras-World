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
  let conteudo = fs.readFileSync(arquivo, 'utf8').replace(/^﻿/, '')
  const linhas = conteudo.trim().split(/\r?\n/)
  // detecta separador: ';' (planilha do scraper) ou ',' (csv do bot)
  const sep = (linhas[0].split(';').length > linhas[0].split(',').length) ? ';' : ','
  const cabecalho = linhas[0].split(sep).map(c => c.trim().replace(/"/g, '').toLowerCase())
  return linhas.slice(1).filter(l => l.trim()).map(linha => {
    const valores = linha.split(sep).map(v => v.trim().replace(/"/g, ''))
    return Object.fromEntries(cabecalho.map((c, i) => [c, valores[i] || '']))
  })
}

function soDigitos(s) { return (s || '').replace(/\D/g, '') }

function numerosJaEnviados() {
  const set = new Set()
  if (fs.existsSync(DISPAROS_FILE)) {
    try {
      const d = JSON.parse(fs.readFileSync(DISPAROS_FILE, 'utf8'))
      for (const r of d) if (r.enviado) set.add(soDigitos(r.numero))
    } catch {}
  }
  return set
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

  const jaEnviados = numerosJaEnviados()
  let enviados = 0, pulados = 0
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i]
    const nome = lead.name || lead.nome || lead.empresa || 'vocês'
    const telefone = soDigitos(lead.phone || lead.telefone || lead.whatsapp)
    const numeroBr = telefone.startsWith('55') ? telefone : '55' + telefone
    const numero = numeroBr + '@s.whatsapp.net'

    const nicho = lead.nicho || detectarNicho(nome, lead.category || lead.categoria || '')
    const nota = lead.nota || lead.rating || '?'
    const avaliacoes = lead.avaliacoes || lead['avaliações'] || lead.reviews || '?'
    const previewUrl = lead.preview_url || lead.previewurl || ''
    const preview = previewUrl || CONFIG.previews[nicho] || CONFIG.previews.default

    if (jaEnviados.has(numeroBr)) {
      pulados++
      console.log(`[${i + 1}/${leads.length}] ${nome} | ${telefone} — já contatado, pulando\n`)
      continue
    }

    console.log(`[${i + 1}/${leads.length}] ${nome} | ${nicho} | ${telefone}`)

    // Monta as duas mensagens (v2) ou cai pro template antigo de uma mensagem
    const usarV2 = CONFIG.mensagens_v2 && previewUrl
    const subst = (t) => t
      .replace(/{nome}/g, nome).replace(/{nota}/g, nota)
      .replace(/{avaliacoes}/g, avaliacoes).replace(/{preview_url}/g, previewUrl).replace(/{preview}/g, preview)

    try {
      if (usarV2) {
        await sock.sendMessage(numero, { text: subst(CONFIG.mensagens_v2.apresentacao) })
        try { await sock.sendPresenceUpdate('composing', numero) } catch {}
        await sleep(6000 + Math.random() * 4000) // 6-10s "digitando"
        await sock.sendMessage(numero, { text: subst(CONFIG.mensagens_v2.preview) })
      } else {
        await sock.sendMessage(numero, { text: montarMensagem(lead, nicho) })
      }
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

  console.log(`\n=== Concluído: ${enviados}/${leads.length} enviadas (${pulados} puladas) ===`)
  console.log(`Registro em: ${DISPAROS_FILE}`)
  process.exit(0)
}

main()
