import Phaser from 'phaser';
import HealthSystem from '../systems/HealthSystem';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, config) {
        // Usa a sprite inicial da config (ex: 'p1_idle')
        super(scene, x, y, `${config.prefix}_idle`);
        
        this.prefix = config.prefix; // Guarda o prefixo (p1, p2, etc.)
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.health = new HealthSystem(3);
        this.isDead = false;
        this.isAttacking = false;
        this.setCollideWorldBounds(true);
        this.setDragX(500);

        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            attack: Phaser.Input.Keyboard.KeyCodes.Q
        });

        this.attackZone = scene.add.zone(0, 0, 40, 50);
        scene.physics.add.existing(this.attackZone);
        this.attackZone.body.setAllowGravity(false);
        this.attackZone.body.enable = false;
    }

    update() {
        if (this.isDead || this.isAttacking) return;

        if (this.keys.left.isDown) {
            this.setVelocityX(-180);
            this.setFlipX(true);
            this.play(`${this.prefix}_walk`, true); // Uso do prefixo
        } else if (this.keys.right.isDown) {
            this.setVelocityX(180);
            this.setFlipX(false);
            this.play(`${this.prefix}_walk`, true); // Uso do prefixo
        } else {
            this.setVelocityX(0);
            this.play(`${this.prefix}_idle`, true); // Uso do prefixo
        }

        if (this.keys.up.isDown && this.body.onFloor()) {
            this.setVelocityY(-350);
        }

        if (!this.body.onFloor()) {
            this.play(`${this.prefix}_jump`, true); // Uso do prefixo
        }

        const offset = this.flipX ? -30 : 30;
        this.attackZone.setPosition(this.x + offset, this.y);

        if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
            this.attack();
        }
    }

    // Dentro do Player.js
    takeDamage(amount) {
        if (this.isHurt || this.isDead) return;

        this.health.damage(amount);
        this.isHurt = true;

        // Efeito visual (piscar vermelho)
        this.setTint(0xff0000);
        
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
            this.isHurt = false;
        });

        if (this.health.isDead()) {
            this.die();
        }
    }

    attack() {
        this.isAttacking = true;
        this.setVelocityX(0);
        this.play(`${this.prefix}_attack`); // Uso do prefixo
        this.attackZone.body.enable = true;

        // Escuta a animação específica baseada no prefixo
        this.once(`animationcomplete-${this.prefix}_attack`, () => {
            this.isAttacking = false;
            this.attackZone.body.enable = false;
        });
    }

    die() {
        this.isDead = true;
        this.setVelocity(0, 0);
        this.body.setAllowGravity(false);

        // Efeito de aumentar opacidade (brilho) antes de sumir
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                this.createSmokeEffect();
            }
        });
        // Faz fade out da música de fundo (supondo que a key seja 'bg_music')
        this.scene.audio.fadeOut('bg_music', 1500);
        this.once('animationcomplete', () => {
            // Lógica de restart ou Game Over
            this.scene.scene.restart();
        });
    }

    createSmokeEffect() {
        // Criar sistema de partículas para o fumo
        const particles = this.scene.add.particles(this.x, this.y, 'smoke_particle', {
            speed: { min: 20, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 800,
            gravityY: -50,
            quantity: 20,
            emitting: false
        });

        particles.explode(30); // Dispara 30 partículas de uma vez
    }
}