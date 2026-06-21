/* ===========================================
   DÍA DEL PADRE - SCRIPTS
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initScrollAnimations();
    initGalleryEffects();
    initParallax();
});

/* ===========================================
   SCROLL ANIMATIONS
   =========================================== */

function initScrollAnimations() {
    const elements = document.querySelectorAll('.message-card, .gallery-item, .video-card, .quote-container');
    
    elements.forEach(el => {
        el.classList.add('fade-in');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ===========================================
   GALLERY EFFECTS
   =========================================== */

function initGalleryEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        // Add subtle rotation on hover
        item.addEventListener('mouseenter', function() {
            const rotation = (Math.random() - 0.5) * 2; // -1 to 1 degree
            this.style.transform = `scale(1.02) rotate(${rotation}deg)`;
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Lightbox functionality
    const photoPlaceholders = document.querySelectorAll('.photo-placeholder');
    photoPlaceholders.forEach(placeholder => {
        placeholder.style.cursor = 'pointer';
        placeholder.addEventListener('click', function() {
            showPhotoMessage(this);
        });
    });
}

function showPhotoMessage(element) {
    const photoText = element.querySelector('.placeholder-text').textContent;
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(61, 50, 41, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(145deg, #FFFEF9 0%, #F9F5ED 100%);
        padding: 3rem;
        max-width: 500px;
        text-align: center;
        border: 2px solid #C9A96E;
        position: relative;
    `;
    
    content.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">📷</div>
        <h3 style="font-family: 'Playfair Display', serif; color: #722F37; margin-bottom: 1rem;">${photoText}</h3>
        <p style="color: #6B5B4F; font-style: italic; margin-bottom: 1.5rem;">
            Para agregar tu foto, reemplaza esta sección con una etiqueta &lt;img&gt; en el HTML
        </p>
        <p style="font-size: 0.9rem; color: #8B7355;">
            Ejemplo: &lt;img src="tu-foto.jpg" alt="Descripción" style="width:100%; height:auto;"&gt;
        </p>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #8B7355;
            cursor: pointer;
        ">×</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close on click outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

/* ===========================================
   PARALLAX EFFECT
   =========================================== */

function initParallax() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (hero) {
            hero.style.backgroundPositionY = `${rate}px`;
        }
    });
}

/* ===========================================
   SMOOTH SCROLL FOR ANCHORS
   =========================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ===========================================
   TYPEWRITER EFFECT (Optional)
   =========================================== */

function typewriterEffect(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ===========================================
   HELPER: Add CSS animation keyframes
   =========================================== */

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
