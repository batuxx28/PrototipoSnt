(function () {
  'use strict';

  const app = window.SenatiApp || {};
  const $ = app.$ || ((selector, context = document) => context.querySelector(selector));
  const $$ = app.$$ || ((selector, context = document) => Array.from(context.querySelectorAll(selector)));
  const ready = app.ready || ((callback) => { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true }); else callback(); });
  const escapeHTML = app.escapeHTML || ((value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])));
  const normalize = app.normalize || ((value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase());
  const PER_PAGE = 6;

  function unique(values) {
    return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'es'));
  }

  function selectorsForFilter(key) {
    const ids = {
      area: '#areaFilter, #filterArea',
      programa: '#programFilter, #programaFilter, #filterPrograma',
      modalidad: '#modalityFilter, #modalidadFilter, #filterModalidad',
      sede: '#campusFilter, #sedeFilter, #filterSede'
    };
    return `[data-filter="${key}"], [name="${key}"], [name="${key}[]"], ${ids[key]}`;
  }

  ready(() => {
    const data = window.SenatiData;
    const grid = $('[data-career-results], [data-careers-container], #careerResults, #career-results-grid, .career-results__grid, .careers-grid, .career-grid');
    if (!data || !grid) return;

    const form = $('[data-filters-form], [data-career-filters], #careerFilters, #career-filters-form, .career-filters');
    const count = $('[data-results-count], #results-count, #resultsCount, .results-count');
    const title = $('[data-results-title], #resultsTitle');
    const empty = $('[data-empty-state], #emptyState, #no-results, .empty-results, .empty-state');
    const pagination = $('[data-pagination], #pagination, .pagination');
    const orders = $$('[data-sort], [data-sort-select], #sortCareers, #orderCareers, [name="orden"]');
    const order = orders[0] || null;
    const filterToggle = $('[data-filters-toggle], [data-filter-toggle], #filtersToggle, .filters-toggle, .filter-toggle');
    const filterPanel = (filterToggle && (document.getElementById(filterToggle.getAttribute('aria-controls')) || form)) || form;
    const clearButtons = $$('[data-clear-filters], #clearFilters, .clear-filters');
    const params = new URLSearchParams(window.location.search);
    let currentPage = Math.max(1, Number(params.get('pagina')) || 1);
    let filtered = [];

    function populateSelect(key, values) {
      $$(selectorsForFilter(key), form || document).filter((control) => control.tagName === 'SELECT').forEach((select) => {
        const currentValues = new Set($$('option', select).map((option) => normalize(option.value)));
        values.forEach((value) => {
          if (currentValues.has(normalize(value))) return;
          const option = document.createElement('option');
          option.value = value;
          option.textContent = value;
          select.appendChild(option);
        });
      });
    }

    populateSelect('area', unique(data.carreras.map((item) => item.area)));
    populateSelect('programa', unique(data.carreras.map((item) => item.programa)));
    populateSelect('modalidad', unique(data.carreras.flatMap((item) => item.modalidad)));
    populateSelect('sede', unique(data.carreras.flatMap((item) => item.sedes)));

    function controls(key) {
      return $$(selectorsForFilter(key), form || document);
    }

    function valuesFor(key) {
      return controls(key).filter((control) => {
        if (control.type === 'checkbox' || control.type === 'radio') return control.checked;
        return Boolean(control.value);
      }).map((control) => control.value).filter(Boolean);
    }

    function setFromParam(key) {
      const requested = params.getAll(key).concat(params.getAll(`${key}[]`));
      if (!requested.length) return;
      const paramMatches = (optionValue) => requested.some((value) => {
        const optionNormalized = normalize(optionValue);
        const requestedNormalized = normalize(value);
        if (optionNormalized === requestedNormalized) return true;
        if (key === 'programa' && /^\d$/.test(requestedNormalized)) return optionNormalized.includes(`${requestedNormalized} ano`);
        return requestedNormalized.length >= 3 && optionNormalized.includes(requestedNormalized);
      });
      controls(key).forEach((control) => {
        if (control.tagName === 'SELECT') {
          const option = Array.from(control.options).find((item) => paramMatches(item.value));
          if (option) control.value = option.value;
        } else {
          const match = paramMatches(control.value);
          if (control.type === 'checkbox' || control.type === 'radio') control.checked = match;
        }
      });
    }
    ['area', 'programa', 'modalidad', 'sede'].forEach(setFromParam);
    if (params.get('orden')) orders.forEach((control) => { control.value = params.get('orden'); });

    function matches(item, key, selected) {
      if (!selected.length) return true;
      const source = Array.isArray(item[key]) ? item[key] : [item[key]];
      return selected.some((choice) => source.some((value) => normalize(value) === normalize(choice)));
    }

    function currentState() {
      return {
        area: valuesFor('area'),
        programa: valuesFor('programa'),
        modalidad: valuesFor('modalidad'),
        sede: valuesFor('sede'),
        orden: order ? order.value : 'relevant'
      };
    }

    function sortItems(items, sort) {
      const copy = [...items];
      if (/nombre-?asc|name-?asc|alfabetico|az/i.test(sort)) copy.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
      if (/nombre-?desc|name-?desc|za/i.test(sort)) copy.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'));
      if (/duracion|corta/i.test(sort)) copy.sort((a, b) => parseInt(a.duracion, 10) - parseInt(b.duracion, 10));
      return copy;
    }

    function careerCard(item) {
      const modalities = item.modalidad.join(' · ');
      const campuses = item.sedes.slice(0, 3).join(', ');
      const extraCampuses = item.sedes.length > 3 ? ` +${item.sedes.length - 3}` : '';
      return `
        <article class="career-card" data-area="${escapeHTML(item.color)}">
          <a class="career-card__image career-card__image-link" href="detalle-carrera.html?id=${encodeURIComponent(item.id)}" aria-label="Conocer la carrera ${escapeHTML(item.nombre)}">
            <img src="${escapeHTML(item.imagen)}" alt="Representación tecnológica de ${escapeHTML(item.nombre)}" loading="lazy">
          </a>
          <div class="career-card__body">
            <span class="category-badge career-card__tag">${escapeHTML(item.area)}</span>
            <h2><a href="detalle-carrera.html?id=${encodeURIComponent(item.id)}">${escapeHTML(item.nombre)}</a></h2>
            <p class="career-card__program">${escapeHTML(item.programa)} · ${escapeHTML(modalities)}</p>
            <ul class="career-card__metadata"><li class="career-card__meta">${escapeHTML(modalities)}</li><li class="career-card__locations"><span class="sr-only">Sedes: </span>${escapeHTML(campuses + extraCampuses)}</li></ul>
            <p class="career-card__demand"><span aria-hidden="true">↗</span><span>${escapeHTML(item.demanda)}</span></p>
            <a class="text-link" href="detalle-carrera.html?id=${encodeURIComponent(item.id)}">Ver más <span aria-hidden="true">→</span></a>
          </div>
        </article>`;
    }

    function visiblePageNumbers(totalPages) {
      if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
      const candidates = [1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter((page) => page > 0 && page <= totalPages);
      return [...new Set(candidates)].sort((a, b) => a - b);
    }

    function renderPagination(totalPages) {
      if (!pagination) return;
      if (totalPages <= 1) {
        pagination.innerHTML = '';
        pagination.hidden = true;
        return;
      }
      pagination.hidden = false;
      let previousPage = 0;
      const pageButtons = visiblePageNumbers(totalPages).map((page) => {
        const ellipsis = previousPage && page - previousPage > 1 ? '<span class="pagination__ellipsis" aria-hidden="true">…</span>' : '';
        previousPage = page;
        return `${ellipsis}<button type="button" data-page="${page}" ${page === currentPage ? 'class="is-active" aria-current="page"' : ''} aria-label="Ir a la página ${page}">${page}</button>`;
      }).join('');
      pagination.innerHTML = `
        <button type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Página anterior">←</button>
        ${pageButtons}
        <button type="button" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Página siguiente">→</button>`;
      $$('button[data-page]', pagination).forEach((button) => button.addEventListener('click', () => {
        currentPage = Number(button.dataset.page);
        render(false);
        const heading = title || grid;
        heading.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }));
    }

    function updateUrl(state) {
      if (!window.history || !window.history.replaceState) return;
      const query = new URLSearchParams();
      ['area', 'programa', 'modalidad', 'sede'].forEach((key) => state[key].forEach((value) => query.append(key, value)));
      if (state.orden && state.orden !== 'relevant') query.set('orden', state.orden);
      if (currentPage > 1) query.set('pagina', currentPage);
      window.history.replaceState({}, '', `${window.location.pathname}${query.toString() ? `?${query}` : ''}`);
    }

    function render(resetPage = true) {
      const state = currentState();
      if (resetPage) currentPage = 1;
      filtered = sortItems(data.carreras.filter((item) => (
        matches(item, 'area', state.area) &&
        matches(item, 'programa', state.programa) &&
        matches(item, 'modalidad', state.modalidad) &&
        matches(item, 'sedes', state.sede)
      )), state.orden);

      const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
      currentPage = Math.min(currentPage, totalPages);
      const start = (currentPage - 1) * PER_PAGE;
      const visible = filtered.slice(start, start + PER_PAGE);
      grid.innerHTML = visible.map(careerCard).join('');
      grid.setAttribute('aria-busy', 'false');
      $$('img', grid).forEach((img) => img.addEventListener('error', () => { img.hidden = true; }, { once: true }));
      if (count) count.textContent = (count.hasAttribute('data-count-only') || count.tagName === 'STRONG' || count.id === 'results-count') ? String(filtered.length) : `${filtered.length} ${filtered.length === 1 ? 'carrera encontrada' : 'carreras encontradas'}`;
      const activeLabel = $('#active-search-label');
      if (activeLabel) activeLabel.textContent = state.area.length === 1 ? state.area[0] : 'Todas las carreras';
      else if (title) title.textContent = state.area.length === 1 ? `Resultados para: ${state.area[0]}` : 'Encuentra la carrera ideal para ti';
      const selectedEntries = ['area', 'programa', 'modalidad', 'sede'].flatMap((key) => state[key].map((value) => ({ key, value })));
      const filterCount = $('[data-filter-count]');
      if (filterCount) {
        filterCount.textContent = String(selectedEntries.length);
        filterCount.hidden = selectedEntries.length === 0;
      }
      const activeFilters = $('[data-active-filters], #active-filters');
      if (activeFilters) {
        activeFilters.innerHTML = selectedEntries.map(({ key, value }) => `<button type="button" data-remove-filter="${escapeHTML(key)}" data-value="${escapeHTML(value)}" aria-label="Quitar filtro ${escapeHTML(value)}">${escapeHTML(value)} <span aria-hidden="true">×</span></button>`).join('');
        $$('[data-remove-filter]', activeFilters).forEach((button) => button.addEventListener('click', () => {
          controls(button.dataset.removeFilter).forEach((control) => {
            if (normalize(control.value) !== normalize(button.dataset.value)) return;
            if (control.type === 'checkbox' || control.type === 'radio') control.checked = false;
            else control.value = '';
          });
          render(true);
        }));
      }
      if (empty) {
        empty.hidden = filtered.length !== 0;
        if (!filtered.length && !empty.textContent.trim()) empty.textContent = 'No encontramos carreras con estos filtros. Prueba cambiando una o más opciones.';
      }
      grid.hidden = filtered.length === 0;
      renderPagination(totalPages);
      updateUrl(state);
    }

    if (form) {
      form.addEventListener('change', (event) => {
        if (event.target.matches('select, input[type="checkbox"], input[type="radio"]')) render(true);
      });
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        render(true);
        if (filterToggle && window.matchMedia('(max-width: 767px)').matches) {
          filterPanel.hidden = true;
          filterToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('filters-open');
          const backdrop = $('[data-filters-backdrop], .filters-backdrop');
          if (backdrop) backdrop.hidden = true;
        }
      });
    }
    orders.forEach((control) => control.addEventListener('change', () => {
      orders.forEach((other) => { if (other !== control) other.value = control.value; });
      render(true);
    }));
    clearButtons.forEach((button) => button.addEventListener('click', () => {
      if (form && form.tagName === 'FORM') form.reset();
      else controls('area').concat(controls('programa'), controls('modalidad'), controls('sede')).forEach((control) => {
        if (control.type === 'checkbox' || control.type === 'radio') control.checked = false;
        else control.value = '';
      });
      orders.forEach((control) => { control.value = 'relevant'; });
      render(true);
    }));

    if (filterToggle && filterPanel) {
      const closeButton = $('[data-filter-close]', filterPanel);
      const backdrop = $('[data-filters-backdrop], .filters-backdrop');
      if (!filterPanel.id) filterPanel.id = 'careerFiltersPanel';
      filterToggle.setAttribute('aria-controls', filterPanel.id);
      if (!filterToggle.hasAttribute('aria-expanded')) filterToggle.setAttribute('aria-expanded', 'false');
      const setPanel = (expanded) => {
        filterToggle.setAttribute('aria-expanded', String(expanded));
        filterPanel.hidden = !expanded;
        filterPanel.classList.toggle('is-open', expanded);
        if (backdrop) backdrop.hidden = !expanded;
        document.body.classList.toggle('filters-open', expanded);
        if (expanded && window.matchMedia('(max-width: 767px)').matches) {
          const firstControl = $('button, input, select, [tabindex]:not([tabindex="-1"])', filterPanel);
          if (firstControl) window.setTimeout(() => firstControl.focus(), 0);
        }
      };
      filterToggle.addEventListener('click', () => setPanel(filterToggle.getAttribute('aria-expanded') !== 'true'));
      if (closeButton) closeButton.addEventListener('click', () => { setPanel(false); filterToggle.focus(); });
      if (backdrop) backdrop.addEventListener('click', () => setPanel(false));
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && filterToggle.getAttribute('aria-expanded') === 'true') {
          setPanel(false);
          filterToggle.focus();
        }
      });
      filterPanel.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab' || filterToggle.getAttribute('aria-expanded') !== 'true') return;
        const focusable = $$('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])', filterPanel)
          .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
      const syncPanel = () => {
        const mobile = window.matchMedia('(max-width: 767px)').matches;
        filterPanel.hidden = mobile && filterToggle.getAttribute('aria-expanded') !== 'true';
        if (!mobile && backdrop) backdrop.hidden = true;
      };
      window.addEventListener('resize', syncPanel);
      syncPanel();
    }

    render(false);
  });
})();
