export default class HealthSystem {
    constructor(maxHealth = 3) {
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
    }

    damage(amount = 1) {
        this.currentHealth -= amount;
        if (this.currentHealth < 0) this.currentHealth = 0;
        return this.currentHealth;
    }

    isDead() {
        return this.currentHealth <= 0;
    }
}