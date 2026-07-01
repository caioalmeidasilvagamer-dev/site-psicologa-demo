/* ============================================================
   Landing Page — Psicólogo(a) Clínico(a) | Template Demo
   JavaScript — Interações e funcionalidades
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----------------------------------------------------------
     MENU MOBILE — Toggle e overlay
     ---------------------------------------------------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const headerNav = document.querySelector('.header-nav');
  const menuOverlay = document.querySelector('.menu-overlay');
  const body = document.body;

  function abrirMenu() {
    menuToggle.classList.add('active');
    headerNav.classList.add('aberto');
    menuOverlay.classList.add('ativo');
    body.style.overflow = 'hidden';
  }

  function fecharMenu() {
    menuToggle.classList.remove('active');
    headerNav.classList.remove('aberto');
    menuOverlay.classList.remove('ativo');
    body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (headerNav.classList.contains('aberto')) {
        fecharMenu();
      } else {
        abrirMenu();
      }
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', fecharMenu);
  }

  // Fechar menu ao clicar em um link da navegação
  const navLinks = document.querySelectorAll('.header-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', fecharMenu);
  });


  /* ----------------------------------------------------------
     HEADER — Efeito ao rolar (scroll)
     ---------------------------------------------------------- */
  const header = document.querySelector('.header');
  let ultimoScroll = 0;

  function atualizarHeader() {
    const scrollAtual = window.scrollY;

    if (scrollAtual > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    ultimoScroll = scrollAtual;
  }

  window.addEventListener('scroll', atualizarHeader, { passive: true });
  atualizarHeader(); // Executar na carga inicial


  /* ----------------------------------------------------------
     SCROLL SUAVE — Para âncoras internas
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ----------------------------------------------------------
     FAQ — Accordion
     ---------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const pergunta = item.querySelector('.faq-pergunta');

    pergunta.addEventListener('click', () => {
      const estaAtivo = item.classList.contains('ativo');

      // Fechar todos os outros
      faqItems.forEach(outro => {
        if (outro !== item) {
          outro.classList.remove('ativo');
        }
      });

      // Toggle do item clicado
      item.classList.toggle('ativo', !estaAtivo);
    });
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
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
      }
    );

    elementosAnimar.forEach(el => observer.observe(el));
  } else {
    // Fallback: mostrar todos os elementos se o navegador não suportar
    elementosAnimar.forEach(el => el.classList.add('visivel'));
  }


  /* ----------------------------------------------------------
     FORMULÁRIO — Validação básica
     ---------------------------------------------------------- */
  const form = document.querySelector('.form-agendamento');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = form.querySelector('#form-nome');
      const telefone = form.querySelector('#form-telefone');
      let valido = true;

      // Reset estilos de erro
      form.querySelectorAll('input, textarea, select').forEach(input => {
        input.style.borderColor = 'rgba(255, 255, 255, 0.25)';
      });

      // Validar nome
      if (nome && nome.value.trim().length < 3) {
        nome.style.borderColor = '#e74c3c';
        valido = false;
      }

      // Validar telefone
      if (telefone && telefone.value.trim().length < 10) {
        telefone.style.borderColor = '#e74c3c';
        valido = false;
      }

      if (valido) {
        // Simular envio (demo)
        const btnSubmit = form.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerHTML;

        btnSubmit.innerHTML = '<i data-lucide="check-circle"></i> Mensagem enviada!';
        btnSubmit.style.backgroundColor = '#25D366';
        btnSubmit.disabled = true;

        // Reinicializar ícones Lucide no botão
        if (window.lucide) {
          lucide.createIcons();
        }

        setTimeout(() => {
          form.reset();
          btnSubmit.innerHTML = textoOriginal;
          btnSubmit.style.backgroundColor = '';
          btnSubmit.disabled = false;

          if (window.lucide) {
            lucide.createIcons();
          }
        }, 3000);
      }
    });
  }


  /* ----------------------------------------------------------
     MÁSCARA SIMPLES — Telefone
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
     NAVEGAÇÃO ATIVA — Highlight do item de menu ao rolar
     ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.header-nav a[href^="#"]');

  function atualizarNavAtiva() {
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

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


  /* ----------------------------------------------------------
     INICIALIZAR LUCIDE ICONS
     ---------------------------------------------------------- */
  if (window.lucide) {
    lucide.createIcons();
  }
});
