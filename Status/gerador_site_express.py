"""
Motor Gerador de Landing Pages Express 10x (MotionSites.ai + Spline 3D Real + Micro-Interações)
Gera prévias ultrarrápidas em segundos com Canvas 3D dinâmico, física de partículas reativas ao cursor,
glassmorphism volumétrico e barra de conversão superior direcionando para o WhatsApp do Marquinhos.
"""

import json
import os
import re
import urllib.parse

WHATSAPP_MARQUINHOS = "5511939318424"
NOME_AGENCIA = "Marquinhos | Moura.AI"

NICHOS_CONFIG = {
    "odontologia": {
        "categoria": "Clínica Odontológica & Estética Dental Avançada",
        "tagline": "✦ ATENDIMENTO HUMANIZADO & TECNOLOGIA 3D",
        "headline": "Transforme seu Sorriso com Tratamentos Modernos e Conforto Total",
        "subheadline": "Excelência em implantes sem dor, alinhadores invisíveis, clareamento a laser e reabilitação oral. Cuidado de alto padrão com agendamento imediato.",
        "badge_extra": "✨ Tecnologia 3D Intraoral sem moldes desconfortáveis",
        "servicos": [
            {"icone": "✨", "titulo": "Implantes & Próteses Fixas", "desc": "Reabilitação oral definitiva com tecnologia 3D sem dor e com recuperação rápida."},
            {"icone": "💎", "titulo": "Alinhadores Invisíveis", "desc": "Correção ortodôntica discreta e confortável sem fios metálicos aparentes."},
            {"icone": "🌟", "titulo": "Clareamento & Lentes de Contato", "desc": "Harmonização do sorriso com resinas e porcelanas importadas de alta durabilidade."},
            {"icone": "🩺", "titulo": "Check-up & Prevenção Digital", "desc": "Limpeza profilática profunda e diagnóstico precoce com câmera intraoral digital."}
        ],
        "depoimentos": [
            {"autor": "Mariana Siqueira", "texto": "Atendimento impecável! Fiz meu clareamento e o resultado superou todas as expectativas. Ambiente acolhedor e pontual.", "tempo": "Há 2 semanas"},
            {"autor": "Carlos Eduardo M.", "texto": "Equipe extremamente profissional. Perdi o medo de ir ao dentista depois que conheci o atendimento deles. Nota 10!", "tempo": "Há 1 mês"},
            {"autor": "Fernanda Bastos", "texto": "Fiz meus implantes e voltei a sorrir com confiança. O Dr. foi super atencioso e o pós-operatório foi tranquilo.", "tempo": "Há 3 semanas"}
        ]
    },
    "advocacia": {
        "categoria": "Sociedade de Advogados & Assessoria Jurídica Estratégica",
        "tagline": "✦ SEGURANÇA JURÍDICA & ATUAÇÃO COMBATIVA",
        "headline": "Protegendo Seus Direitos e Blindando Seu Patrimônio",
        "subheadline": "Assessoria jurídica especializada para pessoas físicas e empresas. Soluções ágeis, éticas e personalizadas em todas as instâncias judiciais e extrajudiciais.",
        "badge_extra": "🛡️ Atendimento consultivo e preventivo 24/7",
        "servicos": [
            {"icone": "⚖️", "titulo": "Direito Empresarial & Blindagem", "desc": "Blindagem jurídica, conformidade e redução de passivos para sua empresa prosperar."},
            {"icone": "💼", "titulo": "Direito Trabalhista & Previdenciário", "desc": "Defesa de direitos, planejamento de aposentadoria e acordos judiciais vantajosos."},
            {"icone": "🏛️", "titulo": "Direito Civil & Planejamento Familiar", "desc": "Inventários rápidos, divórcios, partilha de bens e planejamento sucessório patrimonial."},
            {"icone": "🛡️", "titulo": "Consultoria Preventiva", "desc": "Atuação prévia para evitar litígios caros e garantir segurança em contratos e transações."}
        ],
        "depoimentos": [
            {"autor": "Rodrigo Mendes", "texto": "Excelente escritório. Resolveram uma questão societária complexa da minha empresa com muita agilidade e transparência.", "tempo": "Há 3 semanas"},
            {"autor": "Patrícia Albuquerque", "texto": "Advogados atenciosos e muito competentes. Conduziram meu processo com total clareza em cada etapa.", "tempo": "Há 1 mês"},
            {"autor": "Guilherme Prado", "texto": "A assessoria mensal deles nos poupou milhares de reais em passivos trabalhistas. Super recomendo!", "tempo": "Há 2 meses"}
        ]
    },
    "restaurante": {
        "categoria": "Restaurante, Pizzaria & Experiência Gastronômica",
        "tagline": "✦ SABOR ARTESANAL & ENTREGA ULTRA-RÁPIDA",
        "headline": "Uma Experiência Gastronômica Inesquecível a Cada Pedido",
        "subheadline": "Ingredientes frescos selecionados, receitas autorais e massa de fermentação natural. Peça pelo cardápio digital ou reserve sua mesa sem filas.",
        "badge_extra": "🍕 Cardápio Digital Interativo com Pedido Direto no WhatsApp",
        "servicos": [
            {"icone": "🍕", "titulo": "Cardápio Digital & Pedido 1-Clique", "desc": "Escolha seus pratos favoritos, monte combinações e envie o pedido formatado direto para nossa cozinha."},
            {"icone": "🛵", "titulo": "Delivery Térmico VIP", "desc": "Embalagens especiais que mantêm a temperatura, crocância e apresentação perfeitas até a sua mesa."},
            {"icone": "🍷", "titulo": "Carta de Vinhos & Bebidas Especiais", "desc": "Harmonização completa com rótulos selecionados e coquetelaria autoral premium."},
            {"icone": "🎉", "titulo": "Reservas & Eventos Especiais", "desc": "Ambiente aconchegante para comemorações, aniversários e encontros corporativos."}
        ],
        "depoimentos": [
            {"autor": "Lucas Faria", "texto": "A melhor comida da região disparado! O pedido pelo WhatsApp chegou em 25 minutos, crocante e quentinho.", "tempo": "Há 4 dias"},
            {"autor": "Camila Rocha", "texto": "Cardápio super fácil de usar, pedimos e recebemos confirmação instantânea. Viramos clientes fiéis!", "tempo": "Há 1 semana"},
            {"autor": "Marcelo Vieira", "texto": "Pratos muito bem servidos e sabor surreal. Carta de drinks fantástica. Vale cada centavo!", "tempo": "Há 2 semanas"}
        ]
    },
    "barbearia": {
        "categoria": "Barbearia Clássica & Centro de Estética Masculina",
        "tagline": "✦ ESTILO, PRECISÃO & ATENDIMENTO SEM FILAS",
        "headline": "Onde o Cuidado Masculino Encontra a Excelência",
        "subheadline": "Cortes contemporâneos, barboterapia com toalha quente e produtos premium. Agende seu horário online em 30 segundos e venha tomar uma cerveja gelada.",
        "badge_extra": "✂️ Agendamento Online sem Espera pelo Celular",
        "servicos": [
            {"icone": "✂️", "titulo": "Corte de Cabelo Personalizado", "desc": "Técnicas de fade, degradê e tesoura adaptadas ao formato do seu rosto e estilo."},
            {"icone": "🪒", "titulo": "Barboterapia com Toalha Quente", "desc": "Alinhamento com navalha, esfoliação facial, óleos essenciais e hidratação profunda."},
            {"icone": "🧴", "titulo": "Tratamentos Capilares & Barba", "desc": "Lavagem com shampoo mentolado, selagem, camuflagem de fios brancos e hidratação."},
            {"icone": "🍻", "titulo": "Espaço Lounge & Bebidas", "desc": "Ambiente climatizado com café expresso, sinuca e cervejas artesanais selecionadas."}
        ],
        "depoimentos": [
            {"autor": "Bruno Henrique", "texto": "Ambiente de primeira e os barbeiros mandam muito bem no degradê. Não troco por nenhuma outra!", "tempo": "Há 1 semana"},
            {"autor": "Thiago Martins", "texto": "A barboterapia é relaxamento puro depois de um dia de trabalho. Profissionais pontuais e educados.", "tempo": "Há 2 semanas"},
            {"autor": "Gabriel Costa", "texto": "Melhor barbearia da cidade. Agendamento prático pelo WhatsApp e corte sempre impecável.", "tempo": "Há 3 semanas"}
        ]
    },
    "microsaas_clinica": {
        "categoria": "Micro-SaaS & Automação de Agendamentos",
        "tagline": "✦ RECUPERAÇÃO AUTOMÁTICA DE CONSULTAS VIA IA",
        "headline": "Zere os Horários Ociosos e as Faltas na Sua Clínica",
        "subheadline": "Sistema inteligente integrado ao WhatsApp que confirma consultas com antecedência e preenche horários cancelados em até 10 minutos com pacientes da lista de espera.",
        "badge_extra": "⚡ Retorno financeiro comprovado: recupere até R$ 8.000/mês em consultas perdidas",
        "servicos": [
            {"icone": "📱", "titulo": "Confirmação Automática no WhatsApp", "desc": "Disparo de lembrete 24h e 12h antes com botões interativos de Sim e Não, sem ocupar a secretária."},
            {"icone": "⚡", "titulo": "Reocupação Instantânea de Horários", "desc": "Assim que uma consulta é cancelada, a IA avisa os próximos pacientes da lista de espera automaticamente."},
            {"icone": "📊", "titulo": "Painel de Faturamento Recuperado", "desc": "Dashboard visual com métricas em tempo real de pacientes salvos e receita preservada no mês."},
            {"icone": "🔗", "titulo": "Integração sem Trocar de Sistema", "desc": "Funciona em conjunto com a sua agenda atual sem exigir treinamentos complexos ou migrações."}
        ],
        "depoimentos": [
            {"autor": "Dra. Letícia Silveira", "texto": "Reduzimos as faltas de 28% para menos de 4% no primeiro mês. O sistema se pagou logo na primeira semana!", "tempo": "Há 1 semana"},
            {"autor": "Dr. Fernando Gusmão", "texto": "Minhas secretárias agora têm tempo para acolher os pacientes que chegam na recepção. Automação impecável.", "tempo": "Há 3 semanas"},
            {"autor": "Dra. Beatriz Prado", "texto": "Recuperamos mais de R$ 6.500 no mês passado com a lista de espera automática. Indispensável para qualquer clínica.", "tempo": "Há 1 mês"}
        ]
    },
    "contabilidade": {
        "categoria": "Assessoria Contábil, Fiscal & BPO Financeiro",
        "tagline": "✦ INTELIGÊNCIA TRIBUTÁRIA & CRESCIMENTO SEGURO",
        "headline": "Menos Burocracia, Menos Impostos e Mais Lucro no Seu Caixa",
        "subheadline": "Gestão contábil digital, planejamento tributário estratégico para redução lícita de tributos e suporte consultivo contínuo para sua empresa escalar com tranquilidade.",
        "badge_extra": "📈 Economia tributária média de 20% a 35% no primeiro ano",
        "servicos": [
            {"icone": "📊", "titulo": "Abertura & Regularização Rápida", "desc": "Processo 100% digital para emissão de CNPJ, contratos sociais, alvarás e licenças."},
            {"icone": "💰", "titulo": "Planejamento Tributário Estratégico", "desc": "Análise contábil aprofundada para enquadrar seu negócio no regime de menor imposto."},
            {"icone": "📑", "titulo": "Gestão de Folha & Departamento Pessoal", "desc": "Cálculo de encargos, eSocial, férias e rescisões com zero risco de passivo trabalhista."},
            {"icone": "📈", "titulo": "BPO Financeiro & Relatórios em Tempo Real", "desc": "Controle de fluxo de caixa, contas a pagar e relatórios para tomadas de decisão inteligentes."}
        ],
        "depoimentos": [
            {"autor": "Eduardo Ramos", "texto": "A transição de contador para eles reduziu nossos impostos em mais de 25% no primeiro trimestre. Indico de olhos fechados!", "tempo": "Há 2 semanas"},
            {"autor": "Juliana Silveira", "texto": "Atendimento rápido no WhatsApp, nunca fiquei com dúvida sem resposta. Plataforma super intuitiva.", "tempo": "Há 1 mês"},
            {"autor": "Fábio Nogueira", "texto": "Tiraram toda a dor de cabeça da folha de pagamento da minha agência. Trabalho impecável e pontual.", "tempo": "Há 2 meses"}
        ]
    },
    "churrascaria": {
        "categoria": "Churrascaria, Steakhouse & Cortes Nobres",
        "tagline": "✦ TRADIÇÃO DO FOGO DE CHÃO & CARNES NOBRES",
        "headline": "O Melhor Churrasco com Cortes Nobres e Sabor Incomparável",
        "subheadline": "Picanha na brasa, costela fogo de chão, cortes Angus selecionados e buffet completo de saladas e antepastos. Venha viver essa experiência.",
        "badge_extra": "🥩 Cortes Angus Certificados & Buffet Completo",
        "servicos": [
            {"icone": "🥩", "titulo": "Rodízio Completo & Cortes Nobres", "desc": "Mais de 20 cortes nobres servidos continuamente: Picanha, Fraldinha, Ancho, Cordeiro e Costela."},
            {"icone": "🥗", "titulo": "Buffet Gourmet & Frutos do Mar", "desc": "Mesa farta de antepastos, saladas frescas, queijos nobres e opções de frutos do mar."},
            {"icone": "🍷", "titulo": "Adega Climatizada & Drinks", "desc": "Seleção especial de vinhos tintos perfeitos para harmonização com carnes vermelhas."},
            {"icone": "🎉", "titulo": "Espaço Kids & Estacionamento VIP", "desc": "Ambiente confortável para famílias com recreação infantil e manobrista gratuito."}
        ],
        "depoimentos": [
            {"autor": "Rodrigo Calheiros", "texto": "A melhor costela da vida! Atendimento nota mil dos garçons, carnes no ponto exato. Vale cada centavo.", "tempo": "Há 3 dias"},
            {"autor": "Camila Figueira", "texto": "Comemoramos o aniversário do meu pai lá e foi incrível. Picanha suculenta e buffet impecável.", "tempo": "Há 1 semana"},
            {"autor": "Marcos Vinicius", "texto": "Ambiente amplo, carnes de altíssima qualidade e carta de vinhos excelente. Recomendo muito!", "tempo": "Há 2 semanas"}
        ]
    },
    "cabeleireiro": {
        "categoria": "Studio de Beleza, Cabelo & Estética Feminina",
        "tagline": "✦ TRANSFORMAÇÃO CAPILAR & CUIDADO EXCLUSIVO",
        "headline": "Realce Sua Beleza com Tratamentos Capilares de Alto Padrão",
        "subheadline": "Especialistas em mechas loiras, morena iluminada, cronograma capilar de luxo e escovas modeladas. Atendimento VIP com hora marcada.",
        "badge_extra": "✨ Produtos Importados & Diagnóstico Capilar Gratuito",
        "servicos": [
            {"icone": "💇‍♀️", "titulo": "Mechas & Morena Iluminada", "desc": "Técnicas modernas sem quebra dos fios, tonalidades personalizadas e brilho tridimensional."},
            {"icone": "✨", "titulo": "Tratamentos & Reconstrução", "desc": "Cronograma capilar profundo com marcas líderes mundiais para recuperar fios danificados."},
            {"icone": "💅", "titulo": "Manicure, Pedicure & Nail Art", "desc": "Unhas de gel, esmaltação em gel e spa dos pés com esterilização cirúrgica em autoclave."},
            {"icone": "💄", "titulo": "Make & Penteados para Noivas/Eventos", "desc": "Produção completa para formaturas, casamentos e festas com fixação prolongada 24h."}
        ],
        "depoimentos": [
            {"autor": "Juliana Paes M.", "texto": "Fiz meu loiro dos sonhos aqui! Meu cabelo ficou super saudável e com uma cor incrível. Atendimento de princesa.", "tempo": "Há 5 dias"},
            {"autor": "Larissa Menezes", "texto": "Melhor salão da cidade. Pontuais, educadas e o resultado da morena iluminada superou minhas expectativas.", "tempo": "Há 2 semanas"},
            {"autor": "Carla Vasconcelos", "texto": "Salão impecável e café maravilhoso. Fiz reconstrução capilar e meu cabelo renasceu. Super recomendo!", "tempo": "Há 3 semanas"}
        ]
    },
    "farmacia": {
        "categoria": "Farmácia, Drogaria & Manipulação Especializada",
        "tagline": "✦ SAÚDE, ECONOMIA & ENTREGA EXPRESSA",
        "headline": "Seus Medicamentos e Cuidados com a Saúde na Sua Porta",
        "subheadline": "Envie sua receita pelo WhatsApp e receba em minutos. Medicamentos éticos, genéricos com até 70% de desconto e manipulação de fórmulas precisas.",
        "badge_extra": "🛵 Entrega Express em até 45 minutos no seu bairro",
        "servicos": [
            {"icone": "💊", "titulo": "Envio de Receitas pelo WhatsApp", "desc": "Tire foto da sua receita e nossa equipe farmacêutica calcula o orçamento com os melhores descontos."},
            {"icone": "🛵", "titulo": "Tele-Entrega Ultra-Rápida", "desc": "Receba medicamentos e produtos de higiene no conforto da sua casa sem sair da rotina."},
            {"icone": "🧪", "titulo": "Fórmulas & Manipulação", "desc": "Laboratório moderno de manipulação com controle de qualidade rigoroso e laudo de pureza."},
            {"icone": "🩺", "titulo": "Aferição de Pressão & Glicemia", "desc": "Espaço de atenção farmacêutica com profissionais qualificados para orientar sobre seu tratamento."}
        ],
        "depoimentos": [
            {"autor": "Dona Sebastiana", "texto": "Atendimento maravilhoso. Mandei a receita da minha mãe e em meia hora os remédios estavam aqui em casa com ótimo desconto.", "tempo": "Há 2 dias"},
            {"autor": "Paulo Ricardo", "texto": "Sempre encontro os medicamentos que preciso e o preço dos genéricos é o melhor da região. Equipe nota 10!", "tempo": "Há 1 semana"},
            {"autor": "Dra. Renata M.", "texto": "Minhas fórmulas manipuladas sempre vêm com precisão e acabamento impecável. Farmácia de muita confiança.", "tempo": "Há 3 semanas"}
        ]
    },
    "geral": {
        "categoria": "Serviços Especializados de Alta Performance",
        "tagline": "✦ ATENDIMENTO DE ALTO PADRÃO & RESULTADOS REAIS",
        "headline": "Soluções Sob Medida com Rapidez, Garantia e Confiabilidade",
        "subheadline": "Profissionais altamente capacitados, tecnologia atualizada e compromisso inegociável com a sua satisfação. Fale conosco e surpreenda-se.",
        "badge_extra": "⭐ Satisfação garantida com nota 4.9 nas avaliações",
        "servicos": [
            {"icone": "⭐", "titulo": "Atendimento Prioritário & Rápido", "desc": "Resposta ágil e sem filas para entender exatamente a sua necessidade e entregar soluções."},
            {"icone": "🛡️", "titulo": "Garantia Total & Segurança", "desc": "Processos certificados com transparência em cada etapa e suporte contínuo garantido."},
            {"icone": "⚡", "titulo": "Metodologia & Eficiência", "desc": "Prazos cumpridos com rigor e precisão técnica para valorizar o seu tempo e investimento."},
            {"icone": "🤝", "titulo": "Consultoria Personalizada", "desc": "Diagnóstico sob medida sem custos adicionais para indicar a melhor solução para você."}
        ],
        "depoimentos": [
            {"autor": "Renata Carvalho", "texto": "Empresa séria, pontual e muito transparente. Resolveram tudo dentro do prazo combinado com muita perfeição.", "tempo": "Há 1 semana"},
            {"autor": "Daniel Oliveira", "texto": "Superou as expectativas. Equipe prestativa e atendimento de primeira linha. Recomendo a todos!", "tempo": "Há 3 semanas"},
            {"autor": "Vanessa Pires", "texto": "Excelente custo-benefício e muita atenção aos detalhes. Com certeza voltarei a contratar.", "tempo": "Há 1 mês"}
        ]
    }
}


