"""
Moura.AI — Gerador de Páginas de Produto Vencedor (Ghost Commerce / One-Product Store)
Inspirado na metodologia de Thiago Hora (Cansei Dessa Vida) e Vagner Mazzeo.
Desenvolvido para Marquinhos (Moura.AI) — WhatsApp Oficial: (11) 93931-8424
"""

import os
import json

WHATSAPP_MARQUINHOS = "5511939318424"

PRODUTOS_CATALOGO = [
    {
        "id": "joelheira-ortopedica",
        "nome": "Joelheira Ortopédica Alívio 3D Pro (Par)",
        "subtitulo": "Compressão Anatômica com Estabilizadores Laterais e Gel Patelar",
        "categoria": "Perpétuo (Saúde / Dor Física)",
        "preco_de": "249,90",
        "preco_por": "129,90",
        "parcelas": "12x de R$ 13,04",
        "custo_estimado": "20,00",
        "lucro_liquido": "85,00",
        "margem_percentual": "65%",
        "cor_destaque": "#10b981", # Emerald
        "badge_status": "🔥 Top Vendas Perpétuo",
        "imagem_hero": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
        "imagens_galeria": [
            "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80"
        ],
        "beneficios": [
            {"icone": "⚡", "titulo": "Alívio Imediato da Dor", "desc": "Tecnologia de compressão 3D que distribui a carga e alivia a pressão nos meniscos e cartilagens."},
            {"icone": "🛡️", "titulo": "Estabilização com Gel de Silicone", "desc": "Anel anatômico patelar que absorve impactos ao caminhar, subir escadas ou correr."},
            {"icone": "🌬️", "titulo": "Tecido Respirável Antisuor", "desc": "Não escorrega, não esquenta e não causa odores mesmo com uso contínuo de 8 a 12 horas."},
            {"icone": "🎯", "titulo": "Aprovado por Ortopedistas", "desc": "Recomendado para artrose, artrite, tendinite patelar e recuperação de lesões articulares."}
        ],
        "depoimentos": [
            {"nome": "Carlos Mendes, 52 anos", "cidade": "São Paulo/SP", "texto": "Sofria com dor terrível no joelho para descer a escada do meu prédio. Depois de 3 dias usando essa joelheira, sinto como se tivesse tirado 15kg do joelho. Vale cada centavo!", "estrelas": 5},
            {"nome": "Maria de Fátima, 48 anos", "cidade": "Campinas/SP", "texto": "Comprei o par porque tenho artrose nos dois joelhos. Ela firma muito sem prender a circulação. Entrega rápida em 4 dias em casa!", "estrelas": 5},
            {"nome": "Roberto Silveira, 39 anos", "cidade": "Santos/SP", "texto": "Voltei a jogar futebol society sem medo. O estabilizador lateral faz toda a diferença.", "estrelas": 5}
        ],
        "garantia_dias": 30
    },
    {
        "id": "caneta-depiladora",
        "nome": "Caneta Depiladora Facial & Sobrancelhas Precision Gold",
        "subtitulo": "Depilação Indolor em Segundos com Ponta Hipogênica Banhada a Ouro 18K",
        "categoria": "Perpétuo (Beleza / Praticidade Feminina)",
        "preco_de": "179,00",
        "preco_por": "97,00",
        "parcelas": "12x de R$ 9,74",
        "custo_estimado": "12,00",
        "lucro_liquido": "67,00",
        "margem_percentual": "69%",
        "cor_destaque": "#f43f5e", # Rose
        "badge_status": "✨ Sensação no TikTok",
        "imagem_hero": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
        "imagens_galeria": [
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80"
        ],
        "beneficios": [
            {"icone": "💎", "titulo": "Ponta Banhada a Ouro 18K", "desc": "Totalmente hipoalergênica, não puxa os fios, não corta e não causa vermelhidão nem bolinhas."},
            {"icone": "💡", "titulo": "Micro-Luz LED Integrada", "desc": "Ilumina até os pelinhos mais finos e invisíveis para você nunca errar o desenho da sobrancelha."},
            {"icone": "👜", "titulo": "Tamanho Discreto de Batom", "desc": "Cabe em qualquer bolsa ou nécessaire. Perfeita para retocar no carro, no trabalho ou antes de sair."},
            {"icone": "🔋", "titulo": "Bateria USB Recarregável", "desc": "Sem gastar pilhas. Uma carga dura semanas de retoques diários."}
        ],
        "depoimentos": [
            {"nome": "Juliana Castro, 29 anos", "cidade": "São Paulo/SP", "texto": "Gente, aposentei a pinça e a cera! Não sinto NADA de dor e a sobrancelha fica limpinha em 1 minuto antes de trabalhar.", "estrelas": 5},
            {"nome": "Aline Rocha, 34 anos", "cidade": "Santo André/SP", "texto": "Minha pele é super sensível e sempre empipocava com cera. Com essa caneta não fica vermelho nada. Amei!", "estrelas": 5},
            {"nome": "Camila Duarte, 41 anos", "cidade": "Ribeirão Preto/SP", "texto": "Comprei duas, uma pra mim e uma pra minha filha adolescente. É muito prática!", "estrelas": 5}
        ],
        "garantia_dias": 30
    },
    {
        "id": "game-stick-4k-retro",
        "nome": "Game Stick 4K Retrô Pro — 10.000 Jogos + 2 Controles Sem Fio",
        "subtitulo": "Reviva os Melhores Clássicos de Playstation 1, Super Nintendo, Mega Drive e Fliperama em 4K na sua TV",
        "categoria": "Sazonal de Alta Explosão (Natal & Fim de Ano 2026)",
        "preco_de": "399,00",
        "preco_por": "249,00",
        "parcelas": "12x de R$ 25,00",
        "custo_estimado": "65,00",
        "lucro_liquido": "150,00",
        "margem_percentual": "60%",
        "cor_destaque": "#8b5cf6", # Purple
        "badge_status": "🎄 O Presente Nº1 do Natal 2026",
        "imagem_hero": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
        "imagens_galeria": [
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80"
        ],
        "beneficios": [
            {"icone": "🎮", "titulo": "10.000 Jogos em 1 Só Aparelho", "desc": "Super Mario World, Mortal Kombat, Sonic, Crash Bandicoot, The King of Fighters, Street Fighter e muito mais."},
            {"icone": "📺", "titulo": "Plug & Play em Qualquer TV (HDMI)", "desc": "Basta plugar na entrada HDMI da TV e na tomada USB. Não precisa de internet nem configurações complicadas."},
            {"icone": "🕹️", "titulo": "2 Controles Sem Fio Inclusos", "desc": "Jogue de dois a até 10 metros de distância com controles ergonômicos sem fios enrolados na sala."},
            {"icone": "💾", "titulo": "Salvamento de Fases Instantâneo", "desc": "Salve seu progresso em qualquer jogo na hora que quiser e continue depois de onde parou."}
        ],
        "depoimentos": [
            {"nome": "Rodrigo Barbosa, 38 anos", "cidade": "Osasco/SP", "texto": "Comprei de presente adiantado de Natal para o meu filho de 9 anos e acabei jogando Super Mario a noite inteira com ele. Nostalgia pura!", "estrelas": 5},
            {"nome": "Fabiano Souza, 33 anos", "cidade": "Guarulhos/SP", "texto": "Funciona muito bem na minha TV 4K. Imagem limpa e os controles respondem super rápido sem delay.", "estrelas": 5},
            {"nome": "Patricia Lima, 45 anos", "cidade": "São Paulo/SP", "texto": "Melhor compra do ano! Reuniu a família no domingo todo jogando Donkey Kong e relembrando a infância.", "estrelas": 5}
        ],
        "garantia_dias": 30
    }
]

