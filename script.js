// Attend que le DOM soit entièrement chargé pour exécuter le script
document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    // --- DONNÉES MUSICALES ---
    // Remplace ces données par tes propres sons
    const musicData = [
        {
            id: 'banger',
            name: 'BANGER 🔥',
            categoryImage: 'image/BANGER.png',  
                      sounds: [
                { id: 'CONIO', title: 'CONIO', artist: 'Kich', coverImage: 'image/CONIO.png', audioSrc: 'banger/CONIO.mp3' },
                { id: 'PLUS', title: 'PLUS', artist: 'Kich', coverImage: 'image/PLUS.png', audioSrc: 'banger/PLUS.mp3' },
                { id: 'SYMA', title: 'SYMA', artist: 'Kich', coverImage: 'image/SYMA.png', audioSrc: 'banger/SYMA.mp3' },

            ]
        },
        {
            id: 'freestyle',
            name: 'FREESTYLE 🎤',
            categoryImage: 'image/FRESSTYLE.png',   
                     sounds: [
                { id: 'free1', title: 'Impro du Soir', artist: 'Artiste Freestyle', coverImage: 'https://placehold.co/50x50/1e90ff/ffffff?text=F1', audioSrc: 'URL_DE_TON_FICHIER_AUDIO_3.mp3' },
            ]
        },
        {
            id: 'map',
            name: 'MAP 🗺️',
            categoryImage: 'image/MAP.png',
                        sounds: [
                { id: 'map1', title: 'Ambiance Voyage', artist: 'Artiste MAP', coverImage: 'https://placehold.co/50x50/3cb371/ffffff?text=M1', audioSrc: 'URL_DE_TON_FICHIER_AUDIO_4.mp3' },
            ]
        }
    ];

    // --- ÉLÉMENTS DU DOM ---
    const pages = document.querySelectorAll('.page');
    const categoryListPage = document.getElementById('page-categories');
    const soundListPage = document.getElementById('page-sounds');
    const categoryListContainer = document.getElementById('category-list');
    const soundListContainer = document.getElementById('sound-list-container');
    const soundsPageTitle = document.getElementById('sounds-page-title');
    const backButton = document.getElementById('back-to-categories');
    
    // Éléments du lecteur audio
    const audioPlayer = document.getElementById('audio-player');
    const audio = new Audio();
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playerCover = document.getElementById('player-cover');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    // AJOUTE ces nouvelles variables
const playerPage = document.getElementById('page-player');
const playerCloseBtn = document.getElementById('player-close-btn');
const fullPlayerCover = document.getElementById('full-player-cover');
const fullPlayerTitle = document.getElementById('full-player-title');
const fullPlayerArtist = document.getElementById('full-player-artist');
const fullPlayPauseBtn = document.getElementById('full-play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const fullProgressContainer = document.getElementById('full-progress-container');
const fullProgressBar = document.getElementById('full-progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const togglePlaylistBtn = document.getElementById('toggle-playlist-btn');
const playlistOverlay = document.getElementById('playlist-overlay');
const playlistList = document.getElementById('playlist-list');

// AJOUTE ces nouvelles variables d'état
let currentPlaylist = [];
let currentTrackIndex = -1;

    
    let currentSound = null;

    // --- NAVIGATION ---
    function showPage(pageId) {
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
    }

    // --- AFFICHAGE ---
 /*    function renderCategories() {
        categoryListContainer.innerHTML = musicData.map(category => {
            // On vérifie si la catégorie est "banger" pour lui donner une classe spéciale
            const extraClass = category.id === 'banger' ? 'full-width' : '';
    
            return `
                <div 
                    class="category-card ${extraClass}" 
                    data-category-id="${category.id}" 
                    style="background-image: url('${category.categoryImage}');"
                >
                </div>
            `;
        }).join('');
    }
     */
    function renderCategories() {
        categoryListContainer.innerHTML = musicData.map(category => {
            const extraClass = category.id === 'banger' ? 'full-width' : '';
            return `
                <div 
                    class="category-card ${extraClass}" 
                    data-category-id="${category.id}" 
                    style="background-image: url('${category.categoryImage}');"
                >
                </div>
            `;
        }).join('');
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            // 1. Ajoute la classe 'clicked' pour l'animation
            this.classList.add('clicked');

            // 2. Récupère l'ID de la catégorie
            const categoryId = this.dataset.categoryId;

            // 3. Attend la fin de la petite animation avant de changer de page
            setTimeout(() => {
                // 4. Retire la classe pour la prochaine fois
                this.classList.remove('clicked');
                // 5. Affiche la page des sons
                renderSounds(categoryId);
            }, 150); // 150ms est une bonne durée pour sentir l'effet
        });
    });
}

    function renderSounds(categoryId) {
        const category = musicData.find(c => c.id === categoryId);
        if (!category) return;

        soundsPageTitle.innerText = category.name;
        soundListContainer.innerHTML = category.sounds.map(sound => `
            <div class="sound-item" data-sound-id="${sound.id}" data-category-id="${categoryId}">
                <img src="${sound.coverImage}" alt="${sound.title}">
                <div class="info">
                    <div class="title">${sound.title}</div>
                    <div class="artist">${sound.artist}</div>
                </div>
            </div>
        `).join('');
        showPage('page-sounds');
    }

    // --- LOGIQUE DU LECTEUR AUDIO ---
