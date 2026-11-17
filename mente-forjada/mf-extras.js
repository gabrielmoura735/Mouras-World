/**
 * MENTE FORJADA — Extras: Animações, Criador de Visuais, Mural
 */

// ==========================================================================
// 1. ANIMAÇÕES DE CARDS (stagger na renderização)
// ==========================================================================

function animateCardsEntrance() {
    const cards = document.querySelectorAll('#grid-principles .principle-card, #grid-user-principles .principle-card');
    cards.forEach((card, i) => {
        card.classList.remove('anim-enter');
        void card.offsetWidth; // reflow
        card.classList.add('anim-enter');
    });
}

// Hook na renderização existente: observar mudanças no grid
const _gridObserver = new MutationObserver(() => animateCardsEntrance());
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid-principles');
    if (grid) _gridObserver.observe(grid, { childList: true });
});

// ==========================================================================
// 2. TRANSIÇÃO SUAVE ENTRE ABAS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const pane = document.getElementById(targetId);
            if (pane) {
                pane.classList.remove('tab-active-anim');
                void pane.offsetWidth;
                pane.classList.add('tab-active-anim');
            }
        });
    });
});

// ==========================================================================
// 3. CRIADOR DE CARDS VISUAIS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const selectEl   = document.getElementById('visual-principle-select');
    const preview    = document.getElementById('visual-card-preview');
    const quoteEl    = document.getElementById('vcq-text');
    const authorEl   = document.getElementById('vcq-author');
    const btnRandom  = document.getElementById('btn-visual-random');
    const btnDl      = document.getElementById('btn-visual-download');
    const themesBtns = document.querySelectorAll('.btn-visual-theme');

    let currentTheme = 'gold';

    // Preencher select com princípios quando o array estiver disponível
    function populateVisualSelect() {
        if (!selectEl || typeof BASE_PRINCIPLES === 'undefined') return;
        selectEl.innerHTML = '';
        BASE_PRINCIPLES.forEach((p, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `${p.author} — ${p.quote.slice(0, 60)}...`;
            selectEl.appendChild(opt);
        });
        updateVisualPreview(0);
    }

    function updateVisualPreview(idx) {
        if (typeof BASE_PRINCIPLES === 'undefined') return;
        const p = BASE_PRINCIPLES[idx];
        if (!p) return;
        quoteEl.textContent  = `"${p.quote}"`;
        authorEl.textContent = `— ${p.author}`;
    }

    if (selectEl) {
        selectEl.addEventListener('change', () => updateVisualPreview(parseInt(selectEl.value)));
    }

    if (btnRandom) {
        btnRandom.addEventListener('click', () => {
            if (typeof BASE_PRINCIPLES === 'undefined') return;
            const idx = Math.floor(Math.random() * BASE_PRINCIPLES.length);
            if (selectEl) selectEl.value = idx;
            updateVisualPreview(idx);
        });
    }

    themesBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themesBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTheme = btn.dataset.vtheme;
            if (preview) {
                preview.className = `visual-card-output vtheme-${currentTheme}`;
            }
        });
    });

    // Download via Canvas
    if (btnDl) {
        btnDl.addEventListener('click', () => {
            if (!preview) return;
            const size = 1080;
            const canvas = document.createElement('canvas');
            canvas.width  = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            const themes = {
                gold:     { bg1: '#0d0a00', bg2: '#1f1600', accent: '#f5b73d', text: '#ffffff' },
                obsidian: { bg1: '#07080c', bg2: '#0f1118', accent: '#94a3b8', text: '#ffffff' },
                crimson:  { bg1: '#0d0000', bg2: '#1a0505', accent: '#ef4444', text: '#ffffff' },
                emerald:  { bg1: '#001209', bg2: '#001f10', accent: '#10b981', text: '#ffffff' },
            };
            const t = themes[currentTheme] || themes.gold;

            // Fundo gradient
            const grad = ctx.createLinearGradient(0, 0, size, size);
            grad.addColorStop(0, t.bg1);
            grad.addColorStop(1, t.bg2);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, size, size);

            // Linha de acento
            ctx.fillStyle = t.accent;
            ctx.fillRect(80, 160, 90, 5);

            // Marca
            ctx.font = 'bold 28px serif';
            ctx.fillStyle = t.accent;
            ctx.globalAlpha = 0.55;
            ctx.fillText('MENTE FORJADA', 80, 140);
            ctx.globalAlpha = 1;

            // Citação — quebrar texto
            const quote = quoteEl ? quoteEl.textContent : '"..."';
            ctx.font = 'bold 48px serif';
            ctx.fillStyle = t.text;
            wrapCanvasText(ctx, quote, 80, 230, size - 160, 68);

            // Autor
            const author = authorEl ? authorEl.textContent : '';
            ctx.font = '500 32px sans-serif';
            ctx.fillStyle = t.accent;
            ctx.fillText(author, 80, size - 100);

            // Download
            const link = document.createElement('a');
            link.download = 'mente-forjada-card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }

    // Inicializar select após DOM + scripts carregados
    setTimeout(populateVisualSelect, 500);
});

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const { width } = ctx.measureText(testLine);
        if (width > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

// ==========================================================================
// 4. MURAL DE PUBLICAÇÕES (localStorage)
// ==========================================================================

const MURAL_KEY = 'mf_mural_posts_v1';

function getMuralPosts() {
    try {
        return JSON.parse(localStorage.getItem(MURAL_KEY) || '[]');
    } catch { return []; }
}

function saveMuralPosts(posts) {
    try { localStorage.setItem(MURAL_KEY, JSON.stringify(posts)); } catch {}
}

function renderMuralFeed() {
    const feed = document.getElementById('mural-feed');
    if (!feed) return;
    const posts = getMuralPosts();

    if (posts.length === 0) {
        feed.innerHTML = `
            <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
                <i class="ph ph-newspaper" style="font-size: 2.5rem; display:block; margin-bottom: 12px;"></i>
                <p>Nenhuma publicação ainda. Seja o primeiro a compartilhar uma reflexão.</p>
            </div>`;
        return;
    }

    feed.innerHTML = posts.slice().reverse().map((post, i) => {
        const initial = (post.name || 'A').charAt(0).toUpperCase();
        return `
            <div class="mural-post-card">
                <div class="mural-post-header">
                    <div class="mural-avatar">${initial}</div>
                    <div class="mural-post-meta">
                        <span class="mural-post-name">${escapeHtml(post.name || 'Guerreiro Anônimo')}</span>
                        <span class="mural-post-date">${formatMuralDate(post.ts)}</span>
                    </div>
                </div>
                <div class="mural-post-text">${escapeHtml(post.text)}</div>
                <div class="mural-post-actions">
                    <button class="btn-mural-like ${post.liked ? 'liked' : ''}" data-post-idx="${posts.length - 1 - i}">
                        <i class="ph${post.liked ? '-fill' : ''} ph-heart"></i>
                        ${post.likes || 0} curtidas
                    </button>
                </div>
            </div>`;
    }).join('');

    // Likes
    feed.querySelectorAll('.btn-mural-like').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.postIdx);
            const posts = getMuralPosts();
            if (!posts[idx]) return;
            posts[idx].liked = !posts[idx].liked;
            posts[idx].likes = (posts[idx].likes || 0) + (posts[idx].liked ? 1 : -1);
            saveMuralPosts(posts);
            renderMuralFeed();
        });
    });
}

function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatMuralDate(ts) {
    if (!ts) return '';
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'agora mesmo';
    if (diff < 3600) return `há ${Math.floor(diff/60)} min`;
    if (diff < 86400) return `há ${Math.floor(diff/3600)}h`;
    return new Date(ts).toLocaleDateString('pt-BR');
}

document.addEventListener('DOMContentLoaded', () => {
    const btnPost = document.getElementById('btn-post-mural');
    const textEl  = document.getElementById('mural-text-input');
    const nameEl  = document.getElementById('mural-name-input');

    if (btnPost) {
        btnPost.addEventListener('click', () => {
            const text = textEl ? textEl.value.trim() : '';
            if (!text) return;
            const posts = getMuralPosts();
            posts.push({
                name: nameEl ? nameEl.value.trim() : '',
                text,
                ts: Date.now(),
                likes: 0,
                liked: false,
            });
            saveMuralPosts(posts);
            if (textEl) textEl.value = '';
            renderMuralFeed();
        });
    }

    // Renderizar ao abrir a aba
    document.querySelectorAll('.nav-tab-btn[data-target="tab-mural"]').forEach(btn => {
        btn.addEventListener('click', () => setTimeout(renderMuralFeed, 100));
    });

    renderMuralFeed();
});
