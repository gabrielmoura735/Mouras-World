// ==========================================================================
// STATE MANAGEMENT & CONSTANTS
// ==========================================================================

const SABORES = [
    { id: 'coxinha', name: 'Coxinha', desc: 'Massa cremosa de batata recheada com frango desfiado temperado com ervas.' },
    { id: 'bolinho_queijo', name: 'Bolinho de Queijo', desc: 'Massa leve recheada com queijo muçarela derretido e um toque de orégano.' },
    { id: 'bolinho_carne', name: 'Bolinho de Carne', desc: 'Delicioso recheio de carne moída selecionada com temperos especiais da casa.' },
    { id: 'kibe', name: 'Kibe', desc: 'Trigo para kibe temperado com hortelã fresca e carne moída suculenta.' },
    { id: 'risole_presunto_queijo', name: 'Risole Presunto c/ Queijo', desc: 'Massa fofinha com recheio clássico de presunto e queijo derretido.' },
    { id: 'enroladinho_salsicha', name: 'Enroladinho de Salsicha', desc: 'Salsicha selecionada envolta em uma massa macia e crocante.' }
];

const PRECOS = {
    cento: {
        30: { frito: 54.90, congelado: 44.90 },
        60: { frito: 94.90, congelado: 84.90 },
        90: { frito: 134.90, congelado: 124.90 }
    }
};

// Global App State
let appState = {
    currentProductType: 'cento', // 'cento' or 'grande'
    currentPreparo: 'frito',      // 'frito' or 'congelado'
    centoDraft: {},               // Temporary counts for the cento builder: { saborId: count }
    cart: []                      // Items in the cart
};

// Initialize draft counts
function resetCentoDraft() {
    SABORES.forEach(sabor => {
        appState.centoDraft[sabor.id] = 0;
    });
}
resetCentoDraft();

// ==========================================================================
// DOM RENDERING FUNCTIONS
// ==========================================================================

// Calculate total selected in the Cento draft builder
function getCentoDraftTotal() {
    return Object.values(appState.centoDraft).reduce((sum, val) => sum + val, 0);
}

