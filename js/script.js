/* ==========================================================================
   EASON LOGISTICS — SCRIPT
   Modular vanilla JS: navigation, reveal animations, counters, timeline,
   image fallback illustrations, and contact-form validation.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     0. Small helpers
     ------------------------------------------------------------------ */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* ------------------------------------------------------------------
     1. NAVBAR — scroll state, mobile drawer, active-link tracking
     ------------------------------------------------------------------ */
  const Nav = {
    navbar: $('#navbar'),
    toggle: $('#navToggle'),
    drawer: $('#mobileDrawer'),
    backdrop: $('#drawerBackdrop'),
    links: $$('.nav-links a, .mobile-drawer a'),
    sections: [],

    init() {
      this.sections = $$('main section[id]');
      on(window, 'scroll', () => this.onScroll(), { passive: true });
      on(this.toggle, 'click', () => this.toggleDrawer());
      on(this.backdrop, 'click', () => this.closeDrawer());
      this.links.forEach((a) => on(a, 'click', () => this.closeDrawer()));
      this.onScroll();
    },

    onScroll() {
      const y = window.scrollY || window.pageYOffset;
      this.navbar.classList.toggle('is-scrolled', y > 40);

      // Active link tracking via simple offset comparison (lightweight, no IO needed here)
      let current = this.sections[0] && this.sections[0].id;
      const scrollPos = y + 140;
      this.sections.forEach((sec) => {
        if (sec.offsetTop <= scrollPos) current = sec.id;
      });
      this.links.forEach((a) => {
        const match = a.getAttribute('href') === `#${current}`;
        a.classList.toggle('active', match);
      });

      // back to top
      BackToTop.el.classList.toggle('show', y > 700);
    },

    toggleDrawer() {
      const open = !this.drawer.classList.contains('open');
      this.drawer.classList.toggle('open', open);
      this.backdrop.classList.toggle('open', open);
      this.toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    },

    closeDrawer() {
      this.drawer.classList.remove('open');
      this.backdrop.classList.remove('open');
      this.toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    },
  };

  /* ------------------------------------------------------------------
     2. BACK TO TOP
     ------------------------------------------------------------------ */
  const BackToTop = {
    el: $('#backToTop'),
    init() {
      on(this.el, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    },
  };

  /* ------------------------------------------------------------------
     3. SCROLL REVEAL (IntersectionObserver)
     ------------------------------------------------------------------ */
  const Reveal = {
    init() {
      const targets = $$('[data-reveal], .why-feature, .safety-point, .step');
      if (!('IntersectionObserver' in window) || !targets.length) {
        targets.forEach((t) => t.classList.add('in-view'));
        return;
      }
      // stagger index within groups
      $$('[data-reveal-group]').forEach((group) => {
        Array.from(group.children).forEach((child, i) => {
          child.style.setProperty('--i', i);
        });
      });

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
      );
      targets.forEach((t) => io.observe(t));
    },
  };

  /* ------------------------------------------------------------------
     4. ANIMATED COUNTERS
     ------------------------------------------------------------------ */
  const Counters = {
    init() {
      const nums = $$('.stat .num[data-count]');
      if (!nums.length) return;

      const animate = (el) => {
        const target = parseFloat(el.getAttribute('data-count'));
        const suffixEl = el.querySelector('.suffix');
        const suffix = suffixEl ? suffixEl.outerHTML : '';
        const duration = 1600;
        const start = performance.now();

        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
          const value = Math.floor(eased * target);
          el.innerHTML = value + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.innerHTML = target + suffix;
        };
        requestAnimationFrame(step);
      };

      if (!('IntersectionObserver' in window)) {
        nums.forEach(animate);
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      nums.forEach((el) => io.observe(el));
    },
  };

  /* ------------------------------------------------------------------
     5. IMAGE FALLBACKS
     Generates an on-brand, blueprint-style inline SVG illustration to
     use whenever a photographic asset (assets/images/*.jpg) is missing
     or fails to load, so the layout always looks intentional.
     ------------------------------------------------------------------ */
  const ImageFallback = {
    icons: {
      hero: 'M4 42h56M10 42V26h14l8-10h14a4 4 0 0 1 4 4v22M10 26h22M40 30h10l6 8v4M18 50a6 6 0 1 0 0-.1M46 50a6 6 0 1 0 0-.1',
      about: 'M12 50V22l20-12 20 12v28M12 50h40M22 50V32h8v18M34 32h8v10h-8z',
      transportation: 'M4 40h40M6 46h56M14 40V24h20l6 8v8M40 24h8l8 8v8M16 50a5 5 0 1 0 0-.1M46 50a5 5 0 1 0 0-.1M10 32h10',
      freight: 'M8 20l24-8 24 8-24 8-24-8zM8 20v24l24 8V28M56 20v24l-24 8M8 20l24 8',
      warehouse: 'M6 26L32 12l26 14v28H6V26zM20 54V34h24v20M6 26h52',
      delivery: 'M6 44V18h30v26M6 44h34M36 28h12l10 10v6M36 44h20M16 52a6 6 0 1 0 0-.1M48 52a6 6 0 1 0 0-.1',
      'fleet-truck': 'M4 42V20h30v22M4 42h4M34 42h6M40 26h10l10 10v6h-20V26zM16 52a6 6 0 1 0 0-.1M50 52a6 6 0 1 0 0-.1',
      'fleet-container': 'M6 18h52v30H6zM6 18l6-6h40l6 6M14 18v30M22 18v30M30 18v30M38 18v30M46 18v30',
      safety: 'M32 6l22 8v16c0 14-9 24-22 28C19 54 10 44 10 30V14z M24 32l6 6 12-12',
      cta: 'M4 42h56M10 42V26h14l8-10h14a4 4 0 0 1 4 4v22M18 50a6 6 0 1 0 0-.1M46 50a6 6 0 1 0 0-.1',
    },

    palette: {
      hero: ['#0D1720', '#1A3145', '#F0A91B'],
      about: ['#122232', '#1A3145', '#178F86'],
      transportation: ['#122232', '#24445E', '#F0A91B'],
      freight: ['#122232', '#1A3145', '#D6432E'],
      warehouse: ['#0D1720', '#1A3145', '#3F9B52'],
      delivery: ['#122232', '#24445E', '#F0A91B'],
      'fleet-truck': ['#0D1720', '#1A3145', '#F0A91B'],
      'fleet-container': ['#122232', '#1A3145', '#178F86'],
      safety: ['#0D1720', '#1A3145', '#F0A91B'],
      cta: ['#0D1720', '#1A3145', '#D6432E'],
    },

    build(type) {
      const [c1, c2, accent] = this.palette[type] || this.palette.hero;
      const path = this.icons[type] || this.icons.hero;
      const uid = 'g' + Math.random().toString(36).slice(2, 8);
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="${uid}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${c1}"/>
              <stop offset="100%" stop-color="${c2}"/>
            </linearGradient>
            <pattern id="${uid}p" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M0 28 L28 0" stroke="${accent}" stroke-opacity="0.08" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="640" height="480" fill="url(#${uid})"/>
          <rect width="640" height="480" fill="url(#${uid}p)"/>
          <g transform="translate(0,0)">
            <line x1="0" y1="0" x2="640" y2="0" stroke="${accent}" stroke-opacity="0.25" stroke-width="1"/>
            <line x1="0" y1="479" x2="640" y2="479" stroke="${accent}" stroke-opacity="0.25" stroke-width="1"/>
          </g>
          <g transform="translate(288,208) scale(4.2)" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.92">
            <path d="${path}"/>
          </g>
          <circle cx="580" cy="60" r="2" fill="${accent}" opacity="0.6"/>
          <circle cx="60" cy="420" r="2" fill="${accent}" opacity="0.6"/>
        </svg>`;
      return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    },

    init() {
      $$('img[data-fallback]').forEach((img) => {
        const type = img.getAttribute('data-fallback');
        const apply = () => {
          img.src = this.build(type);
          img.removeAttribute('data-fallback-pending');
        };
        img.addEventListener('error', apply, { once: true });
        // If the source is already broken (e.g., relative asset not present), trigger check
        if (img.complete && img.naturalWidth === 0) apply();
      });
    },
  };

  /* ------------------------------------------------------------------
     6. CONTACT FORM VALIDATION
     No backend call is made — this validates on the client and shows a
     success state, ready for future API integration.
     ------------------------------------------------------------------ */
  const ContactForm = {
    form: $('#contactForm'),
    success: $('#formSuccess'),

    rules: {
      name: (v) => v.trim().length >= 2 || 'Please enter your full name.',
      company: () => true, // optional
      phone: (v) => /^[0-9+\-\s()]{7,16}$/.test(v.trim()) || 'Enter a valid phone number.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
      service: (v) => v !== '' || 'Please select a service.',
      message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.',
    },

    init() {
      if (!this.form) return;
      on(this.form, 'submit', (e) => this.handleSubmit(e));
      $$('input, select, textarea', this.form).forEach((field) => {
        on(field, 'blur', () => this.validateField(field));
        on(field, 'input', () => {
          const wrap = field.closest('.field');
          if (wrap && wrap.classList.contains('has-error')) this.validateField(field);
        });
      });
    },

    validateField(field) {
      const rule = this.rules[field.name];
      if (!rule) return true;
      const result = rule(field.value);
      const wrap = field.closest('.field');
      const errorEl = wrap ? wrap.querySelector('.field-error') : null;
      if (result === true) {
        wrap && wrap.classList.remove('has-error');
        return true;
      }
      wrap && wrap.classList.add('has-error');
      if (errorEl) errorEl.textContent = result;
      return false;
    },

    handleSubmit(e) {
      e.preventDefault();
      const fields = $$('input, select, textarea', this.form);
      let valid = true;
      fields.forEach((field) => {
        if (!this.validateField(field)) valid = false;
      });

      if (!valid) {
        const firstError = this.form.querySelector('.has-error');
        if (firstError) firstError.querySelector('input, select, textarea').focus();
        return;
      }

      // No backend wired up yet — surface a clear success state and reset.
      this.success.classList.add('show');
      this.form.reset();
      this.success.scrollIntoView({ behavior: 'smooth', block: 'center' });

      window.setTimeout(() => this.success.classList.remove('show'), 8000);
    },
  };

  /* ------------------------------------------------------------------
     7. Init on DOM ready
     ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    Nav.init();
    BackToTop.init();
    Reveal.init();
    Counters.init();
    ImageFallback.init();
    ContactForm.init();

    // Set current year dynamically as a small enhancement (footer text stays accurate)
    const yearEl = $('#currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
