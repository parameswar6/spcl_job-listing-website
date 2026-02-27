/* ============================================
   JOBHUNT — app.js
   All filter, render, modal, save, pagination logic
   ============================================ */

// ── State ──────────────────────────────────────
let allJobs = [];
let filteredJobs = [];
let savedJobs = new Set(JSON.parse(localStorage.getItem('savedJobs') || '[]'));
let currentPage = 1;
let currentModalJobId = null;
const JOBS_PER_PAGE = 6;

// Active filter state
const filters = {
  search: '',
  location: '',
  category: '',
  experience: '',
  type: '',
  sort: 'newest'
};

// ── Boot ───────────────────────────────────────
async function init() {
  try {
    const res = await fetch('jobs.json');
    allJobs = await res.json();
    filterJobs();
  } catch (e) {
    console.error('Failed to load jobs:', e);
  }
}

// ── Core Filter Function ───────────────────────
function filterJobs() {
  // Read live filter values
  filters.search    = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  filters.location  = document.getElementById('locationFilter')?.value || '';
  filters.category  = getActiveChip('categoryChips');
  filters.experience = getActiveChip('expChips');
  filters.type      = getActiveChip('typeChips');
  filters.sort      = document.getElementById('sortSelect')?.value || 'newest';

  filteredJobs = allJobs.filter(job => {
    const searchMatch = !filters.search || [
      job.title, job.company, job.description, job.category
    ].some(f => f.toLowerCase().includes(filters.search));

    const locationMatch  = !filters.location   || job.location === filters.location;
    const categoryMatch  = !filters.category   || job.category === filters.category;
    const expMatch       = !filters.experience || job.experience === filters.experience;
    const typeMatch      = !filters.type       || job.type === filters.type;

    return searchMatch && locationMatch && categoryMatch && expMatch && typeMatch;
  });

  // Sort
  if (filters.sort === 'az') {
    filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
  }
  // default: newest (JSON order)

  currentPage = 1;
  renderJobs();
  renderPagination();
  updateJobCount();
}

// ── Render Cards ───────────────────────────────
function renderJobs() {
  const grid = document.getElementById('jobsGrid');
  const empty = document.getElementById('emptyState');
  grid.innerHTML = '';

  if (filteredJobs.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const start = (currentPage - 1) * JOBS_PER_PAGE;
  const pageJobs = filteredJobs.slice(start, start + JOBS_PER_PAGE);

  pageJobs.forEach((job, index) => {
    const card = createCard(job, index);
    grid.appendChild(card);
  });
}

function createCard(job, index) {
  const isSaved = savedJobs.has(job.id);
  const card = document.createElement('div');
  card.className = 'job-card';
  card.style.animationDelay = `${index * 0.06}s`;
  card.style.setProperty('--card-accent', job.color);

  card.innerHTML = `
    <div class="card-top">
      <div class="card-logo" style="background:${job.color};">${job.logo}</div>
      <button class="card-save-btn ${isSaved ? 'saved' : ''}"
              onclick="toggleSave(event, ${job.id})"
              title="${isSaved ? 'Unsave Job' : 'Save Job'}">
        ${isSaved ? '🔖' : '🔖'}
      </button>
    </div>
    <div class="card-title">${job.title}</div>
    <div class="card-company">${job.company}</div>
    <div class="card-tags">
      <span class="tag tag-location">📍 ${job.location}</span>
      <span class="tag tag-exp">${capitalise(job.experience)}</span>
      <span class="tag tag-type">${job.type}</span>
      <span class="tag tag-category">${job.category}</span>
    </div>
    <p class="card-desc">${job.description}</p>
    <div class="card-footer">
      <span class="card-salary">${job.salary}</span>
      <span class="card-posted">${job.posted}</span>
    </div>
    <button class="btn-view" onclick="openModal(${job.id})">View Details →</button>
  `;

  return card;
}

// ── Pagination ─────────────────────────────────
function renderPagination() {
  const container = document.getElementById('pagination');
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  container.innerHTML = '';

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.textContent = i;
    btn.onclick = () => goToPage(i);
    container.appendChild(btn);
  }
}

