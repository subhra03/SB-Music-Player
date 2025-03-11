class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentSongIndex = 0;
        this.shuffle = false;
        this.repeatMode = 'off'; 
        this.volume = 1;
        this.history = [];
        
        this.playlist = [
            {
                title: "Khuda Jaane",
                artist: "Vishal & Shekhar, KK, Shilpa Rao, Anvita Dutt Guptan",
                duration: "5:33",
                file: "assets//Khuda Jaane - Bachna Ae Haseeno 128 Kbps.mp3",
                cover: "https://i.redd.it/l7vfal60wr0d1.jpeg"
            },
            {
                title: "Hosanna",
                artist: "A.R. Rahman, Leon D'souza, Suzanne D'Mello",
                duration: "5:31",
                file: "assets//Hosanna - Ekk Deewana Tha 128 Kbps.mp3",
                cover: "https://c.saavncdn.com/147/Hosanna-Hindi-2012-20200627123411-500x500.jpg"
            },
            {
                title: "Sudhu Tomari Jonno",
                artist: "Arijit Singh, Shreya Ghoshal",
                duration: "3:30",
                file: "assets//Sudhu-Tomari-Jonno.mp3",
                cover: "https://c.saavncdn.com/196/Shudhu-Tomari-Jonyo-Original-Motion-Picture-Soundtrack-Bengali-2015-20250220172701-500x500.jpg"
            },
            {
                title: "Tum Se Hi",
                artist: "Mohit Chauhan",
                duration: "5:23",
                file: "assets//Tum Se Hi - Jab We Met 128 Kbps.mp3",
                cover: "https://c.saavncdn.com/223/Jab-We-Met-Hindi-2007-20231016162009-500x500.jpg"
            },
            
            
            {
                title: "Ratiyaan",
                artist: "Hansika Pareek",
                duration: "2:55",
                file: "assets//Ratiyaan - PagalMass.mp3",
                cover: "https://pagalmass.com/upload_file/51/230x230/thumb_67a99b7c32234.webp"
            }
        ];

        this.initElements();
        this.initEventListeners();
        this.loadFromLocalStorage();
        this.initPlaylist();
        this.loadSong(0);
    }

    initElements() {
        this.playPauseBtn = document.getElementById('play-pause');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.shuffleBtn = document.getElementById('shuffle');
        this.repeatBtn = document.getElementById('repeat');
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        
        this.progressBar = document.querySelector('.progress-bar');
        this.bufferBar = document.querySelector('.buffer-bar');
        this.currentTimeEl = document.querySelector('.current-time');
        this.durationEl = document.querySelector('.duration');
        this.songTitle = document.querySelector('.song-title');
        this.artistEl = document.querySelector('.artist');
        this.albumArt = document.querySelector('.album-art');
        this.playlistEl = document.querySelector('.playlist');
        this.playerContainer = document.querySelector('.music-player');
    }

    initEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        
        document.querySelector('.progress-container').addEventListener('click', (e) => this.seek(e));
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('progress', () => this.updateBuffer());
        this.audio.addEventListener('volumechange', () => this.updateVolumeUI());
    }

    initPlaylist() {
        this.playlistEl.innerHTML = '';
        this.playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <i class='bx bx-music'></i>
                <div>
                    <div class="song-title">${song.title}</div>
                    <div class="artist">${song.artist}</div>
                </div>
                <span class="song-duration">${song.duration}</span>
            `;
            li.addEventListener('click', () => this.loadSong(index));
            this.playlistEl.appendChild(li);
        });
    }

    loadSong(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentSongIndex = index;
        const song = this.playlist[index];
        
        this.audio.src = song.file;
        this.songTitle.textContent = song.title;
        this.artistEl.textContent = song.artist;
        this.albumArt.src = song.cover;
        this.durationEl.textContent = song.duration;

        this.updateActivePlaylistItem();
        this.saveToLocalStorage();
        this.play();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        this.audio.play();
        this.playerContainer.classList.add('playing');
        this.playPauseBtn.innerHTML = '<i class="bx bx-pause"></i>';
    }

    pause() {
        this.isPlaying = false;
        this.audio.pause();
        this.playerContainer.classList.remove('playing');
        this.playPauseBtn.innerHTML = '<i class="bx bx-play"></i>';
    }

    prevSong() {
        if (this.audio.currentTime > 5) {
            this.audio.currentTime = 0;
            return;
        }
        
        this.history.push(this.currentSongIndex);
        const newIndex = this.shuffle ? 
            this.getRandomIndex() : 
            (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
        
        this.loadSong(newIndex);
    }

    nextSong() {
        this.history.push(this.currentSongIndex);
        let newIndex;
        
        if (this.shuffle) {
            newIndex = this.getRandomIndex();
        } else {
            newIndex = (this.currentSongIndex + 1) % this.playlist.length;
        }
        
        this.loadSong(newIndex);
    }

    getRandomIndex() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.playlist.length);
        } while (newIndex === this.currentSongIndex && this.playlist.length > 1);
        return newIndex;
    }

    toggleShuffle() {
        this.shuffle = !this.shuffle;
        this.shuffleBtn.classList.toggle('active-mode', this.shuffle);
        this.saveToLocalStorage();
    }

    toggleRepeat() {
        const modes = ['off', 'all', 'one'];
        this.repeatMode = modes[(modes.indexOf(this.repeatMode) + 1) % modes.length];
        this.repeatBtn.innerHTML = {
            'off': '<i class="bx bx-repost"></i>',
            'all': '<i class="bx bx-repost"></i>',
            'one': '<i class="bx bx-repost"></i>'
        }[this.repeatMode];
        this.repeatBtn.classList.toggle('active-mode', this.repeatMode !== 'off');
        this.saveToLocalStorage();
    }

    handleSongEnd() {
        switch (this.repeatMode) {
            case 'one':
                this.loadSong(this.currentSongIndex);
                break;
            case 'all':
                this.nextSong();
                break;
            default:
                if (this.currentSongIndex === this.playlist.length - 1) {
                    this.pause();
                } else {
                    this.nextSong();
                }
        }
    }

    setVolume(value) {
        this.volume = value;
        this.audio.volume = value;
        this.volumeSlider.value = value;
        this.updateVolumeUI();
        this.saveToLocalStorage();
    }

    toggleMute() {
        this.audio.muted = !this.audio.muted;
        this.updateVolumeUI();
    }

    updateVolumeUI() {
        const volumeLevel = this.audio.muted ? 0 : this.audio.volume;
        this.volumeBtn.innerHTML = volumeLevel === 0 ? 
            '<i class="bx bx-volume-mute"></i>' :
            volumeLevel < 0.5 ? 
            '<i class="bx bx-volume-low"></i>' : 
            '<i class="bx bx-volume-full"></i>';
    }

    seek(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = pos * this.audio.duration;
    }

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }

    updateBuffer() {
        if (this.audio.buffered.length > 0) {
            const buffered = (this.audio.buffered.end(0) / this.audio.duration) * 100;
            this.bufferBar.style.width = `${buffered}%`;
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updateActivePlaylistItem() {
        document.querySelectorAll('.playlist li').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }

    handleKeyDown(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                this.audio.currentTime = Math.max(0, this.audio.currentTime - 5);
                break;
            case 'ArrowRight':
                this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 5);
                break;
            case 'ArrowUp':
                this.setVolume(Math.min(1, this.audio.volume + 0.1));
                break;
            case 'ArrowDown':
                this.setVolume(Math.max(0, this.audio.volume - 0.1));
                break;
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('musicPlayerSettings', JSON.stringify({
            volume: this.volume,
            shuffle: this.shuffle,
            repeatMode: this.repeatMode,
            currentSongIndex: this.currentSongIndex
        }));
    }

    loadFromLocalStorage() {
        const settings = JSON.parse(localStorage.getItem('musicPlayerSettings')) || {};
        this.volume = settings.volume || 1;
        this.shuffle = settings.shuffle || false;
        this.repeatMode = settings.repeatMode || 'off';
        this.currentSongIndex = settings.currentSongIndex || 0;
        
        this.audio.volume = this.volume;
        this.shuffleBtn.classList.toggle('active-mode', this.shuffle);
        this.repeatBtn.classList.toggle('active-mode', this.repeatMode !== 'off');
    }
}

const player = new MusicPlayer();