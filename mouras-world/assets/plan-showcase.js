const plans = [
  {
    code: "free",
    name: "Essencial",
    duration: "Sem prazo, mediante aprovação",
    billing: "Sem cobrança",
    price: "Gratuito",
    count: 12,
    summary: "Aprenda, conheça as ferramentas e organize suas primeiras ideias.",
    calls: "1–2 sessões em grupo por fim de semana. O acesso depende de solicitação e aprovação.",
    limits: { ai: 3, content: 3, automation: 2, academy: 2, business: 2 },
  },
  {
    code: "six_months",
    name: "Pro",
    duration: "6 meses",
    billing: "Cobrança mensal",
    price: "R$ 39,90/mês · R$ 239,40 no período",
    count: 21,
    summary: "Mais opções para criar, estudar e testar rotinas.",
    calls: "1–2 sessões em grupo por fim de semana.",
    limits: { ai: 5, content: 5, automation: 4, academy: 4, business: 3 },
  },
  {
    code: "one_year",
    name: "Max",
    duration: "1 ano",
    billing: "Cobrança mensal",
    price: "R$ 59,90/mês · R$ 718,80 no período",
    count: 36,
    summary: "Mais recursos e calls agendadas para avançar em projetos.",
    calls: "Calls agendadas com o Gabriel.",
    limits: { ai: 8, content: 8, automation: 7, academy: 7, business: 6 },
  },
  {
    code: "lifetime",
    name: "Infinity",
    duration: "Acesso vitalício",
    billing: "Pagamento único",
    price: "R$ 1.497,00",
    count: 55,
    summary: "Acesso vitalício e maior seleção de recursos avançados.",
    calls: "Calls agendadas com o Gabriel.",
    limits: { ai: 12, content: 12, automation: 11, academy: 10, business: 10 },
  },
];

const categories = [
  {
    id: "ai",
    title: "IA e modelos",
    items: [
      ["Espaço de ferramentas de IA", "Um ponto de partida para conhecer os recursos de IA previstos."],
      ["Biblioteca de prompts", "Instruções organizadas para tarefas do dia a dia."],
      ["Organizador de ideias", "Ajuda visual para estruturar ideias e próximos passos."],
      ["Pesquisa assistida", "Apoio para reunir referências e organizar descobertas."],
      ["Resumo de conteúdos", "Demonstração de síntese de textos e materiais."],
      ["Escrita e revisão", "Apoio conceitual para rascunhos e revisão de textos."],
      ["Criador de prompts", "Modelos para personalizar instruções para diferentes tarefas."],
      ["Comparador de respostas", "Visualização prevista para comparar resultados de modelos."],
      ["Planejamento com IA", "Estruturação de objetivos e etapas em uma prévia guiada."],
      ["Fluxos com múltiplos modelos", "Conceito de uso de diferentes modelos em uma mesma rotina."],
      ["Assistência multimodal", "Prévia de tarefas que combinam texto e mídia."],
      ["Novos modelos no catálogo", "Espaço previsto para modelos adicionados futuramente."],
    ],
  },
  {
    id: "content",
    title: "Criação de conteúdo",
    items: [
      ["Ideias de conteúdo", "Pontos de partida para publicações e projetos."],
      ["Legendas e textos curtos", "Estruturas para textos de redes sociais."],
      ["Roteiros curtos", "Modelos de roteiro para vídeos e apresentações."],
      ["Calendário editorial", "Organização visual de temas e datas."],
      ["Posts para redes sociais", "Estruturas de publicação para diferentes canais."],
      ["Carrosséis de conteúdo", "Organização de ideias em sequências de slides."],
      ["Textos para ofertas e anúncios", "Rascunhos para apresentar produtos e serviços."],
      ["Artigos e newsletters", "Modelos para conteúdos mais completos."],
      ["Páginas de apresentação", "Estruturas para explicar uma ideia ou projeto."],
      ["Variações de criativos", "Alternativas visuais e textuais para uma mesma ideia."],
      ["Imagens em alta resolução", "Geração de imagens avançada prevista para o Infinity."],
      ["Vídeos em alta resolução", "Criação de vídeos avançada prevista para o Infinity."],
    ],
  },
  {
    id: "automation",
    title: "Automação e bots",
    items: [
      ["Checklists de fluxo", "Passos visuais para entender uma rotina automatizada."],
      ["Modelos de automação", "Exemplos editáveis planejados para tarefas recorrentes."],
      ["Bot de dúvidas frequentes", "Conceito de atendimento para perguntas comuns."],
      ["Bot de atendimento", "Prévia de um fluxo de conversa com etapas definidas."],
      ["Conexões entre ferramentas", "Exemplos de integrações previstas para a plataforma."],
      ["Fluxos de WhatsApp", "Demonstração visual de etapas de atendimento."],
      ["Acompanhamento de leads", "Rotinas previstas para organizar contatos e retornos."],
      ["Automação de conteúdo", "Exemplo de sequência de planejamento e publicação."],
      ["Rotinas com vários agentes", "Coordenação planejada entre agentes especializados."],
      ["Controles e permissões", "Definições previstas para limitar ações automatizadas."],
      ["Agentes personalizados", "Conceito de agentes configurados para tarefas específicas."],
    ],
  },
  {
    id: "academy",
    title: "Academy e aprendizado",
    items: [
      ["Trilha de IA para iniciantes", "Conteúdo introdutório para começar com clareza."],
      ["Aulas de prompts", "Exemplos práticos para escrever instruções melhores."],
      ["Projetos guiados", "Exercícios planejados para aprender fazendo."],
      ["Criação com IA", "Aulas previstas sobre usos criativos de IA."],
      ["Automação aplicada", "Conteúdo sobre rotinas e integrações."],
      ["Vendas e atendimento", "Materiais planejados para melhorar processos comerciais."],
      ["Biblioteca de aulas", "Área prevista para organizar os conteúdos publicados."],
      ["Workshops práticos", "Encontros temáticos planejados para praticar em grupo."],
      ["Trilhas avançadas", "Percursos previstos para quem quiser se aprofundar."],
      ["Novas trilhas", "Espaço para conteúdos futuros da Academy."],
    ],
  },
  {
    id: "business",
    title: "Organização e resultados",
    items: [
      ["Painel de projetos", "Visão planejada para organizar iniciativas em andamento."],
      ["Metas e progresso", "Acompanhamento visual de objetivos e etapas."],
      ["Organização de tarefas", "Lista prevista para priorizar atividades."],
      ["Cadastro de oportunidades", "Espaço planejado para registrar contatos e ideias."],
      ["Pipeline comercial", "Visão de etapas para acompanhar oportunidades."],
      ["Métricas de campanhas", "Painel previsto para reunir indicadores de campanhas."],
      ["Relatórios de atividades", "Resumo visual de ações e tarefas registradas."],
      ["Análise de resultados", "Organização de dados para apoiar decisões."],
      ["Painel personalizável", "Opções previstas para adaptar a área de trabalho."],
      ["Acompanhamento estratégico", "Espaço planejado para revisar prioridades e evolução."],
    ],
  },
];

