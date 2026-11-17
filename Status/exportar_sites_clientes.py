"""
Script: exportar_sites_clientes.py
Gera e exporta as landing pages completas de alta conversão para Vercel e produção:
- Churrascaria & Steakhouse
- Studio de Beleza & Cabeleireiro
- Farmácia & Manipulação
- Barbearia Clássica
- Micro-SaaS Clínico
"""
import os
import json
from gerador_site_express import gerar_html_landing_page, WHATSAPP_MARQUINHOS

PASTA_DESTINO = "Status/sites_vercel"
os.makedirs(PASTA_DESTINO, exist_ok=True)

clientes_exemplo = [
    {
        "id": "fogao-de-ouro-churrascaria",
        "nome": "Churrascaria & Steakhouse Fogo de Ouro",
        "nicho": "Churrascaria & Cortes Nobres",
        "cidade": "São Paulo - SP",
        "telefone": "(11) 93931-8424",
        "reviews_count": 340,
        "socio_decisor": "Sr. Antônio Silveira"
    },
    {
        "id": "studio-glamour-cabeleireiros",
        "nome": "Studio Glamour & Beauty Spa",
        "nicho": "Cabeleireiro & Studio de Beleza",
        "cidade": "São Paulo - SP",
        "telefone": "(11) 93931-8424",
        "reviews_count": 215,
        "socio_decisor": "Dra. Vanessa Vasconcelos"
    },
    {
        "id": "drogaria-vida-manipulacao",
        "nome": "Drogaria & Farmácia de Manipulação Vida",
        "nicho": "Farmácia & Manipulação",
        "cidade": "São Paulo - SP",
        "telefone": "(11) 93931-8424",
        "reviews_count": 180,
        "socio_decisor": "Dr. Marcelo Farma"
    },
    {
        "id": "dom-rafael-barbearia-vip",
        "nome": "Barbearia Dom Rafael VIP",
        "nicho": "Barbearia Clássica & Estética",
        "cidade": "São Paulo - SP",
        "telefone": "(11) 93931-8424",
        "reviews_count": 195,
        "socio_decisor": "Rafael Santos"
    },
    {
        "id": "pizzaria-bella-napoli",
        "nome": "Pizzaria Artesanal Bella Napoli",
        "nicho": "Restaurante & Pizzaria",
        "cidade": "São Paulo - SP",
        "telefone": "(11) 93931-8424",
        "reviews_count": 280,
        "socio_decisor": "Luigi Mantovani"
    }
]

print("🚀 Gerando sites de alta conversão para Vercel...")

manifesto = []

for c in clientes_exemplo:
    html = gerar_html_landing_page(c, WHATSAPP_MARQUINHOS)
    arquivo = f"{c['id']}.html"
    caminho = os.path.join(PASTA_DESTINO, arquivo)
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(html)
    
    # Também salvar na pasta pública de prévias
    caminho_previa = os.path.join("Status/previas", arquivo)
    with open(caminho_previa, "w", encoding="utf-8") as f:
        f.write(html)
        
    print(f"  ✅ Site gerado: {arquivo} ({len(html):,} bytes)")
    manifesto.append({
        "id": c["id"],
        "nome": c["nome"],
        "nicho": c["nicho"],
        "arquivo": arquivo,
        "url_local": f"previas/{arquivo}"
    })

# Salvar manifesto de sites
with open(os.path.join(PASTA_DESTINO, "manifesto_sites.json"), "w", encoding="utf-8") as f:
    json.dump(manifesto, f, ensure_ascii=False, indent=2)

print(f"\n🎉 Total de {len(clientes_exemplo)} sites gerados e salvos em {PASTA_DESTINO}/ e Status/previas/")

