"""
Moura.AI — Gerador de Páginas de Infoprodutos & PLR de Alta Margem (98%)
Desenvolvido para Marquinhos (Moura.AI) — WhatsApp Oficial: (11) 93931-8424
"""

import os
import json
import urllib.parse

WHATSAPP_MARQUINHOS = "5511939318424"

INFOPRODUTOS_CATALOGO = [
    {
        "id": "guia-renda-ia-sem-estoque",
        "nome": "Guia Prático: Renda com IA & Vendas Sem Estoque (Método 2026)",
        "subtitulo": "O Passo a Passo Exato para Faturar de R$ 3.000 a R$ 10.000/Mês Usando Ferramentas Gratuitas de IA e Fornecedores Nacionais",
        "preco_de": "97,00",
        "preco_por": "47,00",
        "parcelas": "5x de R$ 10,11",
        "formato": "E-book em PDF Interativo + Planilha de Mineração + Pack de Prompts",
        "entrega": "Acesso Imediato por E-mail e WhatsApp",
        "margem_lucro": "98%",
        "cor_destaque": "#0284c7", # Sky Blue
        "badge": "⚡ Lançamento Oficial Fim de Ano 2026",
        "conteudo_modulos": [
            {"modulo": "Módulo 1", "titulo": "Desbloqueio e Quebra de Crenças", "desc": "Como iniciar com CPF, sem aparecer e sem gastar com mensalidades ou estoques caros."},
            {"modulo": "Módulo 2", "titulo": "A Tríade P.O.C. (Produto, Oferta e Conversão)", "desc": "Os 4 critérios para escolher produtos perpétuos e sazonais de explosão."},
            {"modulo": "Módulo 3", "titulo": "Mineração Secreta no Meta Ads & TikTok", "desc": "Como espionar lojas milionárias e validar anúncios ativos que vendem todo santo dia."},
            {"modulo": "Módulo 4", "titulo": "Automação com IA & Fechamento no WhatsApp", "desc": "Roteiros de 3 mensagens para fechar vendas no automático com Pix imediato."}
        ],
        "bonus": [
            {"nome": "BÔNUS 1: Planilha de Precificação Automática", "valor": "R$ 47,00 (Grátis Hoje)"},
            {"nome": "BÔNUS 2: Lista com 5 Fornecedores Nacionais Testados", "valor": "R$ 97,00 (Grátis Hoje)"},
            {"nome": "BÔNUS 3: Pack com 20 Roteiros de Vídeos Curtos para TikTok", "valor": "R$ 67,00 (Grátis Hoje)"}
        ]
    },
    {
        "id": "pack-100-prompts-fechamento-b2b",
        "nome": "Pack 100 Prompts de Ouro para Fechamento de Vendas B2B",
        "subtitulo": "Copies Validadas de WhatsApp, E-mail Consultivo e Propostas Irresistíveis para Vender Sites e Serviços com IA",
        "preco_de": "67,00",
        "preco_por": "27,00",
        "parcelas": "3x de R$ 9,50",
        "formato": "Documento Digital + Notion Dashboard + Roteiros Prontos",
        "entrega": "Download Imediato em 1 Clique",
        "margem_lucro": "98%",
        "cor_destaque": "#a855f7", # Purple
        "badge": "🎯 Ferramenta de Fechamento Imediato",
        "conteudo_modulos": [
            {"modulo": "Parte 1", "titulo": "Abordagens Frias de Alta Curiosidade", "desc": "Mensagens de 3 linhas com taxa de abertura superior a 65% no WhatsApp."},
            {"modulo": "Parte 2", "titulo": "O Roteiro da 'Antecipação de Valor'", "desc": "Como enviar a prévia de site/serviço fazendo o empresário querer comprar na hora."},
            {"modulo": "Parte 3", "titulo": "Quebra dos 15 Tipos de Objeções", "desc": "Respostas elegantes para 'tá caro', 'não tenho tempo' ou 'já tenho sobrinho que faz'."},
            {"modulo": "Parte 4", "titulo": "Follow-ups e Recuperação de Clientes Sumidos", "desc": "Técnica de reativação de orçamentos parados para fechar contratos no mesmo dia."}
        ],
        "bonus": [
            {"nome": "BÔNUS 1: Modelo de Contrato Blindado de Prestação de Serviços", "valor": "R$ 150,00 (Grátis Hoje)"},
            {"nome": "BÔNUS 2: Script de Ligação Telefônica de 30 Segundos", "valor": "R$ 47,00 (Grátis Hoje)"}
        ]
    }
]

