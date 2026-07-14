(function () {
  'use strict';

  const doc = document;
  const $ = (selector, context = doc) => context.querySelector(selector);
  const $$ = (selector, context = doc) => Array.from(context.querySelectorAll(selector));
  const ready = (callback) => {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', callback, { once: true });
    else callback();
  };
  const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
  const normalize = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileMedia = window.matchMedia('(max-width: 767px)');

  function controlledElement(trigger, fallbackSelector) {
    const id = trigger.getAttribute('aria-controls');
    return (id && doc.getElementById(id)) || (fallbackSelector && $(fallbackSelector)) || trigger.nextElementSibling;
  }

  function setExpanded(trigger, panel, expanded) {
    trigger.setAttribute('aria-expanded', String(expanded));
    if (panel) {
      panel.hidden = !expanded;
      panel.classList.toggle('is-open', expanded);
    }
    trigger.classList.toggle('is-active', expanded);
  }

  function initMegaMenu() {
    const trigger = $('[data-mega-trigger], [data-megamenu-trigger], #careersMenuTrigger, .nav__careers, .main-nav [aria-haspopup="true"]');
    const menu = trigger && controlledElement(trigger, '[data-mega-menu], [data-megamenu], #megaMenu, .mega-menu');
    if (!trigger || !menu) return;

    let closeTimer;
    const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
    const open = () => {
      window.clearTimeout(closeTimer);
      setExpanded(trigger, menu, true);
      doc.body.classList.add('mega-menu-open');
    };
    const close = (returnFocus = false) => {
      setExpanded(trigger, menu, false);
      doc.body.classList.remove('mega-menu-open');
      if (returnFocus) trigger.focus();
    };

    trigger.setAttribute('aria-haspopup', 'true');
    if (!trigger.hasAttribute('aria-expanded')) setExpanded(trigger, menu, false);
    trigger.addEventListener('click', (event) => {
      if (isDesktop() || trigger.getAttribute('href') === '#') event.preventDefault();
      trigger.getAttribute('aria-expanded') === 'true' ? close() : open();
    });
    [trigger, menu].forEach((element) => {
      element.addEventListener('mouseenter', () => { if (isDesktop()) open(); });
      element.addEventListener('mouseleave', () => {
        if (isDesktop()) closeTimer = window.setTimeout(() => close(), 160);
      });
    });
    menu.addEventListener('focusout', (event) => {
      if (isDesktop() && !menu.contains(event.relatedTarget) && event.relatedTarget !== trigger) close();
    });
    doc.addEventListener('pointerdown', (event) => {
      if (trigger.getAttribute('aria-expanded') === 'true' && !menu.contains(event.target) && !trigger.contains(event.target)) close();
    });
    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') close(true);
    });
  }

  function initMobileDrawer() {
    const toggle = $('[data-menu-toggle], #menuToggle, .menu-toggle, .hamburger');
    const drawer = toggle && controlledElement(toggle, '[data-mobile-menu], #mobileMenu, .mobile-menu, .nav-drawer');
    if (!toggle || !drawer) return;
    const closeButtons = $$('[data-menu-close], .mobile-menu__close, .nav-drawer__close', drawer);
    const overlay = $('[data-menu-overlay], [data-drawer-backdrop], .menu-overlay, .drawer-backdrop');

    const apply = (open) => {
      setExpanded(toggle, drawer, open);
      drawer.setAttribute('aria-hidden', String(!open));
      doc.body.classList.toggle('menu-open', open);
      doc.body.classList.toggle('drawer-open', open);
      if (overlay) overlay.hidden = !open;
      if (open) {
        const focusable = $('a, button, input, select, [tabindex]:not([tabindex="-1"])', drawer);
        if (focusable) window.setTimeout(() => focusable.focus(), 0);
      }
    };
    toggle.setAttribute('aria-expanded', 'false');
    drawer.hidden = true;
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      apply(toggle.getAttribute('aria-expanded') !== 'true');
    });
    toggle.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      apply(toggle.getAttribute('aria-expanded') !== 'true');
    });
    closeButtons.forEach((button) => button.addEventListener('click', () => { apply(false); toggle.focus(); }));
    if (overlay) overlay.addEventListener('click', () => apply(false));
    drawer.addEventListener('click', (event) => {
      if (event.target.closest('a[href]') && !event.target.closest('[data-submenu-trigger]')) apply(false);
    });
    drawer.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab' || toggle.getAttribute('aria-expanded') !== 'true') return;
      const focusable = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])', drawer)
        .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        apply(false);
        toggle.focus();
      }
    });
  }

  function initSearch() {
    const toggle = $('[data-search-toggle], .search-toggle');
    const search = toggle && controlledElement(toggle, '#site-search, .site-search');
    if (!toggle || !search) return;
    const close = $('[data-search-close]', search);
    const apply = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      search.hidden = !open;
      search.classList.toggle('is-open', open);
      if (open) {
        const input = $('input[type="search"]', search);
        if (input) window.setTimeout(() => input.focus(), 0);
      }
    };
    toggle.addEventListener('click', () => apply(toggle.getAttribute('aria-expanded') !== 'true'));
    if (close) close.addEventListener('click', () => { apply(false); toggle.focus(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { apply(false); toggle.focus(); }
    });
    search.addEventListener('submit', (event) => {
      const input = $('input[type="search"]', search);
      if (!input || !input.value.trim()) {
        event.preventDefault();
        input && input.focus();
      }
    });
  }

  function bindAccordion(trigger, panel, mobileOnly = false) {
    if (!panel || trigger.dataset.senatiAccordionBound) return;
    trigger.dataset.senatiAccordionBound = 'true';
    if (!panel.id) panel.id = `accordion-${Math.random().toString(36).slice(2, 9)}`;
    trigger.setAttribute('aria-controls', panel.id);
    const syncMode = () => {
      const enabled = !mobileOnly || mobileMedia.matches;
      if (enabled) {
        trigger.setAttribute('role', 'button');
        trigger.tabIndex = 0;
        if (!trigger.hasAttribute('aria-expanded')) setExpanded(trigger, panel, false);
      } else {
        trigger.removeAttribute('role');
        trigger.removeAttribute('tabindex');
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    };
    const toggle = () => {
      if (mobileOnly && !mobileMedia.matches) return;
      setExpanded(trigger, panel, trigger.getAttribute('aria-expanded') !== 'true');
    };
    trigger.addEventListener('click', toggle);
    trigger.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && (!mobileOnly || mobileMedia.matches)) {
        event.preventDefault();
        toggle();
      }
    });
    syncMode();
    mobileMedia.addEventListener('change', syncMode);
  }

  function initAccordions() {
    $$('[data-accordion-trigger], .accordion__trigger').forEach((trigger) => {
      bindAccordion(trigger, controlledElement(trigger), trigger.hasAttribute('data-mobile-only'));
    });
    $$('.footer__column, .footer-column, [data-footer-column]').forEach((column) => {
      const heading = $('[data-footer-trigger], h2 > button, h3 > button, .footer__title, [data-footer-heading]', column);
      const content = $('.footer__links, [data-footer-content], ul', column);
      if (heading && content) bindAccordion(heading, content, true);
    });
  }

  function createFieldError(field, formIndex) {
    const safeName = (field.name || field.id || 'campo').replace(/[^a-z0-9_-]/gi, '-');
    const id = `error-${formIndex}-${safeName}`;
    const describedBy = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    let error = describedBy.map((describedId) => doc.getElementById(describedId)).find((element) => element && element.classList.contains('field-error')) || doc.getElementById(id);
    if (!error) {
      error = doc.createElement('span');
      error.id = id;
      error.className = 'field-error';
      error.setAttribute('aria-live', 'polite');
      const group = field.closest('.form-field, .form-group, .field, label') || field.parentElement;
      (group || field).appendChild(error);
    }
    field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), id].filter(Boolean).join(' '));
    return error;
  }

  function validateField(field, formIndex) {
    const error = createFieldError(field, formIndex);
    const name = normalize(field.name || field.id);
    const value = field.value.trim();
    const isPolicy = /politica|privacy|privacidad|terms|terminos/.test(name);
    const isPhone = /telefono|phone|celular|whatsapp/.test(name) || field.type === 'tel';
    const isEmail = /correo|email/.test(name) || field.type === 'email';
    const isRadio = field.type === 'radio';
    const radioGroupChecked = isRadio && field.form
      ? $$(`input[type="radio"][name="${window.CSS && CSS.escape ? CSS.escape(field.name) : field.name}"]`, field.form).some((radio) => radio.checked)
      : false;
    const knownRequired = /nombre|apellido|correo|email|telefono|phone|celular|whatsapp|programa|area|sede/.test(name);
    let message = '';

    if ((field.required || knownRequired || isPolicy) && ((field.type === 'checkbox' && !field.checked) || (isRadio && !radioGroupChecked) || (!isRadio && field.type !== 'checkbox' && !value))) {
      message = isPolicy ? 'Debes aceptar la política de privacidad.' : 'Completa este campo.';
    } else if (isEmail && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      message = 'Ingresa un correo electrónico válido.';
    } else if (isPhone && value && !/^\d{7,15}$/.test(value)) {
      message = 'Ingresa entre 7 y 15 dígitos, sin espacios.';
    }

    error.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    field.classList.toggle('is-invalid', Boolean(message));
    return !message;
  }

  function initForms() {
    const forms = $$('[data-lead-form], form.lead-form, form[data-senati-form], #leadForm, #detailForm, .hero-form form, .career-form form');
    Array.from(new Set(forms)).forEach((form, formIndex) => {
      if (form.dataset.senatiFormBound) return;
      form.dataset.senatiFormBound = 'true';
      form.noValidate = true;
      const fields = $$('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea', form)
        .filter((field) => !field.disabled);
      let success = $('[data-form-success], .form-success, .form-status', form);
      if (!success) {
        success = doc.createElement('p');
        success.className = 'form-success';
        success.hidden = true;
        success.setAttribute('role', 'status');
        success.setAttribute('aria-live', 'polite');
        success.tabIndex = -1;
        form.appendChild(success);
      }
      fields.forEach((field) => {
        ['input', 'change'].forEach((eventName) => field.addEventListener(eventName, () => {
          if (field.getAttribute('aria-invalid') === 'true') validateField(field, formIndex);
          success.hidden = true;
        }));
      });
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        success.hidden = true;
        const valid = fields.map((field) => validateField(field, formIndex)).every(Boolean);
        if (!valid) {
          const firstInvalid = $('[aria-invalid="true"]', form);
          if (firstInvalid) firstInvalid.focus();
          return;
        }
        const submit = $('[type="submit"]', form);
        const originalLabel = submit ? submit.textContent : '';
        if (submit) {
          submit.disabled = true;
          submit.textContent = 'Enviando…';
        }
        window.setTimeout(() => {
          form.reset();
          fields.forEach((field) => {
            field.setAttribute('aria-invalid', 'false');
            field.classList.remove('is-invalid');
          });
          success.textContent = '¡Gracias! Recibimos tus datos. Un asesor se pondrá en contacto contigo pronto.';
          success.hidden = false;
          success.focus({ preventScroll: true });
          if (submit) {
            submit.disabled = false;
            submit.textContent = originalLabel;
          }
        }, 600);
      });
    });
  }

  function initHeroCarousel() {
    const root = $('[data-hero-carousel]');
    const data = window.SenatiData;
    if (!root || !data || !data.heroSlides || root.dataset.heroBound) return;
    root.dataset.heroBound = 'true';
    const slidesHost = $('[data-hero-slides]', root);
    const eyebrow = $('[data-hero-eyebrow]', root);
    const title = $('[data-hero-title]', root);
    const description = $('[data-hero-description]', root);
    const cta = $('[data-hero-cta]', root);
    const dots = $('[data-hero-dots]', root);
    const previous = $('[data-hero-previous]', root);
    const next = $('[data-hero-next]', root);
    const slides = data.heroSlides;
    let active = 0;
    let autoplay = null;
    let touchStart = 0;

    if (slidesHost) slidesHost.innerHTML = slides.map((slide, index) => `<figure class="hero__slide ${index === 0 ? 'is-active' : ''}" data-hero-slide="${index}" aria-hidden="${index === 0 ? 'false' : 'true'}"><img src="${escapeHTML(slide.image)}" alt="${escapeHTML(slide.alt)}" width="1536" height="864" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}></figure>`).join('');
    if (dots) {
      dots.innerHTML = slides.map((slide, index) => `<button type="button" role="tab" aria-label="Ver ${escapeHTML(slide.eyebrow)}" aria-selected="${index === 0 ? 'true' : 'false'}" data-hero-dot="${index}"></button>`).join('');
      $$('[data-hero-dot]', dots).forEach((dot) => dot.addEventListener('click', () => { goTo(Number(dot.dataset.heroDot), true); restart(); }));
    }
    const apply = () => {
      const slide = slides[active];
      $$('[data-hero-slide]', slidesHost).forEach((item, index) => { item.classList.toggle('is-active', index === active); item.setAttribute('aria-hidden', String(index !== active)); });
      if (eyebrow) eyebrow.textContent = slide.eyebrow;
      if (title) title.textContent = slide.title;
      if (description) description.textContent = slide.description;
      if (cta) { cta.href = slide.ctaUrl; cta.innerHTML = `${escapeHTML(slide.ctaLabel)} <span aria-hidden="true">→</span>`; }
      root.dataset.heroAccent = slide.accent || 'blue';
      $$('[data-hero-dot]', dots).forEach((dot, index) => dot.setAttribute('aria-selected', String(index === active)));
    };
    const goTo = (index, userInitiated = false) => {
      active = (index + slides.length) % slides.length;
      apply();
      if (userInitiated) root.dataset.userInteracted = 'true';
    };
    const stop = () => { if (autoplay) window.clearInterval(autoplay); autoplay = null; };
    const start = () => {
      stop();
      if (reducedMotion()) return;
      autoplay = window.setInterval(() => goTo(active + 1), 5000);
    };
    const restart = () => { stop(); if (!reducedMotion()) window.setTimeout(start, 2500); };
    if (previous) previous.addEventListener('click', () => { goTo(active - 1, true); restart(); });
    if (next) next.addEventListener('click', () => { goTo(active + 1, true); restart(); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', (event) => { if (!root.contains(event.relatedTarget)) start(); });
    root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(active - 1, true); restart(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(active + 1, true); restart(); }
    });
    root.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (event) => {
      const distance = event.changedTouches[0].clientX - touchStart;
      if (Math.abs(distance) < 40) return;
      goTo(active + (distance < 0 ? 1 : -1), true);
      restart();
    }, { passive: true });
    apply();
    start();
  }

  function initStudyModesAndFinder() {
    const data = window.SenatiData;
    if (!data) return;
    const modeHost = $('[data-study-modes]');
    const program = $('[data-finder-program]');
    const area = $('[data-finder-area]');
    const campus = $('[data-finder-campus]');
    const finder = $('[data-career-finder]');
    const addOptions = (select, values) => {
      if (!select) return;
      const current = new Set($$('option', select).map((option) => normalize(option.value)));
      values.forEach((value) => { if (!current.has(normalize(value))) select.add(new Option(value, value)); });
    };
    addOptions(program, data.modalidades.map((item) => item.programa));
    addOptions(area, data.areas.map((item) => item.nombre));
    addOptions(campus, data.sedes);
    if (modeHost && !modeHost.children.length) {
      modeHost.innerHTML = data.modalidades.map((mode) => `<article class="study-mode study-mode--${escapeHTML(mode.accent)}" data-study-mode="${escapeHTML(mode.id)}"><span class="study-mode__icon" aria-hidden="true">${escapeHTML(mode.icono)}</span><h3>${escapeHTML(mode.nombre)}</h3><p>${escapeHTML(mode.descripcion)}</p><button type="button" class="text-link" data-mode-select="${escapeHTML(mode.id)}">Conoce más <span aria-hidden="true">→</span></button></article>`).join('');
      $$('[data-mode-select]', modeHost).forEach((button) => button.addEventListener('click', () => {
        const mode = data.modalidades.find((item) => item.id === button.dataset.modeSelect);
        if (!mode) return;
        $$('.study-mode', modeHost).forEach((card) => card.classList.toggle('is-selected', card.dataset.studyMode === mode.id));
        if (program) program.value = mode.programa;
        if (mode.sede && campus) campus.value = mode.sede;
        if (finder) finder.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
      }));
    }
    if (finder && !finder.dataset.finderBound) {
      finder.dataset.finderBound = 'true';
      finder.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = new URLSearchParams();
        if (program && program.value) query.set('programa', program.value);
        if (area && area.value) query.set('area', area.value);
        const modality = $('[data-finder-modality]', finder);
        if (modality && modality.value) query.set('modalidad', modality.value);
        if (campus && campus.value) query.set('sede', campus.value);
        window.location.href = `carreras.html${query.toString() ? `?${query}` : ''}`;
      });
    }
  }

  function initCampuses() {
    const data = window.SenatiData;
    const list = $('[data-campus-list]');
    const map = $('[data-campus-map]');
    const markerLayer = map ? $('[data-campus-stage]', map) || map : null;
    const detail = $('[data-campus-detail]');
    const search = $('[data-campus-search]');
    if (!data || !list || !map || !markerLayer || !detail || list.dataset.campusesBound) return;
    list.dataset.campusesBound = 'true';
    let selected = data.campuses.find((campus) => campus.id === 'independencia') || data.campuses[0];
    let filter = '';
    const campusCard = (campus) => `<button type="button" class="campus-list__item ${campus.id === selected.id ? 'is-active' : ''}" data-campus-id="${escapeHTML(campus.id)}"><span aria-hidden="true">⌖</span><span><strong>${escapeHTML(campus.name)}</strong><small>${escapeHTML(campus.region)}, ${escapeHTML(campus.city)}</small></span><b aria-hidden="true">›</b></button>`;
    const renderDetail = () => {
      const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.address)}`;
      detail.innerHTML = `<p class="eyebrow">Sede seleccionada</p><h3>${escapeHTML(selected.name)}</h3><p>${escapeHTML(selected.region)}, ${escapeHTML(selected.city)}</p><ul><li>⌖ ${escapeHTML(selected.address)}</li><li>☎ ${escapeHTML(selected.phone)}</li><li>◷ ${escapeHTML(selected.modalities.join(' · '))}</li></ul><p class="campus-detail__label">Especialidades destacadas</p><p class="campus-detail__programs">${escapeHTML(selected.programs.join(' · '))}</p><div><a class="button button--primary button--compact" href="carreras.html?sede=${encodeURIComponent(selected.city)}">Ver especialidades en esta sede</a><span class="campus-detail__links"><a class="text-link" href="${directions}" target="_blank" rel="noopener">Cómo llegar →</a><a class="text-link" href="#whatsapp" data-whatsapp-link>Consultar por WhatsApp →</a></span></div>`;
      initWhatsApp();
    };
    const render = (focusTarget = '') => {
      const term = normalize(search ? search.value : '');
      const visible = data.campuses.filter((campus) => (!filter || campus.region === filter) && (!term || normalize(`${campus.name} ${campus.region} ${campus.city}`).includes(term)));
      if (!visible.some((campus) => campus.id === selected.id)) selected = visible[0] || data.campuses[0];
      list.innerHTML = visible.map(campusCard).join('') || '<p class="campus-empty">No encontramos una sede con esos criterios.</p>';
      markerLayer.querySelectorAll('[data-map-campus]').forEach((item) => item.remove());
      visible.forEach((campus) => { const button = doc.createElement('button'); button.type = 'button'; button.className = `map-marker ${campus.id === selected.id ? 'is-active' : ''}`; button.dataset.mapCampus = campus.id; button.style.setProperty('--x', `${campus.x}%`); button.style.setProperty('--y', `${campus.y}%`); button.setAttribute('aria-label', `${campus.name}, ${campus.region}`); button.setAttribute('aria-pressed', String(campus.id === selected.id)); button.innerHTML = '<span aria-hidden="true">●</span>'; markerLayer.appendChild(button); });
      renderDetail();
      $$('[data-campus-id]', list).forEach((button) => button.addEventListener('click', () => { selected = data.campuses.find((campus) => campus.id === button.dataset.campusId) || selected; render('map'); }));
      $$('[data-map-campus]', markerLayer).forEach((button) => button.addEventListener('click', () => { selected = data.campuses.find((campus) => campus.id === button.dataset.mapCampus) || selected; render('list'); }));
      const activeListItem = $(`[data-campus-id="${selected.id}"]`, list);
      if (activeListItem && focusTarget === 'list') activeListItem.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
      const focusElement = focusTarget === 'map' ? $(`[data-map-campus="${selected.id}"]`, map) : focusTarget === 'list' ? activeListItem : null;
      if (focusElement) focusElement.focus({ preventScroll: true });
    };
    $$('[data-campus-filter]').forEach((button) => button.addEventListener('click', () => { filter = button.dataset.campusFilter || ''; $$('[data-campus-filter]').forEach((item) => item.classList.toggle('is-active', item === button)); render(); }));
    if (search) search.addEventListener('input', render);
    render();
  }

  function renderDataSections() {
    const data = window.SenatiData;
    if (!data) return;
    $$('[data-area-select]').forEach((select) => {
      const current = new Set($$('option', select).map((option) => normalize(option.value)));
      data.areas.forEach((area) => {
        if (!current.has(normalize(area.nombre))) select.add(new Option(area.nombre, area.nombre));
      });
    });
    $$('[data-campus-select]').forEach((select) => {
      const current = new Set($$('option', select).map((option) => normalize(option.value)));
      data.sedes.forEach((campus) => {
        if (!current.has(normalize(campus))) select.add(new Option(campus, campus));
      });
    });
    const areaTrack = $('[data-areas-track], [data-areas-container]');
    if (areaTrack && !areaTrack.children.length) {
      areaTrack.innerHTML = data.areas.map((area) => `
        <article class="area-card area-card--${escapeHTML(area.id)}" style="--area-color:${escapeHTML(area.color)}">
          <div class="area-card__art"><img src="${escapeHTML(area.imagen)}" alt="Ilustración tecnológica de ${escapeHTML(area.nombre)}" loading="lazy"></div>
          <div class="area-card__content"><p class="area-card__count">${data.carreras.filter((career) => career.area === area.nombre).length} carreras</p><h3>${escapeHTML(area.nombre)}</h3><p>${escapeHTML(area.descripcion)}</p>
          <a class="text-link" href="carreras.html?area=${encodeURIComponent(area.nombre)}">Ver especialidades <span aria-hidden="true">→</span></a></div>
        </article>`).join('');
    }
    const testimonialTrack = $('[data-testimonials-track], [data-testimonials-container]');
    if (testimonialTrack && !testimonialTrack.children.length) {
      testimonialTrack.innerHTML = data.testimonios.map((item) => `
        <article class="testimonial-card">
          <span class="testimonial-card__quote" aria-hidden="true">“</span>
          <blockquote>${escapeHTML(item.testimonio)}</blockquote>
          <div class="testimonial-card__person">
            <img src="${escapeHTML(item.foto)}" alt="${escapeHTML(item.nombre)}, persona egresada de SENATI" loading="lazy">
            <div><h3>${escapeHTML(item.nombre)}</h3><p class="testimonial-card__career">${escapeHTML(item.carrera)}</p><p class="testimonial-card__year">Egreso ${escapeHTML(item.egreso)}</p></div>
          </div>
          <div class="testimonial-card__company"><span>Trabaja en</span><img src="${escapeHTML(item.logo)}" alt="${escapeHTML(item.empresa)}" loading="lazy"></div>
        </article>`).join('');
    }
    const companies = $('[data-companies], [data-companies-container]');
    if (companies && !companies.children.length) {
      companies.innerHTML = data.empresas.map((company) => `
        <div class="company-logo logo-strip__item"><img src="${escapeHTML(company.logo)}" alt="${escapeHTML(company.nombre)}" loading="lazy"><span class="sr-only">${escapeHTML(company.nombre)}</span></div>`).join('');
    }
    $$('img').forEach((img) => img.addEventListener('error', () => { img.hidden = true; }, { once: true }));
  }

  function initCarousel(root) {
    const track = $('[data-carousel-track], [data-testimonials-track], [data-testimonials-container], [data-areas-track], [data-areas-container], .carousel__track', root);
    if (!track || track.dataset.senatiCarouselBound) return;
    track.dataset.senatiCarouselBound = 'true';
    const items = () => Array.from(track.children);
    const previous = $('[data-carousel-prev], [data-carousel-previous], .carousel__prev, .carousel__button--previous', root);
    const next = $('[data-carousel-next], .carousel__next', root);
    const dots = $('[data-carousel-dots], .carousel__dots', root);
    let active = 0;

    const goTo = (index, focus = false) => {
      const slides = items();
      if (!slides.length) return;
      active = Math.max(0, Math.min(index, slides.length - 1));
      track.scrollTo({ left: slides[active].offsetLeft - track.offsetLeft, behavior: reducedMotion() ? 'auto' : 'smooth' });
      update(focus);
    };
    const update = (focus = false) => {
      const slides = items();
      if (previous) previous.disabled = active === 0;
      if (next) next.disabled = active === slides.length - 1;
      if (dots) {
        $$('button', dots).forEach((dot, index) => {
          dot.classList.toggle('is-active', index === active);
          dot.setAttribute('aria-current', index === active ? 'true' : 'false');
          if (focus && index === active) dot.focus();
        });
      }
    };
    if (dots && !dots.children.length) {
      dots.innerHTML = items().map((_, index) => `<button type="button" aria-label="Ir al elemento ${index + 1}"></button>`).join('');
      $$('button', dots).forEach((button, index) => button.addEventListener('click', () => goTo(index)));
    }
    if (previous) previous.addEventListener('click', () => goTo(active - 1));
    if (next) next.addEventListener('click', () => goTo(active + 1));
    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const slides = items();
        if (slides.length) active = slides.reduce((best, slide, index) => (
          Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.offsetLeft - track.scrollLeft) ? index : best
        ), 0);
        update();
        ticking = false;
      });
    }, { passive: true });
    update();
  }

  function initCarousels() {
    const roots = $$('[data-carousel], .carousel');
    $$('[data-testimonials-track], [data-testimonials-container], [data-areas-track], [data-areas-container]').forEach((track) => {
      const root = track.closest('section, [data-carousel], .carousel') || track.parentElement;
      if (root && !roots.includes(root)) roots.push(root);
    });
    roots.forEach(initCarousel);
  }

  function initWhatsApp() {
    const defaultConfig = (window.SenatiData && window.SenatiData.whatsapp) || { numero: '51000000000', mensaje: 'Hola, quisiera información sobre SENATI.' };
    const config = Object.assign({}, defaultConfig, window.SENATI_CONFIG && window.SENATI_CONFIG.whatsapp);
    let links = $$('[data-whatsapp], [data-whatsapp-link], .whatsapp-float, .whatsapp-link');
    if (!links.length) {
      const link = doc.createElement('a');
      link.className = 'whatsapp-float';
      link.dataset.whatsapp = '';
      link.innerHTML = '<span class="whatsapp-float__icon" aria-hidden="true">WA</span><span class="whatsapp-float__text">¿Tienes dudas? Chatea por WhatsApp</span>';
      doc.body.appendChild(link);
      links = [link];
    }
    links.forEach((link) => {
      const message = link.dataset.message || config.mensaje;
      link.href = `https://wa.me/${String(config.numero).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', 'Chatear por WhatsApp (se abre en una pestaña nueva)');
    });
  }

  function initBackToTop() {
    let button = $('[data-back-to-top], #backToTop, .back-to-top');
    if (!button) {
      button = doc.createElement('button');
      button.type = 'button';
      button.className = 'back-to-top';
      button.dataset.backToTop = '';
      button.setAttribute('aria-label', 'Volver al inicio');
      button.innerHTML = '<span aria-hidden="true">↑</span>';
      doc.body.appendChild(button);
    }
    const update = () => {
      const visible = window.scrollY > 520;
      button.classList.toggle('is-visible', visible);
      button.hidden = !visible;
      button.tabIndex = visible ? 0 : -1;
      button.setAttribute('aria-hidden', String(!visible));
    };
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' }));
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initSmoothScroll() {
    doc.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || link.getAttribute('href') === '#') return;
      const target = $(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  ready(() => {
    renderDataSections();
    initHeroCarousel();
    initStudyModesAndFinder();
    initCampuses();
    initMegaMenu();
    initMobileDrawer();
    initSearch();
    initAccordions();
    initForms();
    initCarousels();
    initWhatsApp();
    initBackToTop();
    initSmoothScroll();
  });

  window.SenatiApp = Object.freeze({ $, $$, ready, escapeHTML, normalize, initForms, initAccordions });
})();
