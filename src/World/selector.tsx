// DificultadSelector.tsx
import React from 'react';

type Difficulty = 'Facil' | 'Intermedio' | 'Dificil' | undefined;

interface DificultadSelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DificultadSelector: React.FC<DificultadSelectorProps> = ({ onSelectDifficulty }) => {
  const handleDifficultyChange = (newDifficulty:Difficulty) => {
    onSelectDifficulty(newDifficulty);
  };

  return (
    <div id='inicio'>
      <div id='titulo'>
        <h1 id='titleshadow'>Yoshi's Battle</h1>
        <h1 id='title'>Yoshi's Battle</h1>
      </div>      
      <div id='options'>
        <button onClick={() => handleDifficultyChange('Facil')}>facil</button>
        <button onClick={() => handleDifficultyChange('Intermedio')}>intermedio</button>
        <button onClick={() => handleDifficultyChange('Dificil')}>dificil</button>
      </div>
      {/* <h2>Selecciona una dificultad:</h2>
      <select value={selectedDifficulty} onChange={handleDifficultyChange}>
        <option value={undefined}>Selecciona una dificultad</option>
        <option value="Facil">Facil</option>
        <option value="Intermedio">Intermedio</option>
        <option value="Dificil">Dificil</option>
      </select> */}
    </div>
  );
};

export default DificultadSelector;