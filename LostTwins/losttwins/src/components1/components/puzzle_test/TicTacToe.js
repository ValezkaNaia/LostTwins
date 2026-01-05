import React, { useState, useEffect, useCallback } from 'react'; /* Adicionado useCallback e useEffect */
import { motion } from 'framer-motion';
import './Puzzles.css';


/* Componente do quadrado do tabuleiro */
function Square({ value, onSquareClick }) {
  const displayValue = value === 'X' ? '💧' : value === 'O' ? '🌿' : null; 
  return (
    <button className="puzzle-square" onClick={onSquareClick}>
      {displayValue}
    </button>
  );
}

/* Componente do tabuleiro */
function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status = winner 
    ? "Vencedor: " + (winner === 'X' ? "Ilyra" : "NPC") 
    : "Próximo: " + (xIsNext ? "Ilyra" : "NPC");


    /* Função para lidar com o clique em um quadrado */
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] || !xIsNext) return; /* Previne jogadas inválidas */
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    onPlay(nextSquares);
  }

  return (
    <div className="board-wrapper">
      <div className="status-label">{status}</div>
      <div className="board-grid">
        {squares.map((val, i) => (
          <Square key={i} value={val} onSquareClick={() => handleClick(i)} /> /* Passa a função de clique */
        ))}
      </div>
    </div>
  );
}

/* Componente principal do jogo*/
export default function TicTacToe() {
  const [history, setHistory] = useState([Array(9).fill(null)]); /* Histórico de jogadas */
  const [currentMove, setCurrentMove] = useState(0); /* Movimento atual */
  const xIsNext = currentMove % 2 === 0;  /* Determina de quem é a vez */
  const currentSquares = history[currentMove]; /* Estado atual do tabuleiro */

  // Usamos useCallback para que a função não mude em cada renderização
  const handlePlay = useCallback((nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];  /* Atualiza o histórico */
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); /* Atualiza o movimento atual */
  }, [history, currentMove]);


  /* Efeito colateral para a jogada do NPC */
  useEffect(() => {
    // Agora incluímos todas as dependências necessárias no array []
    if (!xIsNext && !calculateWinner(currentSquares)) {
      const emptySquares = currentSquares.map((val, idx) => val === null ? idx : null).filter(val => val !== null); /* Encontra quadrados vazios */

      if (emptySquares.length > 0) { /* Timer para simular o tempo de pensamento do NPC */
        const timer = setTimeout(() => { 
          const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)]; /* Escolhe um quadrado aleatório */
          const nextSquares = currentSquares.slice(); /* Cria uma cópia do estado atual */
          nextSquares[randomIndex] = 'O';
          handlePlay(nextSquares);
        }, 800);
        return () => clearTimeout(timer); // Limpeza do timer
      }
    }
  }, [xIsNext, currentSquares, handlePlay]); // <--- Todas as dependências aqui!

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="puzzle-card glass-card">
      <h2 className="puzzle-title">Ancient grid</h2>
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      <button className="reset-btn" onClick={() => {setHistory([Array(9).fill(null)]); setCurrentMove(0);}}>
        Reiniciar
      </button>
    </motion.div>
  );
}

/* Função para calcular o vencedor */
function calculateWinner(squares) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}