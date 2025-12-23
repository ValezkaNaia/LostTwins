// components/ui/HUD.js
import React from 'react';
import Health from './Health';
import Score from './Score';
import '../../styles/hud.css';

const HUD = ({ playerStats, gameStats }) => {
  return (
    <div className="hud-overlay">
      <div className="hud-top-left">
        <Health current={playerStats.health} max={playerStats.maxHealth} />
      </div>
      <div className="hud-top-right">
        <Score gameStats={gameStats} isActive={true} />
      </div>
    </div>
  );
};

export default HUD;