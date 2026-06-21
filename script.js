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
    initWall();
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

        // Iniciar música automáticamente
        const audio = document.getElementById('bg-music');
        const icon = document.getElementById('music-icon');
        const bar = document.getElementById('music-bar');
        if (audio) {
            audio.play().catch(() => {});
            icon.innerHTML = '&#9646;&#9646;';
            bar.classList.remove('paused');
            musicPlaying = true;
        }
    });

    document.addEventListener('keydown', function closeSplash(e) {
        splash.classList.add('hide');
        document.body.style.overflow = '';
        setTimeout(() => splash.remove(), 700);
        document.removeEventListener('keydown', closeSplash);

        // Iniciar música automáticamente
        const audio = document.getElementById('bg-music');
        const icon = document.getElementById('music-icon');
        const bar = document.getElementById('music-bar');
        if (audio) {
            audio.play().catch(() => {});
            icon.innerHTML = '&#9646;&#9646;';
            bar.classList.remove('paused');
            musicPlaying = true;
        }
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
let uploadFileData = null;
let uploadMode = 'foto'; // 'foto' or 'video'

function initUpload() {
    // Photo dropzone
    const dropzone = document.getElementById('upload-dropzone');
    const input = document.getElementById('upload-input');
    if (dropzone && input) {
        dropzone.addEventListener('click', () => input.click());
        dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.style.borderColor = 'var(--accent)'; });
        dropzone.addEventListener('dragleave', () => { dropzone.style.borderColor = ''; });
        dropzone.addEventListener('drop', e => {
            e.preventDefault();
            dropzone.style.borderColor = '';
            if (e.dataTransfer.files.length) handleUploadFile(e.dataTransfer.files[0], 'foto');
        });
        input.addEventListener('change', e => {
            if (e.target.files.length) handleUploadFile(e.target.files[0], 'foto');
        });
    }

    // Video dropzone
    const dropzoneV = document.getElementById('upload-dropzone-video');
    const inputV = document.getElementById('upload-input-video');
    if (dropzoneV && inputV) {
        dropzoneV.addEventListener('click', () => inputV.click());
        dropzoneV.addEventListener('dragover', e => { e.preventDefault(); dropzoneV.style.borderColor = 'var(--accent)'; });
        dropzoneV.addEventListener('dragleave', () => { dropzoneV.style.borderColor = ''; });
        dropzoneV.addEventListener('drop', e => {
            e.preventDefault();
            dropzoneV.style.borderColor = '';
            if (e.dataTransfer.files.length) handleUploadFile(e.dataTransfer.files[0], 'video');
        });
        inputV.addEventListener('change', e => {
            if (e.target.files.length) handleUploadFile(e.target.files[0], 'video');
        });
    }

    // Camera inputs
    const camFoto = document.getElementById('camera-input-foto');
    const camVideo = document.getElementById('camera-input-video');
    if (camFoto) {
        camFoto.addEventListener('change', e => {
            if (e.target.files.length) handleUploadFile(e.target.files[0], 'foto');
        });
    }
    if (camVideo) {
        camVideo.addEventListener('change', e => {
            if (e.target.files.length) handleUploadFile(e.target.files[0], 'video');
        });
    }
}

function switchUploadTab(tab) {
    uploadMode = tab;
    document.getElementById('tab-foto').classList.toggle('active', tab === 'foto');
    document.getElementById('tab-video').classList.toggle('active', tab === 'video');
    document.getElementById('upload-foto-tab').classList.toggle('active', tab === 'foto');
    document.getElementById('upload-video-tab').classList.toggle('active', tab === 'video');
    resetUploadForm();
}

function openCamera(type) {
    if (type === 'foto') {
        document.getElementById('camera-input-foto').click();
    } else {
        document.getElementById('camera-input-video').click();
    }
}

