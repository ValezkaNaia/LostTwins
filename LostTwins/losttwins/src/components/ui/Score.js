import React, { useState, useEffect } from 'react';

const Score = ({ gameStats, isActive }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [runtimeSeconds, setRuntimeSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setRuntimeSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    const newScore = calculateScore();
    setDisplayScore(newScore);
  }, [gameStats, runtimeSeconds]);

  const calculateScore = () => {
    let score = 0;

    // Points for enemies killed
    if (gameStats?.enemiesKilled) {
      score += gameStats.enemiesKilled * 100;
    }

    // Points for minigames completed
    if (gameStats?.minigamesCompleted) {
      score += gameStats.minigamesCompleted * 500;
    }

    // Bonus for time efficiency (less time = more bonus)
    const timeBonus = Math.max(0, 3600 - runtimeSeconds) * 0.5;
    score += Math.floor(timeBonus);

    // Health bonus (remaining health percentage)
    if (gameStats?.currentHealth && gameStats?.maxHealth) {
      const healthBonus = (gameStats.currentHealth / gameStats.maxHealth) * 1000;
      score += Math.floor(healthBonus);
    }

    // Puzzle solving bonus
    if (gameStats?.puzzlesSolved) {
      score += gameStats.puzzlesSolved * 250;
    }

    return Math.floor(score);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="score-container">
      <div className="score-display">
        <h3>Score: {displayScore.toLocaleString()}</h3>
      </div>
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