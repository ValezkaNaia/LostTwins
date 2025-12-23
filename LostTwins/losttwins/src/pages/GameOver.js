// pages/GameOver.js
import React from 'react';
import { motion } from 'framer-motion';
import '../styles/game.css'; // Ou um ficheiro específico gameover.css

const GameOver = ({ finalScore, stats, onRestart }) => {
  return (
    <div className="game-over-screen">
      <motion.div 
        className="glass-card game-over-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h1 className="modern-title">DESTINY FAILED</h1>
        
        <div className="stats-grid">
          <div className="stat-item">
            <span>Final Score</span>
            <span className="stat-value">{finalScore}</span>
          </div>
          <div className="stat-item">
            <span>Enemies Defeated</span>
            <span className="stat-value">{stats.enemiesKilled}</span>
          </div>
        </div>

        <div className="actions">
          <motion.button 
            className="modern-play-btn"
            whileHover={{ scale: 1.05 }}
            onClick={onRestart}
          >
            TRY AGAIN
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameOver;