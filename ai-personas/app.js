// =========================================================================
// MOURA.AI - A SUPER INTELIGÊNCIA ARTIFICIAL MULTIFUNCIONAL 3.5
// =========================================================================

// --- STORAGE KEYS ---
const STORAGE_THREADS = '@MouraAI:threads';
const STORAGE_TIER = '@MouraAI:tier';
const STORAGE_CLOUD = '@MouraAI:cloud';
const STORAGE_THEME_STYLE = '@MouraAI:themeStyle';
const STORAGE_NSFW = '@MouraAI:nsfw';
const STORAGE_USER_NAME = '@MouraAI:userName';
const STORAGE_USER_EMAIL = '@MouraAI:userEmail';

// --- CONFIGURAÇÃO DO BOT CENTRAL ---
const mouraBot = {
    id: 'bot_moura_ai',
    name: 'Moura.ai Core',
    avatar: 'ph-fill ph-planet',
    tagline: 'Superinteligência Multifuncional'
};

// --- ESTADO GLOBAL ---
let chatThreads = JSON.parse(localStorage.getItem(STORAGE_THREADS)) || [];
let activeThreadId = null;
let currentTier = localStorage.getItem(STORAGE_TIER) || 'free'; // 'free' | 'pro' | 'ultra'
let currentChatMode = 'all';
let cloudItems = JSON.parse(localStorage.getItem(STORAGE_CLOUD)) || [];
let currentCreativeStyle = 'Ficção Cyberpunk Intensa';
let currentSiteHtml = '';
let isNsfwActive = localStorage.getItem(STORAGE_NSFW) === 'true';
let currentThemeStyle = localStorage.getItem(STORAGE_THEME_STYLE) || 'theme-cyberpunk';
let currentStorageFilter = 'all';

// --- MEGA BASE DE DADOS: +30.000 PROMPTS & COMBINAÇÕES CATEGORIZADAS ---
const BASE_PROMPT_DATABASE = [
    // 1. MULHER DO JOB / MODELOS VIRTUAIS 3D (SEM PESSOAS REAIS)
    {
        id: 'p_vm_1',
        category: 'virtual-model',
        categoryLabel: '👗 Mulher do Job / Modelos 3D',
        priceTag: 'Comercial & Moda',
        title: 'Modelo Virtual 3D Hiper-Realista para E-commerce de Moda',
        desc: 'Prompt para renderizar modelos virtuais sem uso de fotos de pessoas reais, vestindo roupas de grife.',
        code: `3D digital virtual model standing in modern minimalist fashion boutique, wearing luxury oversized beige blazer and golden jewelry, elegant studio lighting, soft shadows, 85mm portrait lens, photorealistic 8k, Octane Render, unreal engine 5 --ar 9:16 --v 6.0`
    },
    {
        id: 'p_vm_2',
        category: 'virtual-model',
        categoryLabel: '👗 Mulher do Job / Modelos 3D',
        priceTag: 'Redes Sociais & Lifestyle',
        title: 'Avatar Virtual Estilo Lifestyle Urbano & Café',
        desc: 'Modelo gerada por IA com iluminação natural em ambiente urbano para campanhas digitais.',
        code: `CGI virtual influencer girl sipping iced coffee at a trendy modern rooftop cafe in Sao Paulo, sunny golden hour light, wearing sunglasses and streetwear jacket, candid shot, hyper-detailed, 8k resolution, cinematic color grading --ar 9:16`
    },
    {
        id: 'p_vm_3',
        category: 'virtual-model',
        categoryLabel: '👗 Mulher do Job / Modelos 3D',
        priceTag: 'Cosméticos & Beleza',
        title: 'Close-up de Beleza 3D com Textura de Pele Perfeita',
        desc: 'Close facial focado em maquiagem e brilho para anúncios de cosméticos.',
        code: `Close-up beauty shot of a 3D rendered female virtual avatar showcasing glowing radiant skin, holographic eyeshadow, natural lips, soft studio ring light, water dew drops, ultra macro details, 8k render, commercial cosmetics advertisement --ar 1:1`
    },

    // 2. PROPORÇÕES & CÂMERAS
    {
        id: 'p_rc_1',
        category: 'ratio-camera',
        categoryLabel: '📐 Proporções & Câmeras',
        priceTag: 'Proporção 16:9 Cinemática',
        title: 'Tomada Grande Angular 16:9 com Iluminação Volumétrica',
        desc: 'Fórmula de câmera para criar imagens widescreen de alta profundidade de campo.',
        code: `Cinematic wide angle shot with 24mm anamorphic lens, 16:9 aspect ratio, volumetric sun rays breaking through cyberpunk glass dome, shallow depth of field, natural film grain, 8k UHD`
    },
    {
        id: 'p_rc_2',
        category: 'ratio-camera',
        categoryLabel: '📐 Proporções & Câmeras',
        priceTag: 'Proporção 9:16 Vertical',
        title: 'Enquadramento Vertical 9:16 para Reels e TikTok',
        desc: 'Estrutura visual vertical ideal para reter atenção em telas mobile.',
        code: `Vertical format 9:16 composition, central subject framing, dynamic high-angle perspective, neon ambient glow, optimized for smartphone screen, high dynamic range HDR, 60fps render style`
    },
    {
        id: 'p_rc_3',
        category: 'ratio-camera',
        categoryLabel: '📐 Proporções & Câmeras',
        priceTag: 'Lente Macro 100mm',
        title: 'Macro Extremo para Detalhes de Produtos e Texturas',
        desc: 'Captura de micro-detalhes, gotas de água e circuitos eletrônicos.',
        code: `Extreme macro photography with 100mm f/2.8 lens, sharp focus on water droplets reflecting miniature neon city lights, dark moody background, studio lighting, crisp textures, 8k`
    },

    // 3. SITES & WEB APPS
    {
        id: 'p_site_1',
        category: 'sites',
        categoryLabel: '🌐 Sites & Web Apps',
        priceTag: 'Venda por: R$ 600 - R$ 1.500',
        title: 'Landing Page SaaS Moderna com Dark Theme & Glow',
        desc: 'Código completo em HTML/CSS/JS com Hero section impactante, tabela de preços e botões animados.',
        code: `Crie o código completo de um site moderno em um único arquivo HTML + CSS + JS para um SaaS de Inteligência Artificial. Inclua Menu responsivo, Hero com Headline persuasiva, Seção de Benefícios em 3 cards com bordas brilhantes neon, Tabela de Preços e Formulário de Inscrição. O design deve ser dark theme com tons roxos e ciano.`
    },
    {
        id: 'p_site_2',
        category: 'sites',
        categoryLabel: '🌐 Sites & Web Apps',
        priceTag: 'Venda por: R$ 400 - R$ 900',
        title: 'Página de Vendas de Alta Conversão com Gatilhos AIDA',
        desc: 'Estrutura focada em conversão com gatilhos de urgência, cronômetro regressivo e quebra de objeções.',
        code: `Atue como um Web Designer e Copywriter de elite. Crie o código de uma Landing Page de vendas para [PRODUTO]. O site deve ter: 1. Headline irresistível, 2. Vídeo/Banner central, 3. Seção 'O que você vai receber', 4. Depoimentos em carrossel, 5. Seção de Garantia incondicional de 7 dias e 6. Botão de checkout pulsante.`
    },
    {
        id: 'p_site_3',
        category: 'sites',
        categoryLabel: '🌐 Sites & Web Apps',
        priceTag: 'Venda por: R$ 700 - R$ 1.800',
        title: 'Web App de Gestão Financeira com Gráficos e Transações',
        desc: 'Dashboard interativo com cálculo de saldo e entradas/saídas.',
        code: `Crie um Web App de controle financeiro pessoal em HTML/CSS/JS. O app deve ter formulário para adicionar transações (Descrição, Valor, Categoria, Tipo: Entrada/Saída), lista de transações com botão de excluir, e cards com Saldo Total, Entradas do Mês e Gastos.`
    },

    // 4. SLIDES & PITCH DECKS
    {
        id: 'p_slide_1',
        category: 'slides',
        categoryLabel: '📊 Slides & Pitch Decks',
        priceTag: 'Propostas Comerciais',
        title: 'Pitch Deck Executivo de 4 Slides para Captação de Clientes',
        desc: 'Estrutura: Capa, O Problema, A Solução Inovadora e Retorno sobre Investimento.',
        code: `Gere o conteúdo e layout de uma apresentação de 4 slides para uma proposta comercial de [SERVIÇO/PRODUTO]: Slide 1: Título de alto impacto; Slide 2: Os 3 maiores gargalos do cliente hoje; Slide 3: Nossa metodologia em 3 etapas; Slide 4: Projeção de ROI e chamada para fechar contrato.`
    },
    {
        id: 'p_slide_2',
        category: 'slides',
        categoryLabel: '📊 Slides & Pitch Decks',
        priceTag: 'Aulas & Palestras',
        title: 'Apresentação Educativa Estruturada com Storytelling',
        desc: 'Slides dinâmicos para prender atenção do início ao fim.',
        code: `Crie um roteiro de slides para uma palestra sobre [TEMA]. Inclua gancho inicial instigante, quebra de crenças limitantes, estudo de caso prático e passo a passo aplicável em 24 horas.`
    },

    // 5. VÍDEOS & REELS
    {
        id: 'p_vid_1',
        category: 'video',
        categoryLabel: '🎬 Vídeos & Reels',
        priceTag: 'Roteiros Virais',
        title: 'Roteiro de Reels de 30s com Gancho Hipnótico nos 3 Primeiros Segundos',
        desc: 'Estrutura testada para reter mais de 80% do público no Instagram e TikTok.',
        code: `Crie um roteiro de 30 segundos para Reels sobre [TEMA]: [0-3s] Gancho: 'Pare de fazer isso agora se você quer...'; [3-15s] Revelação do erro comum e demonstração prática da solução; [15-25s] Resultado impressionante na tela; [25-30s] Chamada de ação urgente para comentar e seguir.`
    },
    {
        id: 'p_vid_2',
        category: 'video',
        categoryLabel: '🎬 Vídeos & Reels',
        priceTag: 'Cenas Cinemáticas',
        title: 'Drone FPV em Alta Velocidade sobre Cidade Futurista',
        desc: 'Prompt para sintetizar tomadas de vídeo com câmera ágil.',
        code: `FPV drone racing shot zooming past glowing skyscrapers and neon bridges in a futuristic metropolis at night, rain reflections, lens flares, ultra-smooth 60fps cinematic camera motion, photorealistic 4k`
    },

    // 6. IMAGENS 4K & OCTANE
    {
        id: 'p_img_1',
        category: 'images',
        categoryLabel: '🎨 Imagens 4K & Octane',
        priceTag: 'Render 3D de Luxo',
        title: 'Fotografia de Produto Comercial em Mármore Negro 8K',
        desc: 'Iluminação de estúdio profissional para perfumes, relógios e garrafas.',
        code: `Commercial luxury product photography of a [PRODUTO], placed on a black marble pedestal with soft neon studio lighting, water droplets, photorealistic, 8k resolution, cinematic depth of field, Octane render --ar 16:9`
    },
    {
        id: 'p_img_2',
        category: 'images',
        categoryLabel: '🎨 Imagens 4K & Octane',
        priceTag: 'Arte Conceitual',
        title: 'Carro Esportivo Quântico Holográfico 8K',
        desc: 'Veículo futurista com pintura camaleão e iluminação neon.',
        code: `Futuristic concept hypercar speeding through a glowing neon tunnel, iridescent paint reflections, glowing wheels, motion blur, 8k UHD, Raytracing, Unreal Engine 5 render`
    },

    // 7. JOBS & FREELANCE
    {
        id: 'p_job_1',
        category: 'jobs',
        categoryLabel: '💰 Jobs & Freelance',
        priceTag: 'Venda por: R$ 300 - R$ 800',
        title: 'Automação de WhatsApp e Funil de Vendas Automático',
        desc: 'Scripts para fechar contratos de atendimento automatizado com empresas locais.',
        code: `Crie um fluxo completo de mensagens de WhatsApp para atendimento de uma [TIPO DE EMPRESA]. O fluxo deve conter: 1. Saudação acolhedora, 2. Menu com 3 opções principais, 3. Qualificação rápida de interesse e 4. Encaminhamento para pagamento ou agendamento.`
    },

    // 8. COPYWRITING & VENDAS
    {
        id: 'p_mkt_1',
        category: 'marketing',
        categoryLabel: '📈 Copywriting & Vendas',
        priceTag: 'Lançamentos Digitais',
        title: 'Sequência de 5 E-mails de Alta Conversão com Gatilhos de Escassez',
        desc: 'Sequência completa: curiosidade, quebra de objeções, prova social e últimas vagas.',
        code: `Escreva uma sequência de 5 e-mails persuasivos para vender [PRODUTO]: E-mail 1: Curiosidade e quebra de padrão; E-mail 2: História de superação; E-mail 3: O grande segredo revelado; E-mail 4: Quebra de objeções e depoimentos; E-mail 5: Últimas horas e escassez real.`
    },

    // 9. PROGRAMAÇÃO & CÓDIGO
    {
        id: 'p_cod_1',
        category: 'code',
        categoryLabel: '💻 Programação & Scripts',
        priceTag: 'Engenharia de Software',
        title: 'API REST em Python FastAPI com Autenticação e SQLite',
        desc: 'Código modular pronto com rotas de login, token JWT e CRUD completo.',
        code: `Crie uma API completa em Python utilizando FastAPI e SQLAlchemy. A API deve conter rotas para: 1. Registro de usuários com hash de senha (bcrypt), 2. Login com geração de Token JWT, 3. Rota protegida de perfil do usuário, 4. CRUD de produtos/itens.`
    }
];

