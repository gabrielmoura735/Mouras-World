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

const AVULSO_PRECOS = {
    coxinha: { 1: 2.50, 6: 14.00, 12: 26.00 },
    bolinho_queijo: { 1: 2.50, 6: 14.00, 12: 26.00 },
    bolinho_carne: { 1: 2.50, 6: 14.00, 12: 26.00 },
    kibe: { 1: 2.80, 6: 16.00, 12: 29.00 },
    risole_presunto_queijo: { 1: 2.80, 6: 16.00, 12: 29.00 },
    enroladinho_salsicha: { 1: 2.80, 6: 16.00, 12: 29.00 }
};

// Global App State
let appState = {
    currentProductType: 'cento', // 'cento' or 'grande'
    currentPreparo: 'frito',      // 'frito' or 'congelado'
    centoSize: 60,               // 30, 60, 90
    centoDraftQty: 1,             // Quantity of centos to add
    centoDraft: {},               // Temporary counts for the cento builder: { saborId: count }
    avulsoDraft: {                 // Selected portion size (1, 6, 12) for each flavor in the menu
        coxinha: 1,
        bolinho_queijo: 1,
        bolinho_carne: 1,
        kibe: 1,
        risole_presunto_queijo: 1,
        enroladinho_salsicha: 1
    },
    avulsoDraftQty: {              // Selected package quantity (1, 2, 3...) to add to cart
        coxinha: 1,
        bolinho_queijo: 1,
        bolinho_carne: 1,
        kibe: 1,
        risole_presunto_queijo: 1,
        enroladinho_salsicha: 1
    },
    cart: []                      // Items in the cart
};

// Initialize draft counts
function resetCentoDraft() {
    SABORES.forEach(sabor => {
        appState.centoDraft[sabor.id] = 0;
    });
}

