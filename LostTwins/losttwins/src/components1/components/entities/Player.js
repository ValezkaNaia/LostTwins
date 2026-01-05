import Phaser from 'phaser';
import HealthSystem from '../systems/HealthSystem';

/**
 * Classe que representa o Jogador (Player) no jogo.
 * Estende a classe Sprite com física Arcade do Phaser.
 * Gere o movimento, combate, vida e animações do personagem.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
    /**
     * Cria uma nova instância do Jogador.
     * @param {Phaser.Scene} scene - A cena onde o jogador será criado.
     * @param {number} x - A posição horizontal inicial.
     * @param {number} y - A posição vertical inicial.
     * @param {object} config - Configurações adicionais (ex: prefixo das animações 'p1' ou 'p2').
     */
    constructor(scene, x, y, config) {
        // Inicializa a sprite com a imagem 'idle' correspondente ao prefixo (p1 ou p2)
        super(scene, x, y, `${config.prefix}_idle`);
        
        this.prefix = config.prefix; // Guarda o prefixo (p1, p2, etc.)
        
        // Adiciona o objeto à lista de exibição e ao sistema de física da cena
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Inicializa o sistema de vida com 3 corações
        this.health = new HealthSystem(3);
        
        // Flags de estado
        this.isDead = false;
        this.isAttacking = false;
        
        // Configurações de física
        this.setCollideWorldBounds(true); // Impede que saia dos limites do mundo
        this.setDragX(500);               // Atrito horizontal para parar suavemente

        // Configuração das teclas de controlo
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            attack: Phaser.Input.Keyboard.KeyCodes.Q
        });

        // Criação da zona de ataque (Hitbox invisível para causar dano)
        this.attackZone = scene.add.zone(0, 0, 40, 50);
        scene.physics.add.existing(this.attackZone);
        this.attackZone.body.setAllowGravity(false); // A zona não cai com a gravidade
        this.attackZone.body.enable = false;         // Desativada por defeito (só ativa ao atacar)
    }

    /**
     * Loop principal do jogador, executado a cada frame.
     * Gere o movimento e input.
     */
    update() {
        // Se estiver morto ou a atacar, bloqueia o movimento
        if (this.isDead || this.isAttacking) return;

        // Movimento Horizontal
        if (this.keys.left.isDown) {
            this.setVelocityX(-180); // Move para a esquerda
            this.setFlipX(true);     // Espelha a sprite para a esquerda
            this.play(`${this.prefix}_walk`, true); // Toca animação de andar
        } else if (this.keys.right.isDown) {
            this.setVelocityX(180);  // Move para a direita
            this.setFlipX(false);    // Sprite normal (direita)
            this.play(`${this.prefix}_walk`, true);
        } else {
            this.setVelocityX(0);    // Para o movimento
            this.play(`${this.prefix}_idle`, true); // Animação parado
        }

        // Salto (apenas se estiver no chão)
        if (this.keys.up.isDown && this.body.onFloor()) {
            this.setVelocityY(-350);
        }

        // Animação de Salto (se estiver no ar)
        if (!this.body.onFloor()) {
            this.play(`${this.prefix}_jump`, true);
        }

        // Atualiza a posição da zona de ataque para acompanhar o jogador
        // O offset define se a zona aparece à esquerda ou à direita
        const offset = this.flipX ? -30 : 30;
        this.attackZone.setPosition(this.x + offset, this.y);

        // Input de Ataque
        if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
            this.attack();
        }
    }

    /**
     * Aplica dano ao jogador.
     * @param {number} amount - Quantidade de vida a retirar.
     */
    takeDamage(amount) {
        // Se já estiver magoado ou morto, ignora
        if (this.isHurt || this.isDead) return;

        this.health.damage(amount);
        this.isHurt = true; // Ativa flag de invencibilidade temporária

        // Feedback visual: tinge a sprite de vermelho
        this.setTint(0xff0000);
        
        // Após 200ms, remove o vermelho e permite levar dano novamente
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
            this.isHurt = false;
        });

        // Verifica se morreu
        if (this.health.isDead()) {
            this.die();
        }
    }

    /**
     * Executa a lógica de ataque.
     */
    attack() {
        this.isAttacking = true;
        this.setVelocityX(0); // Para o jogador durante o ataque
        this.play(`${this.prefix}_attack`); 
        this.attackZone.body.enable = true; // Ativa a hitbox de dano

        // Quando a animação terminar, desativa o estado de ataque e a hitbox
        this.once(`animationcomplete-${this.prefix}_attack`, () => {
            this.isAttacking = false;
            this.attackZone.body.enable = false;
        });
    }

    /**
     * Lida com a morte do jogador.
     */
    die() {
        this.isDead = true;
        this.setVelocity(0, 0);
        this.body.setAllowGravity(false); // Para de cair

        // Efeito visual: Desaparece suavemente (Fade out)
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                this.createSmokeEffect(); // Cria fumo ao desaparecer
                
                // Aguarda 1.5s e emite o evento de Game Over para a interface React
                this.scene.time.delayedCall(1500, () => {
                    if (window.gameEvents) {
                        const score = this.scene.registry.get('score') || 0;
                        window.gameEvents.emit('gameOver', score);
                    }
                });
            }
        });
        
        // Fade out da música de fundo
        if (this.scene.audio) {
            this.scene.audio.fadeOut('bg_music', 1500);
        }
    }

    /**
     * Cria um efeito de partículas de fumo.
     */
    createSmokeEffect() {
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

        particles.explode(30); // Emite 30 partículas numa explosão
    }
}