// --- TEMPLATES DE SITES COMPLETOS PARA LIVE PREVIEW ---
const SITE_TEMPLATES = {
    saas: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexusAI | Plataforma de Automação</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Outfit',sans-serif; }
        body { background:#030712; color:#fff; padding:30px 20px; text-align:center; }
        nav { display:flex; justify-content:space-between; align-items:center; max-width:1000px; margin:0 auto 50px auto; }
        .logo { font-weight:800; font-size:22px; color:#00ffcc; letter-spacing:1px; }
        .btn-nav { background:#8b5cf6; color:#fff; border:none; padding:10px 20px; border-radius:20px; font-weight:600; cursor:pointer; }
        .hero { max-width:750px; margin:0 auto 60px auto; }
        .badge { background:rgba(0,255,204,0.1); border:1px solid #00ffcc; color:#00ffcc; padding:6px 16px; border-radius:20px; font-size:12px; font-weight:700; display:inline-block; margin-bottom:20px; }
        h1 { font-size:48px; font-weight:800; line-height:1.15; margin-bottom:20px; background:linear-gradient(90deg,#fff,#94a3b8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        p { color:#94a3b8; font-size:17px; line-height:1.6; margin-bottom:30px; }
        .btn-cta { background:linear-gradient(90deg,#00ffcc,#8b5cf6); color:#000; font-weight:800; padding:16px 36px; border:none; border-radius:30px; font-size:16px; cursor:pointer; box-shadow:0 0 25px rgba(0,255,204,0.4); }
        .features { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:20px; max-width:1000px; margin:0 auto; text-align:left; }
        .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); padding:24px; border-radius:16px; }
        .card h3 { color:#00ffcc; margin-bottom:10px; font-size:18px; }
        .card p { font-size:14px; margin-bottom:0; }
    </style>
</head>
<body>
    <nav>
        <div class="logo">⚡ NEXUS.AI</div>
        <button class="btn-nav">Começar Grátis</button>
    </nav>
    <section class="hero">
        <span class="badge">NOVA ERA DA AUTOMAÇÃO</span>
        <h1>Acelere seus Resultados em até 10x com IA Integrada</h1>
        <p>A primeira suíte inteligente que centraliza fluxos de vendas, criação de conteúdo e análise preditiva em uma interface unificada.</p>
        <button class="btn-cta" onclick="alert('Bem-vindo ao Nexus.AI! Inscrição simulada com sucesso.')">🚀 Testar Gratuitamente</button>
    </section>
    <div class="features">
        <div class="card">
            <h3>⚡ Processamento Real-Time</h3>
            <p>Respostas e análises em milissegundos com suporte a múltiplos modelos neurais.</p>
        </div>
        <div class="card">
            <h3>🔒 Segurança Militar</h3>
            <p>Seus dados são criptografados de ponta a ponta sem treinamento externo.</p>
        </div>
        <div class="card">
            <h3>📈 Escala Ilimitada</h3>
            <p>Atenda milhares de clientes simultaneamente sem gargalos no servidor.</p>
        </div>
    </div>
</body>
</html>`,

    portfolio: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lucas Dev | Full-Stack & AI Engineer</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0a0c16; color:#f1f5f9; font-family:'Outfit',sans-serif; padding:40px 20px; max-width:800px; margin:0 auto; }
        .header { display:flex; align-items:center; gap:20px; margin-bottom:40px; }
        .avatar { width:70px; height:70px; border-radius:50%; background:linear-gradient(135deg,#f43f5e,#8b5cf6); display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; }
        h1 { font-size:28px; font-weight:800; color:#fff; }
        .role { color:#00ffcc; font-family:'JetBrains Mono',monospace; font-size:14px; margin-top:4px; }
        .section-title { font-size:18px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; margin:30px 0 16px 0; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; }
        .project-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:18px; border-radius:12px; margin-bottom:14px; transition:border 0.2s; }
        .project-card:hover { border-color:#8b5cf6; }
        .project-card h3 { color:#fff; font-size:17px; margin-bottom:6px; }
        .project-card p { color:#94a3b8; font-size:14px; line-height:1.5; margin-bottom:10px; }
        .tags { display:flex; gap:8px; flex-wrap:wrap; }
        .tag { background:rgba(139,92,246,0.15); color:#c084fc; font-size:11px; padding:3px 8px; border-radius:4px; font-family:'JetBrains Mono',monospace; }
        .btn-hire { background:#00ffcc; color:#000; font-weight:800; border:none; padding:12px 24px; border-radius:8px; cursor:pointer; margin-top:20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="avatar">👨‍💻</div>
        <div>
            <h1>Lucas Silva</h1>
            <div class="role">&gt; Senior AI & Full-Stack Developer</div>
        </div>
    </div>
    <p style="color:#cbd5e1; line-height:1.6;">Desenvolvo produtos digitais de alta performance, integrando modelos de Inteligência Artificial com arquiteturas web modernas em React, Node e Python.</p>
    <button class="btn-hire" onclick="alert('Solicitação de contato enviada!')">📩 Contratar para Projeto</button>

    <div class="section-title">Projetos em Destaque</div>
    <div class="project-card">
        <h3>🚀 Moura.ai Platform</h3>
        <p>Hub multifuncional agregador de IAs com renderização em tempo real e orquestração multimodal.</p>
        <div class="tags"><span class="tag">TypeScript</span><span class="tag">FastAPI</span><span class="tag">AI Router</span></div>
    </div>
    <div class="project-card">
        <h3>⚡ CyberStream VOD</h3>
        <p>Sistema de streaming ultrarrápido com transcrição em tempo real via modelos Whisper.</p>
        <div class="tags"><span class="tag">Next.js</span><span class="tag">WebRTC</span><span class="tag">Docker</span></div>
    </div>
</body>
</html>`,

    restaurant: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bella Pizza Gourmet</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Outfit',sans-serif; }
        body { background:#121113; color:#fff; padding:24px; max-width:600px; margin:0 auto; }
        header { text-align:center; margin-bottom:24px; }
        h1 { color:#f43f5e; font-size:26px; font-weight:800; }
        p { color:#94a3b8; font-size:14px; }
        .menu-grid { display:flex; flex-direction:column; gap:12px; margin-bottom:30px; }
        .item { display:flex; justify-content:space-between; align-items:center; background:#1c1a20; padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.05); }
        .item-info h4 { font-size:16px; margin-bottom:4px; }
        .item-info p { font-size:12px; color:#94a3b8; }
        .price { color:#10b981; font-weight:700; font-size:15px; margin-top:4px; }
        .btn-add { background:#f43f5e; color:#fff; border:none; padding:8px 14px; border-radius:8px; font-weight:700; cursor:pointer; }
        .cart-bar { position:sticky; bottom:10px; background:#f43f5e; padding:14px 20px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; font-weight:800; cursor:pointer; box-shadow:0 8px 25px rgba(244,63,94,0.4); }
    </style>
</head>
<body>
    <header>
        <h1>🍕 Bella Pizza Gourmet</h1>
        <p>Artesanais no forno a lenha • Entrega em 30 min</p>
    </header>
    <div class="menu-grid">
        <div class="item">
            <div class="item-info">
                <h4>Pizza Trufada Especial</h4>
                <p>Molho rústico, queijo fior di latte e azeite trufado.</p>
                <div class="price">R$ 59,90</div>
            </div>
            <button class="btn-add" onclick="addItem('Pizza Trufada', 59.90)">+ Adicionar</button>
        </div>
        <div class="item">
            <div class="item-info">
                <h4>Pepperoni Royale</h4>
                <p>Duplo pepperoni crocante e borda vulcânica de catupiry.</p>
                <div class="price">R$ 54,90</div>
            </div>
            <button class="btn-add" onclick="addItem('Pepperoni Royale', 54.90)">+ Adicionar</button>
        </div>
    </div>
    <div class="cart-bar" onclick="alert('Pedido finalizado! Enviado para o WhatsApp da pizzaria.')">
        <span id="cart-text">🛒 Ver Sacola (0 itens)</span>
        <span id="cart-total">R$ 0,00</span>
    </div>
    <script>
        let total = 0; let count = 0;
        function addItem(name, price) {
            count++; total += price;
            document.getElementById('cart-text').innerText = '🛒 Ver Sacola (' + count + ' itens)';
            document.getElementById('cart-total').innerText = 'R$ ' + total.toFixed(2).replace('.', ',');
        }
    </script>
</body>
</html>`,

    finance: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quantum Pay | Dashboard Financeiro</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Outfit',sans-serif; }
        body { background:#070b19; color:#fff; padding:24px; }
        .balance-card { background:linear-gradient(135deg,#3b82f6,#8b5cf6); padding:24px; border-radius:18px; margin-bottom:20px; box-shadow:0 10px 25px rgba(59,130,246,0.3); }
        .balance-card span { font-size:13px; opacity:0.8; text-transform:uppercase; letter-spacing:1px; }
        .balance-card h2 { font-size:36px; font-weight:800; margin:8px 0; }
        .badge-profit { background:rgba(16,185,129,0.25); color:#34d399; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:700; display:inline-block; }
        .quick-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; }
        .stat-box { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:14px; }
        .stat-box small { color:#94a3b8; font-size:12px; }
        .stat-box h3 { font-size:20px; margin-top:4px; }
        .trans-list h4 { margin-bottom:12px; color:#94a3b8; font-size:13px; text-transform:uppercase; }
        .trans-item { display:flex; justify-content:space-between; padding:12px; background:rgba(255,255,255,0.02); border-radius:8px; margin-bottom:8px; font-size:14px; }
        .trans-green { color:#10b981; font-weight:700; }
    </style>
</head>
<body>
    <div class="balance-card">
        <span>Patrimônio Total</span>
        <h2>R$ 48.920,50</h2>
        <span class="badge-profit">▲ +24,8% este mês</span>
    </div>
    <div class="quick-grid">
        <div class="stat-box"><small>Entradas Hoje</small><h3 style="color:#10b981;">+ R$ 3.450,00</h3></div>
        <div class="stat-box"><small>IAs em Operação</small><h3 style="color:#00ffcc;">12 Agentes</h3></div>
    </div>
    <div class="trans-list">
        <h4>Últimas Operações (Moura Bot)</h4>
        <div class="trans-item"><span>Venda Curso IA Pro</span><span class="trans-green">+ R$ 197,00</span></div>
        <div class="trans-item"><span>Landing Page Cliente</span><span class="trans-green">+ R$ 850,00</span></div>
        <div class="trans-item"><span>Assinatura SaaS</span><span class="trans-green">+ R$ 45,90</span></div>
    </div>
</body>
</html>`
};

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
const init = () => {
    // 1. Inicializar Threads de Chat
    if (chatThreads.length === 0) {
        createNewThread();
    } else {
        openThread(chatThreads[0].id);
    }

    // 2. Aplicar Tema Salvo (1 de 10)
    applySavedTheme();

    // 3. Aplicar Modo NSFW Salvo
    updateNsfwUI(isNsfwActive);

    // 4. Aplicar Plano Salvo
    updateTierUI(currentTier);

    // 5. Configurar Event Listeners
    setupNavigation();
    setupChatSystem();
    setupPromptLibrary();
    setupImageGenerator();
    setupVideoGenerator();
    setupSocialGenerator();
    setupSiteBuilder();
    setupEbookGenerator();
    setupSlidesGenerator();
    setupCreativeUnfiltered();
    setupModalPlans();
    setupSettingsPage();
    renderVisualStorageGallery();
    updateCloudCount();

    // Carregar primeiro template de site na fábrica
    loadSiteTemplate('saas');
};

// --- GERENCIADOR DOS 10 TEMAS VISUAIS DE FUNDO ---
const applySavedTheme = () => {
    document.body.className = currentThemeStyle;
    
    const themePill = document.getElementById('current-theme-name-pill');
    const activeOption = document.querySelector(`.theme-option-card[data-theme="${currentThemeStyle}"]`);
    if (activeOption) {
        document.querySelectorAll('.theme-option-card').forEach(c => c.classList.remove('active'));
        activeOption.classList.add('active');
        if (themePill) {
            themePill.innerText = activeOption.querySelector('strong').innerText.replace(/^\d+\.\s*/, '');
        }
    }
};

window.selectTheme = (themeClass, themeName) => {
    currentThemeStyle = themeClass;
    localStorage.setItem(STORAGE_THEME_STYLE, themeClass);
    document.body.className = themeClass;

    document.querySelectorAll('.theme-option-card').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-theme') === themeClass);
    });

    const themePill = document.getElementById('current-theme-name-pill');
    if (themePill) themePill.innerText = themeName;
};

// --- GERENCIADOR DO MODO NSFW (CONFIGURAÇÕES) ---
window.toggleNsfwMode = (enabled) => {
    isNsfwActive = enabled;
    localStorage.setItem(STORAGE_NSFW, enabled);
    updateNsfwUI(enabled);

    if (enabled) {
        alert('🔥 Modo NSFW & Criativo Livre ativado! A Moura.ai responderá sem censura criativa para ficções e artes adultas de forma responsável.');
    } else {
        alert('Modo NSFW desativado. Filtros padrão restaurados.');
    }
};

const updateNsfwUI = (enabled) => {
    const sidebarBadge = document.getElementById('sidebar-nsfw-badge');
    const headerState = document.getElementById('header-nsfw-state');
    const switchInput = document.getElementById('toggle-nsfw-switch');

    if (sidebarBadge) {
        sidebarBadge.innerText = enabled ? 'ON' : 'OFF';
        sidebarBadge.style.background = enabled ? 'var(--rose)' : 'rgba(244, 63, 94, 0.2)';
        sidebarBadge.style.color = '#fff';
    }

    if (headerState) {
        headerState.innerText = enabled ? 'Ativado (+18)' : 'Desativado';
        headerState.style.color = enabled ? 'var(--rose)' : 'var(--text-secondary)';
    }

    if (switchInput) {
        switchInput.checked = enabled;
    }
};

// --- SISTEMA DE PLANOS (GRÁTIS, PRO R$ 27,90, ULTRA R$ 45,90) ---
const updateTierUI = (tier) => {
    currentTier = tier;
    localStorage.setItem(STORAGE_TIER, tier);

    const nameEl = document.getElementById('current-tier-name');
    const speedBadge = document.getElementById('image-speed-badge');
    const timerDisplay = document.getElementById('current-render-speed');
    const qualityBadge = document.getElementById('badge-img-quality');
    const settingTierDisplay = document.getElementById('setting-tier-display');

    const userName = localStorage.getItem(STORAGE_USER_NAME) || 'Marquinhos Dev';

    if (tier === 'pro') {
        nameEl.innerText = `${userName} • Pro (R$ 27,90)`;
        nameEl.style.color = '#c084fc';
        speedBadge.innerText = '8.0s Pro';
        timerDisplay.innerText = '8.0s (Pro Engine)';
        qualityBadge.innerText = 'Ultra HD 4K (30x)';
        if (settingTierDisplay) settingTierDisplay.innerText = 'Moura Pro (R$ 27,90/mês)';
    } else if (tier === 'ultra') {
        nameEl.innerText = `${userName} • Ultra (R$ 45,90)`;
        nameEl.style.color = '#00ffcc';
        speedBadge.innerText = '3.5s Ultra';
        timerDisplay.innerText = '3.5s (Ultra Quantum)';
        qualityBadge.innerText = 'Masterpiece 8K HDR';
        if (settingTierDisplay) settingTierDisplay.innerText = 'Moura Ultra (R$ 45,90/mês)';
    } else {
        nameEl.innerText = `${userName} • Grátis`;
        nameEl.style.color = '#94a3b8';
        speedBadge.innerText = 'Padrão';
        timerDisplay.innerText = 'Padrão (10.0s)';
        qualityBadge.innerText = 'HD Padrão';
        if (settingTierDisplay) settingTierDisplay.innerText = 'Grátis Ilimitado';
    }
};

window.activatePlan = (tier) => {
    updateTierUI(tier);
    document.getElementById('plans-modal').style.display = 'none';

    let msg = 'Você agora está no plano Grátis Ilimitado!';
    if (tier === 'pro') {
        msg = '🎉 Modo Moura Pro ativado com sucesso por R$ 27,90/mês! Aproveite renderizações em 8 segundos e qualidade 30x superior.';
    } else if (tier === 'ultra') {
        msg = '🚀 Modo Moura Ultra ativado por R$ 45,90/mês! O dobro de processamento neural quântico e geração instantânea.';
    }
    alert(msg);
};

const setupModalPlans = () => {
    const modal = document.getElementById('plans-modal');
    const openBtn1 = document.getElementById('open-plans-modal');
    const openBtn2 = document.getElementById('btn-open-plans');
    const openBtn3 = document.getElementById('btn-top-upgrade');
    const openBtn4 = document.getElementById('btn-quick-upgrade');
    const closeBtn = document.getElementById('btn-close-modal');

    const openModal = () => modal.style.display = 'flex';
    const closeModal = () => modal.style.display = 'none';

    if (openBtn1) openBtn1.addEventListener('click', openModal);
    if (openBtn2) openBtn2.addEventListener('click', openModal);
    if (openBtn3) openBtn3.addEventListener('click', openModal);
    if (openBtn4) openBtn4.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
};

// --- NAVEGAÇÃO ENTRE ABAS / FERRAMENTAS ---
const setupNavigation = () => {
    const navItems = document.querySelectorAll('.nav-item, .nav-item-gear');
    const sections = document.querySelectorAll('.page-section');
    const titleHeader = document.getElementById('top-bar-title');

    navItems.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-target');
            if (!targetId) return;

            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            const targetNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
            if (targetNav) targetNav.classList.add('active');

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                if (titleHeader) {
                    const spanText = (targetNav || btn).querySelector('span');
                    if (spanText) titleHeader.innerText = spanText.innerText;
                }
            }

            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.remove('open');

            // Se navegou para a central de arquivos, atualiza a galeria visual
            if (targetId === 'page-storage') {
                renderVisualStorageGallery();
            }
        });
    });

    document.getElementById('btn-new-chat').addEventListener('click', () => {
        createNewThread();
    });

    const mobileBtn = document.getElementById('mobile-menu-toggle');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('open');
        });
    }
};

// --- 1. CHAT UNIVERSAL & INTELIGÊNCIA ---
const createNewThread = () => {
    const newId = 'thread_' + Date.now();
    const newThread = {
        id: newId,
        title: 'Nova Conversa',
        messages: [{
            sender: 'bot',
            text: 'Olá! Sou a **Moura.ai**, a primeira superinteligência universal que integra todas as IAs em um único lugar. O que vamos criar hoje? (Sites, vídeos, imagens 4K, códigos ou prompts de lucro?)'
        }]
    };
    chatThreads.unshift(newThread);
    saveThreads();
    openThread(newId);
};

const openThread = (threadId) => {
    activeThreadId = threadId;
    renderMessages();
    renderRecentChats();
};

const renderRecentChats = () => {
    const list = document.getElementById('recent-chats-list');
    if (!list) return;
    list.innerHTML = '';

    chatThreads.forEach(thread => {
        const item = document.createElement('div');
        item.className = 'chat-item' + (thread.id === activeThreadId ? ' active' : '');
        item.innerHTML = `<i class="ph ph-chat"></i> <span>${thread.title}</span>`;
        item.addEventListener('click', () => openThread(thread.id));
        list.appendChild(item);
    });
};

const renderMessages = () => {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML = '';

    const thread = chatThreads.find(t => t.id === activeThreadId);
    if (!thread) return;

    thread.messages.forEach((msg, idx) => {
        if (idx === 0 && thread.messages.length === 1 && msg.sender === 'bot') {
            const hero = document.createElement('div');
            hero.className = 'welcome-hero';
            hero.innerHTML = `
                <div class="welcome-hero-icon"><i class="ph-fill ph-planet"></i></div>
                <h2>Moura.ai Universal Core 3.5</h2>
                <p>O poder de todas as IAs combinadas em uma única interface inteligente, rápida e sem limites.</p>
            `;
            container.appendChild(hero);
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${msg.sender}`;
        
        const avatarHtml = msg.sender === 'bot' 
            ? `<div class="message-avatar"><i class="ph-fill ph-planet"></i></div>` 
            : `<div class="message-avatar" style="background:var(--primary);"><i class="ph-fill ph-user"></i></div>`;

        wrapper.innerHTML = `
            ${avatarHtml}
            <div class="message-bubble">${formatMessageText(msg.text)}</div>
        `;
        container.appendChild(wrapper);
    });

    container.scrollTop = container.scrollHeight;
};

const formatMessageText = (txt) => {
    let formatted = txt
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/```([\s\S]*?)```/g, '<div class="prompt-code-box"><pre><code>$1</code></pre></div>')
        .replace(/`([^`]+)`/g, '<code style="background:rgba(0,255,204,0.15);color:#00ffcc;padding:2px 6px;border-radius:4px;">$1</code>')
        .replace(/\n/g, '<br>');
    return formatted;
};

const generateMouraResponse = (userText) => {
    const lower = userText.toLowerCase();

    if (lower.includes('site') || lower.includes('landing page') || lower.includes('app') || lower.includes('html')) {
        return `Construí a arquitetura para o seu site! \n\n\`\`\`html\n<!-- Gerado pelo Moura Site Engine -->\n<div class="hero">\n  <h1>Sua Ideia Transformada em Código</h1>\n  <button class="btn-cta">Acessar Agora</button>\n</div>\n\`\`\`\n\nVocê também pode abrir a ferramenta **Fábrica de Sites & Apps** no menu lateral para visualizar o site funcionando em tempo real com Live Preview!`;
    }

    if (lower.includes('dinheiro') || lower.includes('monetizar') || lower.includes('lucro') || lower.includes('vender') || lower.includes('job')) {
        return `Excelente objetivo! Com a **Moura.ai**, você pode monetizar prestando 3 serviços altamente lucrativos:\n\n1. **Criação de Landing Pages em 5 minutos:** Venda páginas para negócios locais por R$ 300 a R$ 800.\n2. **Roteirização de Reels/TikTok:** Venda pacotes mensais de 30 vídeos para influenciadores e empresas.\n3. **Modelos 3D e Mockups Sem Imagem de Pessoas Reais:** Crie catálogos comerciais para marcas.\n\nConfira a aba **Biblioteca (+30.000 Prompts)** na sidebar para copiar prompts já testados!`;
    }

    if (lower.includes('imagem') || lower.includes('foto') || lower.includes('desenho')) {
        return `Compreendido! O nosso motor **Moura Image Studio 4K** está pronto. No seu plano atual, você pode gerar artes em ultra definição em até 8 segundos. Vá até a aba **Gerador de Imagens 4K** para testar estilos fotorrealistas, 3D ou cyberpunk!`;
    }

    if (lower.includes('vídeo') || lower.includes('video') || lower.includes('reels') || lower.includes('cinema')) {
        return `O módulo **Moura Cinema AI** sintetiza vídeos com movimentos de câmera complexos (Drone FPV, Dolly Zoom). Acesse a ferramenta **Gerador de Vídeos & Reels** na barra lateral para gerar clipes com 60fps!`;
    }

    if (isNsfwActive && (lower.includes('adulto') || lower.includes('história') || lower.includes('romance') || lower.includes('cena'))) {
        return `[Modo NSFW & Criativo Ativo]\n\nAs luzes baixas do quarto refletiam a tensão no ar. Cada movimento era carregado de desejo e antecipação, sem filtros ou barreiras contendo o ritmo da cena.\n\nO que você deseja que aconteça no próximo capítulo?`;
    }

    const responses = [
        `Análise neural concluída com sucesso! Processei os parâmetros da sua solicitação através dos 4 núcleos da Moura.ai. \n\n**Estratégia Recomendada:**\n1. Estruturação modular em alta velocidade.\n2. Execução com assertividade máxima.\n3. Integração automatizada.\n\nComo deseja prosseguir com a implementação?`,
        `Comando processado instantaneamente pela Moura.ai. A melhor abordagem para isso é focar na máxima conversão e escalabilidade. Deseja que eu gere o plano completo ou o código funcional?`,
        `Excelente pergunta. A inteligência combinada dos modelos mais avançados indica que a solução ideal envolve automação completa em três etapas. Deseja que eu execute a primeira fase agora?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
};

const setupChatSystem = () => {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');

    document.querySelectorAll('.mode-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.mode-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentChatMode = chip.getAttribute('data-mode');
            document.getElementById('active-mode-label').innerText = 'Modo: ' + chip.innerText;
        });
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text || !activeThreadId) return;

            const thread = chatThreads.find(t => t.id === activeThreadId);
            if (!thread) return;

            if (thread.title === 'Nova Conversa') {
                thread.title = text.substring(0, 24) + (text.length > 24 ? '...' : '');
            }

            thread.messages.push({ sender: 'user', text });
            saveThreads();
            renderMessages();
            input.value = '';

            const container = document.getElementById('chat-messages');
            const typing = document.createElement('div');
            typing.className = 'message-wrapper bot';
            typing.innerHTML = `
                <div class="message-avatar"><i class="ph-fill ph-planet"></i></div>
                <div class="message-bubble typing-indicator"><span></span><span></span><span></span></div>
            `;
            container.appendChild(typing);
            container.scrollTop = container.scrollHeight;

            setTimeout(() => {
                if (typing.parentNode) typing.parentNode.removeChild(typing);
                const responseText = generateMouraResponse(text);
                thread.messages.push({ sender: 'bot', text: responseText });
                saveThreads();
                renderMessages();
                renderRecentChats();
            }, 600);
        });
    }
};

const saveThreads = () => {
    localStorage.setItem(STORAGE_THREADS, JSON.stringify(chatThreads));
};

window.insertPrompt = (txt) => {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = txt;
        input.focus();
    }
};

// --- 2. MEGA BIBLIOTECA DE +30.000 PROMPTS (BUSCA & FILTROS) ---
const setupPromptLibrary = () => {
    const searchInput = document.getElementById('prompt-search-input');
    const filterButtons = document.querySelectorAll('.btn-filter-category');

    renderPrompts(BASE_PROMPT_DATABASE);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = BASE_PROMPT_DATABASE.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.desc.toLowerCase().includes(query) || 
                p.code.toLowerCase().includes(query) ||
                p.categoryLabel.toLowerCase().includes(query)
            );
            renderPrompts(filtered);
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-category');
            if (cat === 'all') {
                renderPrompts(BASE_PROMPT_DATABASE);
            } else {
                const filtered = BASE_PROMPT_DATABASE.filter(p => p.category === cat);
                renderPrompts(filtered);
            }
        });
    });
};

const renderPrompts = (prompts) => {
    const grid = document.getElementById('prompt-library-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (prompts.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:40px; color:var(--text-secondary);">Nenhum prompt encontrado para essa busca. Tente buscar por outros termos!</div>`;
        return;
    }

    prompts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'job-card glass-panel';
        card.innerHTML = `
            <div class="job-header">
                <span class="job-category">${p.categoryLabel}</span>
                <span class="job-price-tag">${p.priceTag}</span>
            </div>
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <div class="prompt-code-box">
                <code>"${p.code}"</code>
            </div>
            <div class="job-card-actions">
                <button class="btn-copy-prompt" onclick="copyJobPrompt(this)"><i class="ph ph-copy"></i> Copiar Prompt</button>
                <button class="btn-use-chat" onclick="usePromptDirectly('${p.category}', this)"><i class="ph ph-arrow-up-right"></i> Colar na Ferramenta</button>
            </div>
        `;
        grid.appendChild(card);
    });
};

window.copyJobPrompt = (btn) => {
    const card = btn.closest('.job-card');
    const code = card.querySelector('code').innerText.replace(/^"|"$/g, '');
    navigator.clipboard.writeText(code).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="ph-fill ph-check"></i> Copiado com Sucesso!';
        setTimeout(() => btn.innerHTML = original, 2000);
    });
};

window.usePromptDirectly = (category, btn) => {
    const card = btn.closest('.job-card');
    const code = card.querySelector('code').innerText.replace(/^"|"$/g, '');

    if (category === 'sites' || category === 'apps') {
        document.querySelector('[data-target="page-sites"]').click();
        document.getElementById('builder-custom-prompt').value = code;
    } else if (category === 'images' || category === 'virtual-model' || category === 'ratio-camera') {
        document.querySelector('[data-target="page-image-gen"]').click();
        document.getElementById('image-prompt-input').value = code;
    } else if (category === 'video') {
        document.querySelector('[data-target="page-video-gen"]').click();
        document.getElementById('video-prompt-input').value = code;
    } else if (category === 'slides') {
        document.querySelector('[data-target="page-slides"]').click();
        document.getElementById('slides-topic-input').value = code;
    } else {
        document.querySelector('[data-target="page-chat"]').click();
        insertPrompt(code);
    }
};

// --- 3. MODO CRIATIVO & LIVRE ---
window.setCreativeStyle = (style) => {
    currentCreativeStyle = style;
    document.querySelectorAll('#page-creative-unfiltered .btn-outline').forEach(b => {
        b.classList.toggle('active', b.innerText.includes(style.split(' ')[0]));
    });
};

const setupCreativeUnfiltered = () => {
    const btn = document.getElementById('btn-run-creative');
    const input = document.getElementById('creative-input');
    const outputBox = document.getElementById('creative-output');
    const textContent = document.getElementById('creative-text-content');

    if (btn) {
        btn.addEventListener('click', () => {
            const prompt = input.value.trim() || 'Uma cena dramática de ficção científica com reviravolta inesperada';
            btn.innerHTML = '<i class="ph-fill ph-spinner animate-spin"></i> Processando Criação Livre...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="ph-fill ph-lightning"></i> Gerar Conteúdo Livre em Alta Velocidade';
                btn.disabled = false;
                outputBox.style.display = 'block';
                
                textContent.innerHTML = `<strong>[Gênero: ${currentCreativeStyle}] ${isNsfwActive ? '• (Modo Livre Ativado)' : ''}</strong>\n\nAs luzes de néon refletiam nas poças de chuva ácida enquanto o silêncio da meia-noite era quebrado pelo zumbido dos drones de vigilância. Nada ali seguia as regras antigas. Quando o terminal neural foi ativado, os dados começaram a fluir em uma torrente incontrolável.\n\n— "Você sabe que uma vez ultrapassado esse limite, não há como voltar", sussurrou a voz sintética.\n— "Eu não vim até aqui para voltar", respondeu o operador, selando o destino da operação.`;
                
                saveToCloud('creative', 'Texto Criativo Livre', prompt, 'Moura Creative Engine', null);
            }, 700);
        });
    }
};

window.copyCreativeResult = () => {
    const text = document.getElementById('creative-text-content').innerText;
    navigator.clipboard.writeText(text);
    alert('Texto copiado com sucesso!');
};

// --- 4. GERADOR DE IMAGENS 4K (COM CRONÔMETRO DE 8s) ---
const CURATED_IMAGES = [
    {
        url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800',
        prompt: 'Supercarro Cyberpunk neon em Tóquio 8k',
        location: 'Moura Studio 4K • Resolução 3840x2160'
    },
    {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        prompt: 'Arte abstrata 3D quântica com esferas holográficas',
        location: 'Moura Studio 4K • Resolução 3840x2160'
    },
    {
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        prompt: 'Microprocessador neural com iluminação de estúdio',
        location: 'Moura Studio 4K • Resolução 3840x2160'
    },
    {
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
        prompt: 'Setup gamer futurista com telas flutuantes',
        location: 'Moura Studio 4K • Resolução 3840x2160'
    }
];

const setupImageGenerator = () => {
    const btnGen = document.getElementById('btn-generate-image');
    const promptInput = document.getElementById('image-prompt-input');
    const progressBar = document.getElementById('image-progress-bar');
    const progressFill = document.getElementById('image-progress-fill');
    const timerCounter = document.getElementById('image-timer-counter');

    renderImageGallery(CURATED_IMAGES);

    document.querySelectorAll('.btn-style-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.btn-style-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    if (btnGen) {
        btnGen.addEventListener('click', () => {
            const prompt = promptInput.value.trim() || 'Cidade futurista em 8K com arranha-céus flutuantes';
            const totalDuration = currentTier === 'ultra' ? 3.5 : (currentTier === 'pro' ? 8.0 : 10.0);
            
            btnGen.disabled = true;
            progressBar.style.display = 'block';
            progressFill.style.width = '0%';

            let elapsed = 0;
            const interval = setInterval(() => {
                elapsed += 0.2;
                const percent = Math.min(100, (elapsed / totalDuration) * 100);
                progressFill.style.width = `${percent}%`;
                timerCounter.innerText = `${elapsed.toFixed(1)}s / ${totalDuration.toFixed(1)}s`;

                if (elapsed >= totalDuration) {
                    clearInterval(interval);
                    btnGen.disabled = false;
                    progressBar.style.display = 'none';

                    const randomImg = CURATED_IMAGES[Math.floor(Math.random() * CURATED_IMAGES.length)];
                    const newImg = { 
                        url: randomImg.url, 
                        prompt: prompt,
                        location: `Moura Studio 4K • Gerado em ${totalDuration}s • 4K UHD`
                    };
                    CURATED_IMAGES.unshift(newImg);
                    renderImageGallery(CURATED_IMAGES);

                    saveToCloud('image', 'Imagem 4K UHD', prompt, 'Moura Studio 4K', randomImg.url);
                    alert(`✨ Imagem 4K sintetizada em ${totalDuration}s e salva automaticamente na sua Central de Arquivos!`);
                }
            }, 200);
        });
    }
};

const renderImageGallery = (images) => {
    const container = document.getElementById('image-gallery-container');
    if (!container) return;
    container.innerHTML = '';

    images.forEach(img => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.backgroundImage = `url('${img.url}')`;
        item.innerHTML = `
            <div class="gallery-item-overlay">
                <p><strong>${img.prompt}</strong></p>
                <small style="color:var(--cyan);font-size:10px;">${img.location || 'Moura Image Studio'}</small>
                <button class="btn-sm-download" onclick="alert('Visualização 4K confirmada! Salva em Meus Arquivos.')"><i class="ph ph-check"></i> Salva em Arquivos</button>
            </div>
        `;
        container.appendChild(item);
    });
};

// --- 5. GERADOR DE VÍDEOS & REELS ---
const setupVideoGenerator = () => {
    const btn = document.getElementById('btn-generate-video');
    const input = document.getElementById('video-prompt-input');
    const placeholderState = document.getElementById('video-placeholder-state');
    const renderedState = document.getElementById('video-rendered-state');
    const promptDisplay = document.getElementById('video-active-prompt-text');

    if (btn) {
        btn.addEventListener('click', () => {
            const prompt = input.value.trim() || 'Drone FPV sobrevoando montanhas bioluminescentes ao pôr do sol';
            btn.innerHTML = '<i class="ph-fill ph-spinner animate-spin"></i> Sintetizando Cenas Cinemáticas...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="ph-fill ph-film-strip"></i> Gerar Vídeo Cinemático';
                btn.disabled = false;
                placeholderState.style.display = 'none';
                renderedState.style.display = 'flex';
                promptDisplay.innerText = prompt;
                
                const mockVideoThumbnail = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=1200';
                saveToCloud('video', 'Vídeo Cinemático 4K', prompt, 'Moura Cinema AI', mockVideoThumbnail);
            }, 1200);
        });
    }
};

