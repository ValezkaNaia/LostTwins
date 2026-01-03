import Phaser from 'phaser';
import { initPuzzle } from './PuzzleGame';
import './Puzzle.css';

export default class PuzzleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Puzzle' });
    }

    init(data) {
        this.returnScene = data.returnScene; // Guarda o nome do nível (ex: Level1)
    }

    create() {
        // 1. Criar um elemento HTML "container" por cima do Canvas
        // O Phaser permite adicionar elementos DOM facilmente
        const container = document.createElement('div');
        container.id = 'puzzle-wrapper';
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.zIndex = '1000';
        document.body.appendChild(container);

        // 2. Iniciar o teu código do Puzzle
        initPuzzle(container, () => {
            this.handleWin(container);
        });

        // Opcional: Adicionar um botão de fechar caso o jogador desista
        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'X';
        closeBtn.style.position = 'absolute';
        closeBtn.style.right = '-20px';
        closeBtn.style.top = '-20px';
        closeBtn.onclick = () => this.handleWin(container, false);
        container.appendChild(closeBtn);
    }

    handleWin(container, won = true) {
        // Remover o HTML do DOM
        if (container) container.remove();

        // Fechar esta cena e voltar ao jogo
        this.scene.stop();
        this.scene.resume(this.returnScene, { won: won, game: 'puzzle' });
    }
}