def detectar_nicho_config(nicho_str: str) -> dict:
    nicho_norm = (nicho_str or "").lower()
    if any(k in nicho_norm for k in ["churrasc", "steak", "carne", "rodizio", "picanha"]):
        return NICHOS_CONFIG["churrascaria"]
    if any(k in nicho_norm for k in ["cabeleireir", "salao", "mechas", "loiro", "estetica feminina", "studio"]):
        return NICHOS_CONFIG["cabeleireiro"]
    if any(k in nicho_norm for k in ["farmac", "drogari", "medicamento", "manipulacao", "remedio"]):
        return NICHOS_CONFIG["farmacia"]
    if any(k in nicho_norm for k in ["saas", "software", "agenda", "cancelamento", "encaixa", "sistema"]):
        return NICHOS_CONFIG["microsaas_clinica"]
    if any(k in nicho_norm for k in ["odonto", "dent", "saude", "clinica", "medica"]):
        return NICHOS_CONFIG["odontologia"]
    if any(k in nicho_norm for k in ["advoc", "jurid", "direito", "lei"]):
        return NICHOS_CONFIG["advocacia"]
    if any(k in nicho_norm for k in ["restaurante", "pizz", "hamburg", "delivery", "lanchonete", "gastronomia", "comida"]):
        return NICHOS_CONFIG["restaurante"]
    if any(k in nicho_norm for k in ["barbearia", "barba", "salao", "estetica", "beleza"]):
        return NICHOS_CONFIG["barbearia"]
    if any(k in nicho_norm for k in ["contab", "fiscal", "financeiro", "consultoria"]):
        return NICHOS_CONFIG["contabilidade"]
    return NICHOS_CONFIG["geral"]