function playSound(sound, category) {
    // Créer la playlist à partir de la catégorie actuelle
    currentPlaylist = category.sounds;
    currentTrackIndex = currentPlaylist.findIndex(s => s.id === sound.id);

    currentSound = sound;
    audio.src = sound.audioSrc;
    audio.play();
    
    // Mettre à jour les deux interfaces (petite barre et pleine page)
    updateAllPlayerUI(sound);
}

function updateAllPlayerUI(sound) {
    // Petite barre
    audioPlayer.classList.add('visible');
    playerCover.src = sound.coverImage;
    playerTitle.innerText = sound.title;
    playerArtist.innerText = sound.artist;

    // Page pleine
    fullPlayerCover.src = sound.coverImage;
    fullPlayerTitle.innerText = sound.title;
    fullPlayerArtist.innerText = sound.artist;
    
    updatePlayPauseIcons();
}

function playNext() {
    currentTrackIndex++;
    if (currentTrackIndex >= currentPlaylist.length) {
        currentTrackIndex = 0; // Recommence la playlist
    }
    const nextSound = currentPlaylist[currentTrackIndex];
    const category = musicData.find(c => c.sounds.some(s => s.id === nextSound.id));
    playSound(nextSound, category);
}

function playPrev() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = currentPlaylist.length - 1; // Revient à la fin
    }
    const prevSound = currentPlaylist[currentTrackIndex];
    const category = musicData.find(c => c.sounds.some(s => s.id === prevSound.id));
    playSound(prevSound, category);
}


function updatePlayPauseIcons() {
    const icon = audio.paused ? '#icon-play' : '#icon-pause';
    const bigIcon = audio.paused ? 
        '<svg width="48" height="48"><use href="#icon-play"/></svg>' : 
        '<svg width="48" height="48"><use href="#icon-pause"/></svg>';
    
    playPauseBtn.innerHTML = `<svg width="24" height="24"><use href="${icon}"/></svg>`;
    fullPlayPauseBtn.innerHTML = bigIcon;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function renderPlaylist() {
    playlistList.innerHTML = currentPlaylist.map((sound, index) => {
        const isPlaying = index === currentTrackIndex ? 'playing' : '';
        return `
            <div class="sound-item ${isPlaying}">
                <img src="${sound.coverImage}" alt="${sound.title}">
                <div class="info">
                    <div class="title">${sound.title}</div>
                    <div class="artist">${sound.artist}</div>
                </div>
            </div>
        `;
    }).join('');
}


function togglePlayPause() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    updatePlayPauseIcons(); // Met à jour les deux boutons
}

    
function updatePlayPauseIcons() { // La fonction est déplacée plus haut mais on la garde ici pour référence
    const icon = audio.paused ? '#icon-play' : '#icon-pause';
    const bigIcon = audio.paused ? 
        '<svg width="48" height="48"><use href="#icon-play"/></svg>' : 
        '<svg width="48" height="48"><use href="#icon-pause"/></svg>';
    
    playPauseBtn.innerHTML = `<svg width="24" height="24"><use href="${icon}"/></svg>`;
    fullPlayPauseBtn.innerHTML = bigIcon;
}


function updateProgress() {
    const { duration, currentTime } = audio;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        fullProgressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(duration);
    }
}

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

// --- GESTION DES ÉVÉNEMENTS ---
document.body.addEventListener('click', (e) => {
    // Clic sur une catégorie
    const categoryCard = e.target.closest('.category-card');
    if (categoryCard) {
        // ... (Pas de changement ici)
    }

    // Clic sur un son
    const soundItem = e.target.closest('.sound-item');
    if (soundItem) {
        const category = musicData.find(c => c.id === soundItem.dataset.categoryId);
        const sound = category.sounds.find(s => s.id === soundItem.dataset.soundId);
        if(sound) playSound(sound, category); // On passe la catégorie
    }
});

backButton.addEventListener('click', () => showPage('page-categories'));

// Événements du lecteur audio
playPauseBtn.addEventListener('click', togglePlayPause);
fullPlayPauseBtn.addEventListener('click', togglePlayPause);
audio.addEventListener('play', updatePlayPauseIcons);
audio.addEventListener('pause', updatePlayPauseIcons);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', playNext); // Joue le son suivant à la fin
progressContainer.addEventListener('click', setProgress);
fullProgressContainer.addEventListener('click', setProgress);

// Nouveaux événements pour la page pleine
audioPlayer.addEventListener('click', () => playerPage.classList.add('visible'));
playerCloseBtn.addEventListener('click', () => playerPage.classList.remove('visible'));
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);
togglePlaylistBtn.addEventListener('click', () => {
    renderPlaylist();
    playlistOverlay.classList.add('visible');
});
playlistOverlay.addEventListener('click', (e) => {
    // Si on clique sur le fond et non sur le contenu
    if (e.target === playlistOverlay) {
        playlistOverlay.classList.remove('visible');
    }
});

    // --- INITIALISATION ---
    renderCategories();
});