def gerar_html_produto(prod):
    msg_whats = f"Olá Marquinhos! Vi a oferta da {prod['nome']} por R$ {prod['preco_por']} com Frete Grátis e gostaria de garantir o meu pedido com desconto!"
    import urllib.parse
    link_whats = f"https://api.whatsapp.com/send?phone={WHATSAPP_MARQUINHOS}&text={urllib.parse.quote(msg_whats)}"

    beneficios_html = ""
    for b in prod["beneficios"]:
        beneficios_html += f"""
        <div class="benefit-card">
          <div class="benefit-icon">{b['icone']}</div>
          <div>
            <div class="benefit-title">{b['titulo']}</div>
            <div class="benefit-desc">{b['desc']}</div>
          </div>
        </div>
        """

    depoimentos_html = ""
    for d in prod["depoimentos"]:
        estrelas = "★" * d["estrelas"]
        depoimentos_html += f"""
        <div class="review-card">
          <div class="review-stars">{estrelas}</div>
          <p class="review-text">"{d['texto']}"</p>
          <div class="review-author">
            <div class="avatar">{d['nome'][0]}</div>
            <div>
              <div class="author-name">{d['nome']} <span class="badge-verified">✓ Compra Verificada</span></div>
              <div class="author-city">{d['cidade']} • Há 2 dias</div>
            </div>
          </div>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>{prod['nome']} — Oferta Oficial com Frete Grátis</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {{
      --primary: {prod['cor_destaque']};
      --bg: #0b0f19;
      --card-bg: #111827;
      --border: #1f2937;
      --text: #f9fafb;
      --muted: #9ca3af;
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
      -webkit-font-smoothing: antialiased;
    }}
    .container {{
      max-width: 600px;
      margin: 0 auto;
      background: #0d1322;
      min-height: 100vh;
      box-shadow: 0 0 50px rgba(0,0,0,0.8);
      position: relative;
    }}

    /* Top Scarcity Bar */
    .top-bar {{
      background: linear-gradient(90deg, #dc2626, #b91c1c);
      color: #fff;
      text-align: center;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.3px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }}
    .pulse-dot {{
      width: 8px;
      height: 8px;
      background: #fff;
      border-radius: 50%;
      animation: pulse 1s infinite;
    }}
    @keyframes pulse {{
      0%, 100% {{ transform: scale(1); opacity: 1; }}
      50% {{ transform: scale(1.4); opacity: 0.5; }}
    }}

    /* Header Nav */
    .header-nav {{
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
    }}
    .nav-brand {{
      font-size: 16px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 6px;
    }}
    .nav-trust {{
      font-size: 12px;
      color: var(--success);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }}

    /* Product Gallery */
    .product-hero-wrap {{
      position: relative;
      background: #000;
      text-align: center;
    }}
    .product-img {{
      width: 100%;
      height: 380px;
      object-fit: cover;
      display: block;
    }}
    .badge-category {{
      position: absolute;
      top: 14px;
      left: 14px;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 20px;
    }}
    .badge-offer {{
      position: absolute;
      bottom: 14px;
      right: 14px;
      background: var(--primary);
      color: #000;
      font-size: 12px;
      font-weight: 900;
      padding: 6px 14px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }}

    /* Main Info */
    .product-info {{
      padding: 24px 20px;
    }}
    .rating-row {{
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }}
    .stars {{
      color: var(--gold);
      font-size: 15px;
      letter-spacing: 1px;
    }}
    .rating-text {{
      font-size: 13px;
      color: var(--muted);
      font-weight: 600;
    }}
    h1 {{
      font-size: 22px;
      font-weight: 800;
      line-height: 1.3;
      margin-bottom: 8px;
      color: #fff;
    }}
    .product-subtitle {{
      font-size: 14px;
      color: var(--muted);
      margin-bottom: 18px;
      line-height: 1.4;
    }}

    /* Price Box */
    .price-box {{
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 18px 20px;
      margin-bottom: 24px;
    }}
    .price-de {{
      font-size: 13px;
      color: #94a3b8;
      text-decoration: line-through;
    }}
    .price-por-wrap {{
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin: 4px 0;
    }}
    .price-currency {{
      font-size: 18px;
      font-weight: 700;
      color: var(--primary);
    }}
    .price-main {{
      font-size: 38px;
      font-weight: 900;
      color: #fff;
      letter-spacing: -1px;
    }}
    .price-parcelas {{
      font-size: 13px;
      color: #34d399;
      font-weight: 700;
    }}
    .scarcity-line {{
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px dashed var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #fca5a5;
      font-weight: 600;
    }}

    /* Benefits Section */
    .section-title {{
      font-size: 16px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .benefits-list {{
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 30px;
    }}
    .benefit-card {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }}
    .benefit-icon {{
      font-size: 24px;
      line-height: 1;
      padding-top: 2px;
    }}
    .benefit-title {{
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 2px;
    }}
    .benefit-desc {{
      font-size: 12px;
      color: var(--muted);
      line-height: 1.4;
    }}

    /* Reviews Section */
    .reviews-wrap {{
      margin-bottom: 30px;
    }}
    .review-card {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 12px;
    }}
    .review-stars {{
      color: var(--gold);
      font-size: 13px;
      margin-bottom: 6px;
    }}
    .review-text {{
      font-size: 13px;
      color: #e2e8f0;
      font-style: italic;
      margin-bottom: 12px;
      line-height: 1.4;
    }}
    .review-author {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .avatar {{
      width: 32px;
      height: 32px;
      background: #1e293b;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
    }}
    .author-name {{
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 6px;
    }}
    .author-city {{
      font-size: 11px;
      color: var(--muted);
    }}
    .badge-verified {{
      color: #34d399;
      font-size: 10px;
      font-weight: 600;
    }}

    /* Guarantee Box */
    .guarantee-box {{
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 14px;
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 30px;
    }}
    .guarantee-icon {{
      font-size: 34px;
    }}
    .guarantee-title {{
      font-size: 14px;
      font-weight: 800;
      color: #34d399;
      margin-bottom: 2px;
    }}
    .guarantee-desc {{
      font-size: 12px;
      color: var(--muted);
    }}

    /* Floating Bottom Action */
    .bottom-bar {{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(11, 15, 25, 0.95);
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
      background: linear-gradient(135deg, #10b981, #059669);
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
      box-shadow: 0 4px 25px rgba(16, 185, 129, 0.45);
      animation: pulseBtn 2s infinite;
      cursor: pointer;
    }}
    @keyframes pulseBtn {{
      0%, 100% {{ transform: scale(1); }}
      50% {{ transform: scale(1.02); }}
    }}

    /* Footer */
    footer {{
      text-align: center;
      font-size: 11px;
      color: var(--muted);
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }}
  </style>
</head>
<body>

  <div class="container">
    
    <!-- Top Bar -->
    <div class="top-bar">
      <span class="pulse-dot"></span>
      <span>⚡ ÚLTIMO DIA: FRETE GRÁTIS PARA TODO O BRASIL HOJE!</span>
    </div>

    <!-- Header -->
    <div class="header-nav">
      <div class="nav-brand">
        <span>📦</span> Moura.AI Store
      </div>
      <div class="nav-trust">
        <span>🔒</span> Compra 100% Segura
      </div>
    </div>

    <!-- Hero Image & Badges -->
    <div class="product-hero-wrap">
      <span class="badge-category">{prod['categoria']}</span>
      <img src="{prod['imagem_hero']}" alt="{prod['nome']}" class="product-img">
      <span class="badge-offer">{prod['badge_status']}</span>
    </div>

    <!-- Product Info -->
    <div class="product-info">
      
      <div class="rating-row">
        <span class="stars">★★★★★</span>
        <span class="rating-text">4.9/5.0 (Mais de 1.840 clientes satisfeitos)</span>
      </div>

      <h1>{prod['nome']}</h1>
      <p class="product-subtitle">{prod['subtitulo']}</p>

      <!-- Preço -->
      <div class="price-box">
        <div class="price-de">De: R$ {prod['preco_de']}</div>
        <div class="price-por-wrap">
          <span class="price-currency">R$</span>
          <span class="price-main">{prod['preco_por']}</span>
        </div>
        <div class="price-parcelas">ou em {prod['parcelas']} no cartão</div>
        <div class="scarcity-line">
          <span>⚠️ Atenção: Apenas 7 unidades restantes neste valor promocional.</span>
        </div>
      </div>

      <!-- Benefícios -->
      <div class="section-title">
        <span>💎</span> Por Que Escolher o Nosso Produto?
      </div>
      <div class="benefits-list">
        {beneficios_html}
      </div>

      <!-- Garantia -->
      <div class="guarantee-box">
        <div class="guarantee-icon">🛡️</div>
        <div>
          <div class="guarantee-title">Garantia Incondicional de {prod['garantia_dias']} Dias</div>
          <div class="guarantee-desc">Se você não sentir os resultados ou não amar o produto, devolvemos 100% do seu dinheiro sem perguntas.</div>
        </div>
      </div>

      <!-- Depoimentos -->
      <div class="section-title">
        <span>💬</span> Quem Comprou, Recomenda:
      </div>
      <div class="reviews-wrap">
        {depoimentos_html}
      </div>

      <!-- Footer Info -->
      <footer>
        <p>Moura.AI Soluções & E-commerce • Atendimento: (11) 93931-8424</p>
        <p>Envio rastreado via Correios para todo o Brasil • CNPJ e Dados Verificados</p>
      </footer>

    </div>

    <!-- Floating Action Button -->
    <div class="bottom-bar">
      <a href="{link_whats}" target="_blank" class="btn-buy">
        <span>🛒</span>
        <span>COMPRAR COM FRETE GRÁTIS (R$ {prod['preco_por']})</span>
      </a>
    </div>

  </div>

</body>
</html>
"""