def gerar_html_infoproduto(info):
    msg_whats = f"Olá Marquinhos! Quero adquirir o '{info['nome']}' por R$ {info['preco_por']} via Pix com acesso imediato!"
    link_whats = f"https://api.whatsapp.com/send?phone={WHATSAPP_MARQUINHOS}&text={urllib.parse.quote(msg_whats)}"

    modulos_html = ""
    for m in info["conteudo_modulos"]:
        modulos_html += f"""
        <div class="module-card">
          <div class="module-tag">{m['modulo']}</div>
          <div class="module-title">{m['titulo']}</div>
          <div class="module-desc">{m['desc']}</div>
        </div>
        """

    bonus_html = ""
    for b in info["bonus"]:
        bonus_html += f"""
        <div class="bonus-card">
          <div class="bonus-icon">🎁</div>
          <div>
            <div class="bonus-name">{b['nome']}</div>
            <div class="bonus-val">Valor individual: <span class="val-cut">{b['valor']}</span></div>
          </div>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>{info['nome']} — Acesso Imediato</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {{
      --primary: {info['cor_destaque']};
      --bg: #060911;
      --card-bg: #0d1424;
      --border: #1e293b;
      --text: #f8fafc;
      --muted: #94a3b8;
      --gold: #fbbf24;
      --success: #10b981;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding-bottom: 110px;
    }}
    .container {{
      max-width: 600px;
      margin: 0 auto;
      background: #090f1e;
      min-height: 100vh;
      box-shadow: 0 0 50px rgba(0,0,0,0.8);
      padding: 24px 20px;
    }}
    .badge-top {{
      display: inline-block;
      background: rgba(2, 132, 199, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 6px 14px;
      border-radius: 20px;
      margin-bottom: 16px;
    }}
    h1 {{
      font-size: 24px;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 12px;
      color: #fff;
    }}
    .subtitle {{
      font-size: 14px;
      color: var(--muted);
      line-height: 1.5;
      margin-bottom: 24px;
    }}
    
    /* Mockup Box */
    .mockup-box {{
      background: linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(168, 85, 247, 0.1));
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 30px 20px;
      text-align: center;
      margin-bottom: 28px;
      position: relative;
    }}
    .mockup-icon {{
      font-size: 64px;
      margin-bottom: 12px;
      display: inline-block;
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
    }}
    .mockup-label {{
      font-size: 13px;
      font-weight: 700;
      color: #fff;
    }}
    .mockup-sub {{
      font-size: 12px;
      color: var(--muted);
      margin-top: 4px;
    }}

    /* Offer Box */
    .offer-card {{
      background: #111a2e;
      border: 2px solid var(--primary);
      border-radius: 18px;
      padding: 24px 20px;
      margin-bottom: 30px;
      text-align: center;
    }}
    .price-de {{
      font-size: 14px;
      color: #94a3b8;
      text-decoration: line-through;
    }}
    .price-main {{
      font-size: 44px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -1px;
      margin: 4px 0;
    }}
    .price-parcelas {{
      font-size: 14px;
      color: var(--success);
      font-weight: 700;
      margin-bottom: 14px;
    }}
    .deliver-tag {{
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 8px;
      display: inline-block;
    }}

    /* Modules */
    .section-title {{
      font-size: 16px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .module-card {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 12px;
    }}
    .module-tag {{
      font-size: 10px;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }}
    .module-title {{
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
    }}
    .module-desc {{
      font-size: 13px;
      color: var(--muted);
      line-height: 1.4;
    }}

    /* Bonus */
    .bonus-card {{
      background: rgba(251, 191, 36, 0.06);
      border: 1px solid rgba(251, 191, 36, 0.25);
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 14px;
    }}
    .bonus-icon {{
      font-size: 26px;
    }}
    .bonus-name {{
      font-size: 13px;
      font-weight: 700;
      color: #fff;
    }}
    .bonus-val {{
      font-size: 11px;
      color: var(--gold);
      margin-top: 2px;
    }}
    .val-cut {{
      text-decoration: line-through;
      color: #94a3b8;
    }}

    /* Guarantee */
    .guarantee-box {{
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 24px;
    }}
    .guarantee-icon {{ font-size: 32px; }}
    .guarantee-title {{ font-size: 13px; font-weight: 800; color: #34d399; }}
    .guarantee-desc {{ font-size: 12px; color: var(--muted); }}

    /* Bottom Bar */
    .bottom-bar {{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(6, 9, 17, 0.95);
      backdrop-filter: blur(12px);
      border-top: 1px solid var(--border);
      padding: 14px 20px;
      z-index: 100;
      display: flex;
      justify-content: center;
    }}
    .btn-buy {{
      width: 100%;
      max-width: 560px;
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 16px 20px;
      font-size: 16px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-decoration: none;
      box-shadow: 0 4px 25px rgba(2, 132, 199, 0.45);
      cursor: pointer;
    }}
  </style>
</head>
<body>

  <div class="container">
    <div class="badge-top">{info['badge']}</div>
    <h1>{info['nome']}</h1>
    <p class="subtitle">{info['subtitulo']}</p>

    <!-- Mockup Visual -->
    <div class="mockup-box">
      <div class="mockup-icon">📚</div>
      <div class="mockup-label">{info['formato']}</div>
      <div class="mockup-sub">Liberado na hora em seu celular, tablet ou computador</div>
    </div>

    <!-- Oferta -->
    <div class="offer-card">
      <div class="price-de">De R$ {info['preco_de']} por apenas</div>
      <div class="price-main">R$ {info['preco_por']}</div>
      <div class="price-parcelas">ou em {info['parcelas']} no cartão</div>
      <div class="deliver-tag">✓ {info['entrega']}</div>
    </div>

    <!-- Módulos -->
    <div class="section-title">
      <span>📖</span> O Que Você Vai Receber:
    </div>
    <div class="modules-list">
      {modulos_html}
    </div>

    <!-- Bônus -->
    <div class="section-title" style="margin-top: 26px;">
      <span>🎁</span> Bônus Especiais Inclusos:
    </div>
    <div class="bonus-list">
      {bonus_html}
    </div>

    <!-- Garantia -->
    <div class="guarantee-box">
      <div class="guarantee-icon">🛡️</div>
      <div>
        <div class="guarantee-title">Garantia Blindada de 7 Dias</div>
        <div class="guarantee-desc">Se o conteúdo não te ajudar a fechar suas primeiras vendas, solicite 100% do seu dinheiro de volta sem enrolação.</div>
      </div>
    </div>

  </div>

  <!-- Botão Flutuante -->
  <div class="bottom-bar">
    <a href="{link_whats}" target="_blank" class="btn-buy">
      <span>⚡</span>
      <span>COMPRAR AGORA NO PIX (R$ {info['preco_por']})</span>
    </a>
  </div>

</body>
</html>
"""

