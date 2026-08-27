// Estado Global da Aplicação
let transactions = JSON.parse(localStorage.getItem('@LPoreFinancas:transactions')) || [];
let monthlyGoal = parseFloat(localStorage.getItem('@LPoreFinancas:goal')) || 0;
let plans = JSON.parse(localStorage.getItem('@LPoreFinancas:plans')) || [];
let savingsGoal = JSON.parse(localStorage.getItem('@LPoreFinancas:savingsGoal')) || { amount: 0, date: '' };
let savingsDeposits = JSON.parse(localStorage.getItem('@LPoreFinancas:savingsDeposits')) || [];

// Elementos - Dashboard
const expenseAmount = document.getElementById('expense-amount');
const transactionsList = document.getElementById('transactions-list');
const emptyState = document.getElementById('empty-state');
const form = document.getElementById('transaction-form');
const currentDateEl = document.getElementById('current-date');
const pageTitle = document.getElementById('page-title');

// Elementos - Navegação SPA
const navItems = document.querySelectorAll('.nav-item');
const pageSections = document.querySelectorAll('.page-section');

const filterBtns = document.querySelectorAll('.filter-btn');
const statMaxExpense = document.getElementById('stat-max-expense');
const statAvgExpense = document.getElementById('stat-avg-expense');
const exportBtn = document.getElementById('export-btn');
let currentReportFilter = 'all';

// Elementos - Form Tabs
const tabExpense = document.getElementById('tab-expense');
const tabIncome = document.getElementById('tab-income');
const transType = document.getElementById('trans-type');
const groupCategory = document.getElementById('group-category');
const groupPlatform = document.getElementById('group-platform');
const submitTransBtn = document.getElementById('submit-trans-btn');
const descLabel = document.getElementById('desc-label');

if (tabExpense && tabIncome) {
    tabExpense.addEventListener('click', () => {
        transType.value = 'expense';
        tabExpense.style.background = 'var(--danger)';
        tabExpense.style.color = 'white';
        tabIncome.style.background = 'transparent';
        tabIncome.style.color = 'var(--text-secondary)';
        groupCategory.style.display = 'block';
        groupPlatform.style.display = 'none';
        submitTransBtn.style.background = 'var(--danger)';
        submitTransBtn.textContent = 'Registrar Gasto';
        descLabel.textContent = 'Descrição do Gasto';
    });

    tabIncome.addEventListener('click', () => {
        transType.value = 'income';
        tabIncome.style.background = 'var(--success)';
        tabIncome.style.color = 'white';
        tabExpense.style.background = 'transparent';
        tabExpense.style.color = 'var(--text-secondary)';
        groupCategory.style.display = 'none';
        groupPlatform.style.display = 'block';
        submitTransBtn.style.background = 'var(--success)';
        submitTransBtn.textContent = 'Registrar Ganho/Venda';
        descLabel.textContent = 'Descrição do Ganho';
    });
}

// Elementos - Tema e Score
const themeToggle = document.getElementById('theme-toggle');

// Elementos - Metas
const goalForm = document.getElementById('goal-form');
const goalInput = document.getElementById('monthly-goal');
const currentGoalDisplay = document.getElementById('current-goal-display');
const goalRemainingText = document.getElementById('goal-remaining-text');
const goalProgress = document.getElementById('goal-progress');
const removeGoalBtn = document.getElementById('remove-goal-btn');

// Elementos - Planejamento
const planForm = document.getElementById('plan-form');
const planInput = document.getElementById('plan-desc');
const planList = document.getElementById('plan-list');

// Elementos - Economias
const savingsSetupForm = document.getElementById('savings-setup-form');
const savingsTargetAmount = document.getElementById('savings-target-amount');
const savingsTargetDate = document.getElementById('savings-target-date');
const savingsDepositForm = document.getElementById('savings-deposit-form');
const savingsDepositAmount = document.getElementById('savings-deposit-amount');
const savingsDisplayTitle = document.getElementById('savings-display-title');
const savingsDisplayMath = document.getElementById('savings-display-math');
const savingsProgress = document.getElementById('savings-progress');
const savingsCurrentAmount = document.getElementById('savings-current-amount');
const savingsTargetDisplay = document.getElementById('savings-target-display');
const savingsList = document.getElementById('savings-list');

// Elementos - Chat IA
const aiFab = document.getElementById('ai-fab');
const aiChatWindow = document.getElementById('ai-chat-window');
const closeChatBtn = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('ai-chat-messages');


// --- UTILITÁRIOS ---
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

