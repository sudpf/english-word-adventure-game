class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.currentMusic = null;
        this.speechSynthesis = window.speechSynthesis;
    }

    loadSound(name, src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = src;
            audio.addEventListener('canplaythrough', () => {
                this.sounds[name] = audio;
                resolve(audio);
            }, { once: true });
            audio.addEventListener('error', reject);
            audio.load();
        });
    }

    play(name, volume = this.sfxVolume) {
        if (this.sounds[name]) {
            const sound = this.sounds[name].cloneNode();
            sound.volume = volume;
            sound.play().catch(err => console.log('Audio play failed:', err));
            return sound;
        }
        return null;
    }

    playMusic(name, loop = true) {
        if (this.sounds[name]) {
            if (this.currentMusic) {
                this.currentMusic.pause();
                this.currentMusic.currentTime = 0;
            }
            this.currentMusic = this.sounds[name];
            this.currentMusic.volume = this.musicVolume;
            this.currentMusic.loop = loop;
            this.currentMusic.play().catch(err => console.log('Music play failed:', err));
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    }

    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    resumeMusic() {
        if (this.currentMusic) {
            this.currentMusic.play().catch(err => console.log('Music resume failed:', err));
        }
    }

    speakWord(word, lang = 'en-US') {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = lang;
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            const voices = this.speechSynthesis.getVoices();
            const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
            if (englishVoice) {
                utterance.voice = englishVoice;
            }
            
            this.speechSynthesis.speak(utterance);
        }
    }

    speakLetter(letter) {
        this.speakWord(letter, 'en-US');
    }

    setMusicVolume(volume) {
        this.musicVolume = Utils.clamp(volume, 0, 1);
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume;
        }
    }

    setSfxVolume(volume) {
        this.sfxVolume = Utils.clamp(volume, 0, 1);
    }
}

const audioManager = new AudioManager();
