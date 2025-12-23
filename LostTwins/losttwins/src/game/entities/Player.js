// src/game/entities/Player.js
import HealthSystem from '../../systems/HealthSystem';

class Player {
  constructor(x, y, gameState) {
    this.x = x;
    this.y = y;
    this.gameState = gameState;
    
    // Stats
    this.width = 32;
    this.height = 48;
    this.speed = 5;
    this.maxHealth = 100;
    this.health = 100;
    
    // State
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.isAttacking = false;
    this.direction = 1; 
    this.isInvulnerable = false;
    this.invulnerableTime = 0;
    this.attackCooldown = 0;
  }

  update(input) {
    // Movimento Lateral
    this.velocityX = 0;
    if (input.left) {
      this.velocityX = -this.speed;
      this.direction = -1;
    }
    if (input.right) {
      this.velocityX = this.speed;
      this.direction = 1;
    }

    // Pular
    if (input.jump && !this.isJumping) {
      this.velocityY = -12;
      this.isJumping = true;
    }

    // Gravidade
    this.velocityY += 0.6;
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Chão básico (previne cair infinitamente)
    if (this.y > 500) {
      this.y = 500;
      this.isJumping = false;
      this.velocityY = 0;
    }

    // Ataque
    if (input.attack && this.attackCooldown <= 0) {
      this.attack();
      this.attackCooldown = 30;
    }

    if (this.attackCooldown > 0) this.attackCooldown--;
  }

  attack() {
    this.isAttacking = true;
    
    // Área de dano baseada na direção
    const hitbox = {
      x: this.direction === 1 ? this.x + this.width : this.x - 40,
      y: this.y,
      width: 40,
      height: this.height
    };

    // Avisa o GameState para verificar colisão com inimigos
    this.gameState.checkPlayerAttack(hitbox);

    // Termina a animação de ataque após 200ms
    setTimeout(() => { this.isAttacking = false; }, 200);
  }

  draw(ctx) {
    // Corpo do Player
    ctx.fillStyle = this.isInvulnerable ? '#aaa' : '#4a90e2';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Desenha "espada" se estiver a atacar
    if (this.isAttacking) {
      ctx.fillStyle = '#fff';
      const attackX = this.direction === 1 ? this.x + this.width : this.x - 20;
      ctx.fillRect(attackX, this.y + 10, 20, 10);
    }
  }

  takeDamage(amount) {
    if (this.isInvulnerable) return;
    this.health -= amount;
    this.isInvulnerable = true;
    setTimeout(() => { this.isInvulnerable = false; }, 1000);

    if (this.health <= 0) {
      this.gameState.onGameOver();
    }
  }
}

export default Player;