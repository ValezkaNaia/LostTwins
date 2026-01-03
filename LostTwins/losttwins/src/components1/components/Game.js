import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// Importar as Cenas
import BootLoader from './Maps/BootLoader';
import Level1 from './Maps/Level1Scene';
import Level2 from './Maps/Level2Scene';
import GameOverScene from './Maps/GameOverScene';
import VictoryScene from './Maps/VictoryScene';
import PuzzleScene from './puzzle_test/PuzzleScene';

const Game = () => {
    const gameContainerRef = useRef(null);

    useEffect(() => {
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
            // GESTÃO DE CENAS: A primeira do array é a que começa
            scene: [
                BootLoader,    // Carrega sons e imagens globais
                Level1, 
                Level2, 
                PuzzleScene,
                GameOverScene, 
                VictoryScene
            ]
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div ref={gameContainerRef} id="phaser-game-container" />;
};

export default Game;