const updateCurrentDate = () => {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let formattedDate = now.toLocaleDateString('pt-BR', options);
    currentDateEl.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

// --- NAVEGAÇÃO SPA ---
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Atualiza botões
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Atualiza seções
        const targetId = item.getAttribute('data-target');
        pageSections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        
        // Atualiza Título
        pageTitle.textContent = item.querySelector('span').textContent;

        // Se abriu relatórios, desenha o gráfico
        if (targetId === 'reports') {
            renderChart();
        }
    });
});

// --- TRANSAÇÕES (Apenas Gastos) ---
const addTransaction = (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value.trim();
    const type = document.getElementById('trans-type').value;
    const category = type === 'expense' ? document.getElementById('category').value : document.getElementById('platform').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!description || isNaN(amount) || amount <= 0) return;

    const transaction = { id: Date.now().toString(), description, category, amount, type, date: new Date().toISOString() };
    transactions.push(transaction);
    
    updateLocalStorage();
    updateUI();
    
    form.reset();
    document.getElementById('description').focus();
    
    // IA proativa se ultrapassar meta
    checkGoalStatusAfterTransaction();
};

const removeTransaction = (id) => {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    updateUI();
};

const updateLocalStorage = () => {
    localStorage.setItem('@LPoreFinancas:transactions', JSON.stringify(transactions));
    localStorage.setItem('@LPoreFinancas:goal', monthlyGoal);
    localStorage.setItem('@LPoreFinancas:plans', JSON.stringify(plans));
    localStorage.setItem('@LPoreFinancas:savingsGoal', JSON.stringify(savingsGoal));
    localStorage.setItem('@LPoreFinancas:savingsDeposits', JSON.stringify(savingsDeposits));
};

