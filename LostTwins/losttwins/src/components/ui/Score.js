import React, { useState, useEffect } from 'react';

/**
 * Componente Score (Pontuação).
 * Responsável por calcular e exibir a pontuação do jogador em tempo real,
 * baseando-se nas estatísticas do jogo (inimigos mortos, puzzles, vida) e no tempo decorrido.
 */
const Score = ({ gameStats, isActive }) => {
  // Estado para guardar a pontuação final que aparece no ecrã
  const [displayScore, setDisplayScore] = useState(0);
  
  // Estado para contar o tempo de jogo em segundos (cronómetro interno)
  const [runtimeSeconds, setRuntimeSeconds] = useState(0);

  // Efeito 1: Gestão do Cronómetro
  // Este efeito corre sempre que a propriedade 'isActive' muda.
  useEffect(() => {
    let interval;
    // Só inicia a contagem se o jogo estiver ativo (não pausado)
    if (isActive) {
      interval = setInterval(() => {
        // Aumenta o contador em 1 a cada segundo (1000ms)
        setRuntimeSeconds(prev => prev + 1);
      }, 1000);
    }
    // Limpeza: para o intervalo quando o componente é desmontado ou o jogo pausa
    // Isto evita erros de memória e contagens duplicadas
    return () => clearInterval(interval);
  }, [isActive]);

  // Efeito 2: Atualização da Pontuação
  // Recalcula a pontuação sempre que as estatísticas (gameStats) ou o tempo (runtimeSeconds) mudam
  useEffect(() => {
    const newScore = calculateScore();
    setDisplayScore(newScore);
  }, [gameStats, runtimeSeconds]);

  // Função que contém toda a lógica matemática da pontuação
  const calculateScore = () => {
    let score = 0;

    // Adiciona 100 pontos por cada inimigo derrotado
    // O operador ?. (optional chaining) evita erros se gameStats for nulo
    if (gameStats?.enemiesKilled) {
      score += gameStats.enemiesKilled * 100;
    }

    // Adiciona 500 pontos por cada minijogo completado
    if (gameStats?.minigamesCompleted) {
      score += gameStats.minigamesCompleted * 500;
    }

    // Bónus de tempo: Recompensa a rapidez.
    // Começa com 3600 (equivalente a 1 hora) e subtrai o tempo gasto.
    // Se o jogador demorar mais de 1 hora, o bónus é 0 (Math.max impede valores negativos).
    const timeBonus = Math.max(0, 3600 - runtimeSeconds) * 0.5;
    score += Math.floor(timeBonus);

    // Bónus de Vida: Baseado na percentagem de vida restante.
    // Se tiver 100% de vida, ganha 1000 pontos extra.
    if (gameStats?.currentHealth && gameStats?.maxHealth) {
      const healthBonus = (gameStats.currentHealth / gameStats.maxHealth) * 1000;
      score += Math.floor(healthBonus);
    }

    // Adiciona 250 pontos por cada puzzle resolvido
    if (gameStats?.puzzlesSolved) {
      score += gameStats.puzzlesSolved * 250;
    }

    // Retorna o valor final arredondado para baixo (número inteiro)
    return Math.floor(score);
  };

  // Função auxiliar para formatar segundos em HH:MM:SS para exibição
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    // padStart(2, '0') garante que números como '5' fiquem '05'
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="score-container">
      {/* Mostra a pontuação total em destaque */}
      <div className="score-display">
        <h3>Score: {displayScore.toLocaleString()}</h3>
      </div>
      {/* Mostra os detalhes de como a pontuação foi calculada */}
      <div className="score-breakdown">
        <p>Enemies Killed: {gameStats?.enemiesKilled || 0} × 100</p>
        <p>Minigames Completed: {gameStats?.minigamesCompleted || 0} × 500</p>
        <p>Puzzles Solved: {gameStats?.puzzlesSolved || 0} × 250</p>
        <p>Runtime: {formatTime(runtimeSeconds)}</p>
      </div>
    </div>
  );
};

export default Score;