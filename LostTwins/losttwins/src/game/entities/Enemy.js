// src/game/entities/Enemy.js
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = 2;
    this.health = 50; // Vida simples
    this.maxHealth = 50;
    this.damage = 10;
    this.isDead = false;
  }

  update(player) {
    if (this.isDead) return;

    // Movimento simples em direção ao jogador
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const angle = Math.atan2(dy, dx);
    
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;

    // Colisão simples com o jogador (distância)
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 30) {
      player.takeDamage(this.damage);
    }
  }

  draw(ctx) {
    if (this.isDead) return;

    // //TODO: Adicionar sprite de inimigo genérico
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    
    // Barra de vida pequena por cima
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x - 15, this.y - 25, 30, 4);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x - 15, this.y - 25, (this.health / this.maxHealth) * 30, 4);
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.isDead = true;
      return true; // Retorna true para confirmar que morreu e dar pontos
    }
    return false;
  }
}

export default Enemy;