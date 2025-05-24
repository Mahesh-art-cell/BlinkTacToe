import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Trophy, HelpCircle, Volume2, VolumeX, Sparkles } from 'lucide-react';

const BlinkTacToe = () => {
  // Emoji categories
  const EMOJI_CATEGORIES = {
    animals: { name: 'Animals', emojis: ['🐶', '🐱', '🐵', '🐰', '🦊', '🐻', '🐼', '🐨'] },
    food: { name: 'Food', emojis: ['🍕', '🍟', '🍔', '🍩', '🍎', '🍌', '🍓', '🍊'] },
    sports: { name: 'Sports', emojis: ['⚽️', '🏀', '🏈', '🎾', '🏐', '🏓', '🎱', '⚾️'] },
    nature: { name: 'Nature', emojis: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌵', '🌲'] },
    space: { name: 'Space', emojis: ['🌟', '⭐️', '🌙', '☀️', '🪐', '🌍', '🚀', '👽'] }
  };

  // Game state
  const [gameState, setGameState] = useState('category-selection');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Category, setPlayer1Category] = useState(null);
  const [player2Category, setPlayer2Category] = useState(null);
  const [player1History, setPlayer1History] = useState([]);
  const [player2History, setPlayer2History] = useState([]);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [showHelp, setShowHelp] = useState(false);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animations, setAnimations] = useState({});

  // CSS Styles
  const styles = {
    // Main container
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 25%, #dbeafe 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },

    // Category Selection Styles
    categoryContainer: {
      maxWidth: '1024px',
      margin: '0 auto',
      padding: '24px'
    },
    
    categoryHeader: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    
    mainTitle: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #9333ea, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    },
    
    subtitle: {
      color: '#6b7280'
    },

    categoryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '32px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },

    playerCard: {
      borderRadius: '12px',
      padding: '24px',
      border: '2px solid'
    },

    player1Card: {
      backgroundColor: '#eff6ff',
      borderColor: '#bfdbfe'
    },

    player2Card: {
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca'
    },

    playerTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '16px'
    },

    player1Title: {
      color: '#1e40af'
    },

    player2Title: {
      color: '#dc2626'
    },

    categoryButton: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '2px solid',
      backgroundColor: 'white',
      marginBottom: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },

    categoryButtonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },

    categoryButtonSelected: {
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },

    player1Selected: {
      borderColor: '#3b82f6',
      backgroundColor: '#dbeafe'
    },

    player2Selected: {
      borderColor: '#ef4444',
      backgroundColor: '#fee2e2'
    },

    categoryButtonDisabled: {
      borderColor: '#e5e7eb',
      backgroundColor: '#f3f4f6',
      opacity: 0.5,
      cursor: 'not-allowed'
    },

    categoryName: {
      fontWeight: '600'
    },

    emojiPreview: {
      display: 'flex',
      gap: '4px'
    },

    emoji: {
      fontSize: '1.125rem'
    },

    startButton: {
      background: 'linear-gradient(to right, #9333ea, #ec4899)',
      color: 'white',
      padding: '12px 32px',
      borderRadius: '8px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      margin: '32px auto 0',
      transition: 'all 0.2s ease'
    },

    startButtonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
    },

    // Game Board Styles
    gameContainer: {
      maxWidth: '1024px',
      margin: '0 auto',
      padding: '24px'
    },

    gameHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px'
    },

    gameTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #9333ea, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },

    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },

    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },

    iconButton: {
      padding: '8px',
      color: '#6b7280',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'color 0.2s ease'
    },

    iconButtonHover: {
      color: '#9333ea'
    },

    scoreBoard: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      padding: '8px 16px'
    },

    scoreItem: {
      textAlign: 'center'
    },

    scoreLabel: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },

    scoreValue1: {
      fontWeight: 'bold',
      color: '#2563eb'
    },

    scoreValue2: {
      fontWeight: 'bold',
      color: '#dc2626'
    },

    // Current Player Indicator
    playerIndicator: {
      textAlign: 'center',
      marginBottom: '24px'
    },

    playerIndicatorBox: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: 'bold'
    },

    player1Indicator: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },

    player2Indicator: {
      backgroundColor: '#fee2e2',
      color: '#dc2626'
    },

    // Game Board Grid
    boardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      maxWidth: '384px',
      margin: '0 auto 24px'
    },

    boardCell: {
      aspectRatio: '1',
      backgroundColor: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2.25rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },

    boardCellHover: {
      borderColor: '#a855f7',
      transform: 'scale(1.05)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
    },

    boardCellFilled: {
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },

    winningCell: {
      backgroundColor: '#fef3c7',
      borderColor: '#f59e0b',
      animation: 'pulse 1s infinite'
    },

    // Player History
    historyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '24px'
    },

    historyCard: {
      borderRadius: '8px',
      padding: '16px'
    },

    player1History: {
      backgroundColor: '#eff6ff'
    },

    player2History: {
      backgroundColor: '#fef2f2'
    },

    historyTitle: {
      fontWeight: 'bold',
      marginBottom: '8px'
    },

    player1HistoryTitle: {
      color: '#1e40af'
    },

    player2HistoryTitle: {
      color: '#dc2626'
    },

    historyEmojis: {
      display: 'flex',
      gap: '8px'
    },

    historyEmoji: {
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem'
    },

    player1HistoryEmoji: {
      backgroundColor: '#bfdbfe'
    },

    player2HistoryEmoji: {
      backgroundColor: '#fecaca'
    },

    // Modal Styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 1000
    },

    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '512px',
      width: '100%'
    },

    helpModal: {
      maxHeight: '80vh',
      overflowY: 'auto'
    },

    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '16px'
    },

    helpContent: {
      fontSize: '0.875rem',
      lineHeight: '1.5'
    },

    helpRule: {
      marginBottom: '12px'
    },

    modalButton: {
      backgroundColor: '#9333ea',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      marginTop: '16px',
      transition: 'background-color 0.2s ease'
    },

    modalButtonHover: {
      backgroundColor: '#7c3aed'
    },

    // Victory Modal
    victoryModal: {
      textAlign: 'center',
      maxWidth: '384px'
    },

    victoryIcon: {
      width: '64px',
      height: '64px',
      color: '#eab308',
      margin: '0 auto 16px'
    },

    victoryTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      marginBottom: '8px'
    },

    victorySubtitle: {
      color: '#6b7280',
      marginBottom: '24px'
    },

    victoryButtons: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    },

    victoryButton: {
      padding: '8px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s ease'
    },

    playAgainButton: {
      backgroundColor: '#9333ea',
      color: 'white'
    },

    playAgainButtonHover: {
      backgroundColor: '#7c3aed'
    },

    newCategoriesButton: {
      backgroundColor: '#6b7280',
      color: 'white'
    },

    newCategoriesButtonHover: {
      backgroundColor: '#4b5563'
    },

    // Animations
    '@keyframes bounce': {
      '0%, 20%, 53%, 80%, 100%': {
        transform: 'translate3d(0,0,0)'
      },
      '40%, 43%': {
        transform: 'translate3d(0, -30px, 0)'
      },
      '70%': {
        transform: 'translate3d(0, -15px, 0)'
      },
      '90%': {
        transform: 'translate3d(0, -4px, 0)'
      }
    },

    '@keyframes ping': {
      '75%, 100%': {
        transform: 'scale(2)',
        opacity: 0
      }
    },

    '@keyframes pulse': {
      '0%, 100%': {
        opacity: 1
      },
      '50%': {
        opacity: 0.5
      }
    },

    bounceAnimation: {
      animation: 'bounce 0.5s'
    },

    pingAnimation: {
      animation: 'ping 0.5s'
    },

    disappearAnimation: {
      opacity: 0,
      transition: 'opacity 0.5s ease'
    }
  };

  // Get random emoji from category
  const getRandomEmoji = (category) => {
    const emojis = EMOJI_CATEGORIES[category].emojis;
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  // Check for winning combination
  const checkWinner = useCallback((board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[b] && board[c]) {
        const playerA = board[a].player;
        const playerB = board[b].player;
        const playerC = board[c].player;
        
        if (playerA === playerB && playerB === playerC) {
          return { winner: playerA, line };
        }
      }
    }
    return null;
  }, []);

  // Handle cell click
  const handleCellClick = (index) => {
    if (gameState !== 'playing' || board[index] !== null) return;

    const newBoard = [...board];
    const currentCategory = currentPlayer === 1 ? player1Category : player2Category;
    const currentHistory = currentPlayer === 1 ? player1History : player2History;
    const emoji = getRandomEmoji(currentCategory);
    
    // Add new emoji
    newBoard[index] = { emoji, player: currentPlayer, id: Date.now() };
    
    // Update history
    const newHistory = [...currentHistory, { position: index, id: Date.now() }];
    
    // Handle vanishing rule (max 3 emojis per player)
    if (newHistory.length > 3) {
      const oldestMove = newHistory[0];
      // Check if trying to place on the same position as the oldest emoji
      if (oldestMove.position === index) {
        return; // Invalid move
      }
      
      // Remove oldest emoji from board
      newBoard[oldestMove.position] = null;
      newHistory.shift(); // Remove from history
      
      // Add disappear animation
      setAnimations(prev => ({
        ...prev,
        [oldestMove.position]: 'disappear'
      }));
      
      setTimeout(() => {
        setAnimations(prev => ({
          ...prev,
          [oldestMove.position]: null
        }));
      }, 500);
    }

    // Add appear animation
    setAnimations(prev => ({
      ...prev,
      [index]: 'appear'
    }));

    setTimeout(() => {
      setAnimations(prev => ({
        ...prev,
        [index]: null
      }));
    }, 500);

    // Update state
    setBoard(newBoard);
    if (currentPlayer === 1) {
      setPlayer1History(newHistory);
    } else {
      setPlayer2History(newHistory);
    }

    // Check for winner
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setGameState('game-over');
      setScores(prev => ({
        ...prev,
        [`player${result.winner}`]: prev[`player${result.winner}`] + 1
      }));
      
      if (soundEnabled) {
        console.log('🎉 Victory sound!');
      }
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  // Start new game
  const startNewGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setPlayer1History([]);
    setPlayer2History([]);
    setWinner(null);
    setWinningLine([]);
    setGameState('playing');
    setAnimations({});
  };

  // Reset everything
  const resetGame = () => {
    setGameState('category-selection');
    setPlayer1Category(null);
    setPlayer2Category(null);
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setPlayer1History([]);
    setPlayer2History([]);
    setWinner(null);
    setWinningLine([]);
    setScores({ player1: 0, player2: 0 });
    setAnimations({});
  };

  // Category selection component
  const CategorySelection = () => (
    <div style={styles.categoryContainer}>
      <div style={styles.categoryHeader}>
        <h1 style={styles.mainTitle}>
          Blink Tac Toe
        </h1>
        <p style={styles.subtitle}>Choose your emoji categories!</p>
      </div>

      <div style={styles.categoryGrid}>
        {/* Player 1 Selection */}
        <div style={{...styles.playerCard, ...styles.player1Card}}>
          <h3 style={{...styles.playerTitle, ...styles.player1Title}}>Player 1 - Choose Category</h3>
          <div>
            {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setPlayer1Category(key)}
                style={{
                  ...styles.categoryButton,
                  ...(player1Category === key ? {...styles.categoryButtonSelected, ...styles.player1Selected} : {})
                }}
                onMouseEnter={(e) => {
                  if (player1Category !== key) {
                    Object.assign(e.target.style, styles.categoryButtonHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (player1Category !== key) {
                    Object.assign(e.target.style, styles.categoryButton);
                  }
                }}
              >
                <span style={styles.categoryName}>{category.name}</span>
                <div style={styles.emojiPreview}>
                  {category.emojis.slice(0, 4).map((emoji, i) => (
                    <span key={i} style={styles.emoji}>{emoji}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Player 2 Selection */}
        <div style={{...styles.playerCard, ...styles.player2Card}}>
          <h3 style={{...styles.playerTitle, ...styles.player2Title}}>Player 2 - Choose Category</h3>
          <div>
            {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => player1Category !== key && setPlayer2Category(key)}
                disabled={player1Category === key}
                style={{
                  ...styles.categoryButton,
                  ...(player1Category === key ? styles.categoryButtonDisabled : {}),
                  ...(player2Category === key ? {...styles.categoryButtonSelected, ...styles.player2Selected} : {})
                }}
                onMouseEnter={(e) => {
                  if (player1Category !== key && player2Category !== key) {
                    Object.assign(e.target.style, styles.categoryButtonHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (player1Category !== key && player2Category !== key) {
                    Object.assign(e.target.style, styles.categoryButton);
                  }
                }}
              >
                <span style={styles.categoryName}>{category.name}</span>
                <div style={styles.emojiPreview}>
                  {category.emojis.slice(0, 4).map((emoji, i) => (
                    <span key={i} style={styles.emoji}>{emoji}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {player1Category && player2Category && (
        <button
          onClick={startNewGame}
          style={styles.startButton}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.startButtonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.startButton)}
        >
          <Play size={20} />
          Start Game
        </button>
      )}
    </div>
  );

  // Help modal component
  const HelpModal = () => (
    <div style={styles.modalOverlay}>
      <div style={{...styles.modal, ...styles.helpModal}}>
        <h3 style={styles.modalTitle}>How to Play Blink Tac Toe</h3>
        <div style={styles.helpContent}>
          <p style={styles.helpRule}><strong>Goal:</strong> Get 3 emojis in a row (horizontal, vertical, or diagonal)</p>
          <p style={styles.helpRule}><strong>Twist:</strong> Each player can only have 3 emojis on the board at once!</p>
          <p style={styles.helpRule}><strong>Vanishing Rule:</strong> When you place a 4th emoji, your oldest emoji disappears</p>
          <p style={styles.helpRule}><strong>Important:</strong> You cannot place your 4th emoji where your 1st emoji was</p>
          <p style={styles.helpRule}><strong>Random Emojis:</strong> Each turn gives you a random emoji from your category</p>
          <p style={styles.helpRule}><strong>Win Condition:</strong> First to get 3 emojis in a line wins!</p>
        </div>
        <button
          onClick={() => setShowHelp(false)}
          style={styles.modalButton}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.modalButtonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.modalButton)}
        >
          Got it!
        </button>
      </div>
    </div>
  );

  // Game board component
  const GameBoard = () => (
    <div style={styles.gameContainer}>
      {/* Header */}
      <div style={styles.gameHeader}>
        <div style={styles.headerLeft}>
          <h1 style={styles.gameTitle}>
            Blink Tac Toe
          </h1>
          <button
            onClick={() => setShowHelp(true)}
            style={styles.iconButton}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.iconButtonHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.iconButton)}
          >
            <HelpCircle size={24} />
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={styles.iconButton}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.iconButtonHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.iconButton)}
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.scoreBoard}>
            <div style={styles.scoreItem}>
              <div style={styles.scoreLabel}>Player 1</div>
              <div style={styles.scoreValue1}>{scores.player1}</div>
            </div>
            <div style={styles.scoreItem}>
              <div style={styles.scoreLabel}>Player 2</div>
              <div style={styles.scoreValue2}>{scores.player2}</div>
            </div>
          </div>
          <button
            onClick={resetGame}
            style={styles.iconButton}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.iconButtonHover)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.iconButton)}
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      {/* Current Player Indicator */}
      <div style={styles.playerIndicator}>
        <div style={{
          ...styles.playerIndicatorBox,
          ...(currentPlayer === 1 ? styles.player1Indicator : styles.player2Indicator)
        }}>
          <Sparkles size={20} />
          <span>
            Player {currentPlayer}'s Turn - {EMOJI_CATEGORIES[currentPlayer === 1 ? player1Category : player2Category].name}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div style={styles.boardGrid}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            style={{
              ...styles.boardCell,
              ...(winningLine.includes(index) ? styles.winningCell : {}),
              ...(animations[index] === 'appear' ? styles.bounceAnimation : {}),
              ...(animations[index] === 'disappear' ? styles.pingAnimation : {}),
              ...(cell ? styles.boardCellFilled : {})
            }}
            onMouseEnter={(e) => {
              if (!cell && gameState === 'playing') {
                Object.assign(e.target.style, styles.boardCellHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!cell && gameState === 'playing') {
                Object.assign(e.target.style, styles.boardCell);
              }
            }}
          >
            {cell && (
              <span style={{
                ...(animations[index] === 'disappear' ? styles.disappearAnimation : {})
              }}>
                {cell.emoji}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Player Histories */}
      <div style={styles.historyGrid}>
        <div style={{...styles.historyCard, ...styles.player1History}}>
          <h4 style={{...styles.historyTitle, ...styles.player1HistoryTitle}}>
            Player 1 Active Emojis ({player1History.length}/3)
          </h4>
          <div style={styles.historyEmojis}>
            {player1History.map((move, i) => (
              <div key={move.id} style={{...styles.historyEmoji, ...styles.player1HistoryEmoji}}>
                {board[move.position] && <span>{board[move.position].emoji}</span>}
              </div>
            ))}
          </div>
        </div>
        <div style={{...styles.historyCard, ...styles.player2History}}>
          <h4 style={{...styles.historyTitle, ...styles.player2HistoryTitle}}>
            Player 2 Active Emojis ({player2History.length}/3)
          </h4>
          <div style={styles.historyEmojis}>
            {player2History.map((move, i) => (
              <div key={move.id} style={{...styles.historyEmoji, ...styles.player2HistoryEmoji}}>
                {board[move.position] && <span>{board[move.position].emoji}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {gameState === 'game-over' && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modal, ...styles.victoryModal}}>
            <Trophy style={styles.victoryIcon} />
            <h3 style={styles.victoryTitle}>
              Player {winner} Wins! 🎉
            </h3>
            <p style={styles.victorySubtitle}>
              {EMOJI_CATEGORIES[winner === 1 ? player1Category : player2Category].name} category triumphs!
            </p>
            <div style={styles.victoryButtons}>
              <button
                onClick={startNewGame}
                style={{...styles.victoryButton, ...styles.playAgainButton}}
                onMouseEnter={(e) => Object.assign(e.target.style, {...styles.victoryButton, ...styles.playAgainButton, ...styles.playAgainButtonHover})}
                onMouseLeave={(e) => Object.assign(e.target.style, {...styles.victoryButton, ...styles.playAgainButton})}
              >
                Play Again
              </button>
              <button
                onClick={resetGame}
                style={{...styles.victoryButton, ...styles.newCategoriesButton}}
                onMouseEnter={(e) => Object.assign(e.target.style, {...styles.victoryButton, ...styles.newCategoriesButton, ...styles.newCategoriesButtonHover})}
                onMouseLeave={(e) => Object.assign(e.target.style, {...styles.victoryButton, ...styles.newCategoriesButton})}
              >
                New Categories
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      {gameState === 'category-selection' && <CategorySelection />}
      {(gameState === 'playing' || gameState === 'game-over') && <GameBoard />}
      {showHelp && <HelpModal />}
    </div>
  );
};

export default BlinkTacToe;