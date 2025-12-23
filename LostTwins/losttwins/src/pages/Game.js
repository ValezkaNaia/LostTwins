// src/pages/Game.js
import React, { useEffect, useRef } from 'react';
import GameState from '../game/core/GameState';
import Player from '../game/entities/Player';
import Input from '../game/core/Input';
import HUD from '../components/ui/HUD';

const Game = ({ onGameOver }) => {
  const canvasRef = useRef(null);
  
  // Usamos uma referência para o estado do jogo para evitar re-renders do React no loop
  const statsRef = useRef({ health: 100, score: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 1. Inicializar Sistemas
    const input = new Input();
    const gameState = new GameState(onGameOver);
    const player = new Player(100, 100, gameState);


    let animationId;

    const loop = () => {
      // Limpar Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fundo simples
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#2d2d44'; // Chão
      ctx.fillRect(0, 548, canvas.width, 52);

      // Atualizar Lógica
      player.update(input.getInputs());
      gameState.update(player);

      // Desenhar Entidades
      player.draw(ctx);
      gameState.enemies.forEach(enemy => enemy.draw(ctx));

      // Atualizar dados do HUD (através do gameState)
      statsRef.current = {
        health: player.health,
        score: gameState.scoreSystem.getScore()
      };

      animationId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationId);
  }, [onGameOver]);

  return (
    <div style={{ position: 'relative', width: '800px', margin: '0 auto' }}>
      {/* O HUD deve receber os dados do statsRef ou do gameState */}
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        style={{ border: '2px solid #4a90e2', borderRadius: '8px' }}
      />
    </div>
  );
};

export default Game;