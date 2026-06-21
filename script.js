// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyB9sCbeyBAmVsIqx2xmnAXx7-k_ejCzSyw",
    authDomain: "dia-del-padre-2b8b3.firebaseapp.com",
    projectId: "dia-del-padre-2b8b3",
    storageBucket: "dia-del-padre-2b8b3.firebasestorage.app",
    messagingSenderId: "154027044031",
    appId: "1:154027044031:web:0e8c6b560157e7849aaa0a"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const API_KEY = 'a94b54677ccacbd463a54545b578b3a3';

document.addEventListener('DOMContentLoaded', () => {
    initSplash();
    initScrollAnimations();
    initGalleryEffects();
    loadFamilyPhotos();
    initUpload();
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
        const uploadModal = document.getElementById('upload-modal');
        if (lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (uploadModal && uploadModal.classList.contains('active')) {
            uploadModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/* UPLOAD - FIREBASE */
function initUpload() {
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
}

let uploadFileData = null;

function handleUploadFile(file) {
    if (!file.type.startsWith('image/')) return;
    uploadFileData = file;
    const preview = document.getElementById('upload-preview');
    const previewImg = document.getElementById('upload-preview-img');
    previewImg.src = URL.createObjectURL(file);
    preview.style.display = 'block';
}

function openUploadModal() {
    document.getElementById('upload-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeUploadModal(e) {
    if (e.target.id === 'upload-modal' || e.target.classList.contains('lightbox-close')) {
        document.getElementById('upload-modal').classList.remove('active');
        document.body.style.overflow = '';
        resetUploadForm();
    }
}

function resetUploadForm() {
    uploadFileData = null;
    document.getElementById('upload-preview').style.display = 'none';
    document.getElementById('upload-status').textContent = '';
    document.getElementById('upload-status').className = 'upload-status';
    document.getElementById('upload-name-input').value = '';
    document.getElementById('upload-title-input').value = '';
    document.getElementById('upload-confirm-btn').disabled = false;
    document.getElementById('upload-confirm-btn').textContent = 'SUBIR FOTO';
}

async function confirmUpload() {
    if (!uploadFileData) return;

    const nameInput = document.getElementById('upload-name-input').value.trim();
    const titleInput = document.getElementById('upload-title-input').value.trim();
    if (!nameInput) {
        document.getElementById('upload-status').textContent = 'ESCRIBE TU NOMBRE';
        document.getElementById('upload-status').className = 'upload-status error';
        return;
    }

    const photoTitle = titleInput || nameInput.toUpperCase();

    const btn = document.getElementById('upload-confirm-btn');
    const status = document.getElementById('upload-status');
    btn.disabled = true;
    btn.textContent = 'SUBIENDO...';
    status.textContent = 'SUBIENDO A IMGBB...';
    status.className = 'upload-status uploading';

    const formData = new FormData();
    formData.append('image', uploadFileData);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`imgBB respondió ${res.status}: ${errText}`);
        }

        const data = await res.json();

        if (data.success) {
            status.textContent = 'GUARDANDO EN LA NUBE...';

            await db.collection('family-photos').add({
                name: nameInput,
                title: photoTitle,
                url: data.data.url,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            status.textContent = 'FOTO SUBIDA EXITOSAMENTE';
            status.className = 'upload-status success';
            btn.textContent = 'SUBIDA OK';

            setTimeout(() => {
                document.getElementById('upload-modal').classList.remove('active');
                document.body.style.overflow = '';
                resetUploadForm();
            }, 1500);
        } else {
            throw new Error(`imgBB error: ${JSON.stringify(data)}`);
        }
    } catch (err) {
        console.error('Upload error:', err);
        status.textContent = 'ERROR: ' + err.message.substring(0, 80);
        status.className = 'upload-status error';
        btn.disabled = false;
        btn.textContent = 'REIntentAR';
    }
}

/* LOAD PHOTOS FROM FIREBASE */
function loadFamilyPhotos() {
    db.collection('family-photos').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                const photo = change.doc.data();
                addUserPhotoToGallery({ ...photo, id: change.doc.id });
            }
            if (change.type === 'removed') {
                const el = document.querySelector(`[data-photo-id="${change.doc.id}"]`);
                if (el) el.remove();
            }
        });
    });
}