def gerar_todos_infoprodutos():
    output_dir = os.path.join(os.path.dirname(__file__), "infoprodutos")
    os.makedirs(output_dir, exist_ok=True)
    
    arquivos_gerados = []
    for info in INFOPRODUTOS_CATALOGO:
        nome_arquivo = f"{info['id']}.html"
        caminho_completo = os.path.join(output_dir, nome_arquivo)
        html = gerar_html_infoproduto(info)
        with open(caminho_completo, "w", encoding="utf-8") as f:
            f.write(html)
        arquivos_gerados.append({
            "id": info["id"],
            "nome": info["nome"],
            "preco": info["preco_por"],
            "margem": info["margem_lucro"],
            "formato": info["formato"],
            "arquivo": caminho_completo,
            "url_relativa": f"infoprodutos/{nome_arquivo}"
        })
        print(f"✅ Gerada página para infoproduto: {info['nome']} -> {nome_arquivo}")

    manifesto_path = os.path.join(output_dir, "infoprodutos_manifest.json")
    with open(manifesto_path, "w", encoding="utf-8") as f:
        json.dump(arquivos_gerados, f, ensure_ascii=False, indent=2)
    print(f"📦 Manifesto de infoprodutos salvo em: {manifesto_path}")
    return arquivos_gerados

if __name__ == "__main__":
    gerar_todos_infoprodutos()

