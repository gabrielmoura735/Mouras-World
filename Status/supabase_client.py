import os
import json
import sqlite3
from datetime import datetime

class StatusDatabaseClient:
    def __init__(self, config_path=None):
        if not config_path:
            config_path = os.path.join(os.path.dirname(__file__), "config.json")
        self.config_path = config_path
        self.config = self._load_config()
        self.db_path = os.path.join(os.path.dirname(__file__), "status_database.db")
        self._init_sqlite()

    def _load_config(self):
        try:
            with open(self.config_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def _init_sqlite(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS leads_prospeccao (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                nicho TEXT,
                cidade TEXT,
                telefone TEXT,
                website TEXT,
                instagram TEXT,
                possui_google_maps INTEGER DEFAULT 1,
                possui_site INTEGER DEFAULT 1,
                possui_instagram INTEGER DEFAULT 1,
                nota_digital REAL DEFAULT 5.0,
                status TEXT DEFAULT 'DESCOBERTO',
                gaps_identificados TEXT,
                mensagem_sugerida TEXT,
                link_whatsapp_direto TEXT,
                data_cadastro TEXT,
                data_atualizacao TEXT
            )
        """)
        conn.commit()
        conn.close()

    def salvar_ou_atualizar_lead(self, lead_data):
        """Salva no SQLite local e tenta sincronizar com Supabase se configurado."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Verifica se já existe por nome ou telefone
        cursor.execute("SELECT id FROM leads_prospeccao WHERE nome = ? OR (telefone != '' AND telefone = ?)", 
                       (lead_data.get("nome"), lead_data.get("telefone", "")))
        existente = cursor.fetchone()

        if existente:
            lead_id = existente[0]
            cursor.execute("""
                UPDATE leads_prospeccao SET
                    nicho = ?, cidade = ?, telefone = ?, website = ?, instagram = ?,
                    possui_google_maps = ?, possui_site = ?, possui_instagram = ?,
                    nota_digital = ?, gaps_identificados = ?, mensagem_sugerida = ?,
                    link_whatsapp_direto = ?, data_atualizacao = ?
                WHERE id = ?
            """, (
                lead_data.get("nicho", ""),
                lead_data.get("cidade", ""),
                lead_data.get("telefone", ""),
                lead_data.get("website", ""),
                lead_data.get("instagram", ""),
                1 if lead_data.get("possui_google_maps", True) else 0,
                1 if lead_data.get("possui_site", True) else 0,
                1 if lead_data.get("possui_instagram", True) else 0,
                lead_data.get("nota_digital", 5.0),
                json.dumps(lead_data.get("gaps", []), ensure_ascii=False),
                lead_data.get("mensagem_sugerida", ""),
                lead_data.get("link_whatsapp_direto", ""),
                now,
                lead_id
            ))
        else:
            cursor.execute("""
                INSERT INTO leads_prospeccao (
                    nome, nicho, cidade, telefone, website, instagram,
                    possui_google_maps, possui_site, possui_instagram,
                    nota_digital, status, gaps_identificados, mensagem_sugerida,
                    link_whatsapp_direto, data_cadastro, data_atualizacao
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                lead_data.get("nome", "Empresa"),
                lead_data.get("nicho", "Geral"),
                lead_data.get("cidade", ""),
                lead_data.get("telefone", ""),
                lead_data.get("website", ""),
                lead_data.get("instagram", ""),
                1 if lead_data.get("possui_google_maps", True) else 0,
                1 if lead_data.get("possui_site", True) else 0,
                1 if lead_data.get("possui_instagram", True) else 0,
                lead_data.get("nota_digital", 5.0),
                lead_data.get("status", "DESCOBERTO"),
                json.dumps(lead_data.get("gaps", []), ensure_ascii=False),
                lead_data.get("mensagem_sugerida", ""),
                lead_data.get("link_whatsapp_direto", ""),
                now,
                now
            ))
            lead_id = cursor.lastrowid

        conn.commit()
        conn.close()

        # Tenta sincronizar com Supabase se configurado
        self._sincronizar_supabase(lead_data)
        return lead_id

    def atualizar_status(self, lead_id, novo_status):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("UPDATE leads_prospeccao SET status = ?, data_atualizacao = ? WHERE id = ?", 
                       (novo_status, now, lead_id))
        conn.commit()
        conn.close()

    def listar_leads(self, status=None):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        if status:
            cursor.execute("SELECT * FROM leads_prospeccao WHERE status = ? ORDER BY id DESC", (status,))
        else:
            cursor.execute("SELECT * FROM leads_prospeccao ORDER BY id DESC")
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return rows

    def _sincronizar_supabase(self, lead_data):
        supabase_config = self.config.get("supabase", {})
        url = supabase_config.get("url") or os.environ.get("SUPABASE_URL")
        key = supabase_config.get("anon_key") or os.environ.get("SUPABASE_KEY")

        if not url or not key:
            # Mantém em modo SQLite local seguro
            return

        try:
            import urllib.request
            table = supabase_config.get("tabela_leads", "leads_prospeccao")
            endpoint = f"{url.rstrip('/')}/rest/v1/{table}"
            headers = {
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates"
            }
            req = urllib.request.Request(endpoint, data=json.dumps(lead_data).encode("utf-8"), headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=5) as resp:
                pass
        except Exception as e:
            # Silencioso para manter execução fluida offline
            pass

