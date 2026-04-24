// ============================================================
// LEXABYTE — app.js
// Filtros, busca e scroll reveal. Sem matrix rain, sem cursor.
// ============================================================

// ---- SCROLL REVEAL ----
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target); // dispara uma vez
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));
}

// ---- FILTROS ----
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const cards = document.querySelectorAll('.cards-grid .card, .cards-row .card');

    cards.forEach(card => {
      const badge = card.querySelector('.card-type-badge');
      const type = badge ? badge.textContent.trim().toLowerCase() : '';
      if (filter === 'all' || type === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ---- BUSCA ----
const searchInput = document.querySelector('.search-input');
const searchBtn   = document.querySelector('.search-btn');

function runSearch() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (!query) return;

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const title = card.querySelector('.card-title');
    const meta  = card.querySelector('.card-meta');
    const text  = ((title ? title.textContent : '') + ' ' + (meta ? meta.textContent : '')).toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });
}

if (searchBtn)  searchBtn.addEventListener('click', runSearch);
if (searchInput) {
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') runSearch();
    // limpar filtro ao apagar tudo
    if (e.key === 'Backspace' && searchInput.value.length <= 1) {
      document.querySelectorAll('.card').forEach(c => c.style.display = '');
    }
  });
}

// Backend integration: fetch materiais from Django API
const API_URL = 'http://127.0.0.1:8000/api/materiais/';
const cardsGrid = document.querySelector('.cards-grid.wide');

function formatType(tipo) {
  return tipo ? tipo.toLowerCase() : 'outro';
}

function createMaterialCard(material) {
  const card = document.createElement('div');
  card.className = 'card';
  const title = material.titulo || 'Sem título';
  const badge = formatType(material.tipo);
  const meta = material.autor_ou_criador || 'Sem autor';
  const actionLabel = material.link_acesso ? 'Acessar' : 'Ver';

  card.innerHTML = `
    <div class="card-thumb">
      <div class="card-thumb-placeholder">${title.split(' ').slice(0, 2).join(' ').toUpperCase()}</div>
      <span class="card-type-badge">${badge}</span>
      <div class="card-overlay">
        <button class="card-play">${actionLabel}</button>
      </div>
    </div>
    <div class="card-info">
      <div class="card-title">${title}</div>
      <div class="card-meta">${meta}</div>
    </div>
  `;

  return card;
}

async function loadMaterials() {
  if (!cardsGrid) return;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) return;
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) return;

    cardsGrid.innerHTML = '';
    data.slice(0, 5).forEach(material => cardsGrid.appendChild(createMaterialCard(material)));
  } catch (error) {
    console.warn('Erro ao buscar materiais:', error);
  }
}

loadMaterials();