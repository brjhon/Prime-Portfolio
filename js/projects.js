// Pega botões e cards
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // ativa o botão clicado
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter; // "all", "html-css" ou "js"
    projectCards.forEach(card => {
      const category = card.dataset.category;
      // show se for "all" ou bater com a categoria
      if (filter === 'all' || filter === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
