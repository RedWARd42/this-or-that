import { useState, useEffect } from 'react';
import { gameData, gameModes } from './data.js';
import { playCorrectSound, playIncorrectSound } from './sounds.js';
import './Game.css';

const FEEDBACK_DURATION = 2500; // milliseconds

function Game({ gameMode, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', or null
  const [answered, setAnswered] = useState(false);
  const [progress, setProgress] = useState(100); // 0-100 for progress bar

  // When the mode changes, pick a random question
  useEffect(() => {
    const questions = gameData[gameMode];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setFeedback(null)
    setAnswered(false)
  }, [gameMode])

  // After showing feedback (correct/incorrect), handle based on result
  useEffect(() => {
    if (feedback) {
      setProgress(100);
      const startTime = Date.now();

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.max(0, 100 - (elapsed / FEEDBACK_DURATION) * 100);
        setProgress(newProgress);

        if (elapsed < FEEDBACK_DURATION) {
          requestAnimationFrame(updateProgress);
        } else {
          // When timer completes
          setFeedback(null);
          setAnswered(false);

          if (feedback === 'correct') {
            // Go back to home to choose another game
            onBack();
          } else {
            // Load next question
            const questions = gameData[gameMode];
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            setCurrentQuestion(randomQuestion);
          }
        }
      };

      requestAnimationFrame(updateProgress);
    }
  }, [feedback, gameMode, onBack]);

  const handleAnswer = (selectedAnswer) => {
    if (answered) return; // Prevent multiple answers

    if (selectedAnswer === currentQuestion.correctAnswer) {
      playCorrectSound();
      setFeedback('correct');
      setAnswered(true);
        } else {
          playIncorrectSound();
          setFeedback('incorrect');
          setAnswered(true);
    }
  };

  const getModeTitle = () => {
    const mode = gameModes.find(m => m.id === gameMode);
    return mode ? mode.label : 'Game';
  };

  if (!currentQuestion) {
    return (
      <div className="game-container">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2 className="game-title">{getModeTitle()}</h2>
        <div className="game-content">
          <p style={{marginBottom: 16}}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h2 className="game-title">{getModeTitle()}</h2>

      {feedback && (
        <div className={`feedback-message ${feedback}`}>
          {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="game-content">
        {renderGameContent(gameMode, currentQuestion)}
      </div>

      <div className="button-group">
        {renderButtons(gameMode, currentQuestion, handleAnswer)}
      </div>
    </div>
  );
}

// Helper function to render game-specific content
function renderGameContent(gameMode, question) {
  switch (gameMode) {
    case 'wouldYouRather':
      return <div className="question-text">{question.question}</div>;

    case 'whosMoreFamous':
      return (
        <div className="famous-container">
          <div className="famous-card">
            <img src={question.leftImage} alt={question.leftName} className="famous-image" />
            <p className="famous-name">{question.leftName}</p>
          </div>
          <div className="vs-text">VS</div>
          <div className="famous-card">
            <img src={question.rightImage} alt={question.rightName} className="famous-image" />
            <p className="famous-name">{question.rightName}</p>
          </div>
        </div>
      );

    case 'cakeOrNotCake':
      return (
        <div className="image-container">
          <img src={question.image} alt="Is this cake?" className="game-image" />
        </div>
      );

    case 'siblingsOrDating':
      return (
        <div className="image-container">
          <img src={question.image} alt="Are they siblings or dating?" className="game-image" />
        </div>
      );

    case 'factOrCap':
      return <div className="statement-text">{question.statement}</div>;

    case 'aiOrIRL':
      return (
        <div className="image-container">
          {isVideo(question.image) ? (
            <video src={question.image} alt="AI or In Real Life?" className="game-image" controls autoPlay />
          ) : (
            <img src={question.image} alt="AI or In Real Life?" className="game-image" />
          )}
        </div>
      );

    default:
      return null;
  }
}

// Helper function to render game-specific buttons
function renderButtons(gameMode, question, handleAnswer) {
  switch (gameMode) {
    case 'wouldYouRather':
      return (
        <>
          <button
            className="answer-button"
            onClick={() => handleAnswer(question.option1)}
          >
            {question.option1}
          </button>
          <button
            className="answer-button"
            onClick={() => handleAnswer(question.option2)}
          >
            {question.option2}
          </button>
        </>
      );

    case 'whosMoreFamous':
      return (
        <>
          <button
            className="answer-button"
            onClick={() => handleAnswer('More Famous')}
          >
            More Famous
          </button>
          <button
            className="answer-button"
            onClick={() => handleAnswer('Less Famous')}
          >
            Less Famous
          </button>
        </>
      );

    case 'cakeOrNotCake':
      return (
        <>
          <button
            className="answer-button"
            onClick={() => handleAnswer('Cake')}
          >
            Cake
          </button>
          <button
            className="answer-button"
            onClick={() => handleAnswer('Not Cake')}
          >
            Not Cake
          </button>
        </>
      );

    case 'siblingsOrDating':
      return (
        <>
          <button
            className="answer-button"
            onClick={() => handleAnswer('Siblings')}
          >
            Siblings
          </button>
          <button
            className="answer-button"
            onClick={() => handleAnswer('Dating')}
          >
            Dating
          </button>
        </>
      );

    case 'factOrCap':
      return (
        <>
          <button
            className="answer-button"
            onClick={() => handleAnswer('Fact')}
          >
            Fact
          </button>
          <button
            className="answer-button"
            onClick={() => handleAnswer('Cap')}
          >
            Cap
          </button>
        </>
      );

    case 'aiOrIRL':
      return (
        <>
          <button
            className="answer-button"
            onClick={() => handleAnswer('AI')}
          >
            AI
          </button>
          <button
            className="answer-button"
            onClick={() => handleAnswer('IRL')}
          >
            IRL
          </button>
        </>
      );

    default:
      return null;
  }
}

// Helper function to check if a file is a video
function isVideo(filePath) {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
  const lowerPath = filePath.toLowerCase();
  return videoExtensions.some(ext => lowerPath.endsWith(ext));
}

export default Game;
