//import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import AudioSystem from '../systems/AudioSystem';
import LevelManager from '../systems/LevelManager';
import Door from '../entities/Door';
import NPC from '../entities/NPC';
import HealthSystem from '../systems/HealthSystem'; 

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    create() {
        // Initialize score and timer
        if (!this.registry.has('score')) {
            this.registry.set('score', 0);
        }
        if (!this.registry.has('startTime')) {
            this.registry.set('startTime', Date.now());
        }
        
        // 1. Mapa e Camadas
        const map1 = this.make.tilemap({ key: 'level1' });
        const tilesetChao = map1.addTilesetImage('tileset1', 'tiles-chao');
        const tilesetBackground = map1.addTilesetImage('bgVerde_resized', 'tiles-background1');

        map1.createLayer('fundo', tilesetBackground, 0, 0);
        map1.createLayer('decoration', tilesetBackground, 0, 0);
        this.groundLayer = map1.createLayer('Camada de Blocos 1', tilesetChao, 0, 0);
        this.groundLayer.setCollisionByExclusion([-1]);

        // 2. Sistemas
        this.audio = new AudioSystem(this);
        this.audio.init(['hit_enemy', 'hit_player', 'bg_music']);
        this.audio.play('bg_music', { volume: 0.3, loop: true });

        // ... (dentro do create, após audio.init)
        
        // --- SISTEMA DE VIDA ---
        this.sistemaVida = new HealthSystem(3); // Inicia com 3 vidas
        this.listaCoracoes = []; // Array para guardar as imagens
        this.criarHudVida(); // Desenha os corações iniciais

        // 3. Player
        //this.player = new Player(this, 100, 100);
        //this.player = new Player(this, 100, 100, { prefix: 'p1' });
        this.player = new Player(this, 100, 400, { prefix: 'p1' });
        // AJUSTE: Define a origem para o centro horizontal (0.5) e para os PÉS (1)
        this.player.setOrigin(0.5, 1);
        // setSize(largura, altura) e setOffset(x, y)
        this.player.body.setSize(45, 60); 
        this.player.body.setOffset(10, 3);
        this.physics.add.collider(this.player, this.groundLayer);

        // 4. Inimigos
        const enemy1Config = {
            move: 'enemy1_move', attack: 'enemy1_attack',
            hurt: 'enemy1_hurt', die: 'enemy1_die', idle: 'enemy1_move'
        };

        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        
        const spawnPoints = [
            { x: 528, y: 288 }, { x: 1341, y: 444 }, { x: 2999, y: 385 }
        ];

        spawnPoints.forEach(point => {
            const enemy = new Enemy(this, point.x, point.y, enemy1Config);
            this.enemies.add(enemy);
        });

        // 5. Colisões e Combate
        this.physics.add.collider(this.enemies, this.groundLayer);
        
        // Dano Inimigo -> Player
        this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
            if (!enemy.isDead && !enemy.isAttacking && !enemy.isHurt) {
                
                // Só leva dano se NÃO estiver invencível
                if (!player.invencivel) {
                    enemy.attack(player); // Animação do inimigo
                    this.levarDano();     // Tira vida e atualiza corações
                    
                    // Lógica de Invencibilidade Temporária
                    player.invencivel = true;
                    player.setTint(0xff0000); // Fica vermelho
                    
                    // Após 1 segundo, volta ao normal
                    this.time.delayedCall(1000, () => {
                        player.invencivel = false;
                        player.clearTint();
                    });
                }
            }
        });

        // Dano Player -> Inimigo
        this.physics.add.overlap(this.player.attackZone, this.enemies, (zone, enemy) => {
            if (this.player.isAttacking && !enemy.isHurt && !enemy.isDead) {
                enemy.takeDamage();
                this.audio.play('hit_enemy');
                const knockbackForce = 40; 
                const knockbackDir = (enemy.x > this.player.x) ? knockbackForce : -knockbackForce;
                enemy.setVelocityX(knockbackDir);
                
                // Award score when enemy dies
                if (enemy.health <= 0 && !enemy.scoreAwarded) {
                    enemy.scoreAwarded = true; // Prevent duplicate scoring
                    this.addScore(100); // 100 points per enemy
                }
            }
        });

        //Adicionar npc e minigames 
        this.npcs = this.physics.add.group({ classType: NPC, runChildUpdate: true });

        const spawnPoints2 = [
            { x: 2177, y: 287, game: 'Puzzle' },
            { x: 3593, y: 190, game: 'Puzzle' }
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
        this.physics.world.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
        this.cameras.main.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setZoom(1.2);

        // Teclas de atalho (Debug)
        this.input.keyboard.on('keydown-SPACE', () => { this.player.die(); });

        //Porta
        // 1. Criar a porta no final do nível (ajusta as coordenadas X e Y)
        // Podes ver as coordenadas certas no Tiled ou usar map1.widthInPixels - 100
        this.door = new Door(this, 4796, 400, 'portal_blue').setOrigin(0.5, 1);
        this.door.setDepth(10); // Garante que fica à frente de tudo

        // 2. Configurar a colisão/overlap
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

        //this.physics.world.createDebugGraphic();
    }

    handleReachedDoor() {
        // Evita que o evento dispare múltiplas vezes
        if (this.isChangingLevel) return;
        this.isChangingLevel = true;

        // Feedback visual (opcional: podes tocar um som de porta a abrir)
        this.player.setVelocity(0, 0);
        this.player.anims.play('p1_idle', true);
        
        // Chamar o LevelManager para mudar para o Nível 2
        LevelManager.completeLevel(this); 
        
        // Após um pequeno delay ou após a VictoryScene, o Manager faz o start('Level2')
    }

    addScore(points) {
        const currentScore = this.registry.get('score');
        this.registry.set('score', currentScore + points);
    }

    // --- FUNÇÕES DE HUD E VIDA ---

   criarHudVida() {
        // Limpa visuais antigos
        this.listaCoracoes.forEach(c => c.destroy());
        this.listaCoracoes = [];

        // --- AJUSTES DE POSIÇÃO ---
        // Como tens Zoom 1.2, o (50, 50) fica fora da tela.
        // Vamos aumentar para trazer mais para "dentro".
        const startX = 120; // Antes era 50
        const startY = 70; // Antes era 50
        const espacamento = 40; // Distância entre os corações

        // Cria os corações baseado na vida atual
        for (let i = 0; i < this.sistemaVida.currentHealth; i++) {
            // Calcula a posição de cada um
            let x = startX + (i * espacamento);
            let y = startY;

            let coracao = this.add.image(x, y, 'heart_icon');
            
            // Fixa na tela
            coracao.setScrollFactor(0); 
            coracao.setDepth(100);

            // Opcional: Se achares que os corações ficaram gigantes por causa do zoom,
            // podes diminuir um pouco o tamanho deles aqui:
            // coracao.setScale(0.8); 

            this.listaCoracoes.push(coracao);
        }
    }

    levarDano() {
        // 1. Lógica
        this.sistemaVida.damage(1);

        // 2. Visual (Remove o último coração)
        if (this.listaCoracoes.length > 0) {
            let coracao = this.listaCoracoes.pop();
            coracao.destroy();
        }

        // Tocar som de dano no player
        this.audio.play('hit_player');

        // 3. Game Over check
        if (this.sistemaVida.isDead()) {
            console.log("Game Over");
            this.player.die(); // Se o teu player tiver animação de morte
            
            // Reinicia a cena após um tempo ou vai para Game Over Scene
            this.time.delayedCall(1000, () => {
                this.scene.restart();
            });
        }
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
