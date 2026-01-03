export default class AudioSystem {
    constructor(scene) {
        this.scene = scene;
        this.sounds = new Map();
    }

    init(soundKeys) {
        soundKeys.forEach(key => {
            this.sounds.set(key, this.scene.sound.add(key));
        });
    }

    play(key, config = { volume: 0.5, loop: false }) {
        const sound = this.sounds.get(key);
        if (sound) {
            sound.play(config);
        }
    }

    stop(key) {
        const sound = this.sounds.get(key);
        if (sound) sound.stop();
    }

    // Método de Fade Out
    fadeOut(key, duration = 1000) {
        const sound = this.sounds.get(key);
        if (sound && sound.isPlaying) {
            this.scene.tweens.add({
                targets: sound,
                volume: 0,
                duration: duration,
                onComplete: () => {
                    sound.stop();
                }
            });
        }
    }
}