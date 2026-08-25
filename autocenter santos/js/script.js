(function () {
  'use strict';

  /* ================= MENU MOBILE ================= */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fecha o menu ao clicar em um link
    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ================= HEADER COM SOMBRA AO ROLAR ================= */
  var header = document.getElementById('header');
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ================= ANO DINÂMICO NO RODAPÉ ================= */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ================= STATUS "ABERTO AGORA" ================= */
  // Segunda a sexta: 08h-18h | Sábado: 08h-16h | Domingo: fechado
  var statusBadge = document.getElementById('statusBadge');
  if (statusBadge) {
    var now = new Date();
    var day = now.getDay(); // 0 = domingo ... 6 = sábado
    var hour = now.getHours() + now.getMinutes() / 60;
    var isOpen = false;

    if (day >= 1 && day <= 5) {
      isOpen = hour >= 8 && hour < 18;
    } else if (day === 6) {
      isOpen = hour >= 8 && hour < 16;
    }

    if (isOpen) {
      statusBadge.textContent = 'Aberto agora';
      statusBadge.classList.add('is-open');
    } else {
      statusBadge.textContent = 'Fechado no momento';
      statusBadge.classList.add('is-closed');
    }
  }

  /* ================= CARROSSEL "QUEM SOMOS" ================= */
  var carousel = document.getElementById('aboutCarousel');
  if (carousel) {
    var track = document.getElementById('carouselTrack');
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.getElementById('carouselDots');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    var current = 0;
    var autoplayDelay = 5000;
    var autoplayTimer = null;

    // Cria os indicadores (dots)
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Ir para imagem ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function update() {
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      update();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(next, autoplayDelay);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });

    // Pausa o autoplay ao interagir e retoma ao sair
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    // Suporte a swipe em telas touch
    var touchStartX = 0;
    var touchEndX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        delta < 0 ? next() : prev();
      }
      startAutoplay();
    }, { passive: true });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Não inicia autoplay automático para quem prefere menos movimento
      update();
    } else {
      update();
      startAutoplay();
    }
  }

  /* ================= REVELAÇÃO AO ROLAR (SCROLL REVEAL) ================= */
  var revealTargets = document.querySelectorAll(
    '.service-card, .diff-card, .review-card, .section__title, .section__lead, .location__info, .location__map, .about__text, .about__gallery'
  );

  revealTargets.forEach(function (el) {
    el.setAttribute('data-reveal', '');
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: exibe tudo imediatamente se não houver suporte
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

})();
