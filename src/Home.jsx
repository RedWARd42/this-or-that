import { gameModes } from './data.js';
import './Home.css';

function Home({ onSelectMode }) {
  return (
    <div className="home-container">
      <h1 className="home-title">This or That</h1>
      <p className="home-subtitle">Choose a game mode to get started!</p>
      
      <div className="game-modes-grid">
        {gameModes.map((mode) => (
          <button
            key={mode.id}
            className="game-mode-card"
            onClick={() => onSelectMode(mode.id)}
          >
            <span className="mode-emoji">{mode.emoji}</span>
            <span className="mode-label">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
