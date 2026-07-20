const projects = window.KHAI_PROJECTS || [];
const grid = document.getElementById('projectGrid');
const marketFilter = document.getElementById('marketFilter');
const serviceFilter = document.getElementById('serviceFilter');
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalGallery = document.getElementById('modalGallery');
const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');
const headerRight = document.querySelector('.header-right');

function uniqueValues(key) {
  return [...new Set(projects.map(project => project[key]))].sort();
}
function addOptions(select, values) {
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}
addOptions(marketFilter, uniqueValues('market'));
addOptions(serviceFilter, uniqueValues('service'));

function renderProjects() {
  const market = marketFilter.value;
  const service = serviceFilter.value;
  const filtered = projects.filter(project =>
    (market === 'all' || project.market === market) &&
    (service === 'all' || project.service === service)
  );

  grid.innerHTML = filtered.map(project => `
    <article class="project-card">
      <button type="button" data-project-id="${project.id}" aria-label="Open ${project.title}">
        <div class="thumb"><img src="${project.cover}" alt="${project.title}" loading="lazy"></div>
        <div class="meta">
          <span class="market">${project.market}</span>
          <h3>${project.title}</h3>
          <span class="service">${project.service}</span>
        </div>
      </button>
    </article>
  `).join('');

  grid.querySelectorAll('[data-project-id]').forEach(button => {
    button.addEventListener('click', () => openProject(Number(button.dataset.projectId)));
  });
}
function openProject(id) {
  const project = projects.find(item => item.id === id);
  if (!project) return;
  modalTitle.textContent = project.title;
  modalMeta.textContent = `${project.market} · ${project.service}`;
  modalGallery.innerHTML = project.images.map((src, index) =>
    `<figure><img src="${src}" alt="${project.title} project image ${index + 1}" loading="lazy"></figure>`
  ).join('');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}
function closeProject() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
marketFilter.addEventListener('change', renderProjects);
serviceFilter.addEventListener('change', renderProjects);
document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeProject));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeProject(); });

menuButton.addEventListener('click', () => {
  const open = headerRight.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  headerRight.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

renderProjects();

// Presentation polish interactions
const introLoader = document.getElementById('introLoader');
window.addEventListener('load', () => {
  window.setTimeout(() => introLoader?.classList.add('done'), 1450);
});

const revealTargets = document.querySelectorAll('.about-content, .about-image, .services-heading, .service-grid, .portfolio-heading, .filters, .portfolio-grid, .process-copy, .process ol, .contact > div, footer');
revealTargets.forEach((el) => {
  el.classList.add(el.matches('.service-grid, .process ol') ? 'reveal-stagger' : 'reveal');
});
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
revealTargets.forEach((el) => revealObserver.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: 0.48 });
sections.forEach((section) => sectionObserver.observe(section));

let lastScroll = 0;
const siteHeader = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 180) siteHeader?.classList.add('header-hidden');
  else siteHeader?.classList.remove('header-hidden');
  lastScroll = current;
}, { passive: true });

document.getElementById('pitchHint')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
