import Phaser from 'phaser';
import HealthSystem from '../systems/HealthSystem';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, animConfig) {
        super(scene, x, y, animConfig.move);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //  Centralizar a origem
        this.setOrigin(0.5, 1);

        //  Ajustar o tamanho da colisão (setSize define a largura e altura da caixa)
        // Reduzi para 0.6 e 0.9 para a caixa ficar "dentro" do corpo do boneco
        const bodyWidth = this.width * 0.6;
        const bodyHeight = this.height * 0.9;
        this.body.setSize(40, 50); 

        // Guardar o offset padrão para usarmos no flip
        this.defaultOffsetX = (this.width - bodyWidth) / 2;
        this.defaultOffsetY = this.height - bodyHeight;
        this.body.setOffset(20, 14);
        
        this.health = new HealthSystem(3);
        this.animsList = animConfig;
        
        this.isDead = false;
        this.isHurt = false;
        this.isAttacking = false;
        this.direction = 1;

        this.setCollideWorldBounds(true);
        //para evitar deslizemento ao parar
        this.setDragX(500);
        this.play(this.animsList.move);
    }

    update(player) {
        
        if (this.isDead || this.isHurt || this.isAttacking || !player) return;

        this.setVelocityX(50 * this.direction);
        this.setFlipX(this.direction === 1);
        this.play(this.animsList.move, true);

        // --- SENSOR DE PAREDE E BORDA ---
        
        // 1. Detecção de bloqueio físico (Arcade Physics)
        const isBlocked = this.body.blocked.left || this.body.blocked.right ||
                          this.body.touching.left || this.body.touching.right;

        // 2. Sensor manual de parede (Verifica se há um tile sólido à frente da cintura)
        const xWallCheck = this.x + (this.direction * 22); // Um pouco à frente do corpo
        const yWallCheck = this.y - 25; // Altura da cintura (já que origin é 1)
        const tileWall = this.scene.groundLayer.getTileAtWorldXY(xWallCheck, yWallCheck);

        // 3. Sensor de abismo (Borda)
        const xAhead = this.x + (this.direction * 25); 
        const yBelow = this.y + 5; 
        const tileAhead = this.scene.groundLayer.getTileAtWorldXY(xAhead, yBelow);

        // Lógica de inversão: Se bater em algo (isBlocked), se houver um tile à frente (tileWall), ou se não houver chão (!tileAhead)
        if (isBlocked || (tileWall && tileWall.collides) || !tileAhead) {
            this.direction *= -1;

            // Afasta o inimigo da parede imediatamente para não ficar preso no próximo frame
            this.x += this.direction * 3;
            
            // Força a velocidade a mudar logo
            this.setVelocityX(50 * this.direction);
        }

        // Verificar distância para ataque
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist < 60) {
            this.attack(player);
        }
    }

    // ... métodos takeDamage, attack e die continuam iguais ...
    takeDamage() {
        if (this.isDead || this.isHurt) return;
        this.health.damage(1);
        this.isHurt = true;
        this.setVelocityX(0);
        if (this.health.isDead()) {
            this.die();
        } else {
            this.play(this.animsList.hurt);
            this.once('animationcomplete', () => { this.isHurt = false; });
        }
    }

    attack(player) {
        if (this.isDead || this.isHurt || this.isAttacking) return;
        this.isAttacking = true;
        this.setVelocityX(0);
        // O inimigo vira-se para o player antes de atacar
        this.setFlipX(player.x < this.x);
        this.play(this.animsList.attack);
        this.once('animationcomplete', () => {
            if (!this.isDead) {
                const distFinal = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
                if (distFinal < 70) { 
                    player.takeDamage(1);   
                    this.scene.audio.play('hit_player');                  
                }

                // Efeito de empurrão (Knockback) no Player
                const dir = (player.x > this.x) ? 40 : -40;
                player.setVelocityX(dir);
                player.setVelocityY(-20);
            }
            // Pequena pausa para ele não atacar instantaneamente de novo
            this.scene.time.delayedCall(500, () => {
                this.isAttacking = false;
            });
        });
    }

    die() {
        this.isDead = true;
        this.setVelocity(0, 0);
        this.play(this.animsList.die);
        this.body.enable = false;
        this.once('animationcomplete', () => {
            this.createExplosionEffect();
            this.destroy();
        });
    }

    createExplosionEffect() {
        const particles = this.scene.add.particles(this.x, this.y, 'smoke_particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: 0xff4444,
            lifespan: 600,
            quantity: 20
        });
        particles.explode(20);
        this.scene.time.delayedCall(700, () => particles.destroy());
    }
}