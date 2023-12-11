import './App.css';
import Map from './World/map';
import { useState } from 'react';
import DificultadSelector from './World/selector';
import ReactHowler from 'react-howler'

function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Facil' | 'Intermedio' | 'Dificil' | undefined >(undefined);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleSelectDifficulty = (difficulty: 'Facil' | 'Intermedio' | 'Dificil' | undefined ) => {
    setSelectedDifficulty(difficulty);
  };

  const stopAudio = () => {
    setIsPlaying(false);
  };

  return (
    <>
      {selectedDifficulty === undefined ? (
        <DificultadSelector onSelectDifficulty={handleSelectDifficulty} />
      ) : (
        <>
          <ReactHowler src='./assets/elementos_pagina/sonidos/bgm.mp3' playing={isPlaying} loop={true} volume={0.25} />
          <Map difficulty={selectedDifficulty} stopAudio={stopAudio}/>     
        </>
      )}
    </>
  )
}

export default App