function addUserPhotoToGallery(photo) {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;
    if (grid.querySelector(`[data-photo-id="${photo.id}"]`)) return;

    const displayTitle = (photo.title || photo.name).toUpperCase();

    const item = document.createElement('div');
    item.className = 'gallery-item user-photo';
    item.setAttribute('data-photo-id', photo.id);
    item.setAttribute('onclick', 'openLightbox(this)');
    item.innerHTML = `
        <img src="${photo.url}" alt="${displayTitle}" class="gallery-img">
        <div class="photo-caption">${displayTitle}</div>
        <div class="photo-author">${photo.name.toUpperCase()}</div>
        <button class="user-photo-remove" onclick="event.stopPropagation(); removeUserPhoto('${photo.id}')">X</button>
    `;
    grid.appendChild(item);
}

async function removeUserPhoto(id) {
    try {
        await db.collection('family-photos').doc(id).delete();
    } catch (err) {
        console.error('Error removing photo:', err);
    }
}

/* FADE IN ANIMATION */
const s = document.createElement('style');
s.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}.fade-in{opacity:0;transform:translateY(20px);transition:opacity .8s ease,transform .8s ease}.fade-in.visible{opacity:1;transform:translateY(0)}';
document.head.appendChild(s);

/* MUSIC PLAYER */
let musicPlaying = false;

function toggleMusic() {
    const audio = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');
    const bar = document.getElementById('music-bar');

    if (musicPlaying) {
        audio.pause();
        icon.innerHTML = '&#9654;';
        bar.classList.add('paused');
    } else {
        audio.play().catch(() => {});
        icon.innerHTML = '&#9646;&#9646;';
        bar.classList.remove('paused');
    }
    musicPlaying = !musicPlaying;
}

/* SLIDESHOW */
let slideshowImages = [];
let slideshowIndex = 0;
let slideshowInterval = null;

function getSlideshowData() {
    const items = document.querySelectorAll('.gallery-grid .gallery-item');
    slideshowImages = [];
    items.forEach(item => {
        const img = item.querySelector('.gallery-img');
        const caption = item.querySelector('.photo-caption');
        if (img) {
            slideshowImages.push({
                src: img.src,
                caption: caption ? caption.textContent : ''
            });
        }
    });
}

function openSlideshow() {
    getSlideshowData();
    if (slideshowImages.length === 0) return;

    slideshowIndex = 0;
    showSlideshowSlide();
    document.getElementById('slideshow').classList.add('active');
    document.body.style.overflow = 'hidden';

    slideshowInterval = setInterval(() => {
        slideshowIndex = (slideshowIndex + 1) % slideshowImages.length;
        showSlideshowSlide();
    }, 4000);
}

function closeSlideshow() {
    clearInterval(slideshowInterval);
    document.getElementById('slideshow').classList.remove('active');
    document.body.style.overflow = '';
}

function showSlideshowSlide() {
    const data = slideshowImages[slideshowIndex];
    document.getElementById('slideshow-img').src = data.src;
    document.getElementById('slideshow-caption').textContent = data.caption;
    document.getElementById('slideshow-counter').textContent = `${slideshowIndex + 1} / ${slideshowImages.length}`;
}

function slideshowNext() {
    clearInterval(slideshowInterval);
    slideshowIndex = (slideshowIndex + 1) % slideshowImages.length;
    showSlideshowSlide();
    slideshowInterval = setInterval(() => {
        slideshowIndex = (slideshowIndex + 1) % slideshowImages.length;
        showSlideshowSlide();
    }, 4000);
}

function slideshowPrev() {
    clearInterval(slideshowInterval);
    slideshowIndex = (slideshowIndex - 1 + slideshowImages.length) % slideshowImages.length;
    showSlideshowSlide();
    slideshowInterval = setInterval(() => {
        slideshowIndex = (slideshowIndex + 1) % slideshowImages.length;
        showSlideshowSlide();
    }, 4000);
}
