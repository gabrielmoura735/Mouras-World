#!/usr/bin/env python3
"""
Bot de prospecção ativa — lê leads do MazyOS Scraper e envia WhatsApp personalizado.
Uso: python prospeccao-bot.py [arquivo_leads.csv]
"""
import json, csv, time, random, sys, os, requests
from datetime import datetime
from pathlib import Path

BASE = Path(__file__).parent
CONFIG = json.loads((BASE / "config.json").read_text(encoding="utf-8"))

EVOLUTION_URL = CONFIG["evolution_api_url"]
API_KEY = CONFIG["evolution_api_key"]
INSTANCIA = CONFIG["instancia_whatsapp"]
DISPAROS_FILE = BASE.parent / "dados" / "disparos.json"

def detectar_nicho(nome: str, categoria: str = "") -> str:
    texto = (nome + " " + categoria).lower()
    for nicho, palavras in CONFIG["nichos"].items():
        if any(p in texto for p in palavras):
            return nicho
    return "default"

def montar_mensagem(lead: dict, nicho: str) -> str:
    template = CONFIG["mensagens"].get(nicho, CONFIG["mensagens"]["default"])
    preview = CONFIG["previews"].get(nicho, CONFIG["previews"]["default"])
    return template.format(
        nome=lead.get("name", "vocês"),
        nota=lead.get("rating", "?"),
        avaliacoes=lead.get("reviews", "?"),
        preview=preview
    )

def enviar_whatsapp(numero: str, mensagem: str) -> bool:
    numero_limpo = "".join(c for c in numero if c.isdigit())
    if not numero_limpo.startswith("55"):
        numero_limpo = "55" + numero_limpo
    url = f"{EVOLUTION_URL}/message/sendText/{INSTANCIA}"
    headers = {"apikey": API_KEY, "Content-Type": "application/json"}
    payload = {"number": numero_limpo, "text": mensagem, "delay": 1200}
    try:
        r = requests.post(url, json=payload, headers=headers, timeout=15)
        return r.status_code == 201
    except Exception as e:
        print(f"  ERRO ao enviar: {e}")
        return False

def registrar_disparo(lead: dict, nicho: str, preview: str, ok: bool):
    disparos = []
    if DISPAROS_FILE.exists():
        try:
            disparos = json.loads(DISPAROS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    disparos.append({
        "data": datetime.now().isoformat(),
        "nome": lead.get("name"),
        "numero": lead.get("phone"),
        "nicho": nicho,
        "preview": preview,
        "enviado": ok
    })
    DISPAROS_FILE.parent.mkdir(parents=True, exist_ok=True)
    DISPAROS_FILE.write_text(json.dumps(disparos, ensure_ascii=False, indent=2), encoding="utf-8")

def main():
    arquivo = sys.argv[1] if len(sys.argv) > 1 else str(BASE.parent / "dados" / "leads.csv")
    if not Path(arquivo).exists():
        print(f"Arquivo não encontrado: {arquivo}")
        print("Passe o CSV como argumento: python prospeccao-bot.py caminho/leads.csv")
        return

    leads = []
    with open(arquivo, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            leads.append(row)

    print(f"=== Bot de Prospecção — {len(leads)} leads ===\n")
    enviados = 0
    for i, lead in enumerate(leads):
        nome = lead.get("name", lead.get("nome", ""))
        telefone = lead.get("phone", lead.get("telefone", lead.get("whatsapp", "")))
        if not telefone or not nome:
            print(f"[{i+1}] Pulando — sem nome ou telefone: {lead}")
            continue

        nicho = detectar_nicho(nome, lead.get("category", lead.get("categoria", "")))
        preview = CONFIG["previews"].get(nicho, CONFIG["previews"]["default"])
        mensagem = montar_mensagem(lead, nicho)

        print(f"[{i+1}] {nome} | nicho: {nicho} | {telefone}")
        print(f"     Preview: {preview}")

        ok = enviar_whatsapp(telefone, mensagem)
        registrar_disparo(lead, nicho, preview, ok)
        status = "✅ enviado" if ok else "❌ falhou"
        print(f"     {status}\n")
        if ok:
            enviados += 1

        # pausa aleatória entre envios (evita ban)
        if i < len(leads) - 1:
            pausa = random.randint(60, 120)
            print(f"     Aguardando {pausa}s...\n")
            time.sleep(pausa)

    print(f"\n=== Concluído: {enviados}/{len(leads)} mensagens enviadas ===")
    print(f"Registro salvo em: {DISPAROS_FILE}")

if __name__ == "__main__":
    main()
