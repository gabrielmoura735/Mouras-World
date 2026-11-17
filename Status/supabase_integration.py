"""
Módulo de Integração Supabase — Moura.AI (Projeto uikcunyvemyooibgiixc)
Conecta a base de dados em nuvem do Supabase para armazenar leads B2B minerados,
status de auditoria e gerenciar a fila de disparos do Grok Bot / N8N.
"""
import os
import json
import urllib.request
import urllib.error

# Configurações do Projeto Supabase
SUPABASE_PROJECT_ID = "uikcunyvemyooibgiixc"
SUPABASE_URL = f"https://{SUPABASE_PROJECT_ID}.supabase.co"
SUPABASE_REST_URL = f"{SUPABASE_URL}/rest/v1"

# Credencial padrão informada pelo usuário (chave anônima / service role)
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_or_service_key")

def testar_conexao_supabase():
    """
    Testa a conectividade com o endpoint REST da API do Supabase.
    """
    url = f"{SUPABASE_REST_URL}/"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    print(f"📡 Testando conexão com Supabase: {SUPABASE_URL}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            print(f"✅ Conexão estabelecida com sucesso! Status HTTP: {status}")
            return True
    except urllib.error.HTTPError as e:
        # Se retornar 401 ou 404, o endpoint está ativo e respondendo
        print(f"ℹ️ Endpoint ativo (Resposta HTTP {e.code}): {e.reason}")
        return True
    except Exception as e:
        print(f"⚠️ Erro ao conectar no Supabase: {e}")
        return False

def exportar_leads_para_supabase_json():
    """
    Gera um arquivo JSON estruturado com os leads do Hunter pronto
    para importação via Table Editor ou API no Supabase.
    """
    caminho_leads = "Status/leads_data.json"
    if not os.path.exists(caminho_leads):
        print(f"❌ Arquivo {caminho_leads} não encontrado.")
        return

    with open(caminho_leads, "r", encoding="utf-8") as f:
        leads = json.load(f)

    supabase_payload = []
    for l in leads:
        item = {
            "id": l.get("id"),
            "nome": l.get("nome"),
            "nicho": l.get("nicho"),
            "cidade": l.get("cidade"),
            "socio_decisor": l.get("socio_decisor"),
            "telefone": l.get("telefone"),
            "tem_site": l.get("tem_site", False),
            "tem_pixel": l.get("tem_pixel", False),
            "reviews_count": l.get("reviews_count", 0),
            "status_disparo": "pendente",
            "whatsapp_marquinhos": "5511939318424"
        }
        supabase_payload.append(item)

    saida = "Status/supabase_leads_payload.json"
    with open(saida, "w", encoding="utf-8") as f:
        json.dump(supabase_payload, f, ensure_ascii=False, indent=2)

    print(f"✅ {len(supabase_payload)} leads formatados para o Supabase em {saida}!")

if __name__ == "__main__":
    testar_conexao_supabase()
    exportar_leads_para_supabase_json()