function goToPage(page) {
  currentPage = page;
  renderJobs();
  renderPagination();
  document.querySelector('.jobs-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Count Label ────────────────────────────────
function updateJobCount() {
  const el = document.getElementById('jobCount');
  const total = filteredJobs.length;
  el.textContent = total === 0
    ? 'No jobs found'
    : `Showing ${Math.min(JOBS_PER_PAGE, total)} of ${total} job${total > 1 ? 's' : ''}`;
}

// ── Modal ──────────────────────────────────────
function openModal(id) {
  const job = allJobs.find(j => j.id === id);
  if (!job) return;
  currentModalJobId = id;

  document.getElementById('modalLogo').textContent = job.logo;
  document.getElementById('modalLogo').style.background = job.color;
  document.getElementById('modalTitle').textContent = job.title;
  document.getElementById('modalCompany').textContent = job.company;
  document.getElementById('modalDesc').textContent = job.description;
  document.getElementById('modalAbout').textContent = job.about;

  // Tags
  const tags = document.getElementById('modalTags');
  tags.innerHTML = `
    <span class="tag tag-location">📍 ${job.location}</span>
    <span class="tag tag-exp">${capitalise(job.experience)}</span>
    <span class="tag tag-type">${job.type}</span>
    <span class="tag tag-category">${job.category}</span>
    <span class="tag tag-salary" style="color:#fbbf24;border-color:rgba(251,191,36,0.25);background:rgba(251,191,36,0.08);">💰 ${job.salary}</span>
  `;

  // Requirements
  const reqList = document.getElementById('modalReqs');
  reqList.innerHTML = job.requirements.map(r => `<li>${r}</li>`).join('');

  // Save button state
  updateModalSaveBtn();

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModalBtn() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    closeModalBtn();
  }
}

function updateModalSaveBtn() {
  const btn = document.getElementById('modalSaveBtn');
  if (!btn) return;
  const isSaved = savedJobs.has(currentModalJobId);
  btn.textContent = isSaved ? '🔖 Saved!' : '🔖 Save Job';
  btn.classList.toggle('saved', isSaved);
}

// ── Save / Unsave ──────────────────────────────
function toggleSave(event, id) {
  event.stopPropagation();
  const wasSaved = savedJobs.has(id);
  if (wasSaved) {
    savedJobs.delete(id);
    showToast('Job removed from saved list.');
  } else {
    savedJobs.add(id);
    showToast('✅ Job saved successfully!');
  }
  persistSaved();
  renderJobs(); // re-render to update button state
  if (currentModalJobId === id) updateModalSaveBtn();
}

function toggleSaveFromModal() {
  if (currentModalJobId === null) return;
  toggleSave({ stopPropagation: () => {} }, currentModalJobId);
}

function persistSaved() {
  localStorage.setItem('savedJobs', JSON.stringify([...savedJobs]));
}

// ── Chip Selection ─────────────────────────────
function selectChip(el, groupId) {
  document.querySelectorAll(`#${groupId} .chip`).forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  filterJobs();
}

function getActiveChip(groupId) {
  const active = document.querySelector(`#${groupId} .chip.active`);
  return active ? active.dataset.value : '';
}

// ── Hero Search ────────────────────────────────
function applyHeroSearch() {
  const val = document.getElementById('heroSearch').value;
  const sidebarSearch = document.getElementById('searchInput');
  sidebarSearch.value = val;
  filterJobs();
  document.querySelector('.main-layout').scrollIntoView({ behavior: 'smooth' });
}

// Allow Enter key in hero search
document.addEventListener('DOMContentLoaded', () => {
  const heroInput = document.getElementById('heroSearch');
  if (heroInput) {
    heroInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyHeroSearch();
    });
  }
  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModalBtn();
  });
  init();
});

// ── Clear Filters ──────────────────────────────
function clearAllFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('locationFilter').value = '';
  document.getElementById('heroSearch').value = '';
  document.getElementById('sortSelect').value = 'newest';

  ['categoryChips', 'expChips', 'typeChips'].forEach(groupId => {
    const chips = document.querySelectorAll(`#${groupId} .chip`);
    chips.forEach(c => c.classList.remove('active'));
    chips[0]?.classList.add('active'); // reset to "All"
  });

  filterJobs();
  showToast('Filters cleared.');
}

// ── Toast ──────────────────────────────────────
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Utils ──────────────────────────────────────
function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
