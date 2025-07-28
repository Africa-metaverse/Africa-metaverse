import React, { useState } from 'react';

const Game: React.FC = () => {
  const [score, setScore] = useState(0);

  return (
    <div>
      <h1>Mini Clicker Game</h1>
      <p>Score: {score}</p>
      <button onClick={() => setScore(score + 1)}>Click me!</button>
    </div>
  );
};

export default Game;