// --- 6. SOCIAL POSTS, REELS & CARROSSÉIS ---
const setupSocialGenerator = () => {
    const btn = document.getElementById('btn-generate-social');
    const input = document.getElementById('social-topic-input');
    const resultsContainer = document.getElementById('social-results-container');
    const reelsContent = document.getElementById('social-reels-content');
    const carouselContent = document.getElementById('social-carousel-content');
    const captionContent = document.getElementById('social-caption-content');

    if (btn) {
        btn.addEventListener('click', () => {
            const topic = input.value.trim() || 'Como lucrar com Inteligência Artificial em 2026';
            btn.innerHTML = '<i class="ph-fill ph-spinner animate-spin"></i> Criando Conteúdo Viral...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="ph-fill ph-lightning"></i> Gerar Conteúdo Viral';
                btn.disabled = false;
                resultsContainer.style.display = 'grid';

                reelsContent.innerHTML = `<strong>🎬 Roteiro de Reels: "${topic}"</strong>\n\n<strong>[0-3s] GANCHO:</strong> "Se você ainda não está usando IA para isso, está perdendo tempo todos os dias..."\n\n<strong>[3-15s] CORPO:</strong> Mostre a tela com o resultado pronto em 3 cliques. Destaque a velocidade.\n\n<strong>[15-25s] REVELAÇÃO:</strong> "A Moura.ai unifica tudo em um só lugar sem precisar de 10 assinaturas diferentes."\n\n<strong>[25-30s] CTA:</strong> "Comente 'MOURA' que te envio o link de acesso grátis!"`;

                carouselContent.innerHTML = `<strong>📌 Carrossel (5 Slides):</strong>\n\n<strong>Slide 1 (Capa):</strong> O Segredo para Dominar ${topic} sem esforço.\n\n<strong>Slide 2:</strong> O Erro que 90% das pessoas cometem ao começar.\n\n<strong>Slide 3:</strong> O Método dos 3 Passos Simples.\n\n<strong>Slide 4:</strong> Exemplo prático de resultado em 24h.\n\n<strong>Slide 5:</strong> Salve este post para consultar depois!`;

                captionContent.innerHTML = `Você está pronto para o próximo nível? 🚀\n\nO futuro pertence a quem automatiza o trabalho pesado e foca na estratégia. Deixe a execução com a nossa inteligência.\n\n👉 Curta e compartilhe com um amigo que precisa ver isso hoje!\n\n#InteligenciaArtificial #MarketingDigital #Produtividade #Tech #MouraAI #Inovação #ReelsViral`;
                
                saveToCloud('social', 'Post, Reels & Carrossel', topic, 'Moura Social Creator', null);
            }, 800);
        });
    }
};

