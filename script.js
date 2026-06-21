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

/* UPLOAD FUNCTIONALITY */
const API_KEY = 'c8e4ab9ab62f6479c4842eda4c204407';
let uploadFile = null;

function openUploadModal() {
    document.getElementById('upload-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    loadUserPhotos();
}

function closeUploadModal(e) {
    if (e.target.id === 'upload-modal' || e.target.classList.contains('lightbox-close')) {
        document.getElementById('upload-modal').classList.remove('active');
        document.body.style.overflow = '';
        resetUploadForm();
    }
}

function resetUploadForm() {
    uploadFile = null;
    document.getElementById('upload-preview').style.display = 'none';
    document.getElementById('upload-status').textContent = '';
    document.getElementById('upload-status').className = 'upload-status';
    document.getElementById('upload-name-input').value = '';
    document.getElementById('upload-confirm-btn').disabled = false;
    document.getElementById('upload-confirm-btn').textContent = 'SUBIR FOTO';
}

// Dropzone events
document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('upload-dropzone');
    const input = document.getElementById('upload-input');

    if (!dropzone || !input) return;

    dropzone.addEventListener('click', () => input.click());
    dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.style.borderColor = 'var(--accent)'; });
    dropzone.addEventListener('dragleave', () => { dropzone.style.borderColor = ''; });
    dropzone.addEventListener('drop', e => {
        e.preventDefault();
        dropzone.style.borderColor = '';
        if (e.dataTransfer.files.length) handleUploadFile(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', e => {
        if (e.target.files.length) handleUploadFile(e.target.files[0]);
    });
});

function handleUploadFile(file) {
    if (!file.type.startsWith('image/')) return;
    uploadFile = file;
    const preview = document.getElementById('upload-preview');
    const previewImg = document.getElementById('upload-preview-img');
    previewImg.src = URL.createObjectURL(file);
    preview.style.display = 'block';
}

async function confirmUpload() {
    if (!uploadFile) return;

    const nameInput = document.getElementById('upload-name-input').value.trim();
    if (!nameInput) {
        document.getElementById('upload-status').textContent = 'ESCRIBE TU NOMBRE';
        document.getElementById('upload-status').className = 'upload-status error';
        return;
    }

    const btn = document.getElementById('upload-confirm-btn');
    const status = document.getElementById('upload-status');
    btn.disabled = true;
    btn.textContent = 'SUBIENDO...';
    status.textContent = 'SUBIENDO A IMGBB...';
    status.className = 'upload-status uploading';

    const formData = new FormData();
    formData.append('image', uploadFile);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            const url = data.data.url;
            const photo = { name: nameInput, url: url, id: Date.now() };

            // Save to localStorage
            const photos = JSON.parse(localStorage.getItem('family-photos') || '[]');
            photos.push(photo);
            localStorage.setItem('family-photos', JSON.stringify(photos));

            // Add to gallery
            addUserPhotoToGallery(photo);

            status.textContent = 'FOTO SUBIDA EXITOSAMENTE';
            status.className = 'upload-status success';
            btn.textContent = 'SUBIDA OK';

            setTimeout(() => {
                document.getElementById('upload-modal').classList.remove('active');
                document.body.style.overflow = '';
                resetUploadForm();
            }, 1500);
        } else {
            throw new Error('Upload failed');
        }
    } catch (err) {
        status.textContent = 'ERROR AL SUBIR, INTENTA DE NUEVO';
        status.className = 'upload-status error';
        btn.disabled = false;
        btn.textContent = 'SUBIR FOTO';
    }
}

function loadUserPhotos() {
    const photos = JSON.parse(localStorage.getItem('family-photos') || '[]');
    photos.forEach(photo => addUserPhotoToGallery(photo));
}

function addUserPhotoToGallery(photo) {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    // Check if already exists
    if (grid.querySelector(`[data-photo-id="${photo.id}"]`)) return;

    const item = document.createElement('div');
    item.className = 'gallery-item user-photo';
    item.setAttribute('data-photo-id', photo.id);
    item.setAttribute('onclick', 'openLightbox(this)');
    item.innerHTML = `
        <img src="${photo.url}" alt="${photo.name}" class="gallery-img">
        <div class="photo-caption">${photo.name.toUpperCase()}</div>
        <button class="user-photo-remove" onclick="event.stopPropagation(); removeUserPhoto(${photo.id})">X</button>
    `;
    grid.appendChild(item);
}

function removeUserPhoto(id) {
    const photos = JSON.parse(localStorage.getItem('family-photos') || '[]');
    const updated = photos.filter(p => p.id !== id);
    localStorage.setItem('family-photos', JSON.stringify(updated));
    const el = document.querySelector(`[data-photo-id="${id}"]`);
    if (el) el.remove();
}
