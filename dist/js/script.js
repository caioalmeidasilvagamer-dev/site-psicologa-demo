/* ============================================================
   Landing Page — Psicóloga Premium | JavaScript v2.0
   Padrão: Clean Code, SOLID, acessibilidade WCAG 2.2 AA
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     UTILITÁRIOS INTERNOS
     ---------------------------------------------------------- */

  /**
   * Sanitiza uma string removendo caracteres perigosos para XSS.
   * @param {string} str
   * @returns {string}
   */
  function sanitize(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Verifica se um endereço de e-mail é válido.
   * @param {string} email
   * @returns {boolean}
   */
  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

  /**
   * Exibe ou oculta mensagem de erro acessível para um campo.
   * @param {HTMLElement} campo
   * @param {HTMLElement} erroEl
   * @param {string} mensagem
   */
  function setErro(campo, erroEl, mensagem) {
    campo.setAttribute('aria-invalid', 'true');
    if (erroEl) erroEl.textContent = mensagem;
  }

  /**
   * Remove estado de erro de um campo.
   * @param {HTMLElement} campo
   * @param {HTMLElement} erroEl
   */
  function limparErro(campo, erroEl) {
    campo.removeAttribute('aria-invalid');
    if (erroEl) erroEl.textContent = '';
  }


  /* ----------------------------------------------------------
     INICIALIZAÇÃO — Executar após DOM pronto
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', inicializar);

  function inicializar() {
    iniciarHeader();
    iniciarMenuMobile();
    iniciarScrollSuave();
    iniciarFAQ();
    iniciarAnimacoes();
    iniciarFormulario();
    iniciarMascaraTelefone();
    iniciarNavAtiva();
    iniciarBotaoTopo();
    iniciarCTAFlutuante();
    iniciarLGPD();
    inicializarLucide();
  }


  /* ----------------------------------------------------------
     HEADER — Efeito Scroll
     ---------------------------------------------------------- */
  function iniciarHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let rafId = null;

    function atualizarHeader() {
      if (window.scrollY > 32) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      rafId = null;
    }

    window.addEventListener('scroll', () => {
      if (!rafId) rafId = requestAnimationFrame(atualizarHeader);
    }, { passive: true });

    atualizarHeader();
  }


  /* ----------------------------------------------------------
     MENU MOBILE — Acessível (ARIA + Escape + Focus Trap)
     ---------------------------------------------------------- */
  function iniciarMenuMobile() {
    const toggle    = document.querySelector('#menu-toggle');
    const nav       = document.querySelector('#header-nav');
    const overlay   = document.querySelector('#menu-overlay');
    const body      = document.body;

    if (!toggle || !nav) return;

    function abrirMenu() {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('aberto');
      overlay?.classList.add('ativo');
      body.style.overflow = 'hidden';
      // Foco no primeiro link do menu
      const primeiroLink = nav.querySelector('a');
      primeiroLink?.focus();
    }

    function fecharMenu() {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('aberto');
      overlay?.classList.remove('ativo');
      body.style.overflow = '';
      toggle.focus();
    }

    toggle.addEventListener('click', () => {
      const estaAberto = toggle.getAttribute('aria-expanded') === 'true';
      estaAberto ? fecharMenu() : abrirMenu();
    });

    overlay?.addEventListener('click', fecharMenu);

    // Fechar com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('aberto')) {
        fecharMenu();
      }
    });

    // Fechar ao clicar em links internos
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('aberto')) fecharMenu();
      });
    });
  }


  /* ----------------------------------------------------------
     SCROLL SUAVE — Âncoras Internas
     ---------------------------------------------------------- */
  function iniciarScrollSuave() {
    const header = document.querySelector('.header');

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const alvo = document.querySelector(href);
        if (!alvo) return;

        e.preventDefault();

        const headerH = header ? header.offsetHeight : 72;
        const topo = alvo.getBoundingClientRect().top + window.scrollY - headerH - 12;

        window.scrollTo({ top: topo, behavior: 'smooth' });

        // Acessibilidade: mover foco para o elemento de destino
        alvo.setAttribute('tabindex', '-1');
        alvo.focus({ preventScroll: true });
      });
    });
  }


  /* ----------------------------------------------------------
     FAQ — Accordion Acessível
     ---------------------------------------------------------- */
  function iniciarFAQ() {
    const itens = document.querySelectorAll('.faq-item');
    if (!itens.length) return;

    itens.forEach(item => {
      const pergunta = item.querySelector('.faq-pergunta');
      const resposta = item.querySelector('.faq-resposta');
      if (!pergunta || !resposta) return;

      pergunta.addEventListener('click', () => {
        const estaAtivo = item.classList.contains('ativo');

        // Fechar todos
        itens.forEach(outro => {
          outro.classList.remove('ativo');
          outro.querySelector('.faq-pergunta')?.setAttribute('aria-expanded', 'false');
        });

        // Abrir/Fechar o clicado
        if (!estaAtivo) {
          item.classList.add('ativo');
          pergunta.setAttribute('aria-expanded', 'true');
        }
      });

      // Suporte a teclado: Enter e Espaço
      pergunta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pergunta.click();
        }
      });
    });
  }


  /* ----------------------------------------------------------
     ANIMAÇÕES DE ENTRADA — Intersection Observer
     ---------------------------------------------------------- */
  function iniciarAnimacoes() {
    const elementos = document.querySelectorAll('.animar');
    if (!elementos.length) return;

    // Respeitar prefers-reduced-motion
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (semMovimento) {
      elementos.forEach(el => el.classList.add('visivel'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      elementos.forEach(el => el.classList.add('visivel'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visivel');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.05 }
    );

    elementos.forEach(el => observer.observe(el));
  }


  /* ----------------------------------------------------------
     FORMULÁRIO — Validação Premium Acessível
     ---------------------------------------------------------- */
  function iniciarFormulario() {
    const form       = document.querySelector('#form-contato');
    const feedback   = document.querySelector('#form-feedback');
    const btnSubmit  = document.querySelector('#btn-submit');
    if (!form) return;

    const campos = {
      nome:      { el: form.querySelector('#form-nome'),      erro: form.querySelector('#form-nome-erro')      },
      email:     { el: form.querySelector('#form-email'),     erro: form.querySelector('#form-email-erro')     },
      telefone:  { el: form.querySelector('#form-telefone'),  erro: form.querySelector('#form-telefone-erro')  },
      modalidade:{ el: form.querySelector('#form-modalidade'),erro: form.querySelector('#form-modalidade-erro') },
      lgpd:      { el: form.querySelector('#form-lgpd'),      erro: form.querySelector('#form-lgpd-erro')      },
    };

    // Validação em tempo real (ao sair do campo)
    Object.values(campos).forEach(({ el, erro }) => {
      if (!el) return;
      el.addEventListener('blur', () => validarCampo(el, erro));
      el.addEventListener('input', () => {
        if (el.getAttribute('aria-invalid') === 'true') {
          validarCampo(el, erro);
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Limpar erros anteriores
      Object.values(campos).forEach(({ el, erro }) => {
        if (el) limparErro(el, erro);
      });

      const valido = validarTudo(campos);
      if (!valido) return;

      await enviarFormulario(form, btnSubmit, feedback, campos);
    });
  }

  function validarCampo(el, erroEl) {
    const id = el.id;
    const valor = el.value.trim();

    if (id === 'form-nome') {
      if (!valor || valor.length < 3) {
        setErro(el, erroEl, 'Por favor, informe seu nome completo (mínimo 3 caracteres).');
        return false;
      }
    }

    if (id === 'form-email') {
      if (!valor) {
        setErro(el, erroEl, 'Por favor, informe seu e-mail.');
        return false;
      }
      if (!emailValido(valor)) {
        setErro(el, erroEl, 'Por favor, informe um e-mail válido (ex: nome@email.com).');
        return false;
      }
    }

    if (id === 'form-telefone') {
      const digitos = el.value.replace(/\D/g, '').length;
      if (digitos < 10) {
        setErro(el, erroEl, 'Por favor, informe um telefone válido com DDD.');
        return false;
      }
    }

    if (id === 'form-modalidade') {
      if (!el.value) {
        setErro(el, erroEl, 'Por favor, selecione uma modalidade de atendimento.');
        return false;
      }
    }

    if (id === 'form-lgpd') {
      if (!el.checked) {
        setErro(el, erroEl, 'É necessário concordar com a Política de Privacidade para enviar.');
        return false;
      }
    }

    limparErro(el, erroEl);
    return true;
  }

  function validarTudo(campos) {
    let valido = true;
    let primeiroErro = null;

    Object.values(campos).forEach(({ el, erro }) => {
      if (!el) return;
      const ok = validarCampo(el, erro);
      if (!ok) {
        valido = false;
        if (!primeiroErro) primeiroErro = el;
      }
    });

    if (primeiroErro) primeiroErro.focus();
    return valido;
  }

  async function enviarFormulario(form, btn, feedback, campos) {
    // Estado de loading
    setLoadingState(btn, true);
    if (feedback) feedback.hidden = true;

    try {
      // Simular requisição assíncrona (substituir por fetch real)
      await new Promise(resolve => setTimeout(resolve, 1800));

      // Sucesso
      mostrarFeedback(feedback, 'sucesso',
        '✓ Mensagem enviada com sucesso! Retornarei o contato em até 24 horas.'
      );

      form.reset();
      Object.values(campos).forEach(({ el, erro }) => {
        if (el) limparErro(el, erro);
      });

      // Analytics: disparar evento de conversão
      dispararEvento('form_agendamento_enviado', { modalidade: campos.modalidade?.el?.value });

    } catch (err) {
      mostrarFeedback(feedback, 'erro',
        '× Ocorreu um erro ao enviar. Por favor, tente novamente ou entre em contato pelo WhatsApp.'
      );
    } finally {
      setLoadingState(btn, false);
    }
  }

  function setLoadingState(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn.classList.add('loading');
      const texto = btn.querySelector('.btn-texto');
      if (texto) texto.textContent = 'Enviando...';
    } else {
      btn.disabled = false;
      btn.classList.remove('loading');
      const texto = btn.querySelector('.btn-texto');
      if (texto) texto.textContent = 'Enviar mensagem';
    }
  }

  function mostrarFeedback(el, tipo, mensagem) {
    if (!el) return;
    el.className = `form-feedback ${tipo}`;
    el.textContent = mensagem;
    el.hidden = false;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }


  /* ----------------------------------------------------------
     MÁSCARA DE TELEFONE — Brasil (XX) XXXXX-XXXX
     ---------------------------------------------------------- */
  function iniciarMascaraTelefone() {
    const input = document.querySelector('#form-telefone');
    if (!input) return;

    input.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').slice(0, 11);

      if (v.length > 6) {
        v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      } else if (v.length > 0) {
        v = `(${v}`;
      }

      this.value = v;
    });

    // Não permitir colar caracteres não numéricos
    input.addEventListener('paste', function (e) {
      e.preventDefault();
      const colado = (e.clipboardData || window.clipboardData).getData('text');
      const apenasNumeros = colado.replace(/\D/g, '');
      const evento = new InputEvent('input', { bubbles: true });
      this.value = apenasNumeros;
      this.dispatchEvent(evento);
    });
  }


  /* ----------------------------------------------------------
     NAVEGAÇÃO ATIVA — Highlight Dinâmico
     ---------------------------------------------------------- */
  function iniciarNavAtiva() {
    const header   = document.querySelector('.header');
    const secoes   = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header-nav a[href^="#"]');
    if (!secoes.length || !navLinks.length) return;

    let rafId = null;

    function atualizarNavAtiva() {
      const headerH   = header ? header.offsetHeight : 72;
      const threshold = window.scrollY + headerH + 80;

      let secaoAtual = null;

      secoes.forEach(secao => {
        if (secao.offsetTop <= threshold) {
          secaoAtual = secao.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        const linkId = link.getAttribute('href').replace('#', '');
        if (linkId === secaoAtual) {
          link.classList.add('ativo');
        } else {
          link.classList.remove('ativo');
        }
      });

      rafId = null;
    }

    window.addEventListener('scroll', () => {
      if (!rafId) rafId = requestAnimationFrame(atualizarNavAtiva);
    }, { passive: true });

    atualizarNavAtiva();
  }


  /* ----------------------------------------------------------
     BOTÃO VOLTAR AO TOPO
     ---------------------------------------------------------- */
  function iniciarBotaoTopo() {
    const btn = document.querySelector('#voltar-topo');
    if (!btn) return;

    let rafId = null;

    function atualizarVisibilidade() {
      if (window.scrollY > 400) {
        btn.classList.add('visivel');
      } else {
        btn.classList.remove('visivel');
      }
      rafId = null;
    }

    window.addEventListener('scroll', () => {
      if (!rafId) rafId = requestAnimationFrame(atualizarVisibilidade);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ----------------------------------------------------------
     CTA FLUTUANTE — WhatsApp
     ---------------------------------------------------------- */
  function iniciarCTAFlutuante() {
    const cta = document.querySelector('#cta-flutuante');
    if (!cta) return;

    let rafId = null;

    function atualizarCTA() {
      if (window.scrollY > 500) {
        cta.classList.add('visivel');
      } else {
        cta.classList.remove('visivel');
      }
      rafId = null;
    }

    window.addEventListener('scroll', () => {
      if (!rafId) rafId = requestAnimationFrame(atualizarCTA);
    }, { passive: true });

    // Rastrear clique no CTA
    cta.addEventListener('click', () => {
      dispararEvento('whatsapp_cta_flutuante_clique', {});
    });
  }


  /* ----------------------------------------------------------
     LGPD — Banner de Consentimento de Cookies
     ---------------------------------------------------------- */
  function iniciarLGPD() {
    const banner  = document.querySelector('#lgpd-banner');
    const aceitar = document.querySelector('#lgpd-aceitar');
    const recusar = document.querySelector('#lgpd-recusar');
    if (!banner) return;

    const CHAVE = 'cookie_consent';

    // Verificar consentimento anterior
    const consentimento = localStorage.getItem(CHAVE);
    if (!consentimento) {
      // Mostrar banner com pequeno delay para não atrapalhar LCP
      setTimeout(() => {
        banner.hidden = false;
      }, 1500);
    }

    function ocultarBanner(tipo) {
      localStorage.setItem(CHAVE, tipo);
      banner.style.animation = 'none';
      banner.style.opacity   = '0';
      banner.style.transform = 'translateX(-50%) translateY(20px)';
      banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => { banner.hidden = true; }, 350);

      if (tipo === 'todos') {
        carregarScriptsAnaliticos();
      }
    }

    aceitar?.addEventListener('click', () => ocultarBanner('todos'));
    recusar?.addEventListener('click', () => ocultarBanner('essenciais'));
  }

  function carregarScriptsAnaliticos() {
    // Preparação para GA4 / GTM (descomentar quando configurado)
    // window.dataLayer = window.dataLayer || [];
    // var script = document.createElement('script');
    // script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    // script.async = true;
    // document.head.appendChild(script);
    console.info('[Analytics] Scripts analíticos carregados após consentimento.');
  }


  /* ----------------------------------------------------------
     ANALYTICS — Eventos Personalizados Preparados
     ---------------------------------------------------------- */
  function dispararEvento(nome, parametros) {
    // Scroll Depth — preparado para GA4
    if (typeof window.gtag === 'function') {
      window.gtag('event', nome, parametros);
    }

    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({ event: nome, ...parametros });
    }

    // Debug em desenvolvimento
    if (window.location.protocol === 'file:') {
      console.info(`[Evento] ${nome}`, parametros);
    }
  }

  // Scroll Depth Tracking (preparado para produção)
  (function iniciarScrollDepth() {
    const marcos = [25, 50, 75, 90];
    const disparados = new Set();

    window.addEventListener('scroll', () => {
      const progresso = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      marcos.forEach(marco => {
        if (progresso >= marco && !disparados.has(marco)) {
          disparados.add(marco);
          dispararEvento('scroll_depth', { porcentagem: marco });
        }
      });
    }, { passive: true });
  })();


  /* ----------------------------------------------------------
     LUCIDE ICONS — Inicializar ícones quando disponível
     ---------------------------------------------------------- */
  function inicializarLucide() {
    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      // Tentar novamente após carregamento do script
      window.addEventListener('load', () => {
        if (window.lucide) window.lucide.createIcons();
      });
    }
  }

})();