// Autocomplete draft if not fully selected
function completeCentoDraft() {
    const total = getCentoDraftTotal();
    const target = appState.centoSize;
    if (total === target) return;
    
    const remainder = target - total;
    if (remainder <= 0) return;
    
    // Find flavors that have some selection
    const selectedFlavors = SABORES.filter(sabor => appState.centoDraft[sabor.id] > 0);
    if (selectedFlavors.length === 0) {
        // Distribute equally among all flavors
        const base = Math.floor(remainder / SABORES.length);
        let rem = remainder % SABORES.length;
        SABORES.forEach((sabor, index) => {
            appState.centoDraft[sabor.id] = base + (index < rem ? 1 : 0);
        });
    } else {
        // Distribute remainder among already selected flavors
        const base = Math.floor(remainder / selectedFlavors.length);
        let rem = remainder % selectedFlavors.length;
        selectedFlavors.forEach((sabor, index) => {
            appState.centoDraft[sabor.id] += base + (index < rem ? 1 : 0);
        });
    }
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
    
    SABORES.forEach(sabor => {
        const card = document.createElement('div');
        card.className = 'sabor-item-display';
        
        card.innerHTML = `
            <!-- Product Image -->
            <div class="sabor-img-container" style="width: 100%; height: 160px; overflow: hidden; border-radius: var(--radius-sm); margin-bottom: 12px; border: 1px solid var(--border-color);">
                <img src="assets/${sabor.id}.jpg" alt="${sabor.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="sabor-info" style="text-align: center;">
                <h4 style="font-size: 1.1rem; margin-bottom: 6px; color: var(--primary-dark); font-family: 'Playfair Display', serif;">${sabor.name}</h4>
                <p class="sabor-desc" style="font-size: 0.82rem; color: var(--text-muted); margin: 0; line-height: 1.4;">${sabor.desc}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Render the Grande/Avulso Builder interface (Displays only the catalog image)
function renderGrandeBuilder() {
    const grid = document.getElementById('grande-sabores-grid');
    if (!grid) return;
    grid.innerHTML = '';
}

// Render the price banner callout
function updatePriceBanner() {
    const categoryTitle = document.getElementById('current-category-title');
    const prepTitle = document.getElementById('current-prep-title');
    const priceValue = document.getElementById('current-price-value');
    
    // Update package card price tags dynamically
    [30, 60, 90].forEach(size => {
        const cardPriceEl = document.getElementById(`price-card-${size}`);
        if (cardPriceEl && PRECOS.cento[size]) {
            const price = PRECOS.cento[size][appState.currentPreparo];
            cardPriceEl.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
        }
    });
    
    if (!categoryTitle || !prepTitle || !priceValue) return;
    
    const preparoText = appState.currentPreparo === 'frito' ? 'Frito na Hora' : 'Congelado';
    prepTitle.textContent = preparoText;
    
    if (appState.currentProductType === 'cento') {
        const sizeText = appState.centoSize === 30 ? 'Kit 30 Unidades' : (appState.centoSize === 90 ? 'Kit 90 Unidades' : 'Kit 60 Unidades');
        categoryTitle.textContent = sizeText;
        const price = PRECOS.cento[appState.centoSize][appState.currentPreparo];
        priceValue.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
    } else {
        categoryTitle.textContent = 'Catálogo Oficial de Salgados';
        priceValue.textContent = 'Confira os salgados no catálogo';
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
    
    if (change > 0 && totalSelected >= appState.centoSize) return; // Cap at size
    if (change < 0 && currentQty <= 0) return;       // Floor at 0
    
    appState.centoDraft[saborId] = currentQty + change;
    renderCentoBuilder();
};

// Automatically distribute the units of a cento equally among all 6 flavors
window.autoDistributeCento = function() {
    resetCentoDraft();
    const numSabores = SABORES.length;
    const base = Math.floor(appState.centoSize / numSabores);
    let remainder = appState.centoSize - (base * numSabores);
    
    SABORES.forEach((sabor, index) => {
        appState.centoDraft[sabor.id] = base;
        if (index < remainder) {
            appState.centoDraft[sabor.id] += 1;
        }
    });
    
    renderCentoBuilder();
};

// Set package size of cento (50, 100, 150)
window.setCentoSize = function(size) {
    appState.centoSize = size;
    
    // Update active package card UI
    document.querySelectorAll('.cento-packages .package-card').forEach(card => {
        card.classList.remove('active');
    });
    const activeCard = document.getElementById(`package-${size}`);
    if (activeCard) activeCard.classList.add('active');
    
    resetCentoDraft();
    updatePriceBanner();
    renderCentoBuilder();
};

// Update draft cento qty to add to cart
window.updateCentoDraftQty = function(change) {
    const newQty = appState.centoDraftQty + change;
    if (newQty < 1) return;
    appState.centoDraftQty = newQty;
    
    const qtyEl = document.getElementById('cento-draft-qty');
    if (qtyEl) qtyEl.textContent = newQty;
};

// Add the configured Cento to the main cart
window.addCentoToCart = function() {
    // Auto-fill remainder if incomplete
    completeCentoDraft();
    
    const totalSelected = getCentoDraftTotal();
    if (totalSelected !== appState.centoSize) return;
    
    // Build breakdown summary of chosen flavors
    const breakdown = {};
    SABORES.forEach(sabor => {
        const qty = appState.centoDraft[sabor.id];
        if (qty > 0) {
            breakdown[sabor.name] = qty;
        }
    });
    
    const price = PRECOS.cento[appState.centoSize][appState.currentPreparo];
    
    // Add to cart
    appState.cart.push({
        id: 'cento_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        type: 'cento',
        centoSize: appState.centoSize,
        preparo: appState.currentPreparo,
        price: price,
        qty: appState.centoDraftQty,
        breakdown: breakdown
    });
    
    // Reset draft and UI
    resetCentoDraft();
    appState.centoDraftQty = 1;
    const qtyEl = document.getElementById('cento-draft-qty');
    if (qtyEl) qtyEl.textContent = 1;
    
    renderCentoBuilder();
    updateCartUI();
    openCart();
    
    // Visual Notification / Toast
    showFloatingMessage("Cento de Salgados adicionado ao carrinho!");
};

// Set portion size for an avulso flavor card draft
window.setAvulsoDraftPortion = function(saborId, portion) {
    appState.avulsoDraft[saborId] = portion;
    renderGrandeBuilder();
};

// Increment or decrement draft quantity to add to cart
window.updateAvulsoDraftQty = function(saborId, change) {
    const currentQty = appState.avulsoDraftQty[saborId] || 1;
    const newQty = currentQty + change;
    if (newQty < 1) return;
    appState.avulsoDraftQty[saborId] = newQty;
    renderGrandeBuilder();
};

// Add avulso portion to cart
window.addAvulsoToCart = function(saborId) {
    const sabor = SABORES.find(s => s.id === saborId);
    if (!sabor) return;
    
    const portion = appState.avulsoDraft[saborId] || 1;
    const qty = appState.avulsoDraftQty[saborId] || 1;
    const price = AVULSO_PRECOS[saborId][portion];
    const preparo = appState.currentPreparo;
    
    // Find index in cart
    const index = appState.cart.findIndex(item => 
        item.type === 'avulso' && 
        item.saborId === saborId && 
        item.portion === portion && 
        item.preparo === preparo
    );
    
    if (index > -1) {
        appState.cart[index].qty += qty;
    } else {
        appState.cart.push({
            id: 'avulso_' + saborId + '_' + portion + '_' + preparo,
            type: 'avulso',
            saborId: saborId,
            saborName: sabor.name,
            portion: portion,
            qty: qty,
            price: price,
            preparo: preparo
        });
    }
    
    // Reset draft quantity
    appState.avulsoDraftQty[saborId] = 1;
    
    renderGrandeBuilder();
    updateCartUI();
    openCart();
    showFloatingMessage(`${qty}x porção de ${portion} un. de ${sabor.name} adicionada!`);
};

// Increment or decrement avulso quantity inside the cart
window.updateAvulsoCartCount = function(id, change) {
    const index = appState.cart.findIndex(item => item.id === id);
    if (index > -1) {
        const item = appState.cart[index];
        const newQty = item.qty + change;
        
        if (newQty <= 0) {
            appState.cart.splice(index, 1);
        } else {
            item.qty = newQty;
        }
        updateCartUI();
        renderGrandeBuilder();
    }
};

// Remove any item from cart by its unique ID
window.removeCartItem = function(id) {
    appState.cart = appState.cart.filter(item => item.id !== id);
    updateCartUI();
    renderGrandeBuilder();
};

// Increment or decrement Cento quantity inside the cart
window.updateCentoCartCount = function(id, change) {
    const index = appState.cart.findIndex(item => item.id === id);
    if (index > -1) {
        const item = appState.cart[index];
        const newQty = (item.qty || 1) + change;
        if (newQty <= 0) {
            appState.cart.splice(index, 1);
        } else {
            item.qty = newQty;
        }
        updateCartUI();
    }
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

// Open Cart sidebar explicitly
window.openCart = function() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && !sidebar.classList.contains('active')) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }
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
            totalItems += (item.qty || 1);
            subtotal += item.price * (item.qty || 1);
        } else if (item.type === 'avulso') {
            totalItems += item.qty;
            subtotal += item.price * item.qty;
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
                
            const centoQty = item.qty || 1;
            const itemTotal = item.price * centoQty;
            const sizeText = item.centoSize === 30 ? 'Kit 30 Unidades' : (item.centoSize === 90 ? 'Kit 90 Unidades' : 'Kit 60 Unidades');
                
            itemCard.innerHTML = `
                <div class="cart-item-header">
                    <span class="cart-item-title">${centoQty}x ${sizeText} (${preparoText})</span>
                    <button class="cart-item-remove" onclick="removeCartItem('${item.id}')">Excluir</button>
                </div>
                <div class="cart-item-details">
                    <strong>Sabores:</strong> ${flavorsList}
                </div>
                <div class="cart-item-footer">
                    <div class="qty-control" style="background-color: var(--white); transform: scale(0.9);">
                        <button class="qty-btn" onclick="updateCentoCartCount('${item.id}', -1)">-</button>
                        <span class="qty-val">${centoQty}</span>
                        <button class="qty-btn" onclick="updateCentoCartCount('${item.id}', 1)">+</button>
                    </div>
                    <span class="cart-item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
        } else if (item.type === 'avulso') {
            // Render Avulso details
            const itemTotal = item.price * item.qty;
            itemCard.innerHTML = `
                <div class="cart-item-header">
                    <span class="cart-item-title">${item.qty}x ${item.saborName} (${item.portion} un. - ${preparoText})</span>
                    <button class="cart-item-remove" onclick="removeCartItem('${item.id}')">Excluir</button>
                </div>
                <div class="cart-item-details">
                    Porção de salgados avulsos
                </div>
                <div class="cart-item-footer">
                    <div class="qty-control" style="background-color: var(--white); transform: scale(0.9);">
                        <button class="qty-btn" onclick="updateAvulsoCartCount('${item.id}', -1)">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="updateAvulsoCartCount('${item.id}', 1)">+</button>
                    </div>
                    <span class="cart-item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
        } else {
            // Fallback for old grande
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
                        <span class="qty-val">${item.qty}</span>
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
            const sizeText = item.centoSize === 30 ? 'Kit 30 Unidades' : (item.centoSize === 90 ? 'Kit 90 Unidades' : 'Kit 60 Unidades');
            const qty = item.qty || 1;
            const itemTotal = item.price * qty;
            
            text += `*${index + 1}. ${qty}x ${sizeText} (${preparoText})*\n`;
            Object.entries(item.breakdown).forEach(([flavor, qtyVal]) => {
                text += `  • ${qtyVal}x ${flavor}\n`;
            });
            text += `  └ Preço: R$ ${itemTotal.toFixed(2).replace('.', ',')}\n\n`;
            subtotal += itemTotal;
        } else if (item.type === 'avulso') {
            const itemTotal = item.price * item.qty;
            text += `*${index + 1}. ${item.qty}x ${item.saborName} - Porção de ${item.portion} un. (${preparoText})*\n`;
            text += `  └ Preço: R$ ${itemTotal.toFixed(2).replace('.', ',')}\n\n`;
            subtotal += itemTotal;
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