const renderTransactions = () => {
    transactionsList.innerHTML = '';
    if (transactions.length === 0) {
        emptyState.classList.add('active');
        return;
    }
    emptyState.classList.remove('active');
    
    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    sorted.forEach(transaction => {
        const transactionEl = document.createElement('div');
        transactionEl.classList.add('transaction-item');
        transactionEl.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-icon ${transaction.type}">
                    <i class="ph ${transaction.type === 'expense' ? 'ph-arrow-down' : 'ph-arrow-up'}"></i>
                </div>
                <div class="transaction-details">
                    <h3 style="display:flex; align-items:center; gap:8px;">${transaction.description} <span style="font-size:11px; padding:2px 6px; background:var(--border-color); border-radius:4px; font-weight:500;">${transaction.category || 'Outros'}</span></h3>
                    <p>${formatDate(transaction.date)}</p>
                </div>
            </div>
            <div class="transaction-actions">
                <span class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'expense' ? '-' : '+'} ${formatCurrency(transaction.amount)}
                </span>
                <button class="delete-btn" onclick="removeTransaction('${transaction.id}')"><i class="ph ph-trash"></i></button>
            </div>
        `;
        transactionsList.appendChild(transactionEl);
    });
};

const getTotals = () => {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
};

const balanceAmount = document.getElementById('balance-amount');
const yieldAmount = document.getElementById('yield-amount');
const incomeAmount = document.getElementById('income-amount');

const updateDashboard = () => {
    const { totalIncome, totalExpense, balance } = getTotals();
    
    if(expenseAmount) expenseAmount.textContent = formatCurrency(totalExpense);
    if(incomeAmount) incomeAmount.textContent = formatCurrency(totalIncome);
    if(balanceAmount) balanceAmount.textContent = formatCurrency(balance);

    // Calcular Rendimento Simulado (Nubank Style)
    // Supor rendimento de 0.05% ao dia sobre o saldo
    if(yieldAmount) {
        if(balance > 0) {
            // Simulando um mini rendimento
            const simulatedYield = balance * 0.0005;
            yieldAmount.textContent = '+ ' + formatCurrency(simulatedYield);
        } else {
            yieldAmount.textContent = '+ R$ 0,00';
        }
    }
};

// --- GRÁFICOS E RELATÓRIOS ---
let barChartInstance = null;
let pieChartInstance = null;

// Obter transações filtradas por tempo
const getFilteredTransactions = () => {
    const now = new Date();
    return transactions.filter(t => {
        const tDate = new Date(t.date);
        if (currentReportFilter === 'month') {
            return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        } else if (currentReportFilter === 'week') {
            const diffTime = Math.abs(now - tDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays <= 7;
        }
        return true; // 'all'
    });
};

const updateReportsStats = (filteredList) => {
    if (!statMaxExpense) return;
    let maxExp = 0;
    let totalExp = 0;
    let datesWithExpenses = new Set();

    filteredList.forEach(t => {
        if (t.amount > maxExp) maxExp = t.amount;
        totalExp += t.amount;
        datesWithExpenses.add(t.date.split('T')[0]);
    });

    statMaxExpense.textContent = formatCurrency(maxExp);
    
    const days = datesWithExpenses.size > 0 ? datesWithExpenses.size : 1;
    statAvgExpense.textContent = formatCurrency(totalExp / days);
};

const renderChart = () => {
    const filtered = getFilteredTransactions();
    updateReportsStats(filtered);

    // Gráfico de Pizza (Categorias)
    const ctxPie = document.getElementById('pieChart');
    if(ctxPie) {
        const catGroup = {};
        filtered.forEach(t => {
            const cat = t.category || 'Outros';
            catGroup[cat] = (catGroup[cat] || 0) + t.amount;
        });
        
        const labels = Object.keys(catGroup);
        const data = Object.values(catGroup);
        const bgColors = ['#8b5cf6', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#ec4899', '#64748b'];

        if (pieChartInstance) pieChartInstance.destroy();
        pieChartInstance = new Chart(ctxPie.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: labels.length > 0 ? labels : ['Sem dados'],
                datasets: [{ data: data.length > 0 ? data : [1], backgroundColor: data.length > 0 ? bgColors : ['#e2e8f0'], borderWidth: 0 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
        });
    }

    // Preparar dados para Gráfico (Barras)
    const ctxBar = document.getElementById('barChart');
    if(ctxBar) {
        // Agrupar por data (YYYY-MM-DD)
        const grouped = {};
        filtered.forEach(t => {
            const dateStr = formatDate(t.date);
            if (!grouped[dateStr]) grouped[dateStr] = { out: 0 };
            grouped[dateStr].out += t.amount;
        });

        // Ordenar datas
        const labels = Object.keys(grouped).sort((a,b) => {
            const parseDate = str => {
                const parts = str.split(' de ');
                if(parts.length !== 3) return new Date();
                const months = { 'jan.': 0, 'fev.': 1, 'mar.': 2, 'abr.': 3, 'mai.': 4, 'jun.': 5, 'jul.': 6, 'ago.': 7, 'set.': 8, 'out.': 9, 'nov.': 10, 'dez.': 11 };
                return new Date(parts[2], months[parts[1]], parts[0]);
            };
            return parseDate(a) - parseDate(b);
        });
        
        const dataOut = labels.map(l => grouped[l].out);

        if (barChartInstance) barChartInstance.destroy();
        barChartInstance = new Chart(ctxBar.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels.length > 0 ? labels : ['Sem dados'],
                datasets: [
                    { label: 'Gastos', data: dataOut, backgroundColor: '#ef4444', borderRadius: 4 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
};

if (filterBtns) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentReportFilter = btn.getAttribute('data-filter');
            renderChart();
        });
    });
}

// --- METAS ---
const updateGoalsUI = () => {
    if (monthlyGoal <= 0) {
        currentGoalDisplay.textContent = "Nenhuma meta definida";
        goalRemainingText.textContent = "Defina um limite de gastos abaixo.";
        goalProgress.style.width = '0%';
        return;
    }

    currentGoalDisplay.textContent = `Limite: ${formatCurrency(monthlyGoal)}`;
    
    const { totalExpense } = getTotals();
    const remaining = monthlyGoal - totalExpense;
    const percentage = Math.min((totalExpense / monthlyGoal) * 100, 100);

    goalProgress.style.width = `${percentage}%`;
    goalProgress.className = 'progress-bar'; // reset
    
    if (percentage >= 100) {
        goalProgress.classList.add('danger');
        goalRemainingText.textContent = `Você ultrapassou seu limite em ${formatCurrency(Math.abs(remaining))}!`;
        goalRemainingText.style.color = 'var(--danger)';
    } else if (percentage >= 80) {
        goalProgress.classList.add('warning');
        goalRemainingText.textContent = `Cuidado! Resta apenas ${formatCurrency(remaining)} para gastar.`;
        goalRemainingText.style.color = '#f59e0b';
    } else {
        goalRemainingText.textContent = `Você ainda pode gastar ${formatCurrency(remaining)} esse mês.`;
        goalRemainingText.style.color = 'var(--text-secondary)';
    }
};

goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = parseFloat(goalInput.value);
    if (!isNaN(val) && val > 0) {
        monthlyGoal = val;
        updateLocalStorage();
        updateGoalsUI();
        goalInput.value = '';
        addAIMessage(`Excelente! Seu limite de gastos foi atualizado para ${formatCurrency(val)}.`);
    }
});

if (removeGoalBtn) {
    removeGoalBtn.addEventListener('click', () => {
        monthlyGoal = 0;
        updateLocalStorage();
        updateGoalsUI();
        goalInput.value = '';
        addAIMessage(`Ok! O seu limite de gastos foi removido. Você está livre, mas lembre-se de gastar com consciência!`);
    });
}

// Função global para os botões rápidos no HTML
window.setQuickGoal = (value) => {
    if (goalInput) goalInput.value = value;
    monthlyGoal = value;
    updateLocalStorage();
    updateGoalsUI();
    goalInput.value = '';
    addAIMessage(`Limite rápido ativado! Novo teto de gastos: ${formatCurrency(value)}.`);
};

const checkGoalStatusAfterTransaction = () => {
    if (monthlyGoal <= 0) return;
    const { totalExpense } = getTotals();
    const percentage = (totalExpense / monthlyGoal) * 100;
    
    if (percentage >= 100) {
        addAIMessage("⚠️ Alerta vermelho! Você acabou de ultrapassar seu limite de gastos deste mês.");
        if(!aiChatWindow.classList.contains('open')) aiFab.click();
    } else if (percentage >= 80) {
        addAIMessage("⚠️ Cuidado, você já atingiu mais de 80% do seu limite de gastos mensais.");
        if(!aiChatWindow.classList.contains('open')) aiFab.click();
    }
};

// --- PLANEJAMENTO ---
const renderPlans = () => {
    if (!planList) return;
    planList.innerHTML = '';
    plans.forEach(plan => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('transaction-item');
        itemEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                <input type="checkbox" ${plan.done ? 'checked' : ''} onchange="togglePlan('${plan.id}')" style="width: 18px; height: 18px; accent-color: #8b5cf6; cursor: pointer;">
                <h3 style="font-size: 15px; font-weight: 500; text-decoration: ${plan.done ? 'line-through' : 'none'}; color: ${plan.done ? 'var(--text-secondary)' : 'var(--text-primary)'}">${plan.text}</h3>
            </div>
            <button class="delete-btn" onclick="removePlan('${plan.id}')"><i class="ph ph-trash"></i></button>
        `;
        planList.appendChild(itemEl);
    });
};