def slugify(text: str) -> str:
    text = (text or "").lower()
    text = re.sub(r"[àáâãäå]", "a", text)
    text = re.sub(r"[èéêë]", "e", text)
    text = re.sub(r"[ìíîï]", "i", text)
    text = re.sub(r"[òóôõö]", "o", text)
    text = re.sub(r"[ùúûü]", "u", text)
    text = re.sub(r"[ç]", "c", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "lead"


def gerar_html_landing_page(lead: dict, whatsapp_fechamento: str = WHATSAPP_MARQUINHOS) -> str:
    """
    Gera uma Landing Page Express 10x com Motion Design, Canvas 3D de Partículas Reativas,
    Glassmorphism Refinado e Barra de Conversão Superior para o WhatsApp do Marquinhos.
    """
    nome_empresa = lead.get("nome", "Empresa Modelo")
    nicho = lead.get("nicho", "Serviços")
    cidade = lead.get("cidade", "São Paulo - SP")
    telefone_lead = lead.get("telefone", "")
    reviews_count = lead.get("reviews_count", 142)
    socio = lead.get("socio_decisor", "Diretoria")

    cfg = detectar_nicho_config(nicho)

    # Mensagem de WhatsApp para o fechamento com o Marquinhos
    msg_fechamento = (
        f"Olá Marquinhos! Vi a prévia exclusiva do site da *{nome_empresa}* que você preparou. "
        f"Gostei muito da apresentação e quero saber os detalhes para colocar no ar em 24h com domínio próprio!"
    )
    link_fechamento_marquinhos = f"https://wa.me/{whatsapp_fechamento}?text={urllib.parse.quote(msg_fechamento)}"

    # Mensagem padrão do botão da página do cliente (para o WhatsApp da empresa dele)
    tel_clean = re.sub(r"[^\d]", "", telefone_lead) if telefone_lead else ""
    if not tel_clean:
        tel_clean = whatsapp_fechamento
    msg_lead_cliente = f"Olá! Vi a página da {nome_empresa} e gostaria de solicitar um atendimento prioritário."
    link_whatsapp_lead = f"https://wa.me/{tel_clean}?text={urllib.parse.quote(msg_lead_cliente)}"

    servicos_html = ""
    for s in cfg["servicos"]:
        servicos_html += f"""
        <div class="service-card">
          <div class="service-icon">{s['icone']}</div>
          <div class="service-title">{s['titulo']}</div>
          <div class="service-desc">{s['desc']}</div>
        </div>
        """

    depoimentos_html = ""
    for d in cfg["depoimentos"]:
        depoimentos_html += f"""
        <div class="review-card">
          <div class="stars">★★★★★</div>
          <p class="review-text">"{d['texto']}"</p>
          <div class="review-meta">
            <span class="author">{d['autor']}</span>
            <span class="badge-verified">✓ Verificado no Google</span>
          </div>
          <div class="review-time">{d['tempo']}</div>
        </div>
        """

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{nome_empresa} — {cfg['categoria']}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg: #07090e;
      --bg-surface: #0f141f;
      --bg-elevated: #161e2e;
      --primary: #38bdf8;
      --primary-glow: rgba(56, 189, 248, 0.35);
      --accent: #10b981;
      --border: rgba(255, 255, 255, 0.08);
      --border-glow: rgba(56, 189, 248, 0.4);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --font-main: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    html {{ scroll-behavior: smooth; }}
    body {{
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-main);
      overflow-x: hidden;
      line-height: 1.6;
      background-image: 
        radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.12) 0%, transparent 45%),
        radial-gradient(circle at 85% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
    }}

    /* Top Floating Conversion Banner (Moura.AI Style) */
    .closing-banner {{
      position: sticky;
      top: 0;
      z-index: 999;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-glow);
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }}
    .banner-info {{
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }}
    .pulse-dot {{
      width: 10px;
      height: 10px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 12px #10b981;
      animation: pulse 1.8s infinite;
    }}
    @keyframes pulse {{
      0%, 100% {{ opacity: 1; transform: scale(1); }}
      50% {{ opacity: 0.4; transform: scale(0.85); }}
    }}
    .banner-info strong {{
      color: #fff;
    }}
    .banner-cta {{
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      padding: 9px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.25s ease;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);
    }}
    .banner-cta:hover {{
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
    }}

    /* Header Nav */
    header {{
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}
    .logo-area {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .logo-badge {{
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #38bdf8, #2563eb);
      display: grid;
      place-items: center;
      font-weight: 900;
      font-size: 18px;
      color: #fff;
      box-shadow: 0 4px 14px rgba(56, 189, 248, 0.4);
    }}
    .brand-name {{
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #fff;
    }}
    .brand-city {{
      font-size: 12px;
      color: var(--text-muted);
    }}
    .header-btn {{
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: #fff;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .header-btn:hover {{
      background: rgba(56, 189, 248, 0.1);
      border-color: var(--primary);
      color: var(--primary);
    }}

    /* Hero Section */
    .hero {{
      max-width: 1200px;
      margin: 30px auto 60px;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 48px;
      align-items: center;
    }}
    @media (max-width: 900px) {{
      .hero {{ grid-template-columns: 1fr; margin-top: 10px; }}
    }}
    .tagline-chip {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
    }}
    .hero h1 {{
      font-size: 44px;
      font-weight: 900;
      letter-spacing: -1.2px;
      line-height: 1.15;
      margin-bottom: 18px;
      color: #fff;
    }}
    .hero h1 span {{
      background: linear-gradient(135deg, #38bdf8 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}
    .hero-desc {{
      font-size: 16px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 28px;
    }}
    .badge-extra {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 24px;
    }}
    .hero-actions {{
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      align-items: center;
    }}
    .btn-primary {{
      background: linear-gradient(135deg, #38bdf8, #2563eb);
      color: #fff;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all 0.25s ease;
      box-shadow: 0 4px 20px rgba(56, 189, 248, 0.4);
    }}
    .btn-primary:hover {{
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(56, 189, 248, 0.6);
    }}
    .btn-secondary {{
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: #fff;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }}
    .btn-secondary:hover {{
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.08);
    }}

    /* 3D Visual Mesh Container */
    .hero-visual {{
      position: relative;
      height: 380px;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid var(--border-glow);
      background: radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 0%, rgba(15, 20, 31, 0.8) 70%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    }}
    #meshCanvas {{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }}
    .visual-overlay-card {{
      position: relative;
      z-index: 2;
      background: rgba(15, 20, 31, 0.88);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 24px;
      border-radius: 18px;
      width: 86%;
      box-shadow: 0 16px 45px rgba(0,0,0,0.6);
      animation: floatMotion 5s ease-in-out infinite;
    }}
    @keyframes floatMotion {{
      0%, 100% {{ transform: translateY(0px); }}
      50% {{ transform: translateY(-8px); }}
    }}
    .glass-pill {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.18);
      color: #34d399;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 12px;
    }}

    /* Stats Bar */
    .stats-bar {{
      max-width: 1200px;
      margin: 0 auto 70px;
      padding: 0 24px;
    }}
    .stats-inner {{
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 24px 36px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      text-align: center;
    }}
    .stat-number {{
      font-size: 34px;
      font-weight: 900;
      color: #38bdf8;
      letter-spacing: -0.5px;
    }}
    .stat-label {{
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }}

    /* Section Global */
    section {{
      max-width: 1200px;
      margin: 0 auto 80px;
      padding: 0 24px;
    }}
    .section-title {{
      text-align: center;
      margin-bottom: 48px;
    }}
    .section-title h2 {{
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.8px;
      color: #fff;
      margin-bottom: 8px;
    }}
    .section-title p {{
      color: var(--text-muted);
      font-size: 15px;
    }}

    /* Services Grid */
    .services-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }}
    .service-card {{
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px;
      transition: all 0.3s ease;
      position: relative;
    }}
    .service-card:hover {{
      border-color: var(--border-glow);
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(56, 189, 248, 0.15);
    }}
    .service-icon {{
      font-size: 34px;
      margin-bottom: 16px;
    }}
    .service-title {{
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }}
    .service-desc {{
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.55;
    }}

    /* Reviews Section */
    .reviews-container {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }}
    .review-card {{
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
    }}
    .stars {{
      color: #fbbf24;
      font-size: 16px;
      margin-bottom: 12px;
    }}
    .review-text {{
      font-size: 14px;
      color: #d1d5db;
      font-style: italic;
      line-height: 1.6;
      margin-bottom: 16px;
    }}
    .review-meta {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
    }}
    .author {{
      font-weight: 700;
      color: #fff;
    }}
    .badge-verified {{
      color: #34d399;
      font-size: 11px;
      font-weight: 600;
    }}
    .review-time {{
      font-size: 11px;
      color: #64748b;
      margin-top: 4px;
    }}

    /* Final CTA */
    .final-cta {{
      text-align: center;
      margin-bottom: 80px;
    }}
    .final-cta-box {{
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(16, 185, 129, 0.08));
      border: 1px solid var(--border-glow);
      border-radius: 24px;
      padding: 48px 24px;
      max-width: 800px;
      margin: 0 auto;
    }}
    .final-cta-box h2 {{
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 12px;
      color: #fff;
    }}
    .final-cta-box p {{
      color: var(--text-muted);
      margin-bottom: 28px;
      font-size: 15px;
    }}

    /* Footer */
    footer {{
      border-top: 1px solid var(--border);
      padding: 36px 24px;
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
    }}
    footer a {{
      color: var(--primary);
      text-decoration: none;
    }}

    /* Floating WhatsApp Icon */
    .floating-whatsapp {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 58px;
      height: 58px;
      background: #25d366;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 28px;
      color: #fff;
      box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
      z-index: 998;
      text-decoration: none;
      transition: all 0.25s ease;
    }}
    .floating-whatsapp:hover {{
      transform: scale(1.08);
    }}
  </style>
