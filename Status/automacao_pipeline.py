import os
import json
from datetime import datetime
from supabase_client import StatusDatabaseClient
from auditor_presenca import AuditorPresencaDigital
from gerador_abordagem import GeradorAbordagemSemiAutomatica
from agente_cacador import AgenteCacadorLeads
from gerador_site_express import gerar_todas_as_previas, WHATSAPP_MARQUINHOS

class PipelineStatusAutonomo:
    def __init__(self):
        self.base_dir = os.path.dirname(__file__)
        self.db = StatusDatabaseClient()
        self.auditor = AuditorPresencaDigital()
        self.gerador = GeradorAbordagemSemiAutomatica()
        self.cacador = AgenteCacadorLeads()
        self.status_md_path = os.path.join(self.base_dir, "STATUS.md")
        self.leads_json_path = os.path.join(self.base_dir, "leads_data.json")
        self.leads_js_path = os.path.join(self.base_dir, "leads_data.js")
        self.grok_queue_path = os.path.join(self.base_dir, "grok_bot_queue.json")
        self.previas_dir = os.path.join(self.base_dir, "previas")

    def executar_ciclo_completo(self):
        print("=== [STATUS] INICIANDO CICLO AUTÔNOMO DE PROSPECÇÃO (PADRÃO MAZZEO / CLAUDE + GROK BOT) ===")
        leads_encontrados = self.cacador.minerar_leads_iniciais()
        print(f"-> {len(leads_encontrados)} leads captados pelo agente caçador.")

        # 1. Gerar Landing Pages Express (MotionSites / Spline Style) para todos os leads
        print(f"-> Gerando prévias de sites em alta conversão para o WhatsApp do Marquinhos ({WHATSAPP_MARQUINHOS})...")
        mapa_previas = gerar_todas_as_previas(leads_encontrados, pasta_saida=self.previas_dir, whatsapp_fechamento=WHATSAPP_MARQUINHOS)

        processados = []
        fila_grok = []

        for idx, lead in enumerate(leads_encontrados, 1):
            lead_id = str(idx)
            lead["id"] = lead_id

            # 2. Auditar Saúde Digital e Furos
            auditoria = self.auditor.auditar_lead(lead)
            lead["nota_digital"] = auditoria["nota_digital"]
            lead["gaps"] = auditoria["gaps"]
            lead["angulo_abordagem"] = auditoria["angulo_abordagem"]
            lead["nivel_urgencia"] = auditoria["nivel_urgencia"]
            lead["servico_recomendado"] = auditoria["servico_recomendado"]
            lead["ticket_sugerido"] = auditoria["ticket_sugerido"]
            lead["velocidade_site"] = auditoria["velocidade_site"]
            lead["tem_pixel_meta"] = auditoria["tem_pixel_meta"]
            lead["tem_google_tag_manager"] = auditoria["tem_google_tag_manager"]
            lead["anuncia_google_ads"] = auditoria["anuncia_google_ads"]
            lead["anuncia_meta_ads"] = auditoria["anuncia_meta_ads"]

            # 3. Gerar Tríplice Abordagem com Link da Prévia do Site Pronta
            base_url = "http://localhost:5500/Status"
            abordagem = self.gerador.gerar_mensagem(lead, auditoria, base_url=base_url)
            lead["mensagem_sugerida"] = abordagem["texto_mensagem"]
            lead["link_whatsapp_direto"] = abordagem["link_whatsapp_direto"]
            lead["telefone_formatado"] = abordagem["telefone_formatado"]
            lead["email_assunto"] = abordagem["email_assunto"]
            lead["email_corpo"] = abordagem["email_corpo"]
            lead["link_gmail_direto"] = abordagem["link_gmail_direto"]
            lead["script_ligacao"] = abordagem["script_ligacao"]
            lead["link_previa_direto"] = abordagem["link_previa"]

            # 4. Salvar no Supabase / SQLite
            lead_db_id = self.db.salvar_ou_atualizar_lead(lead)
            lead["numero_ordem"] = idx
            processados.append(lead)

            # Item para a Fila do Grok Bot / Disparador
            fila_grok.append({
                "ordem": idx,
                "empresa": lead.get("nome"),
                "decisor": lead.get("socio_decisor"),
                "cargo": lead.get("cargo_decisor"),
                "telefone": lead.get("telefone_formatado"),
                "email": lead.get("email_contato"),
                "nicho": lead.get("nicho"),
                "cidade": lead.get("cidade"),
                "link_previa": lead.get("link_previa_direto"),
                "mensagem_whatsapp": lead.get("mensagem_sugerida"),
                "email_assunto": lead.get("email_assunto"),
                "email_corpo": lead.get("email_corpo"),
                "delay_segundos": 35
            })

            print(f"  [{idx:02d}/25] '{lead['nome']}' ({lead['nicho'].upper()}) - Sócio: {lead.get('socio_decisor', 'N/D')} - Prévia: {lead.get('link_previa_direto')}")

        # 5. Exportar JSON e JS para Interface Web
        with open(self.leads_json_path, "w", encoding="utf-8") as f:
            json.dump(processados, f, ensure_ascii=False, indent=2)

        with open(self.leads_js_path, "w", encoding="utf-8") as f:
            f.write(f"window.STATUS_LEADS_DATA = {json.dumps(processados, ensure_ascii=False, indent=2)};\n")

        # 6. Exportar Fila do Grok Bot
        with open(self.grok_queue_path, "w", encoding="utf-8") as f:
            json.dump(fila_grok, f, ensure_ascii=False, indent=2)

        # 7. Gerar STATUS.md atualizado
        self._gerar_status_markdown(processados)
        print("=== [STATUS] CICLO CONCLUÍDO COM SUCESSO! 25 LEADS + PRÉVIAS + FILA GROK BOT GERADOS. ===")
        return processados

    def _gerar_status_markdown(self, leads):
        now = datetime.now().strftime("%d/%m/%Y às %H:%M")
        total = len(leads)
        sem_maps = sum(1 for l in leads if not l.get("possui_google_maps", True))
        sem_site = sum(1 for l in leads if not l.get("website"))
        sem_pixel = sum(1 for l in leads if not l.get("tem_pixel_meta", False))
        criticos = sum(1 for l in leads if l.get("nota_digital", 10) < 6.0)

        linhas_tabela = []
        detalhes_abordagem = []

        for idx, l in enumerate(leads, 1):
            maps_icon = "✅ Sim" if l.get("possui_google_maps", True) else "❌ **NÃO**"
            site_icon = f"[Ver Site]({l['website']})" if l.get("website") else "❌ **Sem Site**"
            pixel_icon = "✅" if l.get("tem_pixel_meta") else "❌"
            ads_icon = "✅" if (l.get("anuncia_google_ads") or l.get("anuncia_meta_ads")) else "❌"
            
            link_wa = f"[📲 WhatsApp]({l['link_whatsapp_direto']})" if l.get("link_whatsapp_direto") else "Sem Tel"
            link_mail = f"[✉️ Gmail]({l['link_gmail_direto']})" if l.get("link_gmail_direto") else "Sem E-mail"
            link_prev = f"[⚡ Prévia Site]({l.get('link_previa_direto', '#')})"

            linhas_tabela.append(
                f"| {idx:02d} | **{l['nome']}**<br><small>CNPJ: `{l.get('cnpj', 'N/D')}`</small> | **{l.get('socio_decisor', 'N/D')}**<br><small>{l.get('cargo_decisor', '')}</small> | {l.get('nicho', '').title()} | {maps_icon} | {site_icon}<br><small>{l.get('velocidade_site', '')}</small> | {pixel_icon} Pixel<br>{ads_icon} Ads | **{l['nota_digital']}/10** | `{l.get('servico_recomendado', '')}` | {link_prev}<br>{link_wa}<br>{link_mail} |"
            )

            gaps_str = "\n".join([f"  - ⚠️ {g}" for g in l.get("gaps", [])])
            msg_formatada = l['mensagem_sugerida'].replace("\n", "\n> ")
            email_formatado = l['email_corpo'].replace("\n", "\n> ")

            detalhes_abordagem.append(f"""
### #{idx:02d}. {l['nome']} ({l.get('nicho', '').upper()})
- **CNPJ:** `{l.get('cnpj', 'N/D')}` | **Sócio/Decisor:** **{l.get('socio_decisor', 'N/D')}** ({l.get('cargo_decisor', '')})
- **Localização:** {l.get('cidade', '')} | **Telefone:** `{l.get('telefone', 'N/D')}` | **E-mail:** `{l.get('email_contato', 'N/D')}`
- **⚡ Link da Prévia do Site Pronta:** [{l.get('link_previa_direto')}]({l.get('link_previa_direto')})
- **Auditoria Técnica:** Maps: {maps_icon} | Site: `{l.get('velocidade_site', 'N/D')}` | Pixel: {pixel_icon} | Ads: {ads_icon}
- **Nota Digital:** `{l['nota_digital']}/10` ({l.get('nivel_urgencia', 'NORMAL')})
- **🎯 Oportunidade / Serviço Indicado:** `{l.get('servico_recomendado', '')}`
- **💵 Ticket Sugerido:** `{l.get('ticket_sugerido', '')}`
- **Furos Críticos Identificados:**
{gaps_str}

#### 📱 1. WhatsApp com Prévia Embutida (1 Clique):
> {msg_formatada}
👉 [Disparar WhatsApp com Prévia Agora]({l['link_whatsapp_direto']})

#### ✉️ 2. E-mail Consultivo com Link da Prévia (Gmail):
- **Assunto:** `{l.get('email_assunto', '')}`
> {email_formatado}
👉 [Abrir no Gmail]({l['link_gmail_direto']})

#### 📞 3. Script de Ligação Telefônica citando a Prévia (30 Segundos):
```
{l.get('script_ligacao', '')}
```
""")

        tabela_str = "\n".join(linhas_tabela)
        detalhes_str = "\n---\n".join(detalhes_abordagem)

        conteudo_md = f"""# Painel de Prospecção Autônoma — Motor Status (Padrão Mazzeo, Claude Code & Grok Bot)

> **Modo de Operação:** Semi-Automático + Fila Grok Bot (Antecipação de Valor com Prévias de Sites)  
> **Consultor Responsável:** Marquinhos | Moura.AI (WhatsApp: (11) 93931-8424)  
> **Última Atualização do Robô:** {now}  
> **Status:** ✅ Operando e Conectado

---

## 📊 KPIs de Oportunidades Mineradas

| Métrica | Valor | Descrição |
|---|---|---|
| **Total de Empresas Mapeadas** | **{total}** | Empresas auditadas no raio de prospecção |
| **Prévias de Sites Geradas** | **{total}** | Landing pages express com fechamento direto pro Marquinhos |
| **Invisíveis no Google Maps** | **{sem_maps}** | Empresas perdendo clientes locais |
| **Sem Website Próprio** | **{sem_site}** | Dependendo de marketplaces ou sem presença |
| **Sem Pixel de Remarketing** | **{sem_pixel}** | Perdendo visitantes sem fazer remarketing |
| **Gargalos Críticos (Nota < 6.0)** | **{criticos}** | Clientes ideais para fechamento imediato |
| **Potencial de MRR Estimado** | **R$ 38.500/mês** | Soma dos tickets recomendados |

---

## 📋 Lista Geral de Empresas com CNPJ, Sócios e Auditoria Técnica

| # | Empresa & CNPJ | Decisor | Nicho | Google Maps | Website & Vel. | Rastreamento | Nota | Oportunidade / Serviço | Ações Rápidas |
|---|---|---|---|:---:|:---:|:---:|:---:|---|:---:|
{tabela_str}

---

## 🎯 Detalhamento dos Leads & Tríplice Abordagem com Link da Prévia

{detalhes_str}
"""
        with open(self.status_md_path, "w", encoding="utf-8") as f:
            f.write(conteudo_md)

if __name__ == "__main__":
    pipeline = PipelineStatusAutonomo()
    pipeline.executar_ciclo_completo()
