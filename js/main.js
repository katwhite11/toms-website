/* ================================================
   DR. THOMAS LYONS — MAIN JS
   ================================================ */

/* ── STICKY HEADER ── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ── MOBILE BURGER MENU ── */
(function () {
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('main-nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);

    // Animate burger spans into X
    const spans = burger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu when a nav link is clicked
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      const spans = burger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      const spans = burger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });
})();


/* ── SCROLL ANIMATIONS ── */
(function () {
  const animatedEls = document.querySelectorAll(
    '.fade-in-up, .fade-in-left, .fade-in-right'
  );
  if (!animatedEls.length) return;

  // If IntersectionObserver isn't available, just show everything
  if (!('IntersectionObserver' in window)) {
    animatedEls.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  animatedEls.forEach(function (el) { observer.observe(el); });
})();


/* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const headerHeight = document.getElementById('site-header')
        ? document.getElementById('site-header').offsetHeight
        : 72;

      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();


/* ── PUBLICATION & MEDIA ACCORDIONS ── */
(function () {
  var accordions = [
    { toggle: 'pub-toggle',   list: 'pub-full-list' },
    { toggle: 'media-toggle', list: 'media-full-list' }
  ];

  accordions.forEach(function (ac) {
    var btn  = document.getElementById(ac.toggle);
    var list = document.getElementById(ac.list);
    if (!btn || !list) return;

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isOpen);
      if (isOpen) {
        list.hidden = true;
      } else {
        list.hidden = false;
      }
    });
  });
})();


/* ── TESTIMONIALS CAROUSEL ── */
(function () {
  var track  = document.getElementById('testimonials-track');
  var dotsWrap = document.getElementById('testimonials-dots');
  var prevBtn  = document.getElementById('t-prev');
  var nextBtn  = document.getElementById('t-next');
  if (!track || !dotsWrap) return;

  var slides = Array.from(track.querySelectorAll('.testimonial-slide'));
  var dots   = Array.from(dotsWrap.querySelectorAll('.t-dot'));
  var current = 0;
  var autoTimer;

  function goTo(index, direction) {
    var prev = current;
    current = (index + slides.length) % slides.length;
    if (prev === current) return;

    // Exit current slide
    slides[prev].classList.add('exit');
    slides[prev].classList.remove('active');

    // After exit transition, clean up
    var exiting = slides[prev];
    setTimeout(function () {
      exiting.classList.remove('exit');
    }, 560);

    // Prepare entering slide direction
    slides[current].style.transform = direction === 'prev' ? 'translateX(-40px)' : 'translateX(40px)';
    slides[current].style.opacity = '0';
    slides[current].classList.add('active');

    // Force reflow then transition in
    slides[current].getBoundingClientRect();
    slides[current].style.transform = '';
    slides[current].style.opacity = '';

    // Update dots
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1, 'next'); }
  function prev() { goTo(current - 1, 'prev'); }

  function startAuto() {
    autoTimer = setInterval(next, 6000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  nextBtn && nextBtn.addEventListener('click', function () { next(); resetAuto(); });
  prevBtn && prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.getAttribute('data-target'), 10), 'next');
      resetAuto();
    });
  });

  // Keyboard support when section is focused
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
    if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
  });

  startAuto();
})();


/* ── CONTACT FORM ── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showFormMessage(form, 'Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormMessage(form, 'Please enter a valid email address.', 'error');
      return;
    }

    // Simulate submission (replace with real endpoint / emailjs / etc.)
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    setTimeout(function () {
      btn.disabled    = false;
      btn.textContent = 'Send Message';
      form.reset();
      showFormMessage(
        form,
        'Thank you! Your message has been sent. Dr. Lyons will be in touch soon.',
        'success'
      );
    }, 1200);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(form, text, type) {
    // Remove any existing message
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const msg = document.createElement('p');
    msg.className = 'form-message';
    msg.textContent = text;
    msg.style.cssText = [
      'margin-top: 0.5rem',
      'font-size: 0.9rem',
      'padding: 0.75rem 1rem',
      'border-radius: 4px',
      type === 'success'
        ? 'background: rgba(184,147,90,0.15); color: #d4aa78; border: 1px solid rgba(184,147,90,0.3);'
        : 'background: rgba(200,60,60,0.15); color: #e07070; border: 1px solid rgba(200,60,60,0.3);'
    ].join(';');

    form.appendChild(msg);

    // Auto-remove after 6 seconds
    setTimeout(function () {
      if (msg.parentNode) msg.remove();
    }, 6000);
  }
})();
