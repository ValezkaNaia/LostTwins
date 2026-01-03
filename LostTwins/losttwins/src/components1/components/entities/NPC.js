import Phaser from 'phaser';

export default class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, config) {
        // Usamos a key da spritesheet 'npc_anim'
        super(scene, x, y, 'npc_anim');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body.setImmovable(true);
        this.body.allowGravity = true;
        this.setOrigin(0.5, 1);

        this.minigameKey = config.minigame;
        
        // Iniciar a animação Idle
        this.play('npc_idle_anim');

        // Texto de interação melhorado
        this.interactLabel = scene.add.text(x, y - 80, 'Pressiona [X]', {
            fontSize: '14px',
            fill: '#ffffff',
            backgroundColor: '#000000aa', // Fundo preto semi-transparente
            padding: { x: 8, y: 4 },
            fontFamily: 'Arial',
            borderRadius: 4
        }).setOrigin(0.5).setVisible(false).setDepth(100);
    }

    showPrompt(isVisible) {
        this.interactLabel.setVisible(isVisible);
    }

    update() {
        // O texto segue o NPC (importante se ele cair com a gravidade)
        this.interactLabel.setPosition(this.x, this.y - 80);
        
        // Efeito de levitação suave no texto quando visível
        if (this.interactLabel.visible) {
            this.interactLabel.y += Math.sin(this.scene.time.now / 300) * 3;
        }
    }
}