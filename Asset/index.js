  // ------------------------------
    // Utilities
    // ------------------------------
    const $ = (sel, ctx=document) => ctx.querySelector(sel);
    const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

    // Persisted theme
    const applyTheme = (t) => {
      document.documentElement.classList.toggle('light', t === 'light');
      localStorage.setItem('theme', t);
      const pressed = t === 'light';
      $('#themeToggle')?.setAttribute('aria-pressed', pressed);
      $('#themeToggleM')?.setAttribute('aria-pressed', pressed);
    }
    const preferred = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    if (preferred === 'light') document.documentElement.classList.add('light');

    $('#themeToggle')?.addEventListener('click', () => applyTheme(document.documentElement.classList.contains('light') ? 'dark' : 'light'));
    $('#themeToggleM')?.addEventListener('click', () => applyTheme(document.documentElement.classList.contains('light') ? 'dark' : 'light'));

    // Mobile menu
    $('#menuBtn')?.addEventListener('click', () => {
      const m = $('#mobileMenu');
      const open = !m.classList.contains('open');
      m.classList.toggle('open', open);
      $('#menuBtn').setAttribute('aria-expanded', open);
    });

    // Smooth close menu on click
    $$('#mobileMenu a').forEach(a => a.addEventListener('click', ()=>{
      $('#mobileMenu').classList.remove('open');
      $('#menuBtn').setAttribute('aria-expanded', false);
    }));

    // In-view animations
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if (e.isIntersecting) e.target.classList.add('in-view'); })
    }, { threshold: .2 });
    $$('[data-animate]').forEach(el=> io.observe(el));

    // Project filters
    const applyFilter = (tag) => {
      $$('#projects .chip').forEach(c=> c.classList.toggle('active', c.dataset.filter === tag || (tag==='all' && c.dataset.filter==='all')));
      $$('#projectGrid .project').forEach(p => {
        const tags = p.dataset.tags.split(' ');
        const show = tag === 'all' || tags.includes(tag);
        p.style.display = show ? '' : 'none';
      });
    };
    $$('#projects .chip').forEach(chip => chip.addEventListener('click', () => applyFilter(chip.dataset.filter)));

    // Modals
    $$('[data-modal]').forEach(link => link.addEventListener('click', (e)=>{
      e.preventDefault();
      const sel = link.getAttribute('data-modal');
      const dlg = $(sel);
      dlg.showModal();
    }));
    $$('dialog [data-close]').forEach(btn => btn.addEventListener('click', ()=> btn.closest('dialog').close()));

    // Carousel
    const track = $('#testimonialTrack');
    const slides = $$('.testimonial', track);
    let index = 0;
    const setIndex = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      $('#tDots').textContent = `${index+1} • ${slides.length}`;
    };
    $('#prevT').addEventListener('click', ()=> setIndex(index-1));
    $('#nextT').addEventListener('click', ()=> setIndex(index+1));
    let auto = setInterval(()=> setIndex(index+1), 6000);
    track.addEventListener('pointerenter', ()=> clearInterval(auto));
    track.addEventListener('pointerleave', ()=> auto = setInterval(()=> setIndex(index+1), 6000));

    // Contact form (client-side demo)
    $('#contactForm').addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      const ok = data.name && data.email && data.message && /.+@.+\..+/.test(data.email);
      const status = $('#formStatus');
      if (!ok) { status.textContent = 'Please fill all fields with a valid email.'; status.style.color = 'var(--danger)'; return; }
      status.textContent = 'Thanks! Your message has been queued.';
      status.style.color = 'var(--accent)';
      e.target.reset();
    });

    // Year

    $('#year').textContent = new Date().getFullYear();
