# Otimização On-Page — Lépore Salgados

Este documento reúne a estrutura de SEO técnico, cabeçalhos, metadados e os dados estruturados (Schema Markup JSON-LD) criados para a loja oficial da Lépore Salgados.

---

## 1. Mapeamento de Metadados e Headings

Como a loja é estruturada em uma única página responsiva (Single Page Application), concentramos a otimização de forma estratégica em uma única URL principal:

| Elemento | Configuração Recomendada | Objetivo de SEO |
| :--- | :--- | :--- |
| **URL Amigável** | `/index.html` (ou domínio raiz `/`) | URL limpa, direta e indexável. |
| **Meta Title** | `Lépore Salgados - Cento de Salgados & Congelados no Jaraguá` | Indexar a marca com a palavra-chave mais forte da região. |
| **Meta Description**| `Encomende o melhor cento de salgados artesanais (fritos na hora ou congelados) no Jaraguá, SP. Coxinha, queijo, kibe e mais. Peça já via WhatsApp!` | Atrair cliques com copy persuasiva focando em WhatsApp e locais. |
| **Heading H1** | `Sabor que reúne, qualidade que encanta!` | Título de impacto com a essência artesanal da marca. |
| **Headings H2** | `Nosso Cardápio`, `Nossa Produção`, `Como Funciona`, `Formas de Pagamento` | Organização clara do fluxo de leitura das seções. |

---

## 2. Schema Markup (Dados Estruturados JSON-LD)

Insira este script na seção `<head>` do arquivo `loja/index.html` para que as IAs e o robô de busca do Google entendam perfeitamente o tipo de negócio e sua localização.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "Lépore Salgados",
  "image": "assets/logo.png",
  "@id": "",
  "url": "https://lepore-salgados.netlify.app",
  "telephone": "+5511957020150",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "addressCountry": "BR",
    "streetAddress": "Jardim Ipanema, Jaraguá"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -23.4542,
    "longitude": -46.7431
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "09:00",
    "closes": "21:00"
  },
  "menu": "https://lepore-salgados.netlify.app#menu",
  "servesCuisine": "Salgados Brasileiros, Coxinhas, Salgadinhos de Festa",
  "acceptsReservations": "false"
}
</script>
```

---

## 3. Checklist Técnico de SEO

*   [x] **Design Responsivo (Mobile-First):** Estrutura da loja testada e otimizada para smartphones (onde ocorrem mais de 90% das buscas locais por delivery).
*   [x] **Meta Tags Configuradas:** Meta Title, Meta Description e Meta Viewport declaradas no `<head>`.
*   [x] **Google Fonts Otimizadas:** Carregamento assíncrono das fontes `Playfair Display` e `Outfit`.
*   [x] **Alt Text das Imagens:** Atributo `alt` preenchido em todas as imagens (ex: `alt="Coxinha de Frango Lépore Salgados"`).
*   [ ] **Google Search Console cadastrado:** Cadastrar o domínio no painel do Google para acompanhar impressões e cliques (Pendente após hospedagem).
*   [ ] **Sitemap.xml e Robots.txt:** Criar na pasta `/loja` após definição do domínio oficial da loja.
