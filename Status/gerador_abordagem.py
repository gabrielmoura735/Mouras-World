import urllib.parse
import re

WHATSAPP_MARQUINHOS = "5511939318424"
NOME_CONSULTOR = "Marquinhos"
ASSINATURA_MARQUINHOS = "Marquinhos | Moura.AI Soluções Digitais & IA\nWhatsApp: (11) 93931-8424"

class GeradorAbordagemSemiAutomatica:
    def formatar_numero_whatsapp(self, telefone):
        if not telefone:
            return ""
        numeros = re.sub(r"\D", "", telefone)
        if len(numeros) == 10 or len(numeros) == 11:
            return f"55{numeros}"
        if len(numeros) >= 12 and numeros.startswith("55"):
            return numeros
        return numeros

    def gerar_mensagem(self, lead, auditoria, base_url="http://localhost:5500/Status"):
        """
        Gera a tríplice abordagem no método Vagner Mazzeo (Claude Code + Grok Bot):
        1. WhatsApp Direto em 1 clique com Link da Prévia do Site Pronta (Antecipação de Valor)
        2. E-mail Consultivo de Alta Conversão com botão Gmail e link da prévia
        3. Script de Ligação Telefônica de 30 segundos citando a prévia funcional
        """
        nome_empresa = lead.get("nome", "sua empresa")
        nicho = lead.get("nicho", "negócio").lower()
        cidade = lead.get("cidade", "São Paulo - SP")
        bairro = cidade.split(",")[0] if "," in cidade else cidade
        lead_id = lead.get("id", "1")
        
        # Sócio / Tomador de Decisão
        socio = lead.get("socio_decisor", "")
        cargo = lead.get("cargo_decisor", "responsável")
        primeiro_nome_socio = socio.split()[0] if socio else "Olá"

        angulo = auditoria.get("angulo_abordagem", "")
        gaps = auditoria.get("gaps", [])
        velocidade = auditoria.get("velocidade_site", "Lenta")
        servico = auditoria.get("servico_recomendado", "")

        # Link da Prévia Pronta (Método Mazzeo + Grok Bot)
        link_previa = f"{base_url}/previa.html?id={lead_id}"
        lead["link_previa_direto"] = link_previa

        # ── 1. MENSAGEM DE WHATSAPP (Antecipação de Valor com Prévia em Segundos) ──
        if angulo == "ativacao_google_maps":
            texto_zap = (
                f"Olá, {primeiro_nome_socio}! Tudo bem? ✨\n\n"
                f"Vi que você está à frente do {nome_empresa} aqui no {bairro}. Estava pesquisando opções de {nicho} na nossa região e reparei que a ficha de vocês ainda não aparece verificada no Google Maps quando os clientes procuram por perto.\n\n"
                f"Para adiantar e você ver na prática, estruturei uma prévia funcional de 1 página de como ficaria a presença digital de vocês com agendamento direto:\n"
                f"👉 {link_previa}\n\n"
                f"Estruturamos a ficha do Google Meu Negócio completa em 48h para vocês dominarem as buscas do bairro. Dê uma olhada de 1 minuto na prévia acima e me diga se gostou!"
            )
            assunto_email = f"Oportunidade de visibilidade local & prévia para {nome_empresa}"
            corpo_email = (
                f"Olá, {socio} ({cargo} no {nome_empresa}),\n\n"
                f"Espero que este e-mail o encontre bem.\n\n"
                f"Estava realizando um levantamento de empresas do setor de {nicho} na região de {bairro} e notei um ponto crítico: o {nome_empresa} ainda não possui presença otimizada no Google Meu Negócio / Google Maps.\n\n"
                f"Para você ver o potencial de captação digital imediato, pré-construí uma página de alta conversão para vocês:\n"
                f"🔗 {link_previa}\n\n"
                f"Nós implementamos o setup completo do Google Meu Negócio, otimizamos as palavras-chave e colocamos sua empresa no topo das buscas locais.\n\n"
                f"Você teria 5 minutos nesta semana para avaliarmos essa ativação?\n\n"
                f"Atenciosamente,\n"
                f"{ASSINATURA_MARQUINHOS}"
            )
            script_call = (
                f"📞 SCRIPT DE LIGAÇÃO (30 SEGUNDOS):\n"
                f"1. Secretária atende: 'Olá, bom dia! Por favor, o {socio} está disponível um minuto?'\n"
                f"2. Secretária pergunta quem é: 'Aqui é o Marquinhos da Moura.AI. Eu montei uma prévia moderna de 1 página para o {nome_empresa} com agendamento no celular e vi que vocês perdem clientes no Maps. Queria mandar o link para ele dar uma olhada de 30 segundos.'\n"
                f"3. Ao falar com {socio}: '{primeiro_nome_socio}, bom dia! Vi que você é sócio do {nome_empresa}. Montei uma prévia funcional de como ficaria o site novo de vocês com agendamento rápido no WhatsApp. Mandei no seu WhatsApp ({link_previa}). Dê uma olhada de 1 minuto sem custo. Se gostar, colocamos no ar!'"
            )

        elif angulo == "cardapio_proprio_economia_taxas":
            texto_zap = (
                f"Oi, {primeiro_nome_socio}! Tudo bem por aí? 🍽️\n\n"
                f"Acompanho o trabalho do {nome_empresa} aqui no {bairro} e a qualidade é excelente. Dei uma olhada na presença digital de vocês e notei que vocês ainda perdem margem alta em taxas de aplicativos.\n\n"
                f"Para adiantar, montei uma prévia funcional de como ficaria o novo canal de pedidos próprio de vocês direto no celular:\n"
                f"👉 {link_previa}\n\n"
                f"O cliente pede em 3 cliques e cai direto no seu WhatsApp sem nenhuma comissão intermediária. Dê uma olhada de 1 minuto na prévia acima e me diga o que achou!"
            )
            assunto_email = f"Redução de taxas de delivery & prévia para o {nome_empresa}"
            corpo_email = (
                f"Olá, {socio} ({cargo} no {nome_empresa}),\n\n"
                f"Tudo bem?\n\n"
                f"Parabéns pelo trabalho com o {nome_empresa} em {bairro}. Analisei o fluxo de pedidos de vocês e vi uma oportunidade clara de economia de margem.\n\n"
                f"Preparei uma demonstração prática de como funciona uma página moderna e leve de pedidos diretos para o {nome_empresa}:\n"
                f"🔗 {link_previa}\n\n"
                f"Com esse canal próprio, vocês economizam de 15% a 27% de comissão em clientes recorrentes e recebem via Pix sem taxas intermediárias.\n\n"
                f"Podemos agendar uma rápida demonstração de 5 minutos pelo WhatsApp?\n\n"
                f"Um abraço,\n"
                f"{ASSINATURA_MARQUINHOS}"
            )
            script_call = (
                f"📞 SCRIPT DE LIGAÇÃO (30 SEGUNDOS):\n"
                f"1. Atendente: 'Restaurante {nome_empresa}, pois não?'\n"
                f"2. Você: 'Olá, boa tarde! Gostaria de falar rapidamente com o {socio}, por favor. É o Marquinhos, preparei uma prévia de canal próprio para ele ver.'\n"
                f"3. Ao falar com {socio}: '{primeiro_nome_socio}, tudo bem? Sou o Marquinhos da região. Montei uma página modelo sem custos para o {nome_empresa} para vocês receberem pedidos sem pagar 27% de taxa. Acabei de te mandar no WhatsApp ({link_previa}). Dê uma olhada de 1 minuto no celular!'"
            )

        elif "landing_page" in angulo or "agendamento" in angulo or "Lento" in str(velocidade):
            texto_zap = (
                f"Olá, {primeiro_nome_socio}! Tudo bem? 🚀\n\n"
                f"Vi que você é sócio do {nome_empresa}. Analisei a presença digital de vocês no celular e percebi que o site atual está lento (cerca de {velocidade}) ou ainda não tem uma página moderna focada em agendamentos no WhatsApp.\n\n"
                f"Para adiantar e você ver a diferença na prática, montei uma prévia funcional de 1 página de alta conversão sem custo para a {nome_empresa}:\n"
                f"👉 {link_previa}\n\n"
                f"Ela carrega em menos de 0.5s e foi desenhada para multiplicar as pessoas que chamam vocês no WhatsApp. Dê uma olhada de 1 minuto no celular! Se fizer sentido, colocamos no ar em 24h."
            )
            assunto_email = f"Prévia do novo site de alta conversão para o {nome_empresa}"
            corpo_email = (
                f"Prezado(a) {socio} ({cargo} - {nome_empresa}),\n\n"
                f"Espero que esteja tendo uma excelente semana.\n\n"
                f"Durante uma auditoria técnica em empresas de {nicho} em {bairro}, identifiquei que a experiência mobile do {nome_empresa} pode ser muito mais rápida e lucrativa.\n\n"
                f"Para demonstrar o que é possível, desenvolvi uma prévia funcional de alta velocidade (estilo MotionSites) exclusivamente para a sua empresa:\n"
                f"🔗 {link_previa}\n\n"
                f"Essa estrutura carrega em 0.4s no celular e foi desenhada para converter visitantes em clientes no WhatsApp de forma imediata.\n\n"
                f"Gostaria de avaliar como colocar essa página no ar com seu domínio oficial?\n\n"
                f"Atenciosamente,\n"
                f"{ASSINATURA_MARQUINHOS}"
            )
            script_call = (
                f"📞 SCRIPT DE LIGAÇÃO (30 SEGUNDOS):\n"
                f"1. Recepção: 'Clínica/Empresa {nome_empresa}, bom dia.'\n"
                f"2. Você: 'Olá, bom dia! Por favor, o {socio} está disponível? É o Marquinhos. Criei uma prévia de um site novo para ele ver.'\n"
                f"3. Ao falar com {socio}: '{primeiro_nome_socio}, bom dia! Analisei a experiência mobile do {nome_empresa} e criei uma prévia funcional de alta velocidade para vocês testarem: {link_previa}. Mandei no seu WhatsApp. Dê uma olhada de 1 minuto no celular! Se gostar, conectamos seu domínio próprio em 24h.'"
            )

        elif angulo == "setup_rastreamento_pixel":
            texto_zap = (
                f"Olá, {primeiro_nome_socio}! Tudo bem? 📈\n\n"
                f"Vi que o {nome_empresa} já tem uma estrutura legal no ar, mas durante uma análise técnica reparei que vocês ainda não têm o Pixel do Meta nem o Google Tag Manager instalados no site.\n\n"
                f"Para adiantar, montei uma prévia funcional com toda a estrutura de rastreamento pronta para vocês verem como reter 100% dos visitantes:\n"
                f"👉 {link_previa}\n\n"
                f"Fazemos essa configuração técnica em 24h para você nunca mais perder quem visitou sua página. Dê uma olhada de 1 minuto na prévia acima!"
            )
            assunto_email = f"Ajuste de rastreamento & prévia técnica para {nome_empresa}"
            corpo_email = (
                f"Olá, {socio},\n\n"
                f"Parabéns pelo trabalho com o {nome_empresa}.\n\n"
                f"Auditei o site de vocês e verifiquei a ausência de tags de rastreamento (Pixel do Meta e GTM). Preparei uma prévia com a arquitetura ideal de conversão:\n"
                f"🔗 {link_previa}\n\n"
                f"O setup de rastreamento avançado permite reimpactar os visitantes nas redes sociais com anúncios de remarketing, aumentando as conversões em até 35%.\n\n"
                f"Podemos bater um papo rápido de 5 minutos sobre como implementar isso no {nome_empresa}?\n\n"
                f"Abraços,\n"
                f"{ASSINATURA_MARQUINHOS}"
            )
            script_call = (
                f"📞 SCRIPT DE LIGAÇÃO (30 SEGUNDOS):\n"
                f"1. 'Oi {primeiro_nome_socio}, tudo bem? Aqui é o Marquinhos da Moura.AI. Vi o site do {nome_empresa} e notei que vocês estão recebendo visitas mas não têm o Pixel de remarketing ativado. Montei uma página modelo com rastreamento para você ver ({link_previa}). Posso te mandar no seu WhatsApp?'"
            )

        else:
            texto_zap = (
                f"Olá, {primeiro_nome_socio}! Tudo bem? 🚀\n\n"
                f"Acompanho o crescimento do {nome_empresa} aqui em {bairro}. Fizemos uma auditoria de captação digital e, para adiantar, montei uma prévia funcional exclusiva de como ficaria a presença digital de alta conversão de vocês:\n"
                f"👉 {link_previa}\n\n"
                f"Ela foi feita para carregar em menos de 0.5s e gerar agendamentos automáticos no WhatsApp. Dê uma olhada de 1 minuto no celular e me diga se gostou!"
            )
            assunto_email = f"Prévia exclusiva de presença digital para o {nome_empresa}"
            corpo_email = (
                f"Olá, {socio} ({cargo} no {nome_empresa}),\n\n"
                f"Espero que esteja bem.\n\n"
                f"Mapeamos empresas em destaque no segmento de {nicho} em {bairro} e geramos uma prévia prática de alta conversão para o {nome_empresa}:\n"
                f"🔗 {link_previa}\n\n"
                f"Identificamos oportunidades imediatas para escalar o volume de clientes qualificados utilizando tráfego pago local e agendamento automático.\n\n"
                f"Gostaria de colocar essa página no ar com seu domínio oficial?\n\n"
                f"Atenciosamente,\n"
                f"{ASSINATURA_MARQUINHOS}"
            )
            script_call = (
                f"📞 SCRIPT DE LIGAÇÃO (30 SEGUNDOS):\n"
                f"1. 'Olá {primeiro_nome_socio}! Aqui é o Marquinhos da Moura.AI. Analisamos o mercado de {nicho} aqui de {bairro} e montei uma prévia de site pronta para a {nome_empresa} atrair clientes no WhatsApp. Mandei no seu celular ({link_previa}). Dê uma olhada de 1 minuto sem compromisso!'"
            )

        telefone_formatado = self.formatar_numero_whatsapp(lead.get("telefone", ""))
        link_whatsapp = ""
        if telefone_formatado:
            msg_encoded = urllib.parse.quote(texto_zap)
            link_whatsapp = f"https://wa.me/{telefone_formatado}?text={msg_encoded}"

        email_destinatario = lead.get("email_contato", "contato@empresa.com.br")
        assunto_encoded = urllib.parse.quote(assunto_email)
        corpo_encoded = urllib.parse.quote(corpo_email)
        link_gmail = f"mailto:{email_destinatario}?subject={assunto_encoded}&body={corpo_encoded}"

        return {
            "texto_mensagem": texto_zap,
            "link_whatsapp_direto": link_whatsapp,
            "telefone_formatado": telefone_formatado,
            "email_assunto": assunto_email,
            "email_corpo": corpo_email,
            "link_gmail_direto": link_gmail,
            "script_ligacao": script_call,
            "link_previa": link_previa
        }
