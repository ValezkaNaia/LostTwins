// GameState.js
class GameState {
    constructor() {
        this.health = 3;
        this.maxHealth = 3;
        this.score = 0;
        this.currentLevel = 1;
        this.isGameOver = false; // Adiciona esta flag
    }

    loseLife() {
        this.health--;
        if (this.health <= 0) {
            this.isGameOver = true;
        }
        return this.health;
    }

    reset() {
        this.health = this.maxHealth;
        this.score = 0;
        this.isGameOver = false;
        this.currentLevel = 1;
    }
}
export const gameState = new GameState();