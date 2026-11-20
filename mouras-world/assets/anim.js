/* ============================================================
   Mouras-World — animações compartilhadas (anim.js)
   - Revela cards de seção ao rolar (sem esconder o que já está visível)
   - Dá hover de elevação aos cards
   - Coloca brilho nos botões primários
   Seguro: se algo falhar, o conteúdo continua visível.
   ============================================================ */
(function () {
  // ===== Trava leve de acesso (só quem tem a senha vê) =====
  // Troque GATE_PASS pela senha que quiser. Falha "aberta": se der erro, nunca trava.
  var GATE_PASS = 'mouras';
  var GATE_KEY = 'mw_acesso_ok';
  function mountGate() {
    try {
      if (localStorage.getItem(GATE_KEY) === '1') return;
    } catch (e) { return; } // sem storage: não trava
    var ov = document.createElement('div');
    ov.setAttribute('style', 'position:fixed;inset:0;z-index:99999;background:#0A0612;display:flex;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui,sans-serif;');
    ov.innerHTML =
      '<div style="max-width:380px;width:100%;text-align:center;background:rgba(18,11,30,0.9);border:1px solid rgba(124,58,237,0.4);border-radius:20px;padding:34px 26px;box-shadow:0 0 40px rgba(124,58,237,0.25)">' +
        '<div style="font-size:42px;margin-bottom:10px">🔒</div>' +
        '<h2 style="font-family:Syne,Inter,sans-serif;font-weight:800;color:#fff;font-size:22px;margin:0 0 6px">Projeto privado</h2>' +
        '<p style="color:#94a3b8;font-size:13px;margin:0 0 18px">Conteúdo em desenvolvimento. Digite a senha pra ver. 💜</p>' +
        '<input id="mwGateInput" type="password" placeholder="Senha" autofocus style="width:100%;box-sizing:border-box;padding:13px 16px;border-radius:12px;background:#1A1030;border:1px solid #241A3A;color:#fff;font-size:14px;outline:none;margin-bottom:10px">' +
        '<div id="mwGateErr" style="color:#f87171;font-size:12px;height:16px;margin-bottom:8px"></div>' +
        '<button id="mwGateBtn" style="width:100%;padding:13px;border:0;border-radius:12px;background:linear-gradient(135deg,#7C3AED,#5B21B6);color:#fff;font-weight:800;font-size:15px;cursor:pointer">Entrar</button>' +
      '</div>';
    (document.body || document.documentElement).appendChild(ov);
    var input = ov.querySelector('#mwGateInput');
    var err = ov.querySelector('#mwGateErr');
    function tryOpen() {
      if ((input.value || '').trim().toLowerCase() === GATE_PASS) {
        try { localStorage.setItem(GATE_KEY, '1'); } catch (e) {}
        ov.style.transition = 'opacity .4s'; ov.style.opacity = '0';
        setTimeout(function () { ov.remove(); }, 400);
      } else {
        err.textContent = 'Senha incorreta — tenta de novo 🙂';
        input.value = ''; input.focus();
      }
    }
    ov.querySelector('#mwGateBtn').addEventListener('click', tryOpen);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryOpen(); });
    setTimeout(function () { try { input.focus(); } catch (e) {} }, 50);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', mountGate); } else { mountGate(); }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll(els) {
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || reduce) {
      els.forEach(function (e) { e.classList.remove('anim-prep'); e.classList.add('anim-in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('anim-in');
          en.target.classList.remove('anim-prep');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { obs.observe(e); });
  }

  function init() {
    var vh = window.innerHeight || 800;

    // 1) cards de seção: entrada ao rolar + hover de elevação
    var cards = Array.prototype.slice.call(document.querySelectorAll('section .glass-card'));
    var toReveal = [];
    cards.forEach(function (c) {
      if (c.closest('header')) return;                 // nunca o header fixo
      if (c.classList.contains('mw-lift')) { /* já tem */ } else { c.classList.add('mw-lift'); }
      if (c.classList.contains('reveal')) return;      // já é controlado pela própria página
      // só prepara (esconde) o que está bem abaixo da dobra
      var top = c.getBoundingClientRect().top;
      if (top > vh * 0.85) { c.classList.add('anim-prep'); toReveal.push(c); }
    });
    revealAll(toReveal);

    // 2) brilho nos botões/links primários (os com gradiente roxo)
    Array.prototype.slice.call(document.querySelectorAll('a,button')).forEach(function (b) {
      var cls = b.className && b.className.baseVal !== undefined ? b.className.baseVal : (b.className || '');
      if (typeof cls === 'string' && /from-brand-primary/.test(cls) && !/btn-shine/.test(cls)) {
        b.classList.add('btn-shine');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
