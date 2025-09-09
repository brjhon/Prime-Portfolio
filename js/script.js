// anima as barras de skills quando a seção entra na tela
(function () {
  const bars = [...document.querySelectorAll('.meter > span[data-width]')];
  if (!bars.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        if (!el.dataset.animated) {
          el.style.width = el.dataset.width;
          el.dataset.animated = '1';
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: .4 });
  bars.forEach(b => obs.observe(b));
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

// Revela os cartões da timeline ao entrar na tela
(function () {
  const cards = [...document.querySelectorAll('.tl-card')];
  if (!cards.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .35 });
  cards.forEach(c => io.observe(c));
})();

/* ---------------Secão do Projetos -------------------- */
(function(){
  const grid = document.getElementById('projectsGrid');
  if(!grid) return;

  const cards = [...grid.querySelectorAll('.project-card')];
  const search = document.getElementById('projSearch');
  const sortSel = document.getElementById('projSort');
  const chips = [...document.querySelectorAll('.filter-chip')];
  const counter = document.getElementById('projCount');
  const modal = document.getElementById('projModal');
  const modalBody = modal?.querySelector('.proj-body');
  const modalClose = modal?.querySelector('.proj-close');

  // revela cards ao carregar
  requestAnimationFrame(()=>cards.forEach(c=>c.classList.add('in')));

  // estado de filtros
  const state = { stack:'all', type:'all', status:'all', q:'', sort:'recent' };

  chips.forEach(ch => ch.addEventListener('click', ()=>{
    const key = ch.dataset.key, val = ch.dataset.value;
    // ativa visualmente dentro do mesmo grupo
    chips.filter(c=>c.dataset.key===key).forEach(c=>c.classList.remove('active'));
    ch.classList.add('active');
    state[key] = val;
    apply();
  }));

  search?.addEventListener('input', () => { state.q = search.value.trim().toLowerCase(); apply(); });
  sortSel?.addEventListener('change', () => { state.sort = sortSel.value; apply(); });

  function apply(){
    // ordenação
    const sorted = [...cards].sort((a,b)=>{
      if(state.sort==='az') return a.dataset.name.localeCompare(b.dataset.name);
      if(state.sort==='za') return b.dataset.name.localeCompare(a.dataset.name);
      // recent (desc by date)
      return (b.dataset.date||'').localeCompare(a.dataset.date||'');
    });
    sorted.forEach(c => grid.appendChild(c));

    let shown = 0;
    sorted.forEach(c=>{
      const okStack  = state.stack==='all'  || c.dataset.stack===state.stack;
      const okType   = state.type==='all'   || c.dataset.type===state.type;
      const okStatus = state.status==='all' || c.dataset.status===state.status;

      const q = state.q;
      const hay = (c.dataset.name + ' ' + (c.dataset.tags||'')).toLowerCase();
      const okSearch = !q || hay.includes(q);

      const show = okStack && okType && okStatus && okSearch;
      c.style.display = show ? '' : 'none';
      if(show) shown++;
    });

    if(counter) counter.textContent = shown;
  }

  apply();

  // Quick view (modal)
  grid.addEventListener('click', (e)=>{
    const btn = e.target.closest('.btn-quick');
    if(!btn) return;
    const card = btn.closest('.project-card');
    const imgSrc = card.querySelector('img')?.getAttribute('src');
    const title = card.querySelector('h3')?.textContent || '';
    const text  = card.querySelector('p')?.textContent || '';
    const links = [...card.querySelectorAll('.project-links a')];

    modalBody.innerHTML = `
      <img src="${imgSrc}" alt="${title}">
      <div class="content">
        <h3>${title}</h3>
        <p>${text}</p>
        <div class="links">
          ${links.map(a=>`<a class="btn" target="_blank" rel="noopener" href="${a.href}">${a.textContent}</a>`).join('')}
        </div>
      </div>
    `;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
  }
})();

/* =================== Sesão do Modal do Contato ============ */
(function(){
  const modal = document.getElementById('contactModal');
  const dialog = modal?.querySelector('.contact-dialog');
  const closeBtn = modal?.querySelector('.contact-close');
  const form = modal?.querySelector('#contactForm');

  function openModal(e){
    if(e) e.preventDefault();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    dialog?.focus();
  }
  function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
  }

  // abre via qualquer elemento com data-contact-open OU links para #contact
  document.querySelectorAll('[data-contact-open], a[href="#contact"]')
    .forEach(el => el.addEventListener('click', openModal));

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && modal.classList.contains('show')) closeModal(); });

  // Validação simples
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const msg = form.querySelector('#message');
    [name,email,msg].forEach(i => i.classList.remove('input-error','input-success'));

    let ok = true;
    if(!name.value.trim()){ name.classList.add('input-error'); ok = false; }
    if(!/^\S+@\S+\.\S+$/.test(email.value)){ email.classList.add('input-error'); ok = false; }
    if(msg.value.trim().length < 8){ msg.classList.add('input-error'); ok = false; }

    if(ok){
      [name,email,msg].forEach(i => i.classList.add('input-success'));
      alert('Mensagem enviada! (demo)');
      form.reset();
      closeModal();
    }
  });
})();

/* ===============Sesão do rodapé =============== */
(function(){
  // ano automático
  const y=document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

  // botão voltar ao topo
  const topBtn=document.querySelector('.to-top');
  const onScroll=()=>{ if(window.scrollY>400){ topBtn?.classList.add('show'); } else { topBtn?.classList.remove('show'); } };
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  topBtn?.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
})();


// Spotlight segue o mouse nos cards
(function(){
  function attachSpotlight(scope){
    scope.addEventListener('mousemove', (e)=>{
      const el = e.target.closest('.project-card, .skill-item');
      if(!el) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
    });
  }
  attachSpotlight(document);
})();

// Barra de progresso no topo
(function(){
  const bar = document.getElementById('readProgress');
  if(!bar) return;
  const onScroll = ()=>{
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    const pct = Math.max(0, Math.min(1, scrolled / (height || 1)));
    bar.style.width = (pct * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

