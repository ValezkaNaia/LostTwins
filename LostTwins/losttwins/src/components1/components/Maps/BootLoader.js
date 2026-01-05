import Phaser from 'phaser';

export default class BootLoader extends Phaser.Scene {
    constructor() {
        super({ key: 'BootLoader' });
    }

    preload() {
        // --- BARRA DE PROGRESSO (Opcional mas recomendado) ---
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const progressBar = this.add.graphics();
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4, height / 2, (width / 2) * value, 30);
        });

        // --- CARREGAR MAPAS ---
        this.load.tilemapTiledJSON('level1', 'assets/level1.json');
        this.load.tilemapTiledJSON('level2', 'assets/level2.json');

        // --- CARREGAR IMAGENS / TILESETS ---
        //level1 tilesets
        this.load.image('tiles-chao', 'assets/tileset_64x64(new).png');
        this.load.image('tiles-background1', 'assets/bgVerde_resized.png');
        this.load.image('smoke_particle', 'assets/smoke_dot.png');
        //level2 tilesets
        this.load.image('tiles-chao2', 'assets/level2/mapa.png');
        this.load.image('tiles-background2', 'assets/level2/background.png');
        this.load.image('tiles-softsand', 'assets/level2/softsand.png');
        this.load.image('tiles-water', 'assets/level2/water.png');
        //this.load.image('heart', 'assets/coracao.png');

        // --- CARREGAR SPRITESHEETS (Player 1) ---
        this.load.spritesheet('idle1', 'assets/idle1.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('walk1', 'assets/walk1.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('attack1', 'assets/attack1.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jump1', 'assets/jump1.png', { frameWidth: 64, frameHeight: 64 });

        // --- CARREGAR SPRITESHEETS (Player 2) ---
        this.load.spritesheet('idle2', 'assets/player2/idle2.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('walk2', 'assets/player2/walk2.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('attack2', 'assets/player2/attack2.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('jump2', 'assets/player2/jump2.png', { frameWidth: 64, frameHeight: 64 });

        // --- CARREGAR SPRITESHEETS (Enemy) ---
        this.load.spritesheet('en1_attack', 'assets/enemy1/attack_enemy1.png', { frameWidth: 80, frameHeight: 64 });
        this.load.spritesheet('en1_die', 'assets/enemy1/die_enemy1.png', { frameWidth: 80, frameHeight: 64 });
        this.load.spritesheet('en1_hurt', 'assets/enemy1/hurt_enemy1.png', { frameWidth: 80, frameHeight: 64 });
        this.load.spritesheet('en1_move', 'assets/enemy1/move_enemy1.png', { frameWidth: 80, frameHeight: 64 });

        //Enemy 2 spritesheet
        this.load.spritesheet('en2', 'assets/enemy2.png', { frameWidth: 64, frameHeight: 64 });

        //NPC spritesheet
        this.load.spritesheet('npc_anim', 'assets/npc_idle.png', { frameWidth: 64, frameHeight: 64 });

        //Heart icon
        this.load.image('heart_icon', 'assets/Pixel Heart Sprite Sheet 32x32.png');

        //Portal spritesheet
        this.load.spritesheet('portal_blue', 'assets/portal_blue.png', { frameWidth: 64, frameHeight: 64 });

        // --- CARREGAR ÁUDIO ---
        this.load.audio('hit_enemy', '/sounds/hit_enemy.mp3');
        this.load.audio('hit_player', '/sounds/hit_player.mp3');
        this.load.audio('bg_music', '/sounds/music.mp3');

        // Quando terminar o carregamento, vai para o Level1
        //this.load.on('complete', () => {
           // this.scene.start('Level1');
        //});
    }

    create() {
        //Player
        // Animação parado (Idle)
        this.anims.create({
            key: 'p1_idle',
            frames: this.anims.generateFrameNumbers('idle1', { start: 0, end: 5 }), // Ajusta o end
            frameRate: 8,
            repeat: -1 // -1 faz a animação ficar em loop infinito
        });

        // Animação andar (Walk)
        this.anims.create({
            key: 'p1_walk',
            frames: this.anims.generateFrameNumbers('walk1', { start: 0, end: 5 }), // Ajusta o end
            frameRate: 12,
            repeat: -1
        });

        // Animação saltar (Jump) - Geralmente o jump tem poucos frames ou apenas 1
        this.anims.create({
            key: 'p1_jump',
            frames: this.anims.generateFrameNumbers('jump1', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0 // 0 significa que a animação corre apenas uma vez
        });

        // Animação ataque (Attack)
        this.anims.create({
            key: 'p1_attack',
            frames: this.anims.generateFrameNumbers('attack1', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: 0
        });

        //Player 2
        // Animação parado (Idle)
        this.anims.create({
            key: 'p2_idle',
            frames: this.anims.generateFrameNumbers('idle2', { start: 0, end: 19 }), // Ajusta o end
            frameRate: 8,
            repeat: -1 // -1 faz a animação ficar em loop infinito
        });

        // Animação andar (Walk)
        this.anims.create({
            key: 'p2_walk',
            frames: this.anims.generateFrameNumbers('walk2', { start: 0, end: 3 }), // Ajusta o end
            frameRate: 12,
            repeat: -1
        });

        // Animação saltar (Jump) - Geralmente o jump tem poucos frames ou apenas 1
        this.anims.create({
            key: 'p2_jump',
            frames: this.anims.generateFrameNumbers('jump2', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0 // 0 significa que a animação corre apenas uma vez
        });

        // Animação ataque (Attack)
        this.anims.create({
            key: 'p2_attack',
            frames: this.anims.generateFrameNumbers('attack2', { start: 0, end: 13 }),
            frameRate: 15,
            repeat: 0
        });

        //Enemy 1
        // Animação de movimento do Inimigo 1
        this.anims.create({
            key: 'enemy1_move',
            frames: this.anims.generateFrameNumbers('en1_move', { start: 0, end: 7 }), 
            frameRate: 8,
            repeat: -1
        });

        // Animação de ataque do Inimigo 1
        this.anims.create({
            key: 'enemy1_attack',
            frames: this.anims.generateFrameNumbers('en1_attack', { start: 0, end: 9 }), 
            frameRate: 12,
            repeat: 0
        });
        // Animação de dano do Inimigo 1
        this.anims.create({
            key: 'enemy1_hurt',
            frames: this.anims.generateFrameNumbers('en1_hurt', { start: 0, end: 4 }), 
            frameRate: 10,
            repeat: 0
        });
        // Animação de morte do Inimigo 1
        this.anims.create({
            key: 'enemy1_die',
            frames: this.anims.generateFrameNumbers('en1_die', { start: 0, end: 14 }), 
            frameRate: 8,
            repeat: 0
        });

        //Enemy 2
        // Animação de movimento do Inimigo 2
        this.anims.create({
            key: 'enemy2_move',
            frames: this.anims.generateFrameNumbers('en2', { start: 4, end: 7 }), 
            frameRate: 8,
            repeat: -1
        });

        // Animação de ataque do Inimigo 2
        this.anims.create({
            key: 'enemy2_attack',
            frames: this.anims.generateFrameNumbers('en2', { start: 8, end: 12 }), 
            frameRate: 12,
            repeat: 0
        });
        // Animação de dano do Inimigo 2
        this.anims.create({
            key: 'enemy2_hurt',
            frames: this.anims.generateFrameNumbers('en2', { start: 13, end: 16 }), 
            frameRate: 10,
            repeat: 0
        });
        // Animação de morte do Inimigo 2
        this.anims.create({
            key: 'enemy2_die',
            frames: this.anims.generateFrameNumbers('en2', { start: 17, end: 20 }), 
            frameRate: 8,
            repeat: 0
        });
        //animação portal azul
        this.anims.create({
            key: 'portal_blue_anim',
            frames: this.anims.generateFrameNumbers('portal_blue', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        //animação npc
        this.anims.create({
            key: 'npc_idle_anim',
            frames: this.anims.generateFrameNumbers('npc_anim', { start: 0, end: 3 }), // Ajusta o end conforme o número de frames
            frameRate: 6,
            repeat: -1 // Loop infinito
        });
        // --- FINALIZAÇÃO ---
        // Agora que as animações estão prontas, vamos para o primeiro nível
        this.scene.start('Level1');
    }
}
