// src/pages/Game.js
import React, { useEffect } from 'react';

const Game = ({ onGameOver }) => { // <--- Recebe a prop aqui
  
  useEffect(() => {
    // ... a tua lógica de inicialização do jogo ...
    
    // ONDE O JOGADOR MORRE (dentro da tua classe ou função de jogo):
    // Em vez de this.onGameOver(score, ...), agora chamas a prop do React:
    
    // Exemplo conceptual:
    // gameInstance.events.on('death', (finalScore) => {
    //    onGameOver(finalScore); 
    // });
    
  }, []);

  return <div id="game-container"></div>;
};

export default Game;