if (planForm) {
    planForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = planInput.value.trim();
        if (text) {
            plans.push({ id: Date.now().toString(), text, done: false });
            updateLocalStorage();
            renderPlans();
            planInput.value = '';
        }
    });
}

const togglePlan = (id) => {
    const plan = plans.find(p => p.id === id);
    if (plan) {
        plan.done = !plan.done;
        updateLocalStorage();
        renderPlans();
    }
};

const removePlan = (id) => {
    plans = plans.filter(p => p.id !== id);
    updateLocalStorage();
    renderPlans();
};

// --- ECONOMIAS (POUPANÇA) ---
const updateSavingsUI = () => {
    if (!savingsList) return;
    
    // Atualiza Histórico
    savingsList.innerHTML = '';
    let totalSaved = 0;
    
    const sortedDeposits = [...savingsDeposits].sort((a, b) => new Date(b.date) - new Date(a.date));
    sortedDeposits.forEach(dep => {
        totalSaved += dep.amount;
        const el = document.createElement('div');
        el.style.display = 'flex';
        el.style.justifyContent = 'space-between';
        el.style.padding = '8px 0';
        el.style.borderBottom = '1px solid var(--border-color)';
        el.innerHTML = `
            <span style="color: var(--text-secondary); font-size: 14px;">${formatDate(dep.date)}</span>
            <span style="color: #10b981; font-weight: 600;">+ ${formatCurrency(dep.amount)}</span>
            <button onclick="removeDeposit('${dep.id}')" style="background:none; border:none; color:var(--danger); cursor:pointer;"><i class="ph ph-trash"></i></button>
        `;
        savingsList.appendChild(el);
    });

    if (savingsGoal.amount <= 0 || !savingsGoal.date) {
        savingsDisplayTitle.textContent = "Nenhum objetivo definido";
        savingsDisplayMath.textContent = "Preencha a data e o valor alvo acima para começarmos os cálculos.";
        savingsProgress.style.width = '0%';
        savingsCurrentAmount.textContent = `Guardado: ${formatCurrency(totalSaved)}`;
        savingsTargetDisplay.textContent = `Alvo: R$ 0,00`;
        return;
    }

    savingsDisplayTitle.textContent = `Objetivo: ${formatCurrency(savingsGoal.amount)}`;
    savingsTargetDisplay.textContent = `Alvo: ${formatCurrency(savingsGoal.amount)}`;
    savingsCurrentAmount.textContent = `Guardado: ${formatCurrency(totalSaved)}`;

    const percentage = Math.min((totalSaved / savingsGoal.amount) * 100, 100);
    savingsProgress.style.width = `${percentage}%`;

    // Matemática do tempo
    const now = new Date();
    const targetDate = new Date(savingsGoal.date);
    
    let monthsLeft = (targetDate.getFullYear() - now.getFullYear()) * 12;
    monthsLeft -= now.getMonth();
    monthsLeft += targetDate.getMonth();
    
    if (monthsLeft <= 0) monthsLeft = 1; // Para evitar divisão por 0 se for no mesmo mês

    const remainingAmount = savingsGoal.amount - totalSaved;

    if (remainingAmount <= 0) {
        savingsDisplayMath.textContent = "🎉 Parabéns! Você atingiu sua meta de poupança!";
        savingsDisplayMath.style.color = '#10b981';
    } else {
        const perMonth = remainingAmount / monthsLeft;
        savingsDisplayMath.textContent = `Faltam ${monthsLeft} meses. Você precisa guardar em média ${formatCurrency(perMonth)} por mês para atingir o objetivo!`;
        savingsDisplayMath.style.color = 'var(--text-secondary)';
    }
};

