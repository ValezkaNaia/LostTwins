import Phaser from 'phaser';
import LevelManager from '../systems/LevelManager';

export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    create() {
        const { width, height } = this.scale;
        
        // Fundo festivo
        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);
        
        this.add.text(width / 2, height / 2 - 50, 'NÍVEL CONCLUÍDO!', {
            fontSize: '48px', fill: '#00ff00', fontStyle: 'bold'
        }).setOrigin(0.5);

        const nextBtn = this.add.text(width / 2, height / 2 + 50, 'PRÓXIMO NÍVEL', {
            fontSize: '24px', fill: '#ffffff', backgroundColor: '#222', padding: 15
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        nextBtn.on('pointerdown', () => {
            this.scene.stop('VictoryScene');
            LevelManager.nextLevel(this); // O Manager decide qual é o próximo
        });
    }
}