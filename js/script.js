/* ============================================================
   Landing Page — Psicologia Clínica | Premium Template
   JavaScript — Interações, Acessibilidade & Funcionalidades
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----------------------------------------------------------
     MENU MOBILE — Toggle com Acessibilidade (ARIA)
     ---------------------------------------------------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const headerNav = document.querySelector('.header-nav');
  const menuOverlay = document.querySelector('.menu-overlay');
  const body = document.body;

  function abrirMenu() {
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    headerNav.classList.add('aberto');
    menuOverlay.classList.add('ativo');
    body.style.overflow = 'hidden';
  }

  function fecharMenu() {
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    headerNav.classList.remove('aberto');
    menuOverlay.classList.remove('ativo');
    body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const estaAberto = menuToggle.getAttribute('aria-expanded') === 'true';
      if (estaAberto) {
        fecharMenu();
      } else {
        abrirMenu();
      }
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', fecharMenu);
  }

  // Fechar menu mobile ao clicar em links internos
  const navLinks = document.querySelectorAll('.header-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', fecharMenu);
  });


  /* ----------------------------------------------------------
     HEADER — Efeito de Scroll
     ---------------------------------------------------------- */
  const header = document.querySelector('.header');

  function atualizarHeader() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', atualizarHeader, { passive: true });
  atualizarHeader(); // Execução inicial


  /* ----------------------------------------------------------
     SCROLL SUAVE — Navegação por Âncoras
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Mover foco para o elemento de destino (melhora acessibilidade de teclado)
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });


  /* ----------------------------------------------------------
     FAQ — Accordion Acessível (Toggle ARIA-Expanded)
     ---------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const pergunta = item.querySelector('.faq-pergunta');
    const resposta = item.querySelector('.faq-resposta');

    if (pergunta && resposta) {
      pergunta.addEventListener('click', () => {
        const estaAtivo = item.classList.contains('ativo');

        // Fechar todos os outros accordions
        faqItems.forEach(outro => {
          if (outro !== item) {
            outro.classList.remove('ativo');
            outro.querySelector('.faq-pergunta').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle do accordion atual
        if (estaAtivo) {
          item.classList.remove('ativo');
          pergunta.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('ativo');
          pergunta.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });


  /* ----------------------------------------------------------
     ANIMAÇÕES DE ENTRADA — Intersection Observer
     ---------------------------------------------------------- */
  const elementosAnimar = document.querySelectorAll('.animar');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visivel');
            observer.unobserve(entry.target); // Animar apenas uma vez
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.05
      }
    );

    elementosAnimar.forEach(el => observer.observe(el));
  } else {
    // Fallback para navegadores legados
    elementosAnimar.forEach(el => el.classList.add('visivel'));
  }


  /* ----------------------------------------------------------
     FORMULÁRIO — Validação Acessível (CRO)
     ---------------------------------------------------------- */
  const form = document.querySelector('.form-agendamento');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = form.querySelector('#form-nome');
      const telefone = form.querySelector('#form-telefone');
      let valido = true;

      // Reset de estilos de validação
      form.querySelectorAll('input, select, textarea').forEach(input => {
        input.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        input.removeAttribute('aria-invalid');
      });

      // Validar Nome (mínimo 3 caracteres)
      if (nome && nome.value.trim().length < 3) {
        nome.style.borderColor = '#ff4d4d';
        nome.setAttribute('aria-invalid', 'true');
        valido = false;
      }

      // Validar Telefone (mínimo 10 caracteres numéricos após máscara)
      const numDigitos = telefone ? telefone.value.replace(/\D/g, '').length : 0;
      if (telefone && numDigitos < 10) {
        telefone.style.borderColor = '#ff4d4d';
        telefone.setAttribute('aria-invalid', 'true');
        valido = false;
      }

      if (valido) {
        const btnSubmit = form.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerHTML;

        btnSubmit.innerHTML = '<i data-lucide="check" aria-hidden="true"></i><span>Mensagem enviada com sucesso!</span>';
        btnSubmit.style.backgroundColor = '#25d366';
        btnSubmit.style.borderColor = '#25d366';
        btnSubmit.disabled = true;

        if (window.lucide) {
          lucide.createIcons();
        }

        // Simular requisição assíncrona
        setTimeout(() => {
          form.reset();
          btnSubmit.innerHTML = textoOriginal;
          btnSubmit.style.backgroundColor = '';
          btnSubmit.style.borderColor = '';
          btnSubmit.disabled = false;

          if (window.lucide) {
            lucide.createIcons();
          }
        }, 3500);
      }
    });
  }


  /* ----------------------------------------------------------
     MÁSCARA DE TELEFONE (Brasil: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX)
     ---------------------------------------------------------- */
  const inputTelefone = document.querySelector('#form-telefone');

  if (inputTelefone) {
    inputTelefone.addEventListener('input', function () {
      let valor = this.value.replace(/\D/g, '');

      if (valor.length > 11) {
        valor = valor.slice(0, 11);
      }

      if (valor.length > 6) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
      } else if (valor.length > 2) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
      } else if (valor.length > 0) {
        valor = `(${valor}`;
      }

      this.value = valor;
    });
  }


  /* ----------------------------------------------------------
     ACTIVE NAVIGATION — Highlight Dinâmico na Navegação
     ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.header-nav a[href^="#"]');

  function atualizarNavAtiva() {
    const scrollPosition = window.scrollY + header.offsetHeight + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('ativo');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('ativo');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', atualizarNavAtiva, { passive: true });
  atualizarNavAtiva();


  /* ----------------------------------------------------------
     INICIALIZAR LUCIDE ICONS (SE DISPONÍVEL NO ESCOPO GLOBAL)
     ---------------------------------------------------------- */
  if (window.lucide) {
    lucide.createIcons();
  }
});
