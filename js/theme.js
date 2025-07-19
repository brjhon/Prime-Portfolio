// Seletores
const switchBtn = document.getElementById('themeSwitch');
const body = document.body;
const icon = switchBtn.querySelector('i');

// Função de toggle
function toggleTheme() {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  icon.classList.toggle('bx-sun', !isDark);
  icon.classList.toggle('bx-moon', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Click no ícone
switchBtn.addEventListener('click', toggleTheme);

// Inicializa conforme preferência salva ou sistema
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    body.classList.add('dark');
    icon.classList.replace('bx-sun', 'bx-moon');
  }
})();