def gerar_todos_produtos():
    output_dir = os.path.join(os.path.dirname(__file__), "produtos")
    os.makedirs(output_dir, exist_ok=True)
    
    arquivos_gerados = []
    for prod in PRODUTOS_CATALOGO:
        nome_arquivo = f"{prod['id']}.html"
        caminho_completo = os.path.join(output_dir, nome_arquivo)
        html = gerar_html_produto(prod)
        with open(caminho_completo, "w", encoding="utf-8") as f:
            f.write(html)
        arquivos_gerados.append({
            "id": prod["id"],
            "nome": prod["nome"],
            "preco": prod["preco_por"],
            "lucro": prod["lucro_liquido"],
            "margem": prod["margem_percentual"],
            "categoria": prod["categoria"],
            "arquivo": caminho_completo,
            "url_relativa": f"produtos/{nome_arquivo}"
        })
        print(f"✅ Gerada página para: {prod['nome']} -> {nome_arquivo}")

    # Salva manifesto JSON
    manifesto_path = os.path.join(output_dir, "produtos_manifest.json")
    with open(manifesto_path, "w", encoding="utf-8") as f:
        json.dump(arquivos_gerados, f, ensure_ascii=False, indent=2)
    print(f"📦 Manifesto de produtos salvo em: {manifesto_path}")
    return arquivos_gerados

if __name__ == "__main__":
    gerar_todos_produtos()

