# Bots de Prospecção e Atendimento — 100% Grátis

**Stack:** Baileys (WhatsApp) + Groq API (IA gratuita) + Node.js

Custo total: **R$ 0/mês**

---

## Setup (10 minutos)

### 1. Instalar dependências
Abrir o terminal dentro da pasta `bots/` e rodar:
```
npm install
```

### 2. Pegar chave Groq (grátis)
1. Entrar em https://console.groq.com
2. Criar conta gratuita
3. Ir em "API Keys" → criar chave
4. Copiar a chave

### 3. Editar config.json
Preencher os dois campos:
```json
"groq_api_key": "gsk_XXXXXXXXXXXX",
"gabriel_whatsapp": "5511999999999"
```

### 4. Ligar o bot de resposta
```
node bot.js
```
Vai aparecer um QR code no terminal.
Abrir WhatsApp Business → Dispositivos Conectados → Escanear QR.

Pronto! O bot responde qualquer mensagem que chegar.

### 5. Disparar leads
Pegar o CSV exportado pelo MazyOS Scraper (localhost:8080) e rodar:
```
node prospeccao.js caminho/para/leads.csv
```
O CSV precisa ter: `name`, `phone`, `rating`, `reviews`, `category`.

---

## Como funciona

```
MazyOS Scraper → leads.csv
                     ↓
              prospeccao.js
              (envia primeiro WhatsApp com preview do site)
                     ↓
              Lead responde → bot.js responde com IA (Groq)
                     ↓
              Lead demonstra interesse → notifica Gabriel
```

---

## Limites Groq (plano grátis)
- 6.000 requisições/dia
- 60 req/minuto
- Mais que suficiente pra começar

---

## Dicas
- Deixar `node bot.js` rodando em segundo plano enquanto prospecta
- O QR code só precisa ser escaneado uma vez — a sessão fica salva em `sessao-whatsapp/`
- Se desconectar, só rodar `node bot.js` de novo (não precisa escanear de novo)
- Registros de disparos ficam em `dados/disparos.json`