if (savingsSetupForm) {
    savingsSetupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        savingsGoal = {
            amount: parseFloat(savingsTargetAmount.value),
            date: savingsTargetDate.value
        };
        updateLocalStorage();
        updateSavingsUI();
        addAIMessage(`Excelente! Objetivo de economia atualizado para ${formatCurrency(savingsGoal.amount)}.`);
    });

    savingsDepositForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amt = parseFloat(savingsDepositAmount.value);
        if (!isNaN(amt) && amt > 0) {
            savingsDeposits.push({ id: Date.now().toString(), amount: amt, date: new Date().toISOString() });
            updateLocalStorage();
            updateSavingsUI();
            savingsDepositAmount.value = '';
            addAIMessage(`Boa! Você acabou de guardar mais ${formatCurrency(amt)} no seu cofrinho!`);
        }
    });
}

const removeDeposit = (id) => {
    savingsDeposits = savingsDeposits.filter(d => d.id !== id);
    updateLocalStorage();
    updateSavingsUI();
};


// --- ASSISTENTE IA ---
aiFab.addEventListener('click', () => {
    aiChatWindow.classList.toggle('open');
});

closeChatBtn.addEventListener('click', () => {
    aiChatWindow.classList.remove('open');
});

const addAIMessage = (text) => {
    const msg = document.createElement('div');
    msg.classList.add('message', 'ai-message');
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

const addUserMessage = (text) => {
    const msg = document.createElement('div');
    msg.classList.add('message', 'user-message');
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

const processAIResponse = (userText) => {
    const text = userText.toLowerCase();
    const { totalExpense } = getTotals();
    
    setTimeout(() => {
        if (text.includes('gasto') || text.includes('despesa') || text.includes('total')) {
            addAIMessage(`Até agora você gastou ${formatCurrency(totalExpense)}.`);
            if(monthlyGoal > 0) {
                const remaining = monthlyGoal - totalExpense;
                if(remaining > 0) addAIMessage(`Ainda restam ${formatCurrency(remaining)} do seu limite estabelecido.`);
            }
        } else if (text.includes('dica') || text.includes('ajuda')) {
            if (monthlyGoal > 0 && totalExpense > monthlyGoal * 0.8) {
                addAIMessage("Você está gastando quase todo o seu limite planejado. Seria bom tentar evitar compras não essenciais.");
            } else {
                addAIMessage("Tudo parece tranquilo no momento! Lembre-se de registrar cada pequeno gasto para manter o controle perfeito.");
            }
        } else {
            addAIMessage("Entendo melhor perguntas sobre seus 'gastos', 'limite' ou se você pedir uma 'dica' financeira.");
        }
    }, 600);
};

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    
    addUserMessage(text);
    chatInput.value = '';
    
    // Processa a resposta da IA
    processAIResponse(text);
});


