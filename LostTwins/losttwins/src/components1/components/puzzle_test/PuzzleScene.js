import Phaser from 'phaser';
import { initPuzzle } from './PuzzleGame';
import './Puzzle.css';

/**
 * Cena do Phaser responsável por gerir o minijogo de Puzzle.
 * Esta cena sobrepõe elementos HTML ao canvas do jogo para criar a interface do puzzle.
 * Quando o puzzle termina (vitória ou fecho), devolve o controlo à cena anterior (o nível do jogo).
 */
export default class PuzzleScene extends Phaser.Scene {
    /**
     * Construtor da cena.
     * Define a chave única 'Puzzle' para esta cena ser invocada pelo Scene Manager.
     */
    constructor() {
        super({ key: 'Puzzle' });
    }

    /**
     * Método de inicialização chamado automaticamente quando a cena arranca.
     * Recebe dados da cena anterior.
     * 
     * @param {object} data - Dados passados ao iniciar a cena.
     * @param {string} data.returnScene - A chave da cena (ex: 'Level1') para onde voltar após o puzzle.
     */
    init(data) {
        this.returnScene = data.returnScene; // Guarda o nome do nível para saber onde retomar
    }

    /**
     * Método principal de criação dos objetos da cena.
     * Aqui criamos dinamicamente elementos HTML (DOM) para o puzzle, pois este usa lógica web normal
     * em vez de objetos Phaser puros.
     */
    create() {
        // 1. Criar um elemento HTML "container" por cima do Canvas do Phaser
        // Isto serve como um invólucro para o jogo de puzzle
        const container = document.createElement('div');
        container.id = 'puzzle-wrapper';
        
        // Estilização direta para centrar o contentor no ecrã
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.zIndex = '1000'; // Garante que fica por cima do jogo
        
        // Adiciona o contentor ao corpo do documento HTML
        document.body.appendChild(container);

        // 2. Iniciar a lógica do Puzzle importada de PuzzleGame.js
        // Passamos o contentor onde o puzzle será desenhado e uma função de callback para quando vencer
        initPuzzle(container, () => {
            this.handleWin(container); // Chama a função de vitória quando o puzzle for resolvido
        });

        // 3. Botão de Fechar (Opcional)
        // Permite ao jogador desistir ou fechar o puzzle sem completar
        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'X';
        
        // Posicionamento do botão no canto superior direito do contentor
        closeBtn.style.position = 'absolute';
        closeBtn.style.right = '-20px';
        closeBtn.style.top = '-20px';
        
        // Define o que acontece ao clicar (fecha o puzzle assumindo que não ganhou)
        closeBtn.onclick = () => this.handleWin(container, false);
        
        container.appendChild(closeBtn);
    }

    /**
     * Lida com o fim do minijogo (vitória ou fecho manual).
     * Limpa os elementos HTML e retoma a cena do jogo principal.
     * 
     * @param {HTMLElement} container - O elemento HTML criado no create() que precisa ser removido.
     * @param {boolean} won - Indica se o jogador completou o puzzle com sucesso (default: true).
     */
    handleWin(container, won = true) {
        // Limpeza: Remove o HTML do puzzle do DOM para não ficar lixo no ecrã
        if (container) container.remove();

        // Para a execução desta cena de Puzzle
        this.scene.stop();
        
        // Retoma a cena anterior (o nível onde o jogador estava), passando o resultado
        // 'won': se ganhou, 'game': identificador do minijogo jogado
        this.scene.resume(this.returnScene, { won: won, game: 'puzzle' });
    }
}