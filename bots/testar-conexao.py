#!/usr/bin/env python3
"""
Verifica se Evolution API está rodando e WhatsApp conectado.
Uso: python testar-conexao.py
"""
import json, requests
from pathlib import Path

CONFIG = json.loads((Path(__file__).parent / "config.json").read_text(encoding="utf-8"))
URL = CONFIG["evolution_api_url"]
KEY = CONFIG["evolution_api_key"]
INST = CONFIG["instancia_whatsapp"]

print("=== Teste de Conexão — Evolution API ===\n")

# 1. API no ar?
try:
    r = requests.get(f"{URL}/", timeout=5)
    print(f"✅ Evolution API no ar ({URL})")
except Exception as e:
    print(f"❌ Evolution API fora do ar: {e}")
    print("   Rode: cd bots && docker-compose up -d")
    exit(1)

# 2. Instância existe?
headers = {"apikey": KEY}
try:
    r = requests.get(f"{URL}/instance/fetchInstances", headers=headers, timeout=5)
    instancias = r.json()
    nomes = [i.get("instance", {}).get("instanceName") for i in instancias] if isinstance(instancias, list) else []
    if INST in nomes:
        print(f"✅ Instância '{INST}' encontrada")
    else:
        print(f"⚠️  Instância '{INST}' não encontrada. Crie em: POST {URL}/instance/create")
        print(f"   Instâncias existentes: {nomes}")
except Exception as e:
    print(f"❌ Erro ao listar instâncias: {e}")
    exit(1)

# 3. WhatsApp conectado?
try:
    r = requests.get(f"{URL}/instance/connectionState/{INST}", headers=headers, timeout=5)
    state = r.json().get("instance", {}).get("state", "unknown")
    if state == "open":
        print(f"✅ WhatsApp conectado (state: open)")
    elif state == "close":
        print(f"⚠️  WhatsApp desconectado. Escaneie o QR:")
        qr = requests.get(f"{URL}/instance/connect/{INST}", headers=headers, timeout=5)
        print(f"   GET {URL}/instance/connect/{INST}")
    else:
        print(f"⚠️  Estado: {state}")
except Exception as e:
    print(f"❌ Erro ao verificar estado: {e}")

print("\n=== Fim do teste ===")
