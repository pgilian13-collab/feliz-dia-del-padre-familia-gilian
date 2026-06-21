document.addEventListener('DOMContentLoaded', () => {
    initSplash();
    initScrollAnimations();
    initGalleryEffects();
});

/* SPLASH SCREEN */
function initSplash() {
    const splash = document.getElementById('splash');
    if (!splash) return;
    document.body.style.overflow = 'hidden';

    splash.addEventListener('click', () => {
        splash.classList.add('hide');
        document.body.style.overflow = '';
        setTimeout(() => splash.remove(), 700);
    });

    document.addEventListener('keydown', function closeSplash(e) {
        splash.classList.add('hide');
        document.body.style.overflow = '';
        setTimeout(() => splash.remove(), 700);
        document.removeEventListener('keydown', closeSplash);
    });
}

/* SCROLL ANIMATIONS */
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

/* GALLERY HOVER EFFECTS */
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
}

/* LIGHTBOX */
function openLightbox(el) {
    const img = el.querySelector('.gallery-img');
    const caption = el.querySelector('.photo-caption');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbTitle = document.getElementById('lightbox-title');

    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbTitle.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
    if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-close')) {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/* FADE IN ANIMATION */
const s = document.createElement('style');
s.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}.fade-in{opacity:0;transform:translateY(20px);transition:opacity .8s ease,transform .8s ease}.fade-in.visible{opacity:1;transform:translateY(0)}';
document.head.appendChild(s);
