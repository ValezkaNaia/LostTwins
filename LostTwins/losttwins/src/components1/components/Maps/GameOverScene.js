// scenes/GameOverScene.js
import Phaser from 'phaser';
import LevelManager from '../systems/LevelManager';

/**
 * Cena de Game Over.
 * É exibida quando o jogador perde todas as vidas.
 * Mostra a pontuação final, o tempo jogado, uma tabela de classificação (Leaderboard)
 * e botões para tentar novamente ou fazer login para guardar a pontuação.
 */
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    /**
     * Método principal que constrói a interface visual da cena.
     */
    create() {
        const { width, height } = this.scale;

        // 1. Recuperar Dados: Obtém a pontuação e o tempo de início guardados no registo do Phaser
        const finalScore = this.registry.get('score') || 0;
        const startTime = this.registry.get('startTime');
        
        // Calcula o tempo decorrido em milissegundos
        const elapsed = Date.now() - startTime;
        const timeText = this.formatTime(elapsed);

        // 2. Fundo: Cria um retângulo cor de creme semi-transparente para cobrir o jogo anterior
        this.add.rectangle(0, 0, width, height, 0xFFF8E7, 0.98).setOrigin(0);

        // 3. Título: Texto "GAME OVER" grande e vermelho
        this.add.text(width / 2, 60, 'GAME OVER', {
            fontSize: '48px',
            fill: '#ff0000',
            fontFamily: 'Cinzel, serif',
            fontStyle: 'bold',
            stroke: '#ffffffff',
            strokeThickness: 4
        }).setOrigin(0.5);

        // 4. Caixa de Pontuação: Cria um retângulo branco com borda azul para destacar o score
        const scoreBox = this.add.rectangle(width / 2, 130, 400, 70, 0xFFFFFF, 1);
        scoreBox.setStrokeStyle(2, 0x4a90e2);
        
        // Texto com a pontuação e o tempo formatado
        this.add.text(width / 2, 130, `SCORE: ${finalScore}  |  TIME: ${timeText}`, {
            fontSize: '20px',
            fill: '#4a90e2',
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 5. Leaderboard: Chama a função auxiliar para desenhar a tabela de recordes
        this.createLeaderboard(width, height, finalScore, timeText);

        // 6. Botões: Define a posição Y para a linha de botões
        const buttonY = height - 70;
        
        // Botão "TRY AGAIN" (Tentar de Novo)
        const retryBtn = this.add.text(width / 2 - 120, buttonY, 'TRY AGAIN', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#4a90e2',
            padding: { x: 25, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Efeitos de Hover (passar o rato por cima) para o botão de reiniciar
        retryBtn.on('pointerover', () => {
            retryBtn.setScale(1.05);
            retryBtn.setStyle({ backgroundColor: '#5aa0f2' });
        });
        
        retryBtn.on('pointerout', () => {
            retryBtn.setScale(1);
            retryBtn.setStyle({ backgroundColor: '#4a90e2' });
        });

        // Ação de Clique: Reinicia os dados e o jogo
        retryBtn.on('pointerdown', () => {
            // Zera a pontuação e reinicia o cronómetro
            this.registry.set('score', 0);
            this.registry.set('startTime', Date.now());
            // Usa o LevelManager para reiniciar a cena do Nível 1
            LevelManager.restartGame(this);
        });

        // Botão de Login ou Guardar (Lado direito)
        this.createActionButton(width, height, buttonY, finalScore, timeText);
    }

    /**
     * Desenha a tabela de classificação (Leaderboard) no ecrã.
     */
    createLeaderboard(width, height, currentScore, currentTime) {
        // Título da secção
        this.add.text(width / 2, 180, 'TOP SCORES', {
            fontSize: '24px',
            fill: '#333',
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Fundo da tabela
        const leaderboardBg = this.add.rectangle(width / 2, 300, 500, 200, 0xFFFFFF, 1);
        leaderboardBg.setStrokeStyle(2, 0xa3d8f4);

        // Obtém os dados (atualmente dados falsos/mock para teste)
        const leaderboardData = this.getLeaderboardData();

        if (leaderboardData.length === 0) {
            // Mensagem caso não existam recordes
            this.add.text(width / 2, 300, 'No scores yet! Be the first!', {
                fontSize: '16px',
                fill: '#999',
                fontFamily: 'Inter, sans-serif',
                fontStyle: 'italic'
            }).setOrigin(0.5);
        } else {
            // Exibe os top 5 scores
            let startY = 230;
            leaderboardData.slice(0, 5).forEach((entry, index) => {
                const rank = index + 1;
                // Adiciona medalhas para os 3 primeiros
                const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
                
                // Coluna do Rank
                this.add.text(width / 2 - 220, startY, medalEmoji, {
                    fontSize: '16px',
                    fill: '#333',
                    fontFamily: 'Inter, sans-serif'
                }).setOrigin(0, 0.5);

                // Coluna do Nome
                this.add.text(width / 2 - 180, startY, entry.name, {
                    fontSize: '16px',
                    fill: '#333',
                    fontFamily: 'Inter, sans-serif',
                    fontStyle: 'bold'
                }).setOrigin(0, 0.5);

                // Coluna da Pontuação
                this.add.text(width / 2 + 100, startY, `${entry.score} pts`, {
                    fontSize: '16px',
                    fill: '#4a90e2',
                    fontFamily: 'Inter, sans-serif',
                    fontStyle: 'bold'
                }).setOrigin(0, 0.5);

                // Coluna do Tempo
                this.add.text(width / 2 + 200, startY, entry.time, {
                    fontSize: '16px',
                    fill: '#666',
                    fontFamily: 'Inter, sans-serif'
                }).setOrigin(1, 0.5);

                // Incrementa a posição Y para a próxima linha
                startY += 35;
            });
        }
    }

    /**
     * Cria o botão de ação secundário (Login ou Guardar Score).
     * Verifica se o utilizador está logado para decidir qual botão mostrar.
     */
    createActionButton(width, height, buttonY, score, time) {
        // Nota: checkUserLoggedIn precisa de ser implementado ou importado
        const isLoggedIn = this.checkUserLoggedIn();

        if (isLoggedIn) {
            // Se estiver logado: Botão "SAVE SCORE"
            const saveBtn = this.add.text(width / 2 + 120, buttonY, 'SAVE SCORE', {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                backgroundColor: '#3cff67',
                padding: { x: 25, y: 12 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            saveBtn.on('pointerover', () => {
                saveBtn.setScale(1.05);
                saveBtn.setStyle({ backgroundColor: '#4cff77' });
            });
            
            saveBtn.on('pointerout', () => {
                saveBtn.setScale(1);
                saveBtn.setStyle({ backgroundColor: '#3cff67' });
            });

            saveBtn.on('pointerdown', () => {
                // Nota: saveScore precisa de ser implementado
                this.saveScore(score, time);
                saveBtn.setText('SAVED!');
                saveBtn.disableInteractive();
                saveBtn.setStyle({ backgroundColor: '#2aa04a' });
            });
        } else {
            // Se NÃO estiver logado: Botão "LOGIN"
            const loginBtn = this.add.text(width / 2 + 120, buttonY, 'LOGIN', {
                fontSize: '18px',
                fill: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                backgroundColor: '#3cff67',
                padding: { x: 35, y: 12 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            loginBtn.on('pointerover', () => {
                loginBtn.setScale(1.05);
                loginBtn.setStyle({ backgroundColor: '#4cff77' });
            });
            
            loginBtn.on('pointerout', () => {
                loginBtn.setScale(1);
                loginBtn.setStyle({ backgroundColor: '#3cff67' });
            });

            loginBtn.on('pointerdown', () => {
                // Guarda a pontuação temporariamente no navegador e redireciona para a página de login
                window.localStorage.setItem('pendingScore', JSON.stringify({ score, time }));
                window.location.href = '/login';
            });
        }
    }

    /**
     * Obtém os dados da tabela de classificação.
     * Tenta ler do localStorage ou retorna dados de exemplo.
     */
    getLeaderboardData() {
        // Tenta obter do localStorage (placeholder)
        const stored = window.localStorage.getItem('leaderboard');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Retorna dados fictícios para demonstração se não houver nada guardado
        return [
            { name: 'Player 1', score: 500, time: '3:45' },
            { name: 'Player 2', score: 450, time: '4:12' },
            { name: 'Player 3', score: 400, time: '4:58' }
        ];
    }

    /**
     * Formata milissegundos em MM:SS (ex: 02:30).
     */
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // Métodos auxiliares (Placeholders para evitar erros se não existirem)
    checkUserLoggedIn() {
        // Lógica real de verificação de sessão viria aqui
        return false; 
    }

    saveScore(score, time) {
        console.log('Score saved:', score, time);
        // Lógica de guardar na base de dados viria aqui
    }

}