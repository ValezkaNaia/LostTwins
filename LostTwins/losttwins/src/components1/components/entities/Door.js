import Phaser from 'phaser';

export default class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteKey) {
        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.body.allowGravity = false; // A porta não cai

        // Aumenta o tamanho visual
        this.setScale(2);
        
        // Usamos um check simples ou tocamos direto se todas as portas forem iguais
        if (spriteKey === 'portal_blue') {
            this.play('portal_blue_anim');
        }
        // Ajusta o tamanho da colisão se necessário
        this.body.setSize(this.width * 0.5, this.height);
    }
}