function handleUploadFile(file, mode) {
    uploadFileData = file;
    uploadMode = mode;
    const preview = document.getElementById('upload-preview');
    const previewImg = document.getElementById('upload-preview-img');
    const previewVideo = document.getElementById('upload-preview-video');

    if (mode === 'video') {
        previewImg.style.display = 'none';
        previewVideo.style.display = 'block';
        previewVideo.src = URL.createObjectURL(file);
    } else {
        previewVideo.style.display = 'none';
        previewImg.style.display = 'block';
        previewImg.src = URL.createObjectURL(file);
    }
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
    document.getElementById('upload-preview-img').style.display = 'block';
    document.getElementById('upload-preview-video').style.display = 'none';
    document.getElementById('upload-status').textContent = '';
    document.getElementById('upload-status').className = 'upload-status';
    document.getElementById('upload-name-input').value = '';
    document.getElementById('upload-title-input').value = '';
    document.getElementById('upload-confirm-btn').disabled = false;
    document.getElementById('upload-confirm-btn').textContent = 'SUBIR';
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
    status.textContent = uploadMode === 'video' ? 'SUBIENDO VIDEO...' : 'SUBIENDO A IMGBB...';
    status.className = 'upload-status uploading';

    try {
        let url = '';

        if (uploadMode === 'video') {
            // Upload video to Firebase Storage
            status.textContent = 'SUBIENDO VIDEO A LA NUBE...';
            const storageRef = firebase.storage().ref();
            const videoRef = storageRef.child(`family-videos/${Date.now()}-${uploadFileData.name}`);
            const snapshot = await videoRef.put(uploadFileData);
            url = await snapshot.ref.getDownloadURL();
        } else {
            // Upload photo to imgBB
            const formData = new FormData();
            formData.append('image', uploadFileData);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`imgBB respondió ${res.status}: ${errText}`);
            }
            const data = await res.json();
            if (!data.success) throw new Error(`imgBB error: ${JSON.stringify(data)}`);
            url = data.data.url;
        }

        status.textContent = 'GUARDANDO EN LA NUBE...';

        await db.collection('family-photos').add({
            name: nameInput,
            title: photoTitle,
            url: url,
            type: uploadMode,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        status.textContent = uploadMode === 'video' ? 'VIDEO SUBIDO EXITOSAMENTE' : 'FOTO SUBIDA EXITOSAMENTE';
        status.className = 'upload-status success';
        btn.textContent = 'SUBIDA OK';

        setTimeout(() => {
            document.getElementById('upload-modal').classList.remove('active');
            document.body.style.overflow = '';
            resetUploadForm();
        }, 1500);
    } catch (err) {
        console.error('Upload error:', err);
        status.textContent = 'ERROR: ' + err.message.substring(0, 80);
        status.className = 'upload-status error';
        btn.disabled = false;
        btn.textContent = 'REINTENTAR';
    }
}

/* LOAD CONTENT FROM FIREBASE */
function loadFamilyPhotos() {
    db.collection('family-photos').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                const item = change.doc.data();
                addUserDataToGallery({ ...item, id: change.doc.id });
            }
            if (change.type === 'removed') {
                const el = document.querySelector(`[data-photo-id="${change.doc.id}"]`);
                if (el) el.remove();
            }
        });
    });
}

function addUserDataToGallery(item) {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;
    if (grid.querySelector(`[data-photo-id="${item.id}"]`)) return;

    const displayTitle = (item.title || item.name).toUpperCase();
    const isVideo = item.type === 'video';

    const el = document.createElement('div');
    el.className = 'gallery-item user-photo' + (isVideo ? ' user-video' : '');
    el.setAttribute('data-photo-id', item.id);

    if (isVideo) {
        el.setAttribute('onclick', 'openVideoLightbox(this)');
        el.innerHTML = `
            <video class="gallery-img" preload="metadata" muted>
                <source src="${item.url}" type="video/mp4">
            </video>
            <div class="video-play-icon">&#9654;</div>
            <div class="photo-caption">${displayTitle}</div>
            <div class="photo-author">${item.name.toUpperCase()}</div>
            <button class="user-photo-remove" onclick="event.stopPropagation(); removeUserPhoto('${item.id}')">X</button>
        `;
    } else {
        el.setAttribute('onclick', 'openLightbox(this)');
        el.innerHTML = `
            <img src="${item.url}" alt="${displayTitle}" class="gallery-img">
            <div class="photo-caption">${displayTitle}</div>
            <div class="photo-author">${item.name.toUpperCase()}</div>
            <button class="user-photo-remove" onclick="event.stopPropagation(); removeUserPhoto('${item.id}')">X</button>
        `;
    }
    grid.appendChild(el);
}

