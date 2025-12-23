// Exemplo para src/pages/GameOver.js
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const GameOver = ({ score, leaderboard, onRestart, onHome }) => {
  return (
    <div className="homepage-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#020205' }}>
      
      <motion.h1 initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ fontSize: '4rem', color: '#ff4d4d', fontFamily: 'Cinzel' }}>
        GAME OVER
      </motion.h1>
      
      <p style={{ fontSize: '2rem', color: 'white', marginBottom: '40px' }}>Score Final: {score}</p>

      {/* Tabela de Classificação */}
      <div className="glass-card" style={{ width: '90%', maxWidth: '500px', marginBottom: '30px' }}>
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy color="#FFD700" /> Leaderboard Top 5
        </h3>
        {leaderboard.length > 0 ? (
          leaderboard.map((player, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: index === 0 ? '#FFD700' : '#ccc' }}>
              <span>#{index + 1} {player.user_email ? player.user_email.split('@')[0] : 'Anon'}</span>
              <span>{player.high_score}</span>
            </div>
          ))
        ) : (
          <p>A carregar scores...</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <button className="modern-play-btn" onClick={onRestart}>Tentar de Novo</button>
        <button className="modern-play-btn" style={{ fontSize: '1rem', background: 'transparent' }} onClick={onHome}>Menu</button>
      </div>
    </div>
  );
};

export default GameOver;