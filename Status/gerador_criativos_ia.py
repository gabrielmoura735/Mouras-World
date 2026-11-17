"""
Moura.AI — Gerador de Roteiros de Anúncios e Criativos com IA (TikTok, Reels e Meta Ads)
Metodologia Hook-Story-Offer (Gancho 3s + Dor/História 10s + Demonstração 10s + Oferta 7s)
Desenvolvido para Marquinhos (Moura.AI) — WhatsApp Oficial: (11) 93931-8424
"""

import os
import json

ROTEIROS = [
    {
        "produto_id": "joelheira-ortopedica",
        "nome": "Joelheira Ortopédica Alívio 3D Pro (Par)",
        "plataformas": ["TikTok", "Instagram Reels", "Facebook Ads"],
        "duracao": "30 segundos",
        "sem_aparecer": True,
        "cenas": [
            {
                "tempo": "00:00 - 00:03 (Gancho)",
                "visual": "Vídeo aproximado de alguém descendo escada com a mão no joelho expressando dor. Efeito sonoro de estalo / alerta vermelho na tela.",
                "voz_ia": "Se o seu joelho dói ou estala quando você desce a escada ou levanta do sofá, pare tudo e veja isso agora!",
                "legenda_tela": "JOELHO ESTALANDO OU DOENDO?"
            },
            {
                "tempo": "00:03 - 00:12 (Dor & Identificação)",
                "visual": "Gráfico anatômico simples em 3D mostrando a cartilagem desgastada e a pressão exagerada no menisco.",
                "voz_ia": "O problema não é a sua idade, é o impacto direto na cartilagem que não tem sustentação correta nos ligamentos.",
                "legenda_tela": "O desgaste do menisco sem amortecimento"
            },
            {
                "tempo": "00:12 - 00:22 (Demonstração da Solução)",
                "visual": "Pessoa calçando a Joelheira Alívio 3D. Animação destacando o anel de silicone patelar e os estabilizadores laterais de mola.",
                "voz_ia": "Essa joelheira ortopédica com tecnologia de compressão 3D e anel de silicone anatômico redistribui o peso do seu corpo e absorve 80% do impacto na hora.",
                "legenda_tela": "Alívio imediato da pressão + Estabilização 3D"
            },
            {
                "tempo": "00:22 - 00:30 (Oferta & CTA)",
                "visual": "A pessoa caminhando com passos firmes e sorrindo. Caixa do produto com selo 'Frete Grátis Brasil' e botão de WhatsApp/Site.",
                "voz_ia": "Garanta hoje o seu par com 50% de desconto e frete grátis para todo o Brasil. Clique no botão aqui embaixo antes que o estoque acabe!",
                "legenda_tela": "ÚLTIMAS UNIDADES COM FRETE GRÁTIS! CLIQUE ABAIXO"
            }
        ]
    },
    {
        "produto_id": "caneta-depiladora",
        "nome": "Caneta Depiladora Facial & Sobrancelhas Precision Gold",
        "plataformas": ["TikTok", "Instagram Reels", "YouTube Shorts"],
        "duracao": "25 segundos",
        "sem_aparecer": True,
        "cenas": [
            {
                "tempo": "00:00 - 00:03 (Gancho)",
                "visual": "Mulher com cara de dor puxando pelo com pinça ou cera. Texto em vermelho piscando: 'Chega de sofrer com pinça!'",
                "voz_ia": "Aposto que você ainda perde meia hora chorando de dor com cera ou pinça para limpar a sobrancelha!",
                "legenda_tela": "CHEGA DE SOFRER COM PINÇA!"
            },
            {
                "tempo": "00:03 - 00:12 (Demonstração)",
                "visual": "A Caneta Depiladora sendo ligada, acendendo o LED suave e passando rente à sobrancelha, cortando os pelinhos instantaneamente.",
                "voz_ia": "Conheça a caneta depiladora que remove até os pelinhos mais finos em segundos, sem dor, sem cortes e sem deixar a pele vermelha.",
                "legenda_tela": "Zero dor • Ponta hipoalergênica ouro 18K"
            },
            {
                "tempo": "00:12 - 00:20 (Praticidade)",
                "visual": "Mulher guardando a caneta dentro de uma bolsinha pequena e retocando no espelho do carro em 10 segundos.",
                "voz_ia": "Tem o tamanho de um batom, cabe em qualquer bolsa e é recarregável via USB. Praticidade pura para o seu dia a dia.",
                "legenda_tela": "Tamanho de um batom • Bateria USB"
            },
            {
                "tempo": "00:20 - 00:25 (Chamada de Ação)",
                "visual": "Tela com oferta promocional de R$ 97 e Frete Grátis. Mão clicando no botão de compra.",
                "voz_ia": "Aproveite a promoção de fim de ano por menos de 100 reais com frete grátis. Toque no link e peça a sua!",
                "legenda_tela": "PROMOÇÃO: R$ 97 + FRETE GRÁTIS HOJE"
            }
        ]
    },
    {
        "produto_id": "game-stick-4k-retro",
        "nome": "Game Stick 4K Retrô Pro — 10.000 Jogos (Oferta de Natal)",
        "plataformas": ["TikTok", "Instagram Reels", "Facebook Ads"],
        "duracao": "35 segundos",
        "sem_aparecer": True,
        "cenas": [
            {
                "tempo": "00:00 - 00:04 (Gancho de Nostalgia & Presente)",
                "visual": "Vídeo gameplay do Super Mario World pulando na bandeira e Mortal Kombat gritando 'Finish Him!'. Música clássica de fundo.",
                "voz_ia": "Você lembra da época que a nossa única preocupação era zerar a fase do videogame na casa dos amigos?",
                "legenda_tela": "O PRESENTE PERFEITO DESTE NATAL!"
            },
            {
                "tempo": "00:04 - 00:15 (Apresentação do Produto)",
                "visual": "Mão plugando o Game Stick direto na entrada HDMI da TV da sala. Menu do videogame carregando em 4K com mais de 10.000 jogos.",
                "voz_ia": "Esse pequeno aparelho transforma qualquer TV moderna em uma máquina do tempo com mais de 10.000 jogos clássicos de Super Nintendo, PlayStation 1 e Fliperama.",
                "legenda_tela": "10.000 Clássicos • PlayStation 1, SNES, Mega Drive"
            },
            {
                "tempo": "00:15 - 00:25 (Benefício para a Família)",
                "visual": "Pai e filho sentados no sofá jogando juntos com os 2 controles sem fio, rindo e comemorando.",
                "voz_ia": "Já vem com 2 controles sem fio inclusos! É o melhor presente de Natal para tirar as crianças do celular e reunir a família inteira na sala.",
                "legenda_tela": "2 Controles Sem Fio • Diversão para toda a família"
            },
            {
                "tempo": "00:25 - 00:35 (Oferta de Natal)",
                "visual": "Banner natalino com preço de R$ 249 e selo 'Entrega Garantida Antes do Natal'.",
                "voz_ia": "Lote promocional de Natal com mais de R$ 150 de desconto e entrega rápida para todo o Brasil. Clique no link e garanta o seu antes que esgote!",
                "legenda_tela": "GARANTA ANTES DO NATAL: R$ 249 COM FRETE GRÁTIS"
            }
        ]
    },
    {
        "produto_id": "guia-renda-ia-sem-estoque",
        "nome": "Guia Prático: Renda com IA & Vendas Sem Estoque (Infoproduto)",
        "plataformas": ["Instagram Stories", "TikTok", "WhatsApp Status"],
        "duracao": "25 segundos",
        "sem_aparecer": True,
        "cenas": [
            {
                "tempo": "00:00 - 00:04 (Gancho)",
                "visual": "Print de notificações de vendas caindo na tela do celular (R$ 97, R$ 129, R$ 249) com áudio de moeda caindo.",
                "voz_ia": "Enquanto a maioria fica rolando o feed à toa, tem gente faturando de R$ 3.000 a R$ 10.000 por mês usando IA gratuita e vendas sem estoque.",
                "legenda_tela": "VENDAS SEM ESTOQUE + IA GRATUITA"
            },
            {
                "tempo": "00:04 - 00:14 (O Método)",
                "visual": "Computador abrindo fornecedores nacionais da Kairós e gerador de páginas em segundos.",
                "voz_ia": "Você não precisa ter estoque em casa, não precisa aparecer e não precisa de computador caro. Você só precisa dominar a tríade Produto, Oferta e Conversão.",
                "legenda_tela": "Sem estoque • Sem aparecer • Pelo celular"
            },
            {
                "tempo": "00:14 - 00:25 (Chamada de Ação)",
                "visual": "Capa 3D do Guia Prático + Planilha de Bônus. Preço R$ 47 em destaque.",
                "voz_ia": "Liberei o guia passo a passo completo por apenas R$ 47 no Pix com acesso imediato e 3 bônus exclusivos. Clique no link para baixar agora!",
                "legenda_tela": "APENAS R$ 47 NO PIX • ACESSO IMEDIATO"
            }
        ]
    }
]

