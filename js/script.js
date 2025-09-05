  // anima as barras de skills quando a seção entra na tela
  (function(){
    const bars=[...document.querySelectorAll('.meter > span[data-width]')];
    if(!bars.length) return;
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const el=e.target;
          if(!el.dataset.animated){
            el.style.width = el.dataset.width;
            el.dataset.animated = '1';
          }
          obs.unobserve(el);
        }
      });
    },{threshold:.4});
    bars.forEach(b=>obs.observe(b));
  })();


   // Filtro de projetos
    (function () {
      const btns = document.querySelectorAll('.filter-btn');
      const cards = document.querySelectorAll('.project-card');
      btns.forEach(b => b.addEventListener('click', () => {
        btns.forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const filter = b.dataset.filter;
        cards.forEach(c => { c.style.display = (filter === 'all' || c.dataset.category === filter) ? '' : 'none'; });
      }));
    })();

    // Theme switch opcional (se tiver um botão com id="themeSwitch")
    (function () {
      const key = 'jw-theme'; const saved = localStorage.getItem(key);
      if (saved === 'dark') { document.body.classList.add('dark'); }
      const sw = document.getElementById('themeSwitch');
      if (sw) {
        sw.addEventListener('click', () => {
          document.body.classList.toggle('dark');
          localStorage.setItem(key, document.body.classList.contains('dark') ? 'dark' : 'light');
        });
      }
    })();

    // Validação simples do contato (efeito de borda)
    (function () {
      const form = document.querySelector('.contact form'); if (!form) return;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const n = form.querySelector('#name');
        const m = form.querySelector('#message');
        const em = form.querySelector('#email');
        [n, em, m].forEach(i => i.classList.remove('input-error', 'input-success'));
        let ok = true;
        if (!n.value.trim()) { n.classList.add('input-error'); ok = false; }
        if (!/^\S+@\S+\.\S+$/.test(em.value)) { em.classList.add('input-error'); ok = false; }
        if (m.value.trim().length < 8) { m.classList.add('input-error'); ok = false; }
        if (ok) { [n, em, m].forEach(i => i.classList.add('input-success')); alert('Mensagem enviada! (demo)'); form.reset(); }
      });
    })();