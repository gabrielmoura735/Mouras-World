#!/usr/bin/env python3
"""
Bot de resposta WhatsApp — Flask webhook + Evolution API + Claude Haiku.
Uso: python whatsapp-bot.py
Webhook Evolution API: POST http://localhost:5001/webhook
"""
import json, re, requests
from pathlib import Path
from flask import Flask, request, jsonify
import anthropic

BASE = Path(__file__).parent
CONFIG = json.loads((BASE / "config.json").read_text(encoding="utf-8"))

app = Flask(__name__)
claude = anthropic.Anthropic(api_key=CONFIG["claude_api_key"])

EVOLUTION_URL = CONFIG["evolution_api_url"]
API_KEY = CONFIG["evolution_api_key"]
INSTANCIA = CONFIG["instancia_whatsapp"]
GABRIEL_WA = CONFIG["gabriel_whatsapp"]
SYSTEM_PROMPT = CONFIG["system_prompt_bot"]

# contexto por número (memória simples em RAM)
contextos: dict[str, list] = {}

def enviar(numero: str, texto: str):
    url = f"{EVOLUTION_URL}/message/sendText/{INSTANCIA}"
    headers = {"apikey": API_KEY, "Content-Type": "application/json"}
    requests.post(url, json={"number": numero, "text": texto, "delay": 800}, headers=headers, timeout=10)

def notificar_gabriel(numero: str, mensagem: str, resposta_bot: str):
    aviso = (
        f"🔔 Lead com interesse!\n"
        f"Número: {numero}\n"
        f"Disse: {mensagem[:120]}\n"
        f"Bot respondeu: {resposta_bot[:120]}"
    )
    enviar(GABRIEL_WA, aviso)

def interesse_claro(msg: str) -> bool:
    sinais = ["quero", "quanto custa", "valor", "preço", "quando pode", "pode fazer", "topei", "fechado", "bora", "vamos"]
    return any(s in msg.lower() for s in sinais)

@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.json or {}
    # Evolution API v2 envelope
    evento = data.get("event", "")
    if evento not in ("messages.upsert", "MESSAGES_UPSERT"):
        return jsonify({"ok": True})

    msg_data = data.get("data", {})
    key = msg_data.get("key", {})
    if key.get("fromMe"):        # ignora mensagens enviadas pelo próprio bot
        return jsonify({"ok": True})

    numero = key.get("remoteJid", "").split("@")[0]
    if not numero:
        return jsonify({"ok": True})

    conteudo = msg_data.get("message", {})
    texto = (
        conteudo.get("conversation") or
        conteudo.get("extendedTextMessage", {}).get("text") or ""
    ).strip()

    if not texto:
        return jsonify({"ok": True})

    historico = contextos.setdefault(numero, [])
    historico.append({"role": "user", "content": texto})

    # limita histórico a 10 trocas
    if len(historico) > 20:
        historico[:] = historico[-20:]

    try:
        resp = claude.messages.create(
            model="claude-haiku-4-5",
            max_tokens=300,
            system=SYSTEM_PROMPT,
            messages=historico
        )
        resposta = resp.content[0].text.strip()
    except Exception as e:
        resposta = "Oi! Tive um problema técnico aqui. Pode chamar de novo em instantes? 😅"
        print(f"Erro Claude API: {e}")

    historico.append({"role": "assistant", "content": resposta})
    enviar(numero, resposta)

    if interesse_claro(texto):
        notificar_gabriel(numero, texto, resposta)

    return jsonify({"ok": True})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "instancia": INSTANCIA})

if __name__ == "__main__":
    print("Bot WhatsApp rodando em http://localhost:5001")
    print("Configure o webhook na Evolution API: POST http://SEU_IP:5001/webhook")
    app.run(host="0.0.0.0", port=5001, debug=False)