function openVideoLightbox(el) {
    const video = el.querySelector('video');
    const caption = el.querySelector('.photo-caption');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbTitle = document.getElementById('lightbox-title');

    // Replace img with video in lightbox
    lbImg.style.display = 'none';
    let lbVideo = document.getElementById('lightbox-video');
    if (!lbVideo) {
        lbVideo = document.createElement('video');
        lbVideo.id = 'lightbox-video';
        lbVideo.style.cssText = 'max-width:100%;max-height:80vh;object-fit:contain;border:3px solid #fdfdfa;box-shadow:0 0 60px rgba(255,42,0,0.3);';
        lbVideo.controls = true;
        lbVideo.autoplay = true;
        document.querySelector('.lightbox-content').appendChild(lbVideo);
    }
    lbVideo.src = video.querySelector('source').src;
    lbVideo.style.display = 'block';

    lbTitle.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Clean up video lightbox when closing
const origCloseLightbox = closeLightbox;
closeLightbox = function(e) {
    if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-close')) {
        const lbVideo = document.getElementById('lightbox-video');
        if (lbVideo) {
            lbVideo.pause();
            lbVideo.style.display = 'none';
        }
        const lbImg = document.getElementById('lightbox-img');
        if (lbImg) lbImg.style.display = 'block';
    }
    origCloseLightbox(e);
};

async function removeUserPhoto(id) {
    try {
        await db.collection('family-photos').doc(id).delete();
    } catch (err) {
        console.error('Error removing:', err);
    }
}

/* FADE IN ANIMATION */
const s = document.createElement('style');
s.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}.fade-in{opacity:0;transform:translateY(20px);transition:opacity .8s ease,transform .8s ease}.fade-in.visible{opacity:1;transform:translateY(0)}';
document.head.appendChild(s);

/* MESSAGE WALL */
function initWall() {
    db.collection('wall-messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                const msg = change.doc.data();
                addWallCard({ ...msg, id: change.doc.id }, false);
            }
            if (change.type === 'removed') {
                const el = document.querySelector(`[data-wall-id="${change.doc.id}"]`);
                if (el) el.remove();
            }
        });
    });
}

function addWallCard(msg, prepend = true) {
    const grid = document.getElementById('wall-grid');
    if (!grid) return;
    if (grid.querySelector(`[data-wall-id="${msg.id}"]`)) return;

    const time = msg.timestamp ? new Date(msg.timestamp.seconds * 1000) : new Date();
    const timeStr = time.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

    const card = document.createElement('div');
    card.className = 'wall-card';
    card.setAttribute('data-wall-id', msg.id);
    card.innerHTML = `
        <div class="wall-card-author">${(msg.name || 'ANÓNIMO').toUpperCase()}</div>
        <div class="wall-card-message">"${msg.message}"</div>
        <div class="wall-card-time">${timeStr}</div>
        <div class="wall-card-barcode"></div>
        <button class="wall-card-remove" onclick="removeWallMessage('${msg.id}')">X</button>
    `;

    if (prepend) {
        grid.prepend(card);
    } else {
        grid.appendChild(card);
    }
}

async function submitWallMessage() {
    const name = document.getElementById('wall-name').value.trim();
    const message = document.getElementById('wall-message').value.trim();
    const status = document.getElementById('wall-status');
    const btn = document.getElementById('wall-submit');

    if (!name || !message) {
        status.textContent = 'ESCRIBE TU NOMBRE Y MENSAJE';
        status.className = 'wall-status error';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'ENVIANDO...';
    status.textContent = '';
    status.className = 'wall-status';

    try {
        await db.collection('wall-messages').add({
            name: name,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        status.textContent = 'MENSAJE ENVIADO';
        status.className = 'wall-status sent';
        btn.textContent = 'ENVIADO ✓';
        document.getElementById('wall-name').value = '';
        document.getElementById('wall-message').value = '';

        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = 'ENVIAR MENSAJE';
            status.textContent = '';
            status.className = 'wall-status';
        }, 2000);
    } catch (err) {
        console.error('Wall error:', err);
        status.textContent = 'ERROR: ' + err.message.substring(0, 60);
        status.className = 'wall-status error';
        btn.disabled = false;
        btn.textContent = 'ENVIAR MENSAJE';
    }
}

async function removeWallMessage(id) {
    try {
        await db.collection('wall-messages').doc(id).delete();
    } catch (err) {
        console.error('Error removing message:', err);
    }
}

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