// Render the Cento Builder interface
function renderCentoBuilder() {
    const grid = document.getElementById('cento-sabores-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const totalSelected = getCentoDraftTotal();
    
    SABORES.forEach(sabor => {
        const qty = appState.centoDraft[sabor.id] || 0;
        const card = document.createElement('div');
        card.className = `sabor-item ${qty > 0 ? 'selected' : ''}`;
        
        card.innerHTML = `
            <div class="sabor-info">
                <h4>${sabor.name}</h4>
                <p class="sabor-desc">${sabor.desc}</p>
            </div>
            <div class="sabor-controls">
                <span class="sabor-price">Mini Salgado</span>
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateCentoDraftCount('${sabor.id}', -1)" ${qty <= 0 ? 'disabled' : ''}>-</button>
                    <span class="qty-val">${qty}</span>
                    <button class="qty-btn" onclick="updateCentoDraftCount('${sabor.id}', 1)" ${totalSelected >= 100 ? 'disabled' : ''}>+</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Update progress bar and counter
    const progress = document.getElementById('cento-progress');
    const counterText = document.getElementById('cento-selected-count');
    const addBtn = document.getElementById('add-cento-btn');
    
    if (progress) progress.style.width = `${totalSelected}%`;
    if (counterText) counterText.textContent = totalSelected;
    
    // Enable Add button only if exactly 100 units are selected
    if (addBtn) {
        addBtn.disabled = totalSelected !== 100;
        if (totalSelected === 100) {
            addBtn.classList.add('pulse-active');
        } else {
            addBtn.classList.remove('pulse-active');
        }
    }
}

// Render the Grande Builder interface
function renderGrandeBuilder() {
    const grid = document.getElementById('grande-sabores-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const price = PRECOS.grande[appState.currentPreparo];
    
    SABORES.forEach(sabor => {
        // Find if this specific item is already added to cart to show quantity, 
        // or just let them add directly. For "grande", we put controls directly in the card that updates the cart instantly!
        const cartItem = appState.cart.find(item => 
            item.type === 'grande' && 
            item.saborId === sabor.id && 
            item.preparo === appState.currentPreparo
        );
        const qty = cartItem ? cartItem.qty : 0;
        
        const card = document.createElement('div');
        card.className = `sabor-item ${qty > 0 ? 'selected' : ''}`;
        
        card.innerHTML = `
            <div class="sabor-info">
                <h4>${sabor.name} Grande</h4>
                <p class="sabor-desc">${sabor.desc}</p>
            </div>
            <div class="sabor-controls">
                <span class="sabor-price">R$ ${price.toFixed(2).replace('.', ',')} / un.</span>
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateGrandeCartCount('${sabor.id}', -1)" ${qty <= 0 ? 'disabled' : ''}>-</button>
                    <span class="qty-val">${qty}</span>
                    <button class="qty-btn" onclick="updateGrandeCartCount('${sabor.id}', 1)">+</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Render the price banner callout
function updatePriceBanner() {
    const categoryTitle = document.getElementById('current-category-title');
    const prepTitle = document.getElementById('current-prep-title');
    const priceValue = document.getElementById('current-price-value');
    
    if (!categoryTitle || !prepTitle || !priceValue) return;
    
    const preparoText = appState.currentPreparo === 'frito' ? 'Frito na Hora' : 'Congelado';
    prepTitle.textContent = preparoText;
    
    if (appState.currentProductType === 'cento') {
        categoryTitle.textContent = 'Cento de Salgados (100 unidades)';
        const price = PRECOS.cento[appState.currentPreparo];
        priceValue.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
    } else {
        categoryTitle.textContent = 'Salgado Grande (Lanche Individual)';
        const price = PRECOS.grande[appState.currentPreparo];
        priceValue.textContent = `R$ ${price.toFixed(2).replace('.', ',')} / un.`;
    }
}

// ==========================================================================
// CONTROLLERS & ACTIONS
// ==========================================================================

// Switch tabs: Cento vs Grande
window.setProductType = function(type) {
    appState.currentProductType = type;
    
    const tabCento = document.getElementById('tab-cento');
    const tabGrande = document.getElementById('tab-grande');
    const centoBuilder = document.getElementById('cento-builder');
    const grandeBuilder = document.getElementById('grande-builder');
    
    if (type === 'cento') {
        tabCento.classList.add('active');
        tabGrande.classList.remove('active');
        centoBuilder.classList.add('active');
        grandeBuilder.classList.remove('active');
    } else {
        tabCento.classList.remove('active');
        tabGrande.classList.add('active');
        centoBuilder.classList.remove('active');
        grandeBuilder.classList.add('active');
    }
    
    updatePriceBanner();
    renderCentoBuilder();
    renderGrandeBuilder();
};

// Switch preparation option: Frito vs Congelado
window.setPreparo = function(preparo) {
    appState.currentPreparo = preparo;
    
    const btnFrito = document.getElementById('prep-frito');
    const btnCongelado = document.getElementById('prep-congelado');
    
    if (preparo === 'frito') {
        btnFrito.classList.add('active');
        btnCongelado.classList.remove('active');
    } else {
        btnFrito.classList.remove('active');
        btnCongelado.classList.add('active');
    }
    
    updatePriceBanner();
    renderCentoBuilder();
    renderGrandeBuilder();
};

// Update temporary count in the Cento Builder
window.updateCentoDraftCount = function(saborId, change) {
    const totalSelected = getCentoDraftTotal();
    const currentQty = appState.centoDraft[saborId] || 0;
    
    if (change > 0 && totalSelected >= 100) return; // Cap at 100
    if (change < 0 && currentQty <= 0) return;       // Floor at 0
    
    appState.centoDraft[saborId] = currentQty + change;
    renderCentoBuilder();
};

// Automatically distribute the 100 units of a cento equally among all 6 flavors
window.autoDistributeCento = function() {
    resetCentoDraft();
    const numSabores = SABORES.length;
    const base = Math.floor(100 / numSabores); // 16 units each
    let remainder = 100 - (base * numSabores);  // 4 units remaining
    
    SABORES.forEach((sabor, index) => {
        appState.centoDraft[sabor.id] = base;
        // Distribute remaining units to the first few flavors (Coxinha gets first extra)
        if (index < remainder) {
            appState.centoDraft[sabor.id] += 1;
        }
    });
    
    renderCentoBuilder();
};

// Add the configured Cento to the main cart
window.addCentoToCart = function() {
    const totalSelected = getCentoDraftTotal();
    if (totalSelected !== 100) return;
    
    // Build breakdown summary of chosen flavors
    const breakdown = {};
    SABORES.forEach(sabor => {
        const qty = appState.centoDraft[sabor.id];
        if (qty > 0) {
            breakdown[sabor.name] = qty;
        }
    });
    
    const price = PRECOS.cento[appState.currentPreparo];
    
    // Add to cart
    appState.cart.push({
        id: 'cento_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: 'cento',
        preparo: appState.currentPreparo,
        price: price,
        breakdown: breakdown
    });
    
    // Reset draft and UI
    resetCentoDraft();
    renderCentoBuilder();
    updateCartUI();
    
    // Visual Notification / Toast
    showFloatingMessage("Cento de Salgados adicionado ao carrinho!");
};

// Update Grande Salgado count directly in the cart
window.updateGrandeCartCount = function(saborId, change) {
    const sabor = SABORES.find(s => s.id === saborId);
    if (!sabor) return;
    
    const preparo = appState.currentPreparo;
    const price = PRECOS.grande[preparo];
    
    // Find index
    const index = appState.cart.findIndex(item => 
        item.type === 'grande' && 
        item.saborId === saborId && 
        item.preparo === preparo
    );
    
    if (index > -1) {
        const item = appState.cart[index];
        const newQty = item.qty + change;
        
        if (newQty <= 0) {
            appState.cart.splice(index, 1);
        } else {
            item.qty = newQty;
        }
    } else if (change > 0) {
        appState.cart.push({
            id: 'grande_' + saborId + '_' + preparo,
            type: 'grande',
            saborId: saborId,
            saborName: sabor.name,
            preparo: preparo,
            qty: 1,
            price: price
        });
    }
    
    renderGrandeBuilder();
    updateCartUI();
};

// Remove any item from cart by its unique ID
window.removeCartItem = function(id) {
    appState.cart = appState.cart.filter(item => item.id !== id);
    updateCartUI();
    renderGrandeBuilder();
};

// ==========================================================================
// CART & CHECKOUT LOGIC
// ==========================================================================

// Slide Cart sidebar in/out
window.toggleCart = function() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
};

// Show temporary floating confirmation messages
function showFloatingMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Add custom styling class in head dynamically if needed, or rely on style.css
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Calculate totals and render cart list
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const checkoutSection = document.getElementById('checkout-section');
    
    if (!cartItems || !cartCount) return;
    
    // Compute total items and price
    let totalItems = 0;
    let subtotal = 0;
    
    appState.cart.forEach(item => {
        if (item.type === 'cento') {
            totalItems += 1;
            subtotal += item.price;
        } else {
            totalItems += item.qty;
            subtotal += item.price * item.qty;
        }
    });
    
    // Update floating badge
    cartCount.textContent = totalItems;
    
    if (appState.cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-basket-shopping"></i>
                <p>Seu carrinho está vazio. Adicione alguns salgados para começar!</p>
            </div>
        `;
        if (checkoutSection) checkoutSection.style.display = 'none';
        return;
    }
    
    // Render Items
    cartItems.innerHTML = '';
    appState.cart.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'cart-item';
        
        const preparoText = item.preparo === 'frito' ? 'Frito' : 'Congelado';
        
        if (item.type === 'cento') {
            // Render Cento details
            const flavorsList = Object.entries(item.breakdown)
                .map(([name, qty]) => `${qty} ${name}`)
                .join(', ');
                
            itemCard.innerHTML = `
                <div class="cart-item-header">
                    <span class="cart-item-title">1 Cento de Salgados (${preparoText})</span>
                    <button class="cart-item-remove" onclick="removeCartItem('${item.id}')">Excluir</button>
                </div>
                <div class="cart-item-details">
                    <strong>Sabores:</strong> ${flavorsList}
                </div>
                <div class="cart-item-footer">
                    <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
        } else {
            // Render Grande details
            const itemTotal = item.price * item.qty;
            itemCard.innerHTML = `
                <div class="cart-item-header">
                    <span class="cart-item-title">${item.qty}x ${item.saborName} Grande (${preparoText})</span>
                    <button class="cart-item-remove" onclick="removeCartItem('${item.id}')">Excluir</button>
                </div>
                <div class="cart-item-details">
                    Salgado tamanho lanche individual
                </div>
                <div class="cart-item-footer">
                    <div class="qty-control" style="background-color: var(--white); transform: scale(0.9);">
                        <button class="qty-btn" onclick="updateGrandeCartCount('${item.saborId}', -1)">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="updateGrandeCartCount('${item.saborId}', 1)">+</button>
                    </div>
                    <span class="cart-item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
        }
        cartItems.appendChild(itemCard);
    });
    
    // Update Checkout section totals
    if (checkoutSection) {
        checkoutSection.style.display = 'block';
        
        document.getElementById('summary-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        
        const method = document.getElementById('delivery-method').value;
        const deliveryText = method === 'entrega' ? 'A consultar' : 'Grátis';
        document.getElementById('summary-delivery').textContent = deliveryText;
        
        document.getElementById('summary-total').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
}

// Toggle delivery address / pickup time inputs based on checkout selector
window.handleDeliveryChange = function() {
    const method = document.getElementById('delivery-method').value;
    const deliveryFields = document.getElementById('delivery-fields');
    const retiradaFields = document.getElementById('retirada-fields');
    
    const deliveryAddress = document.getElementById('delivery-address');
    const pickupTime = document.getElementById('pickup-time');
    
    if (method === 'entrega') {
        deliveryFields.style.display = 'block';
        retiradaFields.style.display = 'none';
        
        if (deliveryAddress) deliveryAddress.required = true;
        if (pickupTime) pickupTime.required = false;
    } else {
        deliveryFields.style.display = 'none';
        retiradaFields.style.display = 'block';
        
        if (deliveryAddress) deliveryAddress.required = false;
        if (pickupTime) pickupTime.required = true;
    }
    
    updateCartUI();
};

// Show troco (cash change) input if Payment method is Dinheiro
window.handlePaymentChange = function() {
    const payment = document.getElementById('payment-method').value;
    const changeField = document.getElementById('change-field');
    const cashChange = document.getElementById('cash-change');
    
    if (payment === 'dinheiro') {
        changeField.style.display = 'block';
        if (cashChange) cashChange.required = true;
    } else {
        changeField.style.display = 'none';
        if (cashChange) cashChange.required = false;
    }
};

// ==========================================================================
// WHATSAPP SUBMIT FLOW
// ==========================================================================

window.sendToWhatsApp = function(phoneNum) {
    const clientName = document.getElementById('client-name').value.trim();
    const deliveryMethod = document.getElementById('delivery-method').value;
    const address = document.getElementById('delivery-address').value.trim();
    const pickupTime = document.getElementById('pickup-time').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const cashChange = document.getElementById('cash-change').value.trim();
    const orderNotes = document.getElementById('order-notes').value.trim();
    
    // Check validation
    if (!clientName) {
        alert("Por favor, preencha o seu nome.");
        document.getElementById('client-name').focus();
        return;
    }
    
    if (deliveryMethod === 'entrega' && !address) {
        alert("Por favor, preencha o endereço de entrega.");
        document.getElementById('delivery-address').focus();
        return;
    }
    
    if (deliveryMethod === 'retirada' && !pickupTime) {
        alert("Por favor, preencha o horário aproximado de retirada.");
        document.getElementById('pickup-time').focus();
        return;
    }
    
    if (paymentMethod === 'dinheiro' && !cashChange) {
        alert("Por favor, informe se precisa de troco.");
        document.getElementById('cash-change').focus();
        return;
    }
    
    // Start formatting the text message
    let text = `*NOVO PEDIDO - LÉPORE SALGADOS* 🥟✨\n\n`;
    text += `👤 *Cliente:* ${clientName}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    let subtotal = 0;
    
    // Cart details
    appState.cart.forEach((item, index) => {
        const preparoText = item.preparo === 'frito' ? 'Frito' : 'Congelado';
        
        if (item.type === 'cento') {
            text += `*${index + 1}. Cento de Salgados (${preparoText})*\n`;
            Object.entries(item.breakdown).forEach(([flavor, qty]) => {
                text += `  • ${qty}x ${flavor}\n`;
            });
            text += `  └ Price: R$ ${item.price.toFixed(2).replace('.', ',')}\n\n`;
            subtotal += item.price;
        } else {
            const itemTotal = item.price * item.qty;
            text += `*${index + 1}. ${item.qty}x ${item.saborName} Grande (${preparoText})*\n`;
            text += `  └ Preço: R$ ${itemTotal.toFixed(2).replace('.', ',')}\n\n`;
            subtotal += itemTotal;
        }
    });
    
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    
    // Delivery Details
    if (deliveryMethod === 'entrega') {
        text += `🛵 *Entrega em Domicílio*\n`;
        text += `📍 *Endereço:* ${address}\n`;
    } else {
        text += `🏪 *Retirada no Local*\n`;
        text += `⏰ *Horário:* ${pickupTime}h\n`;
    }
    
    text += `\n💳 *Pagamento:* `;
    if (paymentMethod === 'pix') {
        text += `Pix`;
    } else if (paymentMethod === 'dinheiro') {
        text += `Dinheiro (Troco: ${cashChange})`;
    } else if (paymentMethod === 'cartao_credito') {
        text += `Cartão de Crédito`;
    } else {
        text += `Cartão de Débito`;
    }
    
    if (orderNotes) {
        text += `\n\n📝 *Observações:* ${orderNotes}`;
    }
    
    text += `\n\n💵 *Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    if (deliveryMethod === 'entrega') {
        text += `🚚 *Taxa de Entrega:* A combinar/consultar\n`;
    } else {
        text += `🚚 *Taxa de Entrega:* Grátis (Retirada)\n`;
    }
    text += `*TOTAL ESTIMADO:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
    text += `_Pedido gerado pelo site oficial da Lépore Salgados_`;
    
    // Encode for URL
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/5511${phoneNum}?text=${encodedText}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
};

// ==========================================================================
// TOAST STYLE INJECTOR & ONLOAD INITIALIZER
// ==========================================================================

function injectToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .toast-message {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: var(--primary-dark);
            color: var(--white);
            padding: 12px 24px;
            border-radius: var(--radius-full);
            font-weight: 600;
            box-shadow: var(--shadow-lg);
            z-index: 999;
            opacity: 0;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
            pointer-events: none;
            border: 2px solid var(--secondary);
            font-size: 0.95rem;
            text-align: center;
            max-width: 90%;
        }
        .toast-message.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        .pulse-active {
            animation: pulse-border 1.5s infinite;
        }
        @keyframes pulse-border {
            0% { box-shadow: 0 0 0 0 rgba(214, 69, 39, 0.6); }
            70% { box-shadow: 0 0 0 10px rgba(214, 69, 39, 0); }
            100% { box-shadow: 0 0 0 0 rgba(214, 69, 39, 0); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    injectToastStyles();
    updatePriceBanner();
    renderCentoBuilder();
    renderGrandeBuilder();
    updateCartUI();
});
