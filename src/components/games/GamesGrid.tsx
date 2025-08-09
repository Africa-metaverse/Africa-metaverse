import React from 'react';
import { Game2048, TicTacToe, RockPaperScissors } from './GameComponents';

interface GamesGridProps {
  onPlayGame: (gameName: string) => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
}

export function GamesGrid({ onPlayGame, isLoading, isAdmin }: GamesGridProps) {
  const games = [
    {
      id: '2048',
      component: Game2048,
      name: '2048 Challenge',
      description: 'Slide tiles to reach 2048!',
      icon: '🎮',
    },
    {
      id: 'tictactoe',
      component: TicTacToe,
      name: 'Tic Tac Toe',
      description: 'Classic X and O game!',
      icon: '⭕',
    },
    {
      id: 'rps',
      component: RockPaperScissors,
      name: 'Rock Paper Scissors',
      description: 'Beat the computer!',
      icon: '✂️',
    },
  ];

  const handlePlayGame = async (gameName: string) => {
    if (!isLoading) {
      await onPlayGame(gameName);
    }
  };

  return (
    <div className="glass-card" style={{
      padding: 24,
      marginBottom: 24,
    }}>
      <h2 style={{ color: '#ffb347', marginBottom: 20, fontSize: 20, fontWeight: 700 }}>
        🎮 Available Games
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 20,
      }}>
        {games.map((game) => {
          const GameComponent = game.component;
          return (
            <div key={game.id} style={{ position: 'relative' }}>
              <GameComponent
                onPlayGame={() => handlePlayGame(game.id)}
                isLoading={isLoading}
                isAdmin={isAdmin}
              />
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 20,
        padding: 16,
        background: 'rgba(255, 179, 71, 0.1)',
        borderRadius: 8,
        border: '1px solid rgba(255, 179, 71, 0.2)',
      }}>
        <div style={{ color: '#ffb347', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          💡 How to Play
        </div>
        <div style={{ color: '#666', fontSize: 12, lineHeight: 1.5 }}>
          • Play any game to earn PENGU tokens<br/>
          • Higher scores = more tokens<br/>
          • Claim daily rewards for bonus tokens<br/>
          • Connect your wallet to track progress
        </div>
      </div>
    </div>
  );
} 