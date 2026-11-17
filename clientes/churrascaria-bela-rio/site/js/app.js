/* Churrascaria Bela Rio — animações. Sem GSAP ou com reduced-motion, a página fica inteira e estática. */
(function () {
  "use strict";

  // Header: blur ao rolar + menu mobile
  var header = document.getElementById("header");
  var toggle = document.getElementById("menuToggle");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll("#nav a").forEach(function (a) {
      a.addEventListener("click", function () { header.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); });
    });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  // Hero: título palavra por palavra, depois o resto
  var title = document.getElementById("heroTitle");
  if (title) {
    var words = title.textContent.trim().split(/\s+/);
    title.innerHTML = words.map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    gsap.from(".hero__title .w", { y: 46, opacity: 0, rotateX: -40, duration: .9, ease: "back.out(1.6)", stagger: .07, delay: .15 });
  }
  gsap.from(".reveal-hero", { y: 24, opacity: 0, duration: .8, ease: "power3.out", stagger: .12, delay: .7 });

  // Contadores
  function formatBR(n) { return n.toLocaleString("pt-BR"); }
  document.querySelectorAll(".count").forEach(function (el) {
    var to = parseInt(el.dataset.to, 10);
    var plain = el.dataset.plain === "1";
    var obj = { v: 0 };
    gsap.to(obj, {
      v: to, duration: 2, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: function () { el.textContent = plain ? Math.round(obj.v) : formatBR(Math.round(obj.v)); }
    });
  });

  // Revelações ao rolar
  gsap.utils.toArray(".reveal").forEach(function (el, i) {
    gsap.from(el, {
      y: 36, opacity: 0, duration: .8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      delay: (i % 4) * .06
    });
  });

  // Linha do tempo desenhando
  var tl = document.getElementById("timeline");
  if (tl) {
    var style = document.createElement("style");
    style.textContent = ".timeline::before{transform:scaleY(var(--sy,1))}";
    document.head.appendChild(style);
    var line = { sy: 0 };
    tl.style.setProperty("--sy", "0");
    gsap.to(line, { sy: 1, duration: 1.4, ease: "power2.inOut",
      scrollTrigger: { trigger: tl, start: "top 80%", once: true },
      onUpdate: function () { tl.style.setProperty("--sy", line.sy.toFixed(3)); } });
  }

  // Parallax leve nas fotos
  gsap.utils.toArray("[data-parallax]").forEach(function (img) {
    var amt = parseFloat(img.dataset.parallax) || -16;
    gsap.fromTo(img, { yPercent: -amt / 2, scale: 1.12 }, { yPercent: amt / 2, scale: 1.12, ease: "none",
      scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Cards entram em cascata um pouco mais marcada
  gsap.from(".card__ico", { scale: .4, rotate: -20, duration: .7, ease: "back.out(2)", stagger: .1,
    scrollTrigger: { trigger: ".cards", start: "top 80%", once: true } });

  // Avaliações: estrelas acendem
  gsap.utils.toArray(".review__stars").forEach(function (s) {
    gsap.from(s, { scale: .6, opacity: 0, duration: .5, ease: "back.out(3)",
      scrollTrigger: { trigger: s, start: "top 90%", once: true } });
  });
})();
