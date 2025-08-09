import React, { useState } from 'react';

interface GameProps {
  onPlayGame: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

export function Game2048({ onPlayGame, isLoading, isAdmin }: GameProps) {
  const startGame = () => {
    if (!isLoading) {
      onPlayGame();
    }
  };

  return (
    <div className="glass-card" style={{
      padding: 20,
      textAlign: 'center',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.6 : 1,
      transition: 'all 0.3s ease',
    }} onClick={startGame}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎮</div>
      <h3 style={{ color: '#ffb347', marginBottom: 8, fontSize: 18, fontWeight: 700 }}>
        2048 Challenge
      </h3>
      <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
        {isLoading ? 'Loading...' : 'Slide tiles to reach 2048!'}
      </p>
      {isAdmin && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: '#43e97b',
          color: '#fff',
          padding: '2px 6px',
          borderRadius: 4,
          fontSize: 10,
          fontWeight: 600,
        }}>
          ADMIN
        </div>
      )}
    </div>
  );
}

export function TicTacToe({ onPlayGame, isLoading, isAdmin }: GameProps) {
  const [squares, setSquares] = useState<(string|null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    if (!isLoading && !gameStarted) {
      setGameStarted(true);
      onPlayGame();
    }
  };

  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function reset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameStarted(false);
  }

  function calculateWinner(squares: (string|null)[]) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  const winner = calculateWinner(squares);
  const status = winner ? `Winner: ${winner}` : squares.every(square => square) ? 'Draw!' : `Next player: ${xIsNext ? 'X' : 'O'}`;

  if (!gameStarted) {
    return (
      <div className="glass-card" style={{
        padding: 20,
        textAlign: 'center',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
        transition: 'all 0.3s ease',
      }} onClick={startGame}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⭕</div>
        <h3 style={{ color: '#ffb347', marginBottom: 8, fontSize: 18, fontWeight: 700 }}>
          Tic Tac Toe
        </h3>
        <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
          {isLoading ? 'Loading...' : 'Classic X and O game!'}
        </p>
        {isAdmin && (
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#43e97b',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
          }}>
            ADMIN
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h3 style={{ color: '#ffb347', marginBottom: 8, fontSize: 18, fontWeight: 700 }}>
          Tic Tac Toe
        </h3>
        <div style={{ color: '#666', fontSize: 14, marginBottom: 12 }}>
          {status}
        </div>
        <button
          onClick={reset}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: 'none',
            background: '#ffb347',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          New Game
        </button>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 4,
        maxWidth: 200,
        margin: '0 auto',
      }}>
        {squares.map((square, i) => (
          <button
            key={i}
            style={{
              width: 60,
              height: 60,
              border: '2px solid #ffb347',
              background: 'rgba(255, 179, 71, 0.1)',
              color: '#ffb347',
              fontSize: 24,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => handleClick(i)}
          >
            {square}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RockPaperScissors({ onPlayGame, isLoading, isAdmin }: GameProps) {
  const [playerChoice, setPlayerChoice] = useState<string>('');
  const [computerChoice, setComputerChoice] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    if (!isLoading && !gameStarted) {
      setGameStarted(true);
      onPlayGame();
    }
  };

  function play(choice: string) {
    const choices = ['rock', 'paper', 'scissors'];
    const computer = choices[Math.floor(Math.random() * 3)];
    
    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(getResult(choice, computer));
  }

  function reset() {
    setPlayerChoice('');
    setComputerChoice('');
    setResult('');
    setGameStarted(false);
  }

  function getResult(player: string, computer: string) {
    if (player === computer) return 'Draw!';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'You win!';
    }
    return 'Computer wins!';
  }

  const getEmoji = (choice: string) => {
    switch (choice) {
      case 'rock': return '🪨';
      case 'paper': return '📄';
      case 'scissors': return '✂️';
      default: return '';
    }
  };

  if (!gameStarted) {
    return (
      <div className="glass-card" style={{
        padding: 20,
        textAlign: 'center',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
        transition: 'all 0.3s ease',
      }} onClick={startGame}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✂️</div>
        <h3 style={{ color: '#ffb347', marginBottom: 8, fontSize: 18, fontWeight: 700 }}>
          Rock Paper Scissors
        </h3>
        <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
          {isLoading ? 'Loading...' : 'Beat the computer!'}
        </p>
        {isAdmin && (
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#43e97b',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
          }}>
            ADMIN
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
      <h3 style={{ color: '#ffb347', marginBottom: 16, fontSize: 18, fontWeight: 700 }}>
        Rock Paper Scissors
      </h3>
      
      {result && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>
            {getEmoji(playerChoice)} vs {getEmoji(computerChoice)}
          </div>
          <div style={{ 
            color: result.includes('win') ? '#43e97b' : result.includes('Draw') ? '#ffb347' : '#ff6b6b',
            fontWeight: 600,
            fontSize: 16,
          }}>
            {result}
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
        {['rock', 'paper', 'scissors'].map((choice) => (
          <button
            key={choice}
            onClick={() => play(choice)}
            style={{
              width: 60,
              height: 60,
              border: '2px solid #ffb347',
              background: 'rgba(255, 179, 71, 0.1)',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            {getEmoji(choice)}
          </button>
        ))}
      </div>
      
      <button
        onClick={reset}
        style={{
          padding: '6px 12px',
          borderRadius: 6,
          border: 'none',
          background: '#ffb347',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        New Game
      </button>
    </div>
  );
} 