import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import AudioSystem from '../systems/AudioSystem';
import LevelManager from '../systems/LevelManager';
import Door from '../entities/Door';
import NPC from '../entities/NPC';

export default class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
    }

    create() {
        // 1. Configurar Mapa
        const map2 = this.make.tilemap({ key: 'level2' });

        // Tilesets (Confirma se os nomes batem certo com o JSON)
        const tilesetChao = map2.addTilesetImage('Mapa', 'tiles-chao2');
        const tilesWater = map2.addTilesetImage('fg_0', 'tiles-water');
        const tilesetBackground = map2.addTilesetImage('background', 'tiles-background2');
        const tilesetSoftsand = map2.addTilesetImage('softsand', 'tiles-softsand');

        // Agrupamos os tilesets para facilitar
        const allTiles = [tilesetBackground, tilesetSoftsand, tilesetChao, tilesWater];

        // 2. Criar Camadas (Nomes corrigidos baseados no teu erro de consola)
        map2.createLayer('fundo/sky', allTiles, 0, 0);
        map2.createLayer('fundo/sandbg', allTiles, 0, 0);
        map2.createLayer('fundo/clouds bg', allTiles, 0, 0);
        map2.createLayer('fundo/beach', allTiles, 0, 0);
        
        // CORREÇÃO 1: Estas camadas não têm pasta no nome segundo o console
        map2.createLayer('water', allTiles, 0, 0); 
        map2.createLayer('softsand', allTiles, 0, 0);

        // 3. Camada de Chão (Física)
        this.groundLayer = map2.createLayer('platforms/sand', allTiles, 0, 0);
        this.groundLayer.setCollisionByExclusion([-1]);

        // 4. Player (CORREÇÃO 2: Ajuste para sprites 64x64)
        this.player = new Player(this, 100, 300, { prefix: 'p2' });
        
        // setOrigin(0.5, 1) coloca o ponto âncora nos PÉS do boneco
        // Isso ajuda a resolver o problema de ele aparecer no meio da plataforma
        this.player.setOrigin(0.5, 1);

        // Ajuste da caixa de colisão para sprite 64x64
        // setSize(largura, altura) -> A caixa fica mais fina que a sprite (30px)
        // setOffset(x, y) -> Centraliza a caixa na sprite
        this.player.body.setSize(55, 50); 
        this.player.body.setOffset(3, 14); 

        this.physics.add.collider(this.player, this.groundLayer);

        // 5. Inimigos
        const enemy2Config = {
            move: 'enemy2_move', attack: 'enemy2_attack',
            hurt: 'enemy2_hurt', die: 'enemy2_die', idle: 'enemy2_move'
        };

        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        // Pontos de spawn ajustados (exemplo)
        const spawnPoints = [
            { x: 589, y: 340 }, { x: 1292, y: 225 }, { x: 1767, y: 351 }
        ];

        spawnPoints.forEach(point => {
            const enemy = new Enemy(this, point.x, point.y, enemy2Config);
            this.enemies.add(enemy);

            // AJUSTE DE FÍSICA PARA O INIMIGO
            enemy.setOrigin(0.5, 1); // Pés no ponto Y
            enemy.body.setSize(30, 50); // Ajusta ao tamanho visual do inimigo
            enemy.body.setOffset(17, 14); // Centraliza a caixa na sprite 64x64
        });
        
        this.physics.add.collider(this.enemies, this.groundLayer);

        // Colisões de Combate
        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            if (!enemy.isDead && !enemy.isAttacking && !enemy.isHurt) enemy.attack(player);
        });

        this.physics.add.overlap(this.player.attackZone, this.enemies, (zone, enemy) => {
            if (this.player.isAttacking && !enemy.isHurt && !enemy.isDead) {
                enemy.takeDamage();
                this.audio.play('hit_enemy');
                const knockbackForce = 40; 
                const knockbackDir = (enemy.x > this.player.x) ? knockbackForce : -knockbackForce;
                //const knockbackDir = (enemy.x > this.player.x) ? 100 : -100;
                enemy.setVelocityX(knockbackDir);
            }
        });

        //Adicionar npc e minigames 
        this.npcs = this.physics.add.group({ classType: NPC, runChildUpdate: true });

        const spawnPoints2 = [
            { x: 279, y: 351, game: 'Puzzle' },
            { x: 1067, y: 288, game: 'Puzzle' },
            { x: 2189, y: 191, game: 'Puzzle' }
        ];

        spawnPoints2.forEach(point => {
            const npc = new NPC(this, point.x, point.y, { minigame: point.game });
            this.npcs.add(npc);

            npc.setOrigin(0.5, 1); // Pés no ponto Y
            npc.body.setSize(30, 40); // Ajusta ao tamanho visual do inimigo
            npc.body.setOffset(17, 14); 
        });

        this.physics.add.collider(this.npcs, this.groundLayer);

        // 6. Câmara
        const limiteReal = 2432;

        this.physics.world.setBounds(0, 0, limiteReal, map2.heightInPixels);
        this.cameras.main.setBounds(0, 0, limiteReal, map2.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setZoom(1.2);

        // 7. Porta e Áudio
        this.audio = new AudioSystem(this);
        this.audio.init(['hit_enemy', 'hit_player', 'bg_music']);
        
        // Verifica se a música já toca para não sobrepor
        if (!this.sound.get('bg_music')) {
             this.audio.play('bg_music', { volume: 0.3, loop: true });
        }

        this.door = new Door(this, 2429, 189, 'portal_blue').setOrigin(0.5, 1);
        this.door.setDepth(10); // Garante que fica à frente de tudo
        
        this.physics.add.overlap(this.player, this.door, () => {
            this.handleReachedDoor();
        }, null, this);
        
        this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

        this.events.on('resume', (scene, data) => {
            if (data && data.won) {
                // Se quiser que o NPC suma após o jogo:
                if (this.activeNPC) {
                    this.activeNPC.destroy(); 
                    // Dica: destrua também o label dele se não quiser que fique órfão
                    this.activeNPC.interactLabel.destroy();
                }
            }
        });

        // Debug Visual (Ativa se o player continuar invisível)
        //this.physics.world.createDebugGraphic();
    }

    handleReachedDoor() {
        if (this.isChangingLevel) return;
        this.isChangingLevel = true;
        
        this.player.setVelocity(0, 0);
        
        // CORREÇÃO 3: Tocar a animação correta do player 2
        this.player.anims.play('p2_idle', true); 
        
        LevelManager.completeLevel(this); 
    }

    update() {
        if (this.player) this.player.update();
        if (this.enemies) {
            this.enemies.children.iterate((enemy) => {
                if (enemy && enemy.update) enemy.update(this.player);
            });
        }

        //Saber coordenadas com o click do rato 
        this.input.on('pointerdown', (pointer) => {
            console.log(`X: ${pointer.worldX}, Y: ${pointer.worldY}`);
        });

        let closestNPC = null;
        let shortestDistance = 80; // Distância de ativação

        this.npcs.getChildren().forEach(npc => {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
            
            if (distance < shortestDistance) {
                closestNPC = npc;
                npc.showPrompt(true);
            } else {
                npc.showPrompt(false);
            }
        });

        this.activeNPC = closestNPC;

        // Se pressionar X e estiver perto de um NPC, inicia o jogo específico dele
        if (Phaser.Input.Keyboard.JustDown(this.keyX) && this.activeNPC) {
            this.player.setVelocity(0, 0); // Para o jogador
            this.scene.pause(); // Pausa o mapa
            this.scene.launch(this.activeNPC.minigameKey, { returnScene: this.scene.key });
        }
    }
}