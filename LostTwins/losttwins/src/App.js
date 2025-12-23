import React from 'react';
import Intro from './pages/Intro';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Renderizamos apenas a Intro para focar no design e animações da Homepage */}
      <Intro />
    </div>
  );
}

)
update(player) {
  // ... lógica de movimento dos inimigos ...

  if (player.health <= 0) {
    // Passa o score final e as estatísticas para a função de Game Over
    this.onGameOver(
      this.scoreSystem.getScore(), 
      { enemiesKilled: Math.floor(this.scoreSystem.getScore() / 100) } 
    );
  }
}


export default App;