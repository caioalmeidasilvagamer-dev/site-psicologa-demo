/* ============================================================
   SVG Draw Animation — Psicóloga Premium | svg-draw.js v1.0
   Técnica: stroke-dashoffset via CSS transition + IntersectionObserver
   Padrão: módulo IIFE, zero dependências, respeita prefers-reduced-motion
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     UTILITÁRIO: detectar preferência de movimento reduzido
     ---------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ----------------------------------------------------------
     UTILITÁRIO: obter comprimento total de todos os <path>,
     <circle>, <line>, <polyline>, <polygon>, <rect> em um SVG.
     Retorna array com { el, length } para cada shape.
     ---------------------------------------------------------- */
  function getShapeLengths(svgEl) {
    var shapes = svgEl.querySelectorAll(
      'path, circle, line, polyline, polygon, ellipse, rect'
    );
    var result = [];
    shapes.forEach(function (shape) {
      var len = 0;
      try {
        len = shape.getTotalLength ? shape.getTotalLength() : 0;
      } catch (e) {
        len = 0;
      }
      if (len > 0) {
        result.push({ el: shape, length: len });
      }
    });
    return result;
  }

  /* ----------------------------------------------------------
     CORE: preparar um SVG para animação (set dasharray/dashoffset)
     ---------------------------------------------------------- */
  function prepareSvg(svgEl, animateInstantly) {
    var shapes = getShapeLengths(svgEl);
    shapes.forEach(function (item) {
      var len = item.length;
      item.el.style.strokeDasharray = len;
      item.el.style.strokeDashoffset = animateInstantly ? 0 : len;
      item.el.style.fillOpacity = '0'; // suprimir fill durante animação
    });
    return shapes;
  }

  /* ----------------------------------------------------------
     CORE: disparar animação (zerando o dashoffset via CSS)
     ---------------------------------------------------------- */
  function triggerDraw(svgEl, duration, delay) {
    var shapes = getShapeLengths(svgEl);
    shapes.forEach(function (item) {
      var d = typeof duration === 'number' ? duration : 1800;
      var dl = typeof delay === 'number' ? delay : 0;

      item.el.style.transition =
        'stroke-dashoffset ' + d + 'ms cubic-bezier(0.4, 0, 0.2, 1) ' + dl + 'ms';
      item.el.style.strokeDashoffset = '0';
    });
  }

  /* ----------------------------------------------------------
     MÓDULO 1: Hero Badges — desenhar ao montar a página
     Alvo: .apoio-icon (3 selos no hero)
     ---------------------------------------------------------- */
  function initHeroBadges() {
    var icons = document.querySelectorAll('.hero-apoio .apoio-icon');
    if (!icons.length) return;

    icons.forEach(function (icon, i) {
      if (prefersReducedMotion) {
        prepareSvg(icon, true);
        return;
      }
      prepareSvg(icon, false);
      // Delay escalonado: 400ms, 700ms, 1000ms
      setTimeout(function () {
        triggerDraw(icon, 1600, 0);
      }, 400 + i * 300);
    });
  }

  /* ----------------------------------------------------------
     MÓDULO 2: Cards de Especialidades — scroll trigger por card
     Alvo: .card .card-icone svg
     ---------------------------------------------------------- */
  function initEspecialidadesCards() {
    var cards = document.querySelectorAll('.cards-grid .card');
    if (!cards.length) return;

    if (prefersReducedMotion) {
      cards.forEach(function (card) {
        var svg = card.querySelector('.card-icone svg');
        if (svg) prepareSvg(svg, true);
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (card) {
        var svg = card.querySelector('.card-icone svg');
        if (svg) prepareSvg(svg, true);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var svg = entry.target.querySelector('.card-icone svg');
          if (svg) triggerDraw(svg, 1800, 150);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach(function (card) {
      var svg = card.querySelector('.card-icone svg');
      if (svg) {
        prepareSvg(svg, false);
        observer.observe(card);
      }
    });
  }

  /* ----------------------------------------------------------
     MÓDULO 3: Timeline — linha conectando etapas
     Estratégia: SVG overlay de linha desenhando conforme cada
     timeline-item entra na viewport. Criamos um SVG vertical
     inserido dentro de .timeline, e o stroke-dashoffset
     avança a cada item observado.
     ---------------------------------------------------------- */
  function initTimeline() {
    var timeline = document.querySelector('.timeline');
    var items = document.querySelectorAll('.timeline-item');
    var staticLine = document.querySelector('.timeline-line');
    if (!timeline || !items.length) return;

    // Ocultar a linha estática original — substituiremos pelo SVG animado
    if (staticLine) staticLine.style.opacity = '0';

    // Criar SVG da linha
    var svgNS = 'http://www.w3.org/2000/svg';
    var svgLine = document.createElementNS(svgNS, 'svg');
    svgLine.setAttribute('aria-hidden', 'true');
    svgLine.setAttribute('class', 'timeline-svg-line');

    var linePath = document.createElementNS(svgNS, 'line');
    linePath.setAttribute('stroke', 'currentColor');
    linePath.setAttribute('stroke-width', '2');
    linePath.setAttribute('stroke-linecap', 'round');
    svgLine.appendChild(linePath);
    timeline.insertBefore(svgLine, timeline.firstChild);

    // Função para recalcular dimensões e posição da linha
    function recalcLine() {
      var firstBadge = timeline.querySelector('.timeline-badge');
      var lastBadge  = timeline.querySelectorAll('.timeline-badge');
      lastBadge = lastBadge[lastBadge.length - 1];
      if (!firstBadge || !lastBadge) return;

      var timelineRect = timeline.getBoundingClientRect();
      var firstRect    = firstBadge.getBoundingClientRect();
      var lastRect     = lastBadge.getBoundingClientRect();

      // Posição relativa ao .timeline
      var scrollTop = window.scrollY;
      var tlTop     = timelineRect.top + scrollTop;

      var y1 = firstRect.top + scrollTop + firstRect.height / 2 - tlTop;
      var y2 = lastRect.top + scrollTop + lastRect.height / 2 - tlTop;
      var cx = firstRect.left + firstRect.width / 2 - timelineRect.left;

      svgLine.setAttribute('width', timeline.offsetWidth);
      svgLine.setAttribute('height', timeline.offsetHeight);
      svgLine.style.position = 'absolute';
      svgLine.style.top      = '0';
      svgLine.style.left     = '0';
      svgLine.style.pointerEvents = 'none';

      linePath.setAttribute('x1', cx);
      linePath.setAttribute('y1', y1);
      linePath.setAttribute('x2', cx);
      linePath.setAttribute('y2', y2);
    }

    // Esperar render completo antes de calcular
    setTimeout(recalcLine, 100);
    window.addEventListener('resize', recalcLine, { passive: true });

    if (prefersReducedMotion) {
      setTimeout(function () {
        recalcLine();
        // Mostrar linha inteira instantaneamente
        var totalLen = linePath.getTotalLength ? linePath.getTotalLength() : 400;
        linePath.style.strokeDasharray  = totalLen;
        linePath.style.strokeDashoffset = '0';
      }, 150);
      return;
    }

    // Preparar linha oculta
    setTimeout(function () {
      recalcLine();
      var totalLen = 0;
      try { totalLen = linePath.getTotalLength(); } catch (e) { totalLen = 400; }
      linePath.style.strokeDasharray  = totalLen;
      linePath.style.strokeDashoffset = totalLen;
    }, 150);

    // Observer por etapa: cada item avança o dash
    var drawn = 0;
    var total = items.length;

    var itemObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          drawn++;
          var progress = drawn / total;

          // Recalcular total length no momento certo (DOM estável)
          setTimeout(function () {
            var totalLen = 0;
            try { totalLen = linePath.getTotalLength(); } catch (e) { totalLen = 400; }
            var remaining = totalLen * (1 - progress);
            linePath.style.transition =
              'stroke-dashoffset 900ms cubic-bezier(0.4, 0, 0.2, 1)';
            linePath.style.strokeDashoffset = remaining;
          }, 80);

          itemObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    items.forEach(function (item) {
      itemObserver.observe(item);
    });
  }

  /* ----------------------------------------------------------
     MÓDULO 4: Diferenciais (Princípios Clínicos) — scroll trigger
     Alvo: .diferencial-card .diferencial-icon svg
     ---------------------------------------------------------- */
  function initDiferenciais() {
    var cards = document.querySelectorAll('.diferencial-card');
    if (!cards.length) return;

    if (prefersReducedMotion) {
      cards.forEach(function (card) {
        var svg = card.querySelector('.diferencial-icon svg');
        if (svg) prepareSvg(svg, true);
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (card) {
        var svg = card.querySelector('.diferencial-icon svg');
        if (svg) prepareSvg(svg, true);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var svg = entry.target.querySelector('.diferencial-icon svg');
          if (svg) triggerDraw(svg, 2000, 100);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach(function (card) {
      var svg = card.querySelector('.diferencial-icon svg');
      if (svg) {
        prepareSvg(svg, false);
        observer.observe(card);
      }
    });
  }

  /* ----------------------------------------------------------
     MÓDULO 5: CTA Final — pulso sutil no ícone do botão WhatsApp
     Não usa stroke-dashoffset (ícone é fill), mas aplica um
     pulso suave via classe CSS. Dispara UMA VEZ ao entrar na
     viewport, sem loop infinito.
     ---------------------------------------------------------- */
  function initCTAFinalPulso() {
    var ctaSection = document.querySelector('.agendamento');
    var btnWA      = ctaSection ? ctaSection.querySelector('.btn-whatsapp') : null;
    if (!btnWA) return;

    if (prefersReducedMotion) return;

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          // Adiciona classe de pulso — CSS faz 2 ciclos e para
          btnWA.classList.add('cta-pulse-anim');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(ctaSection);

    /* Também anima os trust-sinais SVGs da seção */
    var trustSinais = ctaSection.querySelectorAll('.trust-sinal svg');
    if (!trustSinais.length) return;

    var trustObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          trustSinais.forEach(function (svg, i) {
            prepareSvg(svg, false);
            triggerDraw(svg, 1500, 200 + i * 150);
          });
          trustObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    trustObserver.observe(ctaSection);
  }

  /* ----------------------------------------------------------
     INICIALIZAÇÃO — aguardar DOM ready
     ---------------------------------------------------------- */
  function init() {
    initHeroBadges();
    initEspecialidadesCards();
    initTimeline();
    initDiferenciais();
    initCTAFinalPulso();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
