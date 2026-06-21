document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initGalleryEffects();
});

function initScrollAnimations() {
    const elements = document.querySelectorAll('.poster-card, .gallery-item, .video-card, .quote-poster');
    elements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

function initGalleryEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const r = (Math.random() - 0.5) * 2;
            this.style.transform = `scale(1.02) rotate(${r}deg)`;
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    const placeholders = document.querySelectorAll('.photo-placeholder');
    placeholders.forEach(ph => {
        ph.style.cursor = 'pointer';
        ph.addEventListener('click', function() {
            const name = this.querySelector('.placeholder-text').textContent;
            showModal(name);
        });
    });
}

function showModal(name) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(10,10,10,0.95);display:flex;justify-content:center;align-items:center;z-index:10000;animation:fadeIn .3s ease;';

    const c = document.createElement('div');
    c.style.cssText = 'background:#fdfdfa;padding:3rem;max-width:500px;text-align:center;border:2px solid #0a0a0a;box-shadow:8px 8px 0px #ff2a00;position:relative;';

    c.innerHTML = `
        <div style="font-family:Impact;font-size:3rem;margin-bottom:1rem;color:#0a0a0a;">+</div>
        <h3 style="font-family:Impact;color:#0a0a0a;margin-bottom:1rem;font-size:1.5rem;text-transform:uppercase;">${name}</h3>
        <p style="color:#666;font-family:Georgia;font-style:italic;margin-bottom:1.5rem;">Para agregar tu foto, reemplaza esta seccion con una etiqueta img en el HTML</p>
        <p style="font-size:0.8rem;color:#999;font-family:'Courier New';">&lt;img src="tu-foto.jpg" alt="descripcion"&gt;</p>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="position:absolute;top:10px;right:15px;background:none;border:none;font-size:1.5rem;color:#0a0a0a;cursor:pointer;font-family:Impact;">X</button>
    `;

    modal.appendChild(c);
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.addEventListener('keydown', function h(e) {
        if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', h); }
    });
}

const s = document.createElement('style');
s.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}.fade-in{opacity:0;transform:translateY(20px);transition:opacity .8s ease,transform .8s ease}.fade-in.visible{opacity:1;transform:translateY(0)}';
document.head.appendChild(s);
