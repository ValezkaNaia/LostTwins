// src/game/core/Input.js
class Input {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      jump: false,
      attack: false
    };

    // Mapeamento de teclas
    this.keyMap = {
      'ArrowLeft': 'left',
      'a': 'left',
      'ArrowRight': 'right',
      'd': 'right',
      ' ': 'jump', // Espaço para saltar
      'w': 'jump',
      'f': 'attack', // 'F' para atacar
      'Enter': 'attack'
    };

    window.addEventListener('keydown', (e) => this.handleKey(e, true));
    window.addEventListener('keyup', (e) => this.handleKey(e, false));
  }

  handleKey(event, isPressed) {
    const action = this.keyMap[event.key];
    if (action) {
      this.keys[action] = isPressed;
    }
  }

  // Retorna o estado atual das teclas para o Player
  getInputs() {
    return this.keys;
  }
}

export default Input;