if(exportBtn) {
    exportBtn.addEventListener('click', () => {
        let csv = "Data,Descricao,Categoria,Valor\n";
        transactions.forEach(t => {
            csv += `${t.date.split('T')[0]},${t.description},${t.category || 'Outros'},${t.amount}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historico_gastos.csv';
        a.click();
        addAIMessage("Pronto! O seu histórico de gastos foi exportado para uma planilha CSV.");
    });
}

if(themeToggle) {
    // Check saved theme
    if(localStorage.getItem('@LPoreFinancas:theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="ph ph-sun"></i> Modo Claro';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if(document.body.classList.contains('dark-theme')) {
            localStorage.setItem('@LPoreFinancas:theme', 'dark');
            themeToggle.innerHTML = '<i class="ph ph-sun"></i> Modo Claro';
        } else {
            localStorage.setItem('@LPoreFinancas:theme', 'light');
            themeToggle.innerHTML = '<i class="ph ph-moon"></i> Modo Escuro';
        }
        if(barChartInstance) renderChart();
    });
}

// --- LMS ACADEMY ---
const lmsCourses = [
    {
        id: 'c1',
        title: 'Gerenciador Financeiro Pessoal',
        tag: 'GESTÃO PESSOAL',
        color: 'var(--primary)',
        thumb: 'https://img.youtube.com/vi/aCg3mY1X7_4/mqdefault.jpg',
        desc: 'Assuma o controle total do seu dinheiro, organize suas contas e saia das dívidas de forma definitiva.',
        modules: [
            { title: 'Parte 1: O Diagnóstico', lessons: ['Como mapear todas as suas despesas', 'Onde seu dinheiro está vazando?', 'A mentalidade do Gerenciador de Sucesso', 'Cortando o que não importa'] },
            { title: 'Parte 2: O Método de Controle', lessons: ['A regra do 50-30-20 na prática', 'Como usar este app perfeitamente', 'Criando um orçamento realista', 'Sobrevivendo ao fim do mês'] },
            { title: 'Parte 3: Destruindo Dívidas', lessons: ['O método bola de neve', 'Como renegociar com o banco', 'Lidando com os juros do cartão', 'Protegendo seu nome no Serasa'] },
            { title: 'Parte 4: A Reserva Blindada', lessons: ['Calculando o valor ideal da reserva', 'Os melhores bancos para guardar', 'Mantendo o foco na meta', 'O que fazer em emergências reais'] },
            { title: 'Parte 5: O Próximo Nível', lessons: ['Como não voltar ao buraco', 'Automatizando seus pagamentos', 'Começando a sonhar com investimentos', 'Seu diploma de Gerenciador'] }
        ]
    },
    {
        id: 'c2',
        title: 'Gestor Financeiro Empresarial',
        tag: 'NEGÓCIOS',
        color: '#f59e0b',
        thumb: 'https://img.youtube.com/vi/bYtJj_z7ZzM/mqdefault.jpg',
        desc: 'Aprenda a administrar o caixa de uma empresa, entender fluxo de caixa e garantir o lucro do negócio.',
        modules: [
            { title: 'Parte 1: Os Pilares da Empresa', lessons: ['O papel vital do Gestor Financeiro', 'Separando a conta PF da PJ', 'O ciclo operacional da empresa', 'Entendendo o capital de giro'] },
            { title: 'Parte 2: Fluxo de Caixa Diário', lessons: ['Como registrar entradas e saídas', 'Contas a pagar vs Contas a receber', 'Conciliação bancária na prática', 'Evitando o furo de caixa'] },
            { title: 'Parte 3: Indicadores de Sucesso', lessons: ['Calculando o Ponto de Equilíbrio (Break-even)', 'Margem de Lucro e Markup', 'Lucratividade vs Rentabilidade', 'Como ler um DRE simplificado'] },
            { title: 'Parte 4: Precificação', lessons: ['Custos fixos e variáveis', 'Como precificar produtos físicos', 'Como precificar serviços', 'O impacto dos descontos'] },
            { title: 'Parte 5: Expansão e Crédito', lessons: ['Quando pegar empréstimos para crescer', 'Analisando o risco de crédito', 'Projetando o futuro da empresa', 'Relatórios essenciais para os donos'] }
        ]
    },
    {
        id: 'c3',
        title: 'Formação: Assistente Financeiro',
        tag: 'CARREIRA',
        color: '#10b981',
        thumb: 'https://img.youtube.com/vi/qYv2f61a1h4/mqdefault.jpg',
        desc: 'Domine as rotinas do setor financeiro e prepare-se para trabalhar na área administrativa de qualquer empresa.',
        modules: [
            { title: 'Parte 1: O Dia a Dia no Escritório', lessons: ['Quais as funções do Assistente?', 'Ferramentas de trabalho (Excel e ERPs)', 'Organização de documentos e notas', 'Postura profissional no setor'] },
            { title: 'Parte 2: Contas a Pagar', lessons: ['Lançamento de notas fiscais', 'Agendamento de boletos no banco', 'Lidando com fornecedores', 'Aprovação de pagamentos'] },
            { title: 'Parte 3: Contas a Receber', lessons: ['Emissão de boletos e notas fiscais', 'Baixa de pagamentos de clientes', 'O que é a régua de cobrança', 'Como cobrar clientes inadimplentes'] },
            { title: 'Parte 4: Tesouraria Básica', lessons: ['Controle do caixinha físico', 'Arquivamento de comprovantes', 'Conferência de extratos bancários', 'Comunicação com a contabilidade'] },
            { title: 'Parte 5: Crescimento Profissional', lessons: ['Como ser promovido a Analista', 'Habilidades mais valorizadas', 'Criando relatórios no Excel', 'Entrevistas para a área financeira'] }
        ]
    },
    {
        id: 'c4',
        title: 'Mestres do CDI e Renda Fixa',
        tag: 'INVESTIMENTOS',
        color: 'var(--success)',
        thumb: 'https://img.youtube.com/vi/H7ZtBf6lQ3E/mqdefault.jpg',
        desc: 'Tudo o que você precisa saber sobre o CDI, Selic, CDBs, LCI, LCA e como multiplicar seu dinheiro com segurança máxima.',
        modules: [
            { title: 'Parte 1: Decifrando o Economês', lessons: ['O que é a taxa Selic?', 'O que é o famoso CDI?', 'Como a inflação corrói seu dinheiro', 'Juros Simples vs Compostos'] },
            { title: 'Parte 2: A Morte da Poupança', lessons: ['Por que a poupança rende tão pouco?', 'Tributação e Aniversário da Poupança', 'Onde deixar a Reserva de Emergência?', 'Contas remuneradas (Nubank, etc)'] },
            { title: 'Parte 3: Títulos Privados', lessons: ['O que é um CDB e como funciona', 'LCI e LCA: O paraíso sem imposto', 'CDB 100% CDI vs Prefixado', 'O seguro do FGC'] },
            { title: 'Parte 4: Tesouro Direto', lessons: ['Tesouro Selic na prática', 'Tesouro IPCA+ e proteção inflacionária', 'Marcação a Mercado: Riscos e ganhos', 'Taxas da B3'] },
            { title: 'Parte 5: Montando sua Carteira', lessons: ['A regra dos prazos de vencimento', 'Diversificando em Renda Fixa', 'O impacto do Imposto de Renda regressivo', 'Acompanhando a rentabilidade'] }
        ]
    },
    {
        id: 'c5',
        title: 'Império Infoprodutos (Estilo Kiwify)',
        tag: 'VENDAS',
        color: '#8b5cf6',
        thumb: 'https://img.youtube.com/vi/bYtJj_z7ZzM/mqdefault.jpg',
        desc: 'O passo a passo para criar, embalar e vender e-books, cursos e PLRs nas maiores plataformas do mercado.',
        modules: [
            { title: 'Parte 1: Escolhendo o Produto', lessons: ['A mentalidade do infoprodutor', 'Nicho Black vs Nicho White', 'O que é um PLR de alta conversão?', 'Validando a dor do seu cliente'] },
            { title: 'Parte 2: Estrutura Plataforma', lessons: ['Como criar conta na Kiwify e Hotmart', 'Configurando sua primeira oferta', 'Estratégias de precificação', 'Cadastrando o produto passo a passo'] },
            { title: 'Parte 3: O Funil de Vendas', lessons: ['Criando a VSL (Video Sales Letter)', 'Copywriting: Escrevendo para vender', 'A estrutura da página de vendas perfeita', 'Configurando Order Bump e Upsell'] },
            { title: 'Parte 4: Tráfego e Anúncios', lessons: ['Facebook Ads para iniciantes', 'Criativos que chamam atenção', 'TikTok Ads orgânico', 'Como ler as métricas (CPA e ROI)'] },
            { title: 'Parte 5: Escala e Recuperação', lessons: ['Como recuperar boletos e Pix', 'Delegando o suporte ao cliente', 'Otimizando campanhas', 'Seus primeiros 10k online'] }
        ]
    },
    {
        id: 'c6',
        title: 'Psicologia do Dinheiro',
        tag: 'MINDSET',
        color: 'var(--danger)',
        thumb: 'https://img.youtube.com/vi/aCg3mY1X7_4/mqdefault.jpg',
        desc: 'Quebre suas crenças limitantes sobre o dinheiro e aprenda a pensar como os grandes milionários.',
        modules: [
            { title: 'Parte 1: Suas Crenças Ocultas', lessons: ['Dinheiro não traz felicidade?', 'Como seus pais moldaram sua carteira', 'O medo de enriquecer', 'A diferença entre ser rico e ser próspero'] },
            { title: 'Parte 2: Hábitos de Riqueza', lessons: ['Pague-se primeiro', 'O poder do ambiente', 'Consumismo vs Investimento', 'Minimalismo financeiro'] },
            { title: 'Parte 3: O Valor do Tempo', lessons: ['Por que seu salário não te fará rico', 'Escalabilidade do esforço', 'Ganhando tempo comprando sistemas', 'A falsa sensação de segurança'] },
            { title: 'Parte 4: Lidando com Perdas', lessons: ['A dor de perder dinheiro', 'Recuperação emocional pós-dívidas', 'Não misture emoção com a bolsa de valores', 'O estoicismo nas finanças'] },
            { title: 'Parte 5: O Mapa da Liberdade', lessons: ['Definindo o seu "Número" de liberdade', 'Como o dinheiro compra opções', 'Deixando um legado', 'O verdadeiro propósito da riqueza'] }
        ]
    }
];

const renderLMS = () => {
    const catalogEl = document.getElementById('lms-catalog');
    const detailEl = document.getElementById('lms-course-detail');
    const gridEl = document.getElementById('courses-grid');
    const backBtn = document.getElementById('lms-back-btn');
    
    if(!catalogEl || !gridEl) return;

    gridEl.innerHTML = '';
    lmsCourses.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        card.innerHTML = `
            <div style="height: 140px; background-color: #e2e8f0; background-image: url('${course.thumb}'); background-size: cover; background-position: center; border-bottom: 1px solid var(--border-color);"></div>
            <div style="padding: 20px;">
                <span style="font-size: 11px; font-weight: 700; color: ${course.color}; text-transform: uppercase; letter-spacing: 1px;">${course.tag}</span>
                <h4 style="font-size: 18px; margin: 8px 0; color: var(--text-primary);">${course.title}</h4>
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">${course.desc}</p>
            </div>
        `;
        card.addEventListener('click', () => openCourse(course));
        gridEl.appendChild(card);
    });

    backBtn.addEventListener('click', () => {
        detailEl.style.display = 'none';
        catalogEl.style.display = 'block';
    });

    const openCourse = (course) => {
        catalogEl.style.display = 'none';
        detailEl.style.display = 'block';

        const videoPlayer = document.getElementById('course-video-player');
        const iframe = document.getElementById('youtube-iframe');
        videoPlayer.style.display = 'none';
        iframe.src = '';

        document.getElementById('course-detail-thumb').style.backgroundImage = `url('${course.thumb}')`;
        document.getElementById('course-detail-tag').textContent = course.tag;
        document.getElementById('course-detail-tag').style.color = course.color;
        document.getElementById('course-detail-title').textContent = course.title;
        document.getElementById('course-detail-desc').textContent = course.desc;

        const modulesEl = document.getElementById('course-modules');
        modulesEl.innerHTML = '';
        
        // Extrai o ID do vídeo do thumbnail para usar como aula mockada
        const videoId = course.thumb.split('/vi/')[1].split('/')[0];

        course.modules.forEach((mod, modIdx) => {
            const modDiv = document.createElement('div');
            modDiv.classList.add('module-item');
            
            let lessonsHTML = '';
            mod.lessons.forEach((lesson, lessIdx) => {
                lessonsHTML += `
                    <button class="lesson-item" style="width: 100%; border: none; background: transparent; cursor: pointer; text-align: left;" onclick="window.playLesson('${videoId}')">
                        <div class="lesson-icon"><i class="ph-fill ph-play-circle"></i></div>
                        <div>
                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 2px;">Aula ${lessIdx + 1}</div>
                            <div style="font-weight: 500;">${lesson}</div>
                        </div>
                    </button>
                `;
            });

            modDiv.innerHTML = `
                <div class="module-header">
                    <span>${mod.title}</span>
                    <i class="ph ph-caret-down"></i>
                </div>
                <div class="module-content">
                    ${lessonsHTML}
                </div>
            `;

            modDiv.querySelector('.module-header').addEventListener('click', () => {
                modDiv.classList.toggle('active');
            });

            modulesEl.appendChild(modDiv);
        });
    };

    window.playLesson = (videoId) => {
        const videoPlayer = document.getElementById('course-video-player');
        const iframe = document.getElementById('youtube-iframe');
        videoPlayer.style.display = 'block';
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        // Scrolla para o video suavemente
        videoPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    window.openCourseById = (courseId) => {
        // Simula click no botão do menu lateral para abrir a sessão Academy
        const eduBtn = document.querySelector('.nav-item[data-target="education"]');
        if (eduBtn) eduBtn.click();
        
        const course = lmsCourses.find(c => c.id === courseId);
        if (course) openCourse(course);
    };
};

// --- INIT ---
const init = () => {
    renderTransactions();
    updateDashboard();
    updateGoalsUI();
    updateCurrentDate();
    updateUI();
    renderPlans();
    updateSavingsUI();
    renderLMS();
    form.addEventListener('submit', addTransaction);
    window.removeTransaction = removeTransaction;
    window.removePlan = removePlan;
    window.togglePlan = togglePlan;
    window.removeDeposit = removeDeposit;
};

init();
