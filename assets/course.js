'use strict';
const menu = document.getElementById('menu-toggle');
const sidebar = document.getElementById('course-nav');
menu?.addEventListener('click', () => {
  const open = sidebar.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close menu' : 'Menu';
});
for (const button of document.querySelectorAll('.copy-code')) {
  button.addEventListener('click', async () => {
    const code = button.closest('.code-block').querySelector('code');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('No clipboard');
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied';
      setTimeout(() => button.textContent = 'Copy code', 2000);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Selected - press Ctrl/Cmd+C';
    }
  });
}
const storageKey = 'zanzibar-atlas-course-progress-v1';
let completed = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) completed = saved.filter(v => typeof v === 'string');
} catch { /* Lessons remain readable when storage is blocked. */ }
const validIds = [...document.querySelectorAll('[data-unit]')]
  .map(a => a.dataset.unit);
completed = [...new Set(completed)].filter(id => validIds.includes(id));
function updateProgress() {
  for (const link of document.querySelectorAll('[data-unit]')) {
    const tick = link.querySelector('.nav-tick');
    if (tick) tick.textContent = completed.includes(link.dataset.unit) ? '✓' : '';
  }
  const count = document.getElementById('progress-count');
  if (count) count.textContent = `${completed.length} of 10 units completed`;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = `${completed.length * 10}%`;
}
const checkbox = document.getElementById('unit-complete');
if (checkbox) {
  const id = document.body.dataset.unit;
  checkbox.checked = completed.includes(id);
  checkbox.addEventListener('change', () => {
    completed = completed.filter(v => v !== id);
    if (checkbox.checked) completed.push(id);
    try { localStorage.setItem(storageKey, JSON.stringify(completed)); }
    catch { document.getElementById('storage-status').textContent =
      'Progress works for this page but cannot be saved in this browser.'; }
    updateProgress();
  });
}
updateProgress();
