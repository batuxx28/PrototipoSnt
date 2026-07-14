(function () {
  'use strict';

  const app = window.SenatiApp || {};
  const $ = app.$ || ((selector, context = document) => context.querySelector(selector));
  const $$ = app.$$ || ((selector, context = document) => Array.from(context.querySelectorAll(selector)));
  const ready = app.ready || ((callback) => { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true }); else callback(); });
  const escapeHTML = app.escapeHTML || ((value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])));
  const mobileMedia = window.matchMedia('(max-width: 767px)');

  function setText(selector, value) {
    $$(selector).forEach((element) => { element.textContent = value; });
  }

  function renderList(selector, values) {
    const list = $(selector);
    if (!list || !values || !values.length) return;
    list.innerHTML = values.map((value) => `<li>${escapeHTML(value)}</li>`).join('');
  }

  function initTabs() {
    const tabLists = $$('[data-tabs], [role="tablist"]');
    tabLists.forEach((tabList, listIndex) => {
      if (tabList.dataset.senatiTabsBound || tabList.matches('[data-curriculum-tabs], #curriculum-tabs, .semester-tabs') || tabList.closest('[data-curriculum]')) return;
      let tabs = $$('[data-tab], [role="tab"]', tabList);
      if (!tabs.length) return;
      tabList.dataset.senatiTabsBound = 'true';
      tabList.setAttribute('role', 'tablist');
      const items = tabs.map((tab, index) => {
        const key = tab.dataset.tab || tab.getAttribute('aria-controls') || `detail-panel-${listIndex}-${index}`;
        const panel = document.getElementById(tab.getAttribute('aria-controls')) || $(`[data-tab-panel="${key}"], #${key}`);
        if (!panel) return null;
        if (!tab.id) tab.id = `detail-tab-${listIndex}-${index}`;
        if (!panel.id) panel.id = key;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);

        let accordion = $('[data-career-accordion-trigger]', panel);
        const existingAccordion = Boolean(accordion);
        if (!accordion) {
          accordion = document.createElement('button');
          accordion.type = 'button';
          accordion.className = 'detail-accordion__trigger';
          accordion.textContent = tab.textContent.trim();
          accordion.setAttribute('aria-controls', panel.id);
          accordion.hidden = true;
          panel.parentNode.insertBefore(accordion, panel);
        }
        const accordionTarget = document.getElementById(accordion.getAttribute('aria-controls')) || panel;
        accordion.addEventListener('click', () => {
          const expanded = accordion.getAttribute('aria-expanded') !== 'true';
          accordion.setAttribute('aria-expanded', String(expanded));
          if (accordionTarget !== panel) accordionTarget.hidden = !expanded;
          else panel.hidden = !expanded;
        });
        return { tab, panel, accordion, accordionTarget, existingAccordion };
      }).filter(Boolean);
      tabs = items.map((item) => item.tab);
      let active = Math.max(0, tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true' || tab.classList.contains('is-active')));

      const activate = (index, focus = true) => {
        active = (index + items.length) % items.length;
        items.forEach((item, itemIndex) => {
          const selected = itemIndex === active;
          item.tab.setAttribute('aria-selected', String(selected));
          item.tab.tabIndex = selected ? 0 : -1;
          item.tab.classList.toggle('is-active', selected);
          if (!mobileMedia.matches) item.panel.hidden = !selected;
        });
        if (focus) items[active].tab.focus();
      };
      items.forEach((item, index) => {
        item.tab.addEventListener('click', (event) => { event.preventDefault(); activate(index, false); });
        item.tab.addEventListener('keydown', (event) => {
          const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
          if (keys[event.key]) { event.preventDefault(); activate(active + keys[event.key]); }
          if (event.key === 'Home') { event.preventDefault(); activate(0); }
          if (event.key === 'End') { event.preventDefault(); activate(items.length - 1); }
        });
      });
      const syncMode = () => {
        const mobile = mobileMedia.matches;
        tabList.hidden = mobile;
        items.forEach((item, index) => {
          if (!item.existingAccordion) item.accordion.hidden = !mobile;
          if (mobile) {
            const expanded = item.accordion.hasAttribute('aria-expanded') ? item.accordion.getAttribute('aria-expanded') === 'true' : index === 0;
            item.accordion.setAttribute('aria-expanded', String(expanded));
            item.panel.hidden = false;
            if (item.accordionTarget !== item.panel) item.accordionTarget.hidden = !expanded;
          } else {
            item.panel.hidden = index !== active;
            if (item.accordionTarget !== item.panel) item.accordionTarget.hidden = false;
          }
        });
      };
      activate(active, false);
      syncMode();
      mobileMedia.addEventListener('change', syncMode);
    });
  }

  function renderCurriculum(container, semesters, separateTabs) {
    if (!container || !semesters || !semesters.length) return;
    const tabsHost = separateTabs || container;
    const contentHost = separateTabs ? container : null;
    if (separateTabs) {
      tabsHost.innerHTML = semesters.map((semester, index) => `<button type="button" role="tab" id="semester-tab-${index}" aria-controls="semester-panel-${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${escapeHTML(semester.semestre)}</button>`).join('');
      contentHost.innerHTML = semesters.map((semester, index) => `<section class="semester" id="semester-panel-${index}" role="tabpanel" aria-labelledby="semester-tab-${index}"><h3><button type="button" aria-expanded="${index === 0}" aria-controls="semester-courses-${index}"><span>${escapeHTML(semester.semestre)}</span><span aria-hidden="true">+</span></button></h3><div class="semester__courses" id="semester-courses-${index}" ${index === 0 ? '' : 'hidden'}><ul>${semester.cursos.map((course) => `<li>${escapeHTML(course)}</li>`).join('')}</ul></div></section>`).join('');
    } else {
      container.innerHTML = `<div class="semester-tabs" role="tablist" aria-label="Semestres de la malla curricular">${semesters.map((semester, index) => `<button type="button" role="tab" id="semester-tab-${index}" aria-controls="semester-panel-${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">${escapeHTML(semester.semestre)}</button>`).join('')}</div><div class="semester-content">${semesters.map((semester, index) => `<section class="semester-panel curriculum-courses" role="tabpanel" id="semester-panel-${index}" aria-labelledby="semester-tab-${index}" ${index === 0 ? '' : 'hidden'}>${semester.cursos.map((course) => `<p class="curriculum-course">${escapeHTML(course)}</p>`).join('')}</section>`).join('')}</div>`;
    }
    const tabs = $$('[role="tab"]', tabsHost);
    const panels = separateTabs ? $$('.semester', container) : $$('.semester-panel', container);
    let active = 0;
    const activate = (index, focus = true) => {
      active = (index + tabs.length) % tabs.length;
      tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === active;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        tab.classList.toggle('is-active', selected);
        panels[tabIndex].hidden = separateTabs && mobileMedia.matches ? false : !selected;
        if (separateTabs && selected) {
          const courses = $('.semester__courses', panels[tabIndex]);
          if (courses) courses.hidden = false;
        }
      });
      if (focus) tabs[active].focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index, false));
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); activate(active + 1); }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); activate(active - 1); }
        if (event.key === 'Home') { event.preventDefault(); activate(0); }
        if (event.key === 'End') { event.preventDefault(); activate(tabs.length - 1); }
      });
    });
    if (separateTabs) {
      $$('.semester h3 button', container).forEach((button) => button.addEventListener('click', () => {
        const courses = document.getElementById(button.getAttribute('aria-controls'));
        const expanded = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(expanded));
        if (courses) courses.hidden = !expanded;
      }));
      const syncSemesters = () => {
        panels.forEach((panel, index) => { panel.hidden = mobileMedia.matches ? false : index !== active; });
      };
      mobileMedia.addEventListener('change', syncSemesters);
      syncSemesters();
    }
    activate(0, false);
  }

  ready(() => {
    const data = window.SenatiData;
    if (!data) return;
    const requestedId = new URLSearchParams(window.location.search).get('id') || 'mecatronica-automotriz';
    const career = data.carreras.find((item) => item.id === requestedId) || data.carreras.find((item) => item.id === 'mecatronica-automotriz') || data.carreras[0];
    if (!career) return;

    setText('[data-career-name]', career.nombre);
    setText('[data-career-area]', career.area);
    setText('[data-career-program]', career.programa);
    setText('[data-career-duration]', career.duracion);
    setText('[data-career-modality]', career.modalidad.join(' / '));
    setText('[data-career-campuses]', career.sedes.join(', '));
    setText('[data-career-title], [data-career-degree]', career.titulo);
    setText('[data-career-description]', career.descripcion);
    setText('[data-career-breadcrumb]', career.nombre);
    setText('[data-career-description-title]', `Conviértete en especialista en ${career.nombre}`);
    setText('[data-career-description-secondary]', `Aprenderás en espacios equipados y desarrollarás proyectos vinculados a retos reales del área de ${career.area.toLowerCase()}.`);
    setText('[data-career-learning-title]', `Desarrolla competencias para ${career.nombre}`);
    setText('[data-career-demand]', career.demanda);

    const mainImage = $('[data-career-image], [data-career-main-image], #careerImage, .career-hero__image img');
    if (mainImage) {
      mainImage.src = career.imagen;
      mainImage.alt = `Representación tecnológica de ${career.nombre}`;
      mainImage.addEventListener('error', () => { mainImage.hidden = true; }, { once: true });
    }
    const gallery = $('[data-career-gallery], .career-gallery');
    if (gallery) {
      const images = career.galeria.length ? career.galeria : [career.imagen];
      const thumbHost = $('.career-gallery__thumbs', gallery) || gallery;
      let buttons = $$('[data-gallery-image], button', thumbHost);
      if (!buttons.length || career.id !== 'mecatronica-automotriz') {
        thumbHost.innerHTML = images.map((src, index) => `<button type="button" data-gallery-image="${escapeHTML(src)}" ${index === 0 ? 'class="is-active" aria-pressed="true"' : 'aria-pressed="false"'} aria-label="Ver imagen ${index + 1} de ${escapeHTML(career.nombre)}"><img src="${escapeHTML(src)}" alt="" loading="lazy"></button>`).join('');
        buttons = $$('button', thumbHost);
      }
      buttons.forEach((button, index) => button.addEventListener('click', () => {
        const selectedImage = button.dataset.galleryImage || images[index] || career.imagen;
        if (mainImage) {
          mainImage.hidden = false;
          mainImage.src = selectedImage;
        }
        buttons.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));
        buttons.forEach((item, itemIndex) => item.setAttribute('aria-pressed', String(itemIndex === index)));
      }));
      $$('img', gallery).forEach((img) => img.addEventListener('error', () => { img.hidden = true; }, { once: true }));
    }

    renderList('[data-learn-list], [data-learning-list], #learnList', career.aprenderas);
    renderList('[data-job-list], #jobList, [data-career-jobs], [data-workplaces-list]', career.campoLaboral);
    $$('[data-career-learning-image], [data-career-work-image]').forEach((imageElement) => {
      if (career.id !== 'mecatronica-automotriz') imageElement.src = career.imagen;
      imageElement.alt = `Representación del aprendizaje y campo profesional de ${career.nombre}`;
    });
    const requirements = $('[data-requirements-list], #requirementsList');
    if (requirements && career.requisitos.length) requirements.innerHTML = career.requisitos.map((requirement, index) => `<li><span>${index + 1}</span>${escapeHTML(requirement)}</li>`).join('');
    const curriculumContainer = $('[data-curriculum-container], [data-curriculum], #curriculum, .curriculum');
    renderCurriculum(curriculumContainer, data.mallas[career.id], $('[data-curriculum-tabs], #curriculum-tabs'));
    const related = $('[data-related-careers]');
    const relatedAll = $('[data-related-all]');
    if (relatedAll) relatedAll.href = `carreras.html?area=${encodeURIComponent(career.area)}`;
    if (related) {
      related.innerHTML = data.carreras.filter((item) => item.area === career.area && item.id !== career.id).slice(0, 3).map((item) => `
        <article class="career-card">
          <a class="career-card__image career-card__image-link" href="detalle-carrera.html?id=${encodeURIComponent(item.id)}"><img src="${escapeHTML(item.imagen)}" alt="Representación tecnológica de ${escapeHTML(item.nombre)}" loading="lazy"></a>
          <div class="career-card__body"><span class="category-badge career-card__tag">${escapeHTML(item.area)}</span><h3><a href="detalle-carrera.html?id=${encodeURIComponent(item.id)}">${escapeHTML(item.nombre)}</a></h3><p class="career-card__program">${escapeHTML(item.programa)}</p><a class="text-link" href="detalle-carrera.html?id=${encodeURIComponent(item.id)}">Ver más <span aria-hidden="true">→</span></a></div>
        </article>`).join('');
      $$('img', related).forEach((img) => img.addEventListener('error', () => { img.hidden = true; }, { once: true }));
    }

    $$('input[name="carrera"], select[name="carrera"], [data-career-input]').forEach((field) => {
      if (field.tagName === 'SELECT' && !Array.from(field.options).some((option) => option.value === career.nombre)) {
        field.add(new Option(career.nombre, career.nombre));
      }
      field.value = career.nombre;
    });
    $$('[data-whatsapp-career], [data-whatsapp-link]').forEach((link) => {
      const configuration = data.whatsapp || { numero: '51000000000' };
      const message = `Hola, quisiera recibir información sobre la carrera de ${career.nombre} en SENATI.`;
      link.href = `https://wa.me/${String(configuration.numero).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    $$('[data-open-lead-form]').forEach((button) => button.addEventListener('click', (event) => {
      const form = $('#detailForm, [data-detail-form], .career-form');
      if (!form) return;
      event.preventDefault();
      form.hidden = false;
      form.classList.add('is-open');
      form.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      const firstField = $('input, select, textarea', form);
      if (firstField) window.setTimeout(() => firstField.focus({ preventScroll: true }), 350);
    }));

    initTabs();
    document.title = `${career.nombre} | SENATI`;
  });
})();