const slides = [
  {
    src: "../assets/previews/ai-workspace.svg",
    alt: "Ilustração conceitual do espaço de ferramentas de IA",
    title: "IA e modelos",
    description: "Ideias, prompts e recursos de IA em uma área organizada.",
  },
  {
    src: "../assets/previews/content-studio.svg",
    alt: "Ilustração conceitual de um estúdio de criação de conteúdo",
    title: "Criação de conteúdo",
    description: "Planejamento visual para textos, posts e materiais.",
  },
  {
    src: "../assets/previews/automation-flow.svg",
    alt: "Ilustração conceitual de uma rotina com agentes e automações",
    title: "Automação e bots",
    description: "Fluxos e agentes apresentados em uma prévia visual.",
  },
  {
    src: "../assets/previews/academy-board.svg",
    alt: "Ilustração conceitual da área de aprendizado da Mouras Academy",
    title: "Academy e projetos",
    description: "Trilhas de aprendizado e projetos em um só lugar.",
  },
];

const picker = document.getElementById("plan-picker");
const progression = document.getElementById("plan-progression");
const preview = document.getElementById("plan-preview");
const list = document.getElementById("resource-list");
const image = document.getElementById("carousel-image");
const dots = document.getElementById("carousel-dots");
const progressionRange = document.getElementById("progression-range");
let selectedPlan = plans[0];
let activeSlide = 0;

function renderProgression() {
  progression.innerHTML = plans.map((plan, index) => {
    const previousPlan = plans[index - 1];
    const note = previousPlan
      ? `+${plan.count - previousPlan.count} em relação ao ${previousPlan.name}`
      : "Gratuito, mediante aprovação";
    const totalLabel = previousPlan ? "no total" : "recursos";
    const totalColor = index === plans.length - 1 ? "text-brand-accent" : "text-white";

    return `
      <li class="flex items-center justify-between gap-4 py-4 last:pb-0">
        <div>
          <p class="font-bold text-white">${plan.name}</p>
          <p class="mt-1 text-xs text-slate-500">${note}</p>
        </div>
        <p class="text-right"><span class="text-2xl font-black ${totalColor}">${plan.count}</span> <span class="text-xs text-slate-400">${totalLabel}</span></p>
      </li>
    `;
  }).join("");
  progressionRange.textContent = `${plans[0].count} a ${plans[plans.length - 1].count}`;
}

