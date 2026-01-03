// scenes/GameOverScene.js
import Phaser from 'phaser';
import LevelManager from '../systems/LevelManager';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        const { width, height } = this.scale;

        // Overlay escuro
        this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);

        this.add.text(width / 2, height / 2 - 40, 'GAME OVER', {
            fontSize: '64px', fill: '#ff0000', fontStyle: 'bold'
        }).setOrigin(0.5);

        const btn = this.add.text(width / 2, height / 2 + 60, 'TENTAR NOVAMENTE', {
            fontSize: '24px', fill: '#ffffff', backgroundColor: '#444', padding: 15
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerdown', () => {
            LevelManager.restartGame(this);
        });
    }
}