#!/usr/bin/env python3
"""
Ponte ManyChat → Evolution API.
ManyChat chama POST /manychat com o número capturado no Instagram DM.
Uso: python webhook-manychat.py
"""
import json, requests
from pathlib import Path
from flask import Flask, request, jsonify

BASE = Path(__file__).parent
CONFIG = json.loads((BASE / "config.json").read_text(encoding="utf-8"))

app = Flask(__name__)
EVOLUTION_URL = CONFIG["evolution_api_url"]
API_KEY = CONFIG["evolution_api_key"]
INSTANCIA = CONFIG["instancia_whatsapp"]

BOAS_VINDAS = (
    "Oi! Vi aqui que você veio pelo Instagram. 😊\n\n"
    "Faço sites pra pequenos negócios em SP — prontos em até 7 dias.\n\n"
    "Me conta: qual é o seu ramo? Assim já te mando um preview de como ficaria o site de vocês."
)

def enviar(numero: str, texto: str):
    numero_limpo = "".join(c for c in numero if c.isdigit())
    if not numero_limpo.startswith("55"):
        numero_limpo = "55" + numero_limpo
    url = f"{EVOLUTION_URL}/message/sendText/{INSTANCIA}"
    headers = {"apikey": API_KEY, "Content-Type": "application/json"}
    r = requests.post(url, json={"number": numero_limpo, "text": texto, "delay": 1000}, headers=headers, timeout=10)
    return r.status_code == 201

@app.route("/manychat", methods=["POST"])
def manychat_webhook():
    data = request.json or {}
    # ManyChat envia: { "phone": "11999999999", "name": "João", ... }
    numero = data.get("phone", data.get("whatsapp", ""))
    if not numero:
        return jsonify({"error": "numero ausente"}), 400
    ok = enviar(numero, BOAS_VINDAS)
    return jsonify({"enviado": ok, "numero": numero})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    print("Webhook ManyChat rodando em http://localhost:5002/manychat")
    app.run(host="0.0.0.0", port=5002, debug=False)
