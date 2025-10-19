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
                { id: 'banger2', title: 'Énergie Pure', artist: 'Artiste Banger', coverImage: 'https://placehold.co/50x50/ff6347/ffffff?text=B2', audioSrc: 'URL_DE_TON_FICHIER_AUDIO_2.mp3' },
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
    function playSound(sound) {
        currentSound = sound;
        audio.src = sound.audioSrc;
        audio.play();
        
        // Mettre à jour l'interface du lecteur
        audioPlayer.classList.add('visible');
        playerCover.src = sound.coverImage;
        playerTitle.innerText = sound.title;
        playerArtist.innerText = sound.artist;
        playPauseBtn.innerHTML = '<svg width="24" height="24"><use href="#icon-pause"/></svg>';
    }

    function togglePlayPause() {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    function updatePlayPauseIcon() {
        const icon = audio.paused ? '#icon-play' : '#icon-pause';
        playPauseBtn.innerHTML = `<svg width="24" height="24"><use href="${icon}"/></svg>`;
    }

    function updateProgress() {
        const { duration, currentTime } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
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
            renderSounds(categoryCard.dataset.categoryId);
        }

        // Clic sur un son
        const soundItem = e.target.closest('.sound-item');
        if (soundItem) {
            const category = musicData.find(c => c.id === soundItem.dataset.categoryId);
            const sound = category.sounds.find(s => s.id === soundItem.dataset.soundId);
            if(sound) playSound(sound);
        }
    });

    backButton.addEventListener('click', () => showPage('page-categories'));

    // Événements du lecteur audio
    playPauseBtn.addEventListener('click', togglePlayPause);
    audio.addEventListener('play', updatePlayPauseIcon);
    audio.addEventListener('pause', updatePlayPauseIcon);
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);

    // --- INITIALISATION ---
    renderCategories();
});

