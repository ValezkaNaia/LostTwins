// src/game/core/GameState.js
import HealthSystem from '../../systems/HealthSystem';
import ScoreSystem from '../../systems/ScoreSystem';
import Enemy from '../entities/Enemy';

class GameState {
  constructor(onGameOver) {
    this.healthSystem = new HealthSystem(100);
    this.scoreSystem = new ScoreSystem();
    this.enemies = [];
    this.onGameOver = onGameOver; // Função para mudar de tela
    this.isPaused = false;
  }

  // Adicionar inimigo
  spawnEnemy(x, y) {
    this.enemies.push(new Enemy(x, y));
  }

  // Atualiza tudo
  update(player, deltaTime) {
    if (this.isPaused) return;

    // Atualizar inimigos e remover mortos
    this.enemies.forEach((enemy, index) => {
      enemy.update(player);
      
      // Se o inimigo morrer (por um ataque do player que deves implementar)
      if (enemy.isDead) {
        this.scoreSystem.addScore(100); // Ganha 100 pontos
        this.enemies.splice(index, 1);
      }
    });

    // Verificar se o jogador morreu
    if (!this.healthSystem.isAlive()) {
      this.onGameOver(this.scoreSystem.getScore());
    }
  }

  // Método chamado quando o jogador ataca
  checkPlayerAttack(attackHitbox) {
    this.enemies.forEach(enemy => {
      if (this.rectIntersect(attackHitbox, enemy)) {
        enemy.takeDamage(25);
      }
    });
  }


  rectIntersect(r1, r2) {
    return !(r2.x > r1.x + r1.width || 
             r2.x + r2.width < r1.x || 
             r2.y > r1.y + r1.height ||
             r2.y + r2.height < r1.y);
  }
}


export default GameState;