def gerar_arquivos_criativos():
    output_dir = os.path.join(os.path.dirname(__file__), "criativos")
    os.makedirs(output_dir, exist_ok=True)
    
    json_path = os.path.join(output_dir, "roteiros_anuncios.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(ROTEIROS, f, ensure_ascii=False, indent=2)

    md_path = os.path.join(output_dir, "ROTEIROS_ANUNCIOS.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# 🎬 Roteiros de Anúncios e Criativos com IA (TikTok, Reels e Meta Ads)\n\n")
        f.write("> **Metodologia Thiago Hora:** Gancho forte (3s) + Identificação da Dor (10s) + Demonstração da Solução (10s) + Oferta Irresistível (7s).\n")
        f.write("> Não precisa aparecer! Use vídeos demonstrativos dos fornecedores ou avatares de IA com voz sintetizada.\n\n---\n\n")

        for r in ROTEIROS:
            f.write(f"## 📱 {r['nome']}\n")
            f.write(f"- **Plataformas:** {', '.join(r['plataformas'])}\n")
            f.write(f"- **Duração:** {r['duracao']}\n")
            f.write(f"- **Gravação:** {'100% Sem Precisar Aparecer' if r['sem_aparecer'] else 'Com apresentador'}\n\n")
            f.write("| Tempo | O Que Mostrar no Vídeo (Cena) | O Que a Voz da IA Fala | Texto / Legenda na Tela |\n")
            f.write("|---|---|---|---|\n")
            for c in r["cenas"]:
                f.write(f"| **{c['tempo']}** | {c['visual']} | \"{c['voz_ia']}\" | `{c['legenda_tela']}` |\n")
            f.write("\n---\n\n")

    print(f"✅ Roteiros salvos em JSON: {json_path}")
    print(f"✅ Documento formatado em: {md_path}")
    return ROTEIROS

if __name__ == "__main__":
    gerar_arquivos_criativos()

