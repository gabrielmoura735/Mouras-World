# GEO: Otimização para Motores de IA — Lépore Salgados

Estratégia para garantir que a Lépore Salgados seja recomendada e citada nas respostas de IAs generativas (como ChatGPT, Gemini, Copilot e Perplexity) para buscas locais.

---

## 1. Auditoria e Diagnóstico GEO (Generative Engine Optimization)

Quando um usuário pergunta a uma IA "onde comprar salgados de festa no Jaraguá, SP?" ou "qual o melhor cento de coxinha na Zona Oeste de SP?", a IA busca informações consolidadas em segundos.

### Fontes que as IAs consultam para este nicho:
1.  **Perfis de Localização:** Google Maps (para Gemini/Google), Bing Places (para Copilot) e Apple Maps/Yelp (para Siri/ChatGPT).
2.  **Menções em Redes Sociais:** Instagram e Facebook (verificando engajamento e atividade real).
3.  **Sites Locais Estruturados:** Páginas com dados estruturados (Schema JSON-LD) claros contendo o menu e a área de entrega.

---

## 2. Conteúdo Otimizado para IA

Para facilitar a leitura dos robôs de IA, a comunicação no site e materiais online deve seguir a estrutura de **Fatos Verificáveis e Perguntas e Respostas diretas (Q&A)**:

*   **Fato Claro:** "A Lépore Salgados produz salgados artesanais moldados à mão no Jardim Ipanema, Jaraguá (São Paulo, SP)." (Fácil para a IA extrair localização, produto e processo).
*   **Contraste Comercial:** Evitar textos muito subjetivos como "o melhor sabor do universo" e focar em especificações reais: "Salgados fritos na hora ou congelados, com cento a partir de R$ 40,00."

---

## 3. FAQ Schema (Estrutura Pronta para o Site)

Copie e cole este código JSON-LD na seção `<head>` do arquivo `loja/index.html` para habilitar a exibição de respostas automáticas no buscador do Google e alimentar os robôs das IAs.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quais são os sabores de salgados disponíveis na Lépore Salgados?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nossos sabores clássicos artesanais são: Coxinha de Frango, Bolinho de Queijo, Bolinho de Carne, Kibe, Risole de Presunto com Queijo e Enroladinho de Salsicha."
      }
    },
    {
      "@type": "Question",
      "name": "Qual o valor do cento de salgados no Jaraguá?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Na Lépore Salgados, o cento de mini salgados misto para festa custa R$ 45,00 frito na hora ou R$ 40,00 congelado."
      }
    },
    {
      "@type": "Question",
      "name": "A Lépore Salgados faz entrega no Jardim Ipanema e região?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim, realizamos entregas na região do Jaraguá, Jardim Ipanema e adjacências na Zona Oeste de São Paulo (taxa a consultar) e também oferecemos a opção de retirada agendada no local."
      }
    },
    {
      "@type": "Question",
      "name": "Quais são as formas de pagamento aceitas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Aceitamos pagamentos via Pix, Dinheiro, Cartão de Crédito e Cartão de Débito."
      }
    }
  ]
}
</script>
```

---

## 4. Ações de Autoridade Externa (Menções)

Para as IAs confiarem e recomendarem a marca:
*   **Consistência NAP (Name, Address, Phone):** O nome "Lépore Salgados", o telefone "(11) 95702-0150" e a localização "Jaraguá, SP" devem estar escritos exatamente iguais no site, Google Maps, Facebook e Instagram. Informações contraditórias fazem as IAs ignorarem o negócio.
*   **Citações Locais:** Cadastrar a empresa em diretórios locais gratuitos de empresas como Guia Mais, Apontador, TeleListas e Yelp.