function renderPicker() {
  picker.innerHTML = plans.map((plan) => `
    <button type="button" class="plan-option min-h-44 rounded-xl p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent" data-plan-code="${plan.code}" aria-pressed="${plan.code === selectedPlan.code}" aria-controls="plan-preview">
      <span class="flex items-start justify-between gap-3">
        <span class="text-lg font-bold text-white">${plan.name}</span>
        <span class="text-right">
          <span class="block text-2xl font-black leading-none text-white">${plan.count}</span>
          <span class="mt-1 block text-[11px] font-semibold text-slate-400">recursos</span>
        </span>
      </span>
      <span class="mt-3 block text-sm leading-5 text-slate-300">${plan.summary}</span>
      <span class="mt-4 block border-t border-brand-border pt-3">
        <span class="block text-xs font-semibold text-white">${plan.billing} · ${plan.duration}</span>
        <span class="mt-1 block text-xs text-slate-400">${plan.price}</span>
      </span>
      <span class="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-brand-accent">Ver detalhes</span>
    </button>
  `).join("");
}

function renderResources() {
  let total = 0;
  list.innerHTML = categories.map((category) => {
    const items = category.items.slice(0, selectedPlan.limits[category.id]);
    total += items.length;
    return `
      <section class="border-t border-brand-border pt-4 first:border-t-0 first:pt-0" aria-labelledby="resource-category-${category.id}">
        <div class="flex items-center justify-between gap-3">
          <h5 id="resource-category-${category.id}" class="text-sm font-bold text-white">${category.title}</h5>
          <span class="text-xs font-semibold text-slate-500">${items.length} itens</span>
        </div>
        <ul class="mt-3 space-y-3">
          ${items.map(([title, description]) => `
            <li class="border-t border-brand-border/70 pt-3 first:border-t-0 first:pt-0">
              <p class="text-sm font-semibold text-brand-accent">${title}</p>
              <p class="mt-1 text-sm leading-5 text-slate-400">${description}</p>
            </li>
          `).join("")}
        </ul>
      </section>
    `;
  }).join("");

  if (total !== selectedPlan.count) {
    throw new Error(`O catálogo do plano ${selectedPlan.name} deveria conter ${selectedPlan.count} recursos, mas contém ${total}.`);
  }

  document.getElementById("selected-plan-count").textContent = total;
  document.getElementById("resource-list-count").textContent = `${total} itens`;
}

function renderCarousel() {
  const slide = slides[activeSlide];
  image.src = slide.src;
  image.alt = slide.alt;
  document.getElementById("carousel-title").textContent = slide.title;
  document.getElementById("carousel-description").textContent = slide.description;
  document.getElementById("carousel-position").textContent = `Imagem ${activeSlide + 1} de ${slides.length}`;
  document.getElementById("plan-carousel").setAttribute("aria-label", `Imagens conceituais do plano ${selectedPlan.name}`);
  dots.innerHTML = slides.map((item, index) => `
    <button type="button" class="carousel-dot min-h-11 min-w-11 rounded-full border border-brand-border text-xs font-bold text-slate-300 hover:border-brand-accent/60 hover:text-white" data-slide-index="${index}" aria-label="Ver imagem ${index + 1}: ${item.title}" aria-current="${index === activeSlide ? "true" : "false"}">${index + 1}</button>
  `).join("");
}

function renderPlan() {
  document.getElementById("selected-plan-name").textContent = selectedPlan.name;
  document.getElementById("selected-plan-summary").textContent = selectedPlan.summary;
  document.getElementById("selected-plan-term").textContent = `${selectedPlan.billing} · ${selectedPlan.duration}`;
  document.getElementById("selected-plan-price").textContent = selectedPlan.price;
  document.getElementById("selected-plan-calls").textContent = `${selectedPlan.calls} A agenda e o formato serão confirmados antes da contratação.`;
  renderPicker();
  renderResources();
  renderCarousel();
}

picker.addEventListener("click", (event) => {
  const button = event.target.closest("[data-plan-code]");
  if (!button) return;

  const nextPlan = plans.find((plan) => plan.code === button.dataset.planCode);
  if (!nextPlan) {
    throw new Error(`Plano não encontrado no catálogo: ${button.dataset.planCode}`);
  }

  selectedPlan = nextPlan;
  activeSlide = 0;
  renderPlan();
});

document.getElementById("carousel-prev").addEventListener("click", () => {
  activeSlide = (activeSlide - 1 + slides.length) % slides.length;
  renderCarousel();
});

document.getElementById("carousel-next").addEventListener("click", () => {
  activeSlide = (activeSlide + 1) % slides.length;
  renderCarousel();
});

dots.addEventListener("click", (event) => {
  const button = event.target.closest("[data-slide-index]");
  if (!button) return;

  activeSlide = Number(button.dataset.slideIndex);
  renderCarousel();
});

renderProgression();
renderPlan();