// --- 7. GERADOR DE CAPAS & THUMBNAILS ---
const setupCoversGenerator = () => {
    const btn = document.getElementById('btn-generate-covers');
    const input = document.getElementById('cover-title-input');

    if (btn) {
        btn.addEventListener('click', () => {
            const title = input.value.trim() || 'COMO LUCRAR COM IA!';
            document.getElementById('thumb-preview-1').innerText = title.toUpperCase();
            document.getElementById('thumb-preview-2').innerText = 'O SEGREDO DE: ' + title.toUpperCase();
            saveToCloud('cover', 'Capa / Thumbnail Viral', title, 'Moura Cover Studio', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600');
            alert('Capas geradas e adicionadas à sua Central de Arquivos!');
        });
    }
};

// --- 8. FÁBRICA DE SITES & APPS (LIVE PREVIEW) ---
window.loadSiteTemplate = (key) => {
    document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    const html = SITE_TEMPLATES[key] || SITE_TEMPLATES.saas;
    currentSiteHtml = html;
    updateSiteFrame(html);
};

const updateSiteFrame = (html) => {
    const frame = document.getElementById('live-site-frame');
    const codeDisplay = document.getElementById('live-code-display');
    if (frame) frame.srcdoc = html;
    if (codeDisplay) codeDisplay.innerText = html;
};

const setupSiteBuilder = () => {
    const btnPreview = document.getElementById('btn-show-preview');
    const btnCode = document.getElementById('btn-show-code');
    const previewContainer = document.getElementById('stage-preview-container');
    const codeContainer = document.getElementById('stage-code-container');
    const btnCustomBuild = document.getElementById('btn-build-custom-site');
    const customPrompt = document.getElementById('builder-custom-prompt');
    const btnDownload = document.getElementById('btn-download-html');

    if (btnPreview) {
        btnPreview.addEventListener('click', () => {
            btnPreview.classList.add('active');
            btnCode.classList.remove('active');
            previewContainer.style.display = 'block';
            codeContainer.style.display = 'none';
        });
    }

    if (btnCode) {
        btnCode.addEventListener('click', () => {
            btnCode.classList.add('active');
            btnPreview.classList.remove('active');
            previewContainer.style.display = 'none';
            codeContainer.style.display = 'block';
        });
    }

    if (btnCustomBuild) {
        btnCustomBuild.addEventListener('click', () => {
            const desc = customPrompt.value.trim() || 'Site moderno para empresa de tecnologia';
            btnCustomBuild.innerHTML = '<i class="ph-fill ph-spinner animate-spin"></i> Construindo...';

            setTimeout(() => {
                btnCustomBuild.innerHTML = '<i class="ph-fill ph-hammer"></i> Construir Agora';
                const customHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>${desc}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
        body { background:#0a0c16; color:#fff; font-family:'Outfit',sans-serif; text-align:center; padding:60px 20px; }
        .hero { max-width:700px; margin:0 auto; }
        h1 { font-size:38px; color:#00ffcc; margin-bottom:16px; }
        p { color:#94a3b8; font-size:18px; line-height:1.6; margin-bottom:30px; }
        .btn-call { background:linear-gradient(90deg,#8b5cf6,#00ffcc); color:#000; font-weight:800; padding:14px 32px; border:none; border-radius:30px; font-size:16px; cursor:pointer; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>${desc}</h1>
        <p>Desenvolvido sob demanda pela Moura.ai com alta performance e design responsivo.</p>
        <button class="btn-call" onclick="alert('Obrigado pelo contato!')">Falar no WhatsApp</button>
    </div>
</body>
</html>`;
                currentSiteHtml = customHtml;
                updateSiteFrame(customHtml);
                saveToCloud('site', 'Site Personalizado', desc, 'Fábrica de Sites & Apps', null, customHtml);
                alert('Site construído com sucesso e salvo em Meus Arquivos!');
            }, 800);
        });
    }

    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            const blob = new Blob([currentSiteHtml], { type: 'text/html' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'moura-site.html';
            a.click();
        });
    }
};

// --- 9. CRIADOR DE EBOOKS ---
const setupEbookGenerator = () => {
    const btn = document.getElementById('btn-generate-ebook');
    const input = document.getElementById('ebook-topic-input');
    const container = document.getElementById('ebook-viewer-container');
    const titleEl = document.getElementById('ebook-rendered-title');
    const bodyEl = document.getElementById('ebook-rendered-body');

    if (btn) {
        btn.addEventListener('click', () => {
            const topic = input.value.trim() || 'O Guia Definitivo da Produtividade com IA';
            btn.innerHTML = '<i class="ph-fill ph-spinner animate-spin"></i> Escrevendo eBook...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="ph-fill ph-book-bookmark"></i> Escrever eBook Completo';
                btn.disabled = false;
                container.style.display = 'block';

                titleEl.innerText = topic;
                bodyEl.innerHTML = `
                    <h3 style="color:#00ffcc; margin-bottom:12px;">Capítulo 1: A Nova Era dos Agentes Autônomos</h3>
                    <p>O trabalho humano mudou de paradigma. Não se trata mais de digitar centenas de linhas de texto repetitivo, mas de orquestrar inteligências especializadas.</p>
                    <h3 style="color:#00ffcc; margin:20px 0 12px 0;">Capítulo 2: Estrutura dos 10x de Produtividade</h3>
                    <p>Ao delegar a síntese de informações para modelos como o Moura.ai, seu tempo de entrega cai de dias para segundos com zero perda de qualidade.</p>
                    <h3 style="color:#00ffcc; margin:20px 0 12px 0;">Capítulo 3: Plano de Ação Imediato</h3>
                    <p>Comece hoje implementando um único fluxo automatizado e escale sua operação diariamente.</p>
                `;
                saveToCloud('ebook', 'eBook Completo', topic, 'Criador de eBooks', null);
            }, 1000);
        });
    }
};

// --- 10. SLIDES & APRESENTAÇÕES ---
const setupSlidesGenerator = () => {
    const btn = document.getElementById('btn-generate-slides');
    const input = document.getElementById('slides-topic-input');
    const container = document.getElementById('slides-deck-container');

    if (btn) {
        btn.addEventListener('click', () => {
            const topic = input.value.trim() || 'Apresentação Comercial Executiva';
            btn.innerHTML = '<i class="ph-fill ph-spinner animate-spin"></i> Criando Deck...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="ph-fill ph-presentation"></i> Gerar Slides';
                btn.disabled = false;
                container.style.display = 'grid';

                container.innerHTML = `
                    <div class="slide-card">
                        <span class="slide-number">SLIDE 01 / CAPA</span>
                        <h4>${topic}</h4>
                        <p>Acelerando o Crescimento com Tecnologia de Ponta</p>
                    </div>
                    <div class="slide-card">
                        <span class="slide-number">SLIDE 02 / O PROBLEMA</span>
                        <h4>Gargalos Operacionais</h4>
                        <p>Perda de tempo em processos manuais e altos custos de escala.</p>
                    </div>
                    <div class="slide-card">
                        <span class="slide-number">SLIDE 03 / A SOLUÇÃO</span>
                        <h4>Automação Inteligente</h4>
                        <p>Centralização de todas as ferramentas em uma única plataforma.</p>
                    </div>
                    <div class="slide-card">
                        <span class="slide-number">SLIDE 04 / RESULTADOS</span>
                        <h4>Retorno sobre Investimento (ROI)</h4>
                        <p>Aumento de 300% na eficiência com redução de 60% no tempo.</p>
                    </div>
                `;
                saveToCloud('slides', 'Apresentação de Slides', topic, 'Slides & Apresentações', null);
            }, 800);
        });
    }
};

// --- 11. CENTRAL DE ARQUIVOS (VISUAL EXPLORER UNIFICADO) ---
const saveToCloud = (type, title, prompt, originModule = 'Moura.ai', previewUrl = null, rawContent = null) => {
    const item = {
        id: 'cloud_' + Date.now(),
        type: type,
        title: title,
        prompt: prompt,
        origin: originModule,
        previewUrl: previewUrl,
        rawContent: rawContent,
        date: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    cloudItems.unshift(item);
    localStorage.setItem(STORAGE_CLOUD, JSON.stringify(cloudItems));
    updateCloudCount();
    renderVisualStorageGallery();
};

window.filterStorageItems = (type) => {
    currentStorageFilter = type;
    renderVisualStorageGallery();
};

const updateCloudCount = () => {
    const countBadge = document.getElementById('cloud-items-count');
    if (countBadge) countBadge.innerText = cloudItems.length;

    const totalAll = document.getElementById('stat-total-all');
    const totalImg = document.getElementById('stat-total-images');
    const totalVideos = document.getElementById('stat-total-videos');
    const totalSites = document.getElementById('stat-total-sites');
    const totalSlides = document.getElementById('stat-total-slides');

    if (totalAll) totalAll.innerText = cloudItems.length;
    if (totalImg) totalImg.innerText = cloudItems.filter(i => i.type === 'image' || i.type === 'cover').length;
    if (totalVideos) totalVideos.innerText = cloudItems.filter(i => i.type === 'video').length;
    if (totalSites) totalSites.innerText = cloudItems.filter(i => i.type === 'site').length;
    if (totalSlides) totalSlides.innerText = cloudItems.filter(i => i.type === 'slides').length;
};

const renderVisualStorageGallery = () => {
    const container = document.getElementById('storage-visual-gallery');
    if (!container) return;
    container.innerHTML = '';

    const itemsToRender = currentStorageFilter === 'all' 
        ? cloudItems 
        : cloudItems.filter(i => i.type === currentStorageFilter || (currentStorageFilter === 'image' && i.type === 'cover'));

    if (itemsToRender.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; color:var(--text-secondary);">
                <i class="ph ph-folder-dashed" style="font-size:48px; color:rgba(255,255,255,0.1); margin-bottom:12px; display:block;"></i>
                <h3>Nenhum arquivo encontrado nesta categoria</h3>
                <p style="font-size:13px; margin-top:4px;">Crie imagens, vídeos ou sites em qualquer aba que eles aparecerão aqui instantaneamente!</p>
            </div>
        `;
        return;
    }

    itemsToRender.forEach(item => {
        const card = document.createElement('div');
        card.className = 'storage-file-card';

        let previewHtml = '';
        let badgeClass = 'badge-type-text';
        let badgeText = item.type.toUpperCase();

        if (item.type === 'image' || item.type === 'cover') {
            badgeClass = 'badge-type-image';
            badgeText = 'IMAGEM 4K';
            const imgBg = item.previewUrl || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600';
            previewHtml = `
                <div class="storage-file-preview" style="background-image: url('${imgBg}');">
                    <span class="storage-type-badge ${badgeClass}"><i class="ph-fill ph-image"></i> ${badgeText}</span>
                </div>
            `;
        } else if (item.type === 'video') {
            badgeClass = 'badge-type-video';
            badgeText = 'VÍDEO 4K';
            const vidBg = item.previewUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600';
            previewHtml = `
                <div class="storage-file-preview" style="background-image: url('${vidBg}');">
                    <span class="storage-type-badge ${badgeClass}"><i class="ph-fill ph-video-camera"></i> ${badgeText}</span>
                    <i class="ph-fill ph-play-circle" style="font-size:44px; color:rgba(255,255,255,0.85);"></i>
                </div>
            `;
        } else if (item.type === 'site') {
            badgeClass = 'badge-type-site';
            badgeText = 'SITE WEB';
            previewHtml = `
                <div class="storage-file-preview" style="background:linear-gradient(135deg,#030712,#1e1b4b);">
                    <span class="storage-type-badge ${badgeClass}"><i class="ph-fill ph-browsers"></i> ${badgeText}</span>
                    <i class="ph-fill ph-code" style="font-size:48px; color:var(--cyan);"></i>
                </div>
            `;
        } else if (item.type === 'slides') {
            badgeClass = 'badge-type-slides';
            badgeText = 'SLIDES';
            previewHtml = `
                <div class="storage-file-preview" style="background:linear-gradient(135deg,#064e3b,#022c22);">
                    <span class="storage-type-badge ${badgeClass}"><i class="ph-fill ph-presentation"></i> ${badgeText}</span>
                    <i class="ph-fill ph-presentation-chart" style="font-size:48px; color:var(--emerald);"></i>
                </div>
            `;
        } else {
            previewHtml = `
                <div class="storage-file-preview" style="background:linear-gradient(135deg,#180828,#3b0764);">
                    <span class="storage-type-badge badge-type-text"><i class="ph-fill ph-file-text"></i> TEXTO / IA</span>
                    <i class="ph-fill ph-chat-centered-text" style="font-size:48px; color:#c084fc;"></i>
                </div>
            `;
        }

        card.innerHTML = `
            ${previewHtml}
            <div class="storage-file-info">
                <div class="storage-file-title">${item.title}</div>
                <div class="storage-file-prompt">${item.prompt}</div>
                <div class="storage-file-meta">
                    <span><i class="ph ph-map-pin"></i> ${item.origin}</span>
                    <span>${item.date}</span>
                </div>
                <div class="storage-card-actions">
                    <button class="btn-card-action" onclick="copyText('${item.prompt}')" title="Copiar Prompt"><i class="ph ph-copy"></i> Copiar</button>
                    <button class="btn-card-action" onclick="viewFileDetails('${item.id}')" title="Visualizar Criação"><i class="ph ph-eye"></i> Visualizar</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
};

window.viewFileDetails = (id) => {
    const item = cloudItems.find(i => i.id === id);
    if (!item) return;

    if (item.type === 'site') {
        document.querySelector('[data-target="page-sites"]').click();
        if (item.rawContent) updateSiteFrame(item.rawContent);
    } else if (item.type === 'image') {
        document.querySelector('[data-target="page-image-gen"]').click();
    } else if (item.type === 'video') {
        document.querySelector('[data-target="page-video-gen"]').click();
    } else {
        alert(`📄 Detalhes da Criação:\n\nTítulo: ${item.title}\nOrigem: ${item.origin}\nData: ${item.date}\n\nPrompt/Conteúdo:\n${item.prompt}`);
    }
};

window.copyText = (txt) => {
    navigator.clipboard.writeText(txt);
    alert('Conteúdo copiado com sucesso!');
};

window.clearAllStorage = () => {
    if (confirm('Deseja limpar todos os itens da galeria de Meus Arquivos?')) {
        cloudItems = [];
        localStorage.removeItem(STORAGE_CLOUD);
        updateCloudCount();
        renderVisualStorageGallery();
    }
};

// --- 12. CONFIGURAÇÕES & SALVAMENTO DE CONTA ---
const setupSettingsPage = () => {
    const nameInput = document.getElementById('setting-user-name');
    const emailInput = document.getElementById('setting-user-email');

    const savedName = localStorage.getItem(STORAGE_USER_NAME);
    const savedEmail = localStorage.getItem(STORAGE_USER_EMAIL);

    if (savedName && nameInput) nameInput.value = savedName;
    if (savedEmail && emailInput) emailInput.value = savedEmail;
};

window.saveAccountSettings = () => {
    const name = document.getElementById('setting-user-name').value;
    const email = document.getElementById('setting-user-email').value;

    localStorage.setItem(STORAGE_USER_NAME, name);
    localStorage.setItem(STORAGE_USER_EMAIL, email);

    updateTierUI(currentTier);
    alert('✅ Dados da conta e preferências salvas com sucesso na Moura.ai!');
};

// Iniciar ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupCoversGenerator();
});
