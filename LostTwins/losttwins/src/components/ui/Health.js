// components/ui/Health.js
import React from 'react';
import { motion } from 'framer-motion';

const Health = ({ current, max }) => {
  const percentage = (current / max) * 100;

  return (
    <div className="health-bar-container">
      <div className="health-label">VITALITY</div>
      <div className="bar-bg">
        <motion.div 
          className="bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {/* TODO: Adicionar ícone de coração pulsante aqui */}
    </div>
  );
};

export default Health;