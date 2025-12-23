class HealthSystem {
  constructor(maxHealth = 3) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
  }

  takeDamage(amount = 1) {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
    return this.currentHealth;
  }

  heal(amount = 1) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    return this.currentHealth;
  }

  getHealth() {
    return this.currentHealth;
  }

  getMaxHealth() {
    return this.maxHealth;
  }

  isAlive() {
    return this.currentHealth > 0;
  }

  reset() {
    this.currentHealth = this.maxHealth;
  }

  getHealthPercentage() {
    return (this.currentHealth / this.maxHealth) * 100;
  }
}

export default HealthSystem;