class AuditorPresencaDigital:
    def auditar_lead(self, lead):
        """
        Audita a saúde da presença digital de uma empresa no padrão Vagner Mazzeo (Abacus AI):
        - nota_digital (0 a 10)
        - gaps identificados (Furos)
        - auditoria técnica: Pixel, GTM, Google Ads, Meta Ads, Velocidade
        - ângulo prioritário de abordagem
        - serviço recomendado ("Cada furo é um serviço")
        - ticket sugerido de fechamento
        """
        gaps = []
        pontos = 10.0

        nome = lead.get("nome", "")
        nicho = lead.get("nicho", "geral").lower()
        telefone = lead.get("telefone", "")
        website = lead.get("website", "").strip()
        instagram = lead.get("instagram", "").strip()
        tem_maps = lead.get("possui_google_maps", True)
        reviews_count = lead.get("reviews_count", 0)

        # 1. Auditoria Google Maps / GMB
        if not tem_maps:
            gaps.append("Invisível no Google Meu Negócio / Maps (clientes locais não encontram a empresa)")
            pontos -= 3.5
        elif reviews_count < 10:
            gaps.append(f"Pouquíssimas avaliações no Google ({reviews_count} reviews) — baixa prova social e perde ranking")
            pontos -= 1.0

        # 2. Auditoria de Website & Velocidade
        velocidade = lead.get("velocidade_site", "")
        if not website:
            if nicho in ["delivery", "alimentacao", "lanchonete", "churrascaria"]:
                gaps.append("Não possui cardápio digital próprio (perde margem pagando até 27% de taxas ao iFood)")
            elif nicho in ["barbearia", "clinica"]:
                gaps.append("Não possui site próprio de agendamento online de consultas/horários")
            else:
                gaps.append("Sem site oficial ou landing page institucional (credibilidade comprometida)")
            pontos -= 3.0
            velocidade = "Sem site"
        elif "ifood.com.br" in website or "instadelivery" in website:
            gaps.append("Depende exclusivamente de marketplaces com altas comissões sobre cada venda")
            pontos -= 1.5
            velocidade = "Terceirizado"
        else:
            if not velocidade:
                velocidade = "3.8s (Lento)"
            if "Lento" in velocidade or "4." in velocidade or "5." in velocidade or "3." in velocidade:
                gaps.append(f"Site lento ({velocidade}) — mais de 53% dos visitantes desistem antes de carregar")
                pontos -= 1.0

        # 3. Auditoria de Rastreamento (Pixel & GTM)
        tem_pixel = lead.get("tem_pixel_meta", False)
        tem_gtm = lead.get("tem_google_tag_manager", False)
        if not tem_pixel and website and "ifood" not in website:
            gaps.append("Sem Pixel do Meta instalado no site (não faz remarketing para quem visita)")
            pontos -= 1.0
        if not tem_gtm and website and "ifood" not in website:
            gaps.append("Sem Google Tag Manager (não rastreia conversões nem cliques de WhatsApp)")
            pontos -= 0.5

        # 4. Auditoria de Tráfego Pago (Google Ads & Meta Ads)
        anuncia_google = lead.get("anuncia_google_ads", False)
        anuncia_meta = lead.get("anuncia_meta_ads", False)
        if not anuncia_google and not anuncia_meta:
            gaps.append("Não roda anúncios patrocinados (concorrentes estão comprando as palavras-chave locais)")
            pontos -= 1.5

        # 5. Auditoria de Redes Sociais & Link da Bio
        if not instagram:
            gaps.append("Sem perfil ativo ou visível no Instagram")
            pontos -= 1.5
        elif not lead.get("tem_link_bio", True):
            gaps.append("Instagram sem link estratégico ou checkout na bio (tráfego da rede é desperdiçado)")
            pontos -= 1.0

        # 6. Atendimento WhatsApp Direto
        if not telefone:
            gaps.append("Sem canal de WhatsApp divulgado publicamente para atendimento rápido")
            pontos -= 1.5

        nota_final = max(1.0, min(10.0, round(pontos, 1)))

        # Regra de Ouro Mazzeo: "Cada Furo é um Serviço pra Vender"
        if not tem_maps:
            angulo = "ativacao_google_maps"
            servico = "⭐ Estruturação de Google Meu Negócio (GMB)"
            ticket = "R$ 1.200 implantação + R$ 600/mês"
        elif not website and nicho in ["delivery", "alimentacao", "lanchonete", "churrascaria"]:
            angulo = "cardapio_proprio_economia_taxas"
            servico = "📱 Cardápio Digital Próprio com WhatsApp"
            ticket = "R$ 1.500 setup + R$ 350/mês"
        elif not website or "Lento" in str(velocidade):
            angulo = "agendamento_automatico_recorrencia" if nicho in ["barbearia", "clinica"] else "criacao_landing_page_rapida"
            servico = "🔥 Landing Page Ultrarrápida de Alta Conversão"
            ticket = "R$ 1.800 setup + R$ 300/mês"
        elif not tem_pixel or not tem_gtm:
            angulo = "setup_rastreamento_pixel"
            servico = "⚙️ Setup de Rastreamento Avançado (Pixel + GTM)"
            ticket = "R$ 900 implantação única"
        elif not anuncia_google and not anuncia_meta:
            angulo = "aumento_visibilidade_trafego_local"
            servico = "📈 Gestão de Tráfego Pago (Google Ads + Meta Ads)"
            ticket = "R$ 1.500/mês a R$ 2.500/mês"
        else:
            angulo = "escala_recorrente_mrr"
            servico = "👑 Otimização Contínua de Conversão e Retenção"
            ticket = "R$ 2.000/mês"

        return {
            "nota_digital": nota_final,
            "gaps": gaps,
            "angulo_abordagem": angulo,
            "servico_recomendado": lead.get("servico_recomendado") or servico,
            "ticket_sugerido": lead.get("ticket_sugerido") or ticket,
            "velocidade_site": velocidade,
            "tem_pixel_meta": tem_pixel,
            "tem_google_tag_manager": tem_gtm,
            "anuncia_google_ads": anuncia_google,
            "anuncia_meta_ads": anuncia_meta,
            "nivel_urgencia": "ALTA" if nota_final < 6.0 else ("MEDIA" if nota_final < 8.5 else "BAIXA")
        }
