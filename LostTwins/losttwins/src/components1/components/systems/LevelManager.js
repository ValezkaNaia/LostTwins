// LevelManager.js
import { gameState } from './GameState';

export default class LevelManager {
    static die(scene) {
        gameState.loseLife();
        
        if (gameState.isGameOver) {
            scene.scene.pause();
            scene.scene.launch('GameOverScene');
        } else {
            scene.scene.restart();
        }
    }

    static nextLevel(scene) {
        gameState.currentLevel++;
        scene.scene.start(`Level${gameState.currentLevel}`);
    }

    static completeLevel(scene) {
        console.log("Nível Completo!");
        
        // Para a cena atual
        scene.scene.stop(scene.scene.key);
        
        // Se o nível atual é Level1, vai para o Level2
        if (scene.scene.key === 'Level1') {
            scene.scene.start('Level2');
        } else {
            scene.scene.start('VictoryScene');
        }
    }
}