// src/pages/Game.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// Importar as Cenas
import BootLoader from '../components1/components/Maps/BootLoader';
import Level1 from '../components1/components/Maps/Level1Scene';
import Level2 from '../components1/components/Maps/Level2Scene';
import GameOverScene from '../components1/components/Maps/GameOverScene';
import VictoryScene from '../components1/components/Maps/VictoryScene';
import PuzzleScene from '../components1/components/puzzle_test/PuzzleScene';

const Game = ({ onGameOver }) => {
    const gameContainerRef = useRef(null);
    const gameInstanceRef = useRef(null);
    const [score, setScore] = React.useState(0);
    const [timer, setTimer] = React.useState('0:00');

    useEffect(() => {
        // Update score and timer display every 100ms
        const interval = setInterval(() => {
            if (gameInstanceRef.current) {
                const registry = gameInstanceRef.current.registry;
                const currentScore = registry.get('score') || 0;
                const startTime = registry.get('startTime');
                
                setScore(currentScore);
                
                if (startTime) {
                    const elapsed = Date.now() - startTime;
                    const seconds = Math.floor(elapsed / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    setTimer(`${minutes}:${secs.toString().padStart(2, '0')}`);
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Configuração do Phaser
        const config = {
            type: Phaser.AUTO,
            width: 1000,
            height: 500,
            parent: gameContainerRef.current,
            dom: {
                createContainer: true
            },
            physics: {
                default: 'arcade',
                arcade: { 
                    gravity: { y: 300 },
                    debug: false 
                }
            },
            scene: [
                BootLoader,
                Level1, 
                Level2, 
                PuzzleScene,
                GameOverScene, 
                VictoryScene
            ]
        };

        // Criar instância do jogo
        const game = new Phaser.Game(config);
        gameInstanceRef.current = game;

        // Criar um evento global para comunicação entre Phaser e React
        window.gameEvents = new Phaser.Events.EventEmitter();
        
        // Escutar o evento de game over vindo do Phaser
        window.gameEvents.on('gameOver', (score) => {
            if (onGameOver) {
                onGameOver(score);
            }
        });

        // Cleanup quando o componente é desmontado
        return () => {
            if (window.gameEvents) {
                window.gameEvents.removeAllListeners();
                delete window.gameEvents;
            }
            if (gameInstanceRef.current) {
                gameInstanceRef.current.destroy(true);
            }
        };
    }, [onGameOver]);

    return (
        <div style={{ 
            position: 'relative',
            height: '100vh',
            background: 'linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%)',
            overflow: 'hidden'
        }}>
            {/* Aura background matching intro */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                filter: 'blur(120px)',
                opacity: 0.3,
                pointerEvents: 'none'
            }}>
                <div style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #4a90e2, transparent)',
                    top: '-10%',
                    left: '-10%',
                    animation: 'moveAura 20s infinite alternate'
                }} />
                <div style={{
                    position: 'absolute',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #3cff67, transparent)',
                    bottom: '-10%',
                    right: '-10%',
                    animation: 'moveAura 20s infinite alternate',
                    animationDelay: '-5s'
                }} />
            </div>

{/* External HUD - Score and Timer */}
            <div style={{
                position: 'absolute',
                top: '100px',  // <---- MUDA AQUI (estava 0)
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '20px 40px',
                zIndex: 10,
                pointerEvents: 'none'
            }}>
                {/* Score Display */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '15px 30px',
                    borderRadius: '15px',
                    border: '2px solid #4a90e2',
                    boxShadow: '0 4px 20px rgba(74, 144, 226, 0.3)'
                }}>
                    <div style={{
                        fontSize: '14px',
                        color: '#666',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600',
                        marginBottom: '5px'
                    }}>SCORE</div>
                    <div style={{
                        fontSize: '32px',
                        color: '#4a90e2',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 'bold'
                    }}>{score}</div>
                </div>

                {/* Timer Display */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '15px 30px',
                    borderRadius: '15px',
                    border: '2px solid #a3d8f4',
                    boxShadow: '0 4px 20px rgba(163, 216, 244, 0.3)'
                }}>
                    <div style={{
                        fontSize: '14px',
                        color: '#666',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600',
                        marginBottom: '5px'
                    }}>TIME</div>
                    <div style={{
                        fontSize: '32px',
                        color: '#4a90e2',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 'bold'
                    }}>{timer}</div>
                </div>
            </div>

            {/* Game container */}
            <div 
                ref={gameContainerRef} 
                id="phaser-game-container"
                style={{ 
                    position: 'relative',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    zIndex: 2
                }}
            />
            
            <style>{`
                @keyframes moveAura {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(20%, 20%) scale(1.2); }
                }
            `}</style>
        </div>
    );
};

export default Game;
