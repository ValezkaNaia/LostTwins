import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const choices = [
  { id: 'Pedra', icon: '🪨', beats: 'Tesoura' },
  { id: 'Papel', icon: '📜', beats: 'Pedra' },
  { id: 'Tesoura', icon: '✂️', beats: 'Papel' }
];

export default function PPT() {  /* Componente principal do jogo */
  const [playerChoice, setPlayerChoice] = useState(null); /* Escolha do jogador */
  const [npcChoice, setNpcChoice] = useState(null); /* Escolha do NPC */
  const [result, setResult] = useState("Escolhe o teu elemento"); /* Resultado do jogo */

  /* Função para lidar com a jogada */
  function handlePlay(choice) {
    const randomNPC = choices[Math.floor(Math.random() * 3)]; /* Escolha aleatória do NPC */
    setPlayerChoice(choice); /* Define a escolha do jogador */
    setNpcChoice(randomNPC); /* Define a escolha do NPC */

    if (choice.id === randomNPC.id) { /* Empate */
      setResult("Empate!"); /* Atualiza o resultado */
    } else if (choice.beats === randomNPC.id) {  /* Jogador vence */
      setResult("Ganhaste o duelo!");
    } else {
      setResult("O NPC venceu...");
    }
  }

  /* Renderiza o componente */
  return (
    <motion.div className="puzzle-card glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="puzzle-title">Elemental clash</h2> 
      <div className="status-label">{result}</div>
      
      <div className="choices-row">
        {choices.map((c) => (
          <button key={c.id} className="puzzle-square large" onClick={() => handlePlay(c)}>  {/* Botão de escolha */}
            <span className="icon">{c.icon}</span>
            <span className="label">{c.id}</span>
          </button>
        ))}
      </div>

       {/* Animação da batalha */}
      <AnimatePresence>
        {playerChoice && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="battle-arena">
            <div className="fighter">Tu: {playerChoice.icon}</div>
            <div className="vs">VS</div>
            <div className="fighter">NPC: {npcChoice.icon}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}