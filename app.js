/**
 * app.js - Main app bootstrap
 * First-visit modals, language switcher, filter, search
 */

document.addEventListener('DOMContentLoaded', () => {
  initFirstVisit();
  initFlow();
  initLanguageSwitcher();
  initFilter();
  initSearch();
});

function initFirstVisit() {
  if (!isFirstVisit()) return;

  const profileModal = document.getElementById('profile-modal');
  const welcomeModal = document.getElementById('welcome-modal');

  profileModal.showModal();

  document.getElementById('profile-save-btn').addEventListener('click', () => {
    const input = document.getElementById('profile-name-input');
    const name = (input.value || '').trim();
    if (name) {
      setItem(STORAGE_KEYS.PROFILE_NAME, name);
    }
    profileModal.close();
    welcomeModal.showModal();
  });

  document.getElementById('welcome-close-btn').addEventListener('click', () => {
    setItem(STORAGE_KEYS.WELCOME_SEEN, 'true');
    welcomeModal.close();
  });
}

function initLanguageSwitcher() {
  const switcher = document.querySelector('.lang-switcher');
  const menu = document.getElementById('lang-menu');
  const currentLabel = document.querySelector('.lang-current');

  if (!switcher || !menu) return;

  switcher.addEventListener('click', () => {
    const isOpen = !menu.hidden;
    menu.hidden = !isOpen;
  });

  menu.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.dataset.lang;
      setItem(STORAGE_KEYS.LANGUAGE, lang);
      currentLabel.textContent = lang.toUpperCase();
      menu.hidden = true;
      // TODO: load translations and update UI
    });
  });
}

function initFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      // TODO: filter cards by status when cards are loaded
    });
  });
}

function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    // TODO: filter cards by search when cards are loaded
  });
}