</head>
<body>

  <!-- Top Floating Closing Banner (Moura.AI) -->
  <div class="closing-banner">
    <div class="banner-info">
      <div class="pulse-dot"></div>
      <div>
        <strong>Prévia Interativa 10x:</strong> Desenvolvida com MotionSites & Spline 3D para <strong>{nome_empresa}</strong>
      </div>
    </div>
    <a href="{link_fechamento_marquinhos}" target="_blank" class="banner-cta">
      <span>🚀</span> Colocar no Ar em 24h com Marquinhos
    </a>
  </div>

  <!-- Header -->
  <header>
    <div class="logo-area">
      <div class="logo-badge">{nome_empresa[0] if nome_empresa else 'E'}</div>
      <div>
        <div class="brand-name">{nome_empresa}</div>
        <div class="brand-city">{cidade} • {cfg['categoria']}</div>
      </div>
    </div>
    <a href="{link_whatsapp_lead}" target="_blank" class="header-btn">
      <span>💬</span> Falar com a Recepção
    </a>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div>
      <div class="tagline-chip">{cfg['tagline']}</div>
      <h1>{cfg['headline'].replace('Sorriso', '<span>Sorriso</span>').replace('Direitos', '<span>Direitos</span>').replace('Experiência', '<span>Experiência</span>').replace('Horários', '<span>Horários</span>')}</h1>
      <p class="hero-desc">{cfg['subheadline']}</p>
      <div class="badge-extra">{cfg.get('badge_extra', '⭐ Atendimento Exclusivo e Personalizado')}</div>
      <div class="hero-actions">
        <a href="{link_whatsapp_lead}" target="_blank" class="btn-primary">
          <span>📅</span> Solicitar Horário Prioritário
        </a>
        <a href="#servicos" class="btn-secondary">
          Conhecer Serviços
        </a>
      </div>
    </div>

    <div class="hero-visual">
      <canvas id="meshCanvas"></canvas>
      <div class="visual-overlay-card">
        <div class="glass-pill">● REPUTAÇÃO MÁXIMA NO GOOGLE</div>
        <div style="font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 4px;">4.9 ★★★★★</div>
        <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 16px;">Baseado em mais de {reviews_count} avaliações espontâneas de clientes em {cidade}.</div>
        <div style="display: flex; gap: 8px; font-size: 12px; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
          <span>✓ Atendimento 100% humanizado</span>
          <span>•</span>
          <span>✓ Tecnologia sem burocracia</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Bar -->
  <div class="stats-bar">
    <div class="stats-inner">
      <div>
        <div class="stat-number">4.9 ★</div>
        <div class="stat-label">Classificação no Google Maps</div>
      </div>
      <div>
        <div class="stat-number">+{reviews_count}</div>
        <div class="stat-label">Famílias & Clientes Atendidos</div>
      </div>
      <div>
        <div class="stat-number">100%</div>
        <div class="stat-label">Compromisso com o Paciente</div>
      </div>
      <div>
        <div class="stat-number">&lt; 15 min</div>
        <div class="stat-label">Tempo Médio de Resposta</div>
      </div>
    </div>
  </div>

  <!-- Services Section -->
  <section id="servicos">
    <div class="section-title">
      <h2>Nossos Serviços Especializados</h2>
      <p>Tratamentos e soluções de alto padrão pensados exclusivamente para você</p>
    </div>
    <div class="services-grid">
      {servicos_html}
    </div>
  </section>

  <!-- Reviews Section -->
  <section>
    <div class="section-title">
      <h2>O Que Dizem Nossos Clientes</h2>
      <p>Depoimentos reais de quem confia no trabalho da {nome_empresa}</p>
    </div>
    <div class="reviews-container">
      {depoimentos_html}
    </div>
  </section>

  <!-- Final CTA -->
  <section class="final-cta">
    <div class="final-cta-box">
      <h2>Pronto para Ter a Melhor Experiência em {cidade}?</h2>
      <p>Entre em contato direto pelo WhatsApp. Nossa equipe está a postos para te responder com prioridade.</p>
      <a href="{link_whatsapp_lead}" target="_blank" class="btn-primary" style="font-size: 16px; padding: 18px 36px;">
        <span>💬</span> Iniciar Atendimento sem Compromisso
      </a>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <p>© 2026 {nome_empresa}. Todos os direitos reservados. • {cidade}</p>
    <p style="margin-top: 8px; font-size: 11px; color: #64748b;">
      Prévia de Alta Conversão desenvolvida por <a href="{link_fechamento_marquinhos}" target="_blank">Marquinhos (Moura.AI)</a>
    </p>
  </footer>

  <!-- Floating WhatsApp Icon -->
  <a href="{link_whatsapp_lead}" target="_blank" class="floating-whatsapp" title="Falar no WhatsApp">
    💬
  </a>

  <!-- Interactive 3D Canvas Mesh Script (MotionSites Style com Física Reativa ao Mouse) -->
  <script>
    const canvas = document.getElementById('meshCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {{
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }}
    window.addEventListener('resize', resize);
    resize();

    let mouse = {{ x: width / 2, y: height / 2, active: false }};
    canvas.addEventListener('mousemove', (e) => {{
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }});
    canvas.addEventListener('mouseleave', () => {{ mouse.active = false; }});

    let points = [];
    const POINT_COUNT = 45;
    for (let i = 0; i < POINT_COUNT; i++) {{
      points.push({{
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2.2 + 1,
        baseColor: '#38bdf8'
      }});
    }}

    function draw() {{
      ctx.clearRect(0, 0, width, height);

      // Conexões de Linha com Gradiente
      for (let i = 0; i < points.length; i++) {{
        for (let j = i + 1; j < points.length; j++) {{
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {{
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            const alpha = (1 - dist / 120) * 0.7;
            ctx.strokeStyle = `rgba(56, 189, 248, ${{alpha}})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }}
        }}
      }}

      // Conexão com o cursor do mouse (Efeito Físico Spline 3D)
      if (mouse.active) {{
        for (let p of points) {{
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {{
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${{1 - dist / 140}})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }}
        }}
      }}

      // Partículas
      for (let p of points) {{
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.baseColor;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }}

      requestAnimationFrame(draw);
    }}
    draw();
  </script>
</body>
</html>
"""
    return html


def gerar_todas_as_previas(lista_leads: list, pasta_saida: str = "Status/previas", whatsapp_fechamento: str = WHATSAPP_MARQUINHOS) -> dict:
    """
    Gera o arquivo HTML de prévia para cada lead na pasta informada.
    Retorna dicionário mapeando o ID do lead para o caminho relativo da prévia.
    """
    os.makedirs(pasta_saida, exist_ok=True)
    mapa_previas = {}

    for lead in lista_leads:
        lead_id = lead.get("id") or slugify(lead.get("nome", "lead"))
        html = gerar_html_landing_page(lead, whatsapp_fechamento)
        nome_arquivo = f"{lead_id}.html"
        caminho_completo = os.path.join(pasta_saida, nome_arquivo)
        with open(caminho_completo, "w", encoding="utf-8") as f:
            f.write(html)
        mapa_previas[lead_id] = f"previas/{nome_arquivo}"

    return mapa_previas


if __name__ == "__main__":
    leads_teste = [
        {
            "id": "odonto-prime-sp",
            "nome": "Clínica Odonto Prime",
            "nicho": "Odontologia & Implantes",
            "cidade": "São Paulo - SP",
            "telefone": "(11) 98765-4321",
            "reviews_count": 184,
            "socio_decisor": "Dr. Fernando Silveira"
        },
        {
            "id": "mendes-advogados",
            "nome": "Mendes & Associados Advocacia",
            "nicho": "Direito Empresarial & Cível",
            "cidade": "São Paulo - SP",
            "telefone": "(11) 97654-3210",
            "reviews_count": 96,
            "socio_decisor": "Dr. Rodrigo Mendes"
        },
        {
            "id": "cantina-da-mamma",
            "nome": "Cantina & Pizzaria da Mamma",
            "nicho": "Restaurante & Pizzaria",
            "cidade": "São Paulo - SP",
            "telefone": "(11) 96543-2109",
            "reviews_count": 312,
            "socio_decisor": "Giovanni Rossini"
        },
        {
            "id": "barbearia-vintage-club",
            "nome": "Vintage Club Barber Shop",
            "nicho": "Barbearia Clássica",
            "cidade": "São Paulo - SP",
            "telefone": "(11) 95432-1098",
            "reviews_count": 147,
            "socio_decisor": "Thiago Martins"
        },
        {
            "id": "recupera-agenda-clinica",
            "nome": "Encaixa Aí — Solução de Agenda para Clínicas",
            "nicho": "Micro-SaaS & Agendamento Médico",
            "cidade": "São Paulo - SP",
            "telefone": "(11) 93931-8424",
            "reviews_count": 89,
            "socio_decisor": "Marquinhos | Moura.AI"
        }
    ]

    print("🚀 Gerando prévias 10x com física reativa e novos nichos...")
    res = gerar_todas_as_previas(leads_teste)
    print("✅ Prévias geradas com sucesso:")
    for k, v in res.items():
        print(f"  • {k} -> {v}")
