# Diagnóstico digital — Churrascaria Bela Rio

Levantado em 2026-11-16 a partir de fontes públicas. Cada item diz de onde veio.

## Resumo em 5 linhas

1. É uma casa forte: 4,4 estrelas com 10.744 avaliações no Google, 13,2 mil seguidores no Instagram, aberta desde 1972.
2. O site é um Wix gratuito de 2018, com propaganda do Wix, sem cardápio, sem horário, sem preço e sem WhatsApp.
3. Não existe nenhum rastreamento: sem pixel do Facebook, sem Google Analytics, sem Tag Manager. Qualquer anúncio que eles façam hoje roda no escuro.
4. Os dados de contato se contradizem: o Google mostra um telefone e um bairro, o site mostra outro telefone e outro bairro.
5. A ficha do Google manda o cliente pro Instagram em vez de um site. Reserva é feita por mensagem no direct.

## Google Meu Negócio

Fonte: ficha pública do Google Maps, coletada pelo MazyOS Scraper em 2026-11-15.

| Item | Situação |
|---|---|
| Ficha | Reivindicada pelo dono ("Churrascaria Bela Rio (proprietário)") |
| Nota | 4,4 em 10.744 avaliações (6.610 de 5★, 2.442 de 4★, 1.019 de 3★, 288 de 2★, 385 de 1★) |
| Horário | Seg a sáb 11h às 23h, dom 11h às 22h |
| Telefone | (11) 3611-0180, fixo |
| Site cadastrado | Instagram (não tem site próprio na ficha) |
| Cardápio, reserva, pedido online | Nenhum link |
| Faixa de preço | Não informada |
| Descrição | "Churrascaria espaçosa com rodízio variado e buffet de saladas, além de várias TVs." |
| Acessibilidade | Marcada (entrada, assento, banheiro e estacionamento) |
| Endereço | Av. Pres. Castelo Branco, 6100, Parque Residencial da Lapa, São Paulo, 05034-000 |

O que as avaliações recentes repetem: picanha, queijo coalho, buffet farto, garçons atenciosos, manobrista grátis, custo-benefício. Reclamação que aparece: preço e atendimento da marmita pra viagem.

## Site atual

Fonte: https://tucdesign.wixsite.com/churrascariabelario (HTML baixado em 2026-11-16).

- Wix no plano gratuito: endereço `tucdesign.wixsite.com`, sem domínio próprio, com banner "Criado com Wix" na página.
- Feito em 2018 por uma agência (tucdesign), sem atualização visível desde então.
- Conteúdo: história (fundada em 1972, pioneira do rodízio em SP), 23 tipos de carne, buffet com 30 saladas, 15 molhos e 6 pratos quentes, mesa de massas, carnes pra viagem, self-service, sala de espera com bar. Galeria de fotos. Página de contato.
- Falta: cardápio, preço, horário de funcionamento, WhatsApp, mapa, botão de reserva, avaliações.
- Telefone no site: (11) 3611-1977. Endereço no site: "Barra Funda". Os dois diferem do Google.
- Texto com erro interno: diz "40 anos" num lugar e "46 anos" em outro (a casa tem 54).

## Instagram e Facebook

Fonte: perfil público https://www.instagram.com/churrascariabelario/, página https://www.facebook.com/ChurrascariaBelaRiooficial/ (achada por busca; resumo indexado pelo Google) e a página "Redes sociais" do site Wix.

- Instagram: 13,2 mil seguidores. Bio fala em rodízio em todas as refeições e self-service por quilo. Slogan usado nas legendas: "Sabor que reúne gerações".
- Preços aparecem só em datas especiais (Dia dos Pais: R$ 104,90 almoço e R$ 84,90 jantar por pessoa, bebidas e sobremesa à parte). O preço do dia a dia não está em lugar nenhum público.
- Reservas são pedidas por mensagem. Em datas como Dia das Mães não aceitam reserva (ordem de chegada).
- Facebook: a página real é facebook.com/ChurrascariaBelaRiooficial, com 162 seguidores e 113 check-ins (resumo indexado pelo Google). O link de Facebook que está no site Wix (facebook.com/churrascariabelario) **não existe mais**: quem clica cai em erro.
- O resumo indexado da página do Facebook mostra rodízio de almoço por R$ 74,90 em dia de semana e R$ 79,90 em fim de semana e feriado. Não está no site: pode estar desatualizado, confirmar com eles antes de publicar.
- O Wix lista um segundo Instagram, @churrascariabela, que ainda existe. Dois perfis dividem o público; vale unificar ou redirecionar.
- O link do site na bio vem com parâmetros de rastreio do Instagram, o que mostra que eles mandam gente pro Wix, mas o Wix não mede nada.

## Rastreamento e anúncios

Fonte: código-fonte do site atual.

- Pixel do Facebook/Meta: **não tem**.
- Google Analytics ou Tag Manager: **não tem**.
- Consequência: se eles anunciam no Instagram ou no Google, não conseguem saber quem clicou, quem ligou ou quem foi até lá. Também não dá pra criar público de remarketing.

## Contato

| Canal | Google | Site | Instagram |
|---|---|---|---|
| Telefone | (11) 3611-0180 | (11) 3611-1977 | não aparece |
| WhatsApp | não | não | não (só direct) |
| Bairro | Parque Res. da Lapa | Barra Funda | não aparece |

Cliente que procura no Google e depois abre o site encontra dois telefones e dois bairros. Isso derruba confiança e reserva.

## O que o site novo resolve

Site em `site/index.html`, feito com os dados públicos deles (o que faltar, o cliente completa):

- Horário, endereço e mapa na primeira tela, iguais ao Google.
- Um telefone só, o da ficha do Google, com botão de ligar no celular.
- A prova social que eles já têm (4,4 com mais de 10 mil avaliações) aparece no topo e com trechos reais de avaliações.
- Rodízio, buffet, massas, self-service por quilo e sala de espera com bar organizados em seções, sem texto corrido.
- Visual de brasa e tradição, com animações leves, abre rápido no celular.
- Pronto pra receber pixel do Meta e Google Analytics no dia em que eles tiverem as contas.

O que ainda falta o cliente passar: preço do rodízio, WhatsApp, fotos originais em alta resolução, qual telefone é o certo.

## Próximos passos sugeridos pra proposta

1. Domínio próprio (ex: churrascariabelario.com.br) e hospedagem rápida, aposentando o Wix gratuito.
2. WhatsApp Business com link direto no site, na ficha do Google e na bio do Instagram.
3. Corrigir a ficha do Google: colocar o site novo no campo "site", unificar telefone e bairro, adicionar cardápio e faixa de preço.
4. Instalar pixel do Meta e Google Analytics 4 pra medir cliques em "ligar", "como chegar" e reservas.
5. Página de reserva (formulário simples ou link do WhatsApp) e aviso de datas especiais.
6. Responder avaliações do Google, principalmente as de 1 e 2 estrelas sobre marmita e atendimento.
