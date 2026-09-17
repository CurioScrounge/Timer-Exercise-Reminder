import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import Timer from './Timer';
import EndTime from './EndTime';
import EndPage from './EndPage';
import alertAudio from './assets/alert3.mp3';
import Modal from './Modal';
import Select from 'react-select';
//fixed
function App() {
  const [endTime, setEndTime] = useState({ hours: 4, minutes: 0 });
  const [duration, setDuration] = useState(45);
  const [showSettings, setShowSettings] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSleepMessage, setShowSleepMessage] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showModal, setShowModal] = useState(false);

  const audioRef = useRef(new Audio(alertAudio));

useEffect(() => {
  const checkTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    setShowSleepMessage(currentHour >= 22);

    const end = new Date();
    end.setHours(endTime.hours, endTime.minutes, 0, 0);

    // Roll end time to tomorrow if it's earlier than current time
    if (end <= now) {
      end.setDate(end.getDate() + 1);
    }

    if (now >= end && currentPage === 'timer') {
      resetTimer();
    }
  };

  const interval = setInterval(checkTime, 1000);
  return () => clearInterval(interval);
}, [endTime, currentPage]);

  const handleStart = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(endTime.hours, endTime.minutes, 0, 0);

    if (end <= now) {
      setShowModal(true);
      return;
    }

    setShowSettings(false);
    setCurrentPage('timer');
  };

  const closeModal = () => setShowModal(false);

  const handleBack = () => {
    setShowSettings(true);
    setCurrentPage('home');
  };

  const handleStartAfresh = () => {
    setElapsedTime(0);
    setShowSettings(true);
    setCurrentPage('home');
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setEndTime({ hours: 4, minutes: 0 });
    setShowSettings(true);
    setCurrentPage('home');
  };

  const handleEndTimer = () => {
    setShowEndPopup(true);
    const audio = audioRef.current;
    audio.volume = 1;
    audio.loop = true;
    audio.play().catch(error => console.error('Audio play error:', error));
  };

  const handlePopupButton = () => {
    setShowEndPopup(false);
    setCurrentPage('endPage');
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  };

  // When exercise page is finished, restart timer cycle
  const handleBackToTimer = () => {
    setElapsedTime(0);
    setCurrentPage('timer');
  };

  return (
    <main>
      {showSleepMessage && (
        <div className="sleep-message">
          It's getting late! Please consider sleeping.
        </div>
      )}
      {showEndPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Time to get up and exercise!</p>
            <button className="timer_end_button" onClick={handlePopupButton}>
              Follow Exercises
            </button>
          </div>
        </div>
      )}
      {showModal && (
        <Modal
          message="Please choose an end time later than the current time."
          onClose={closeModal}
        />
      )}
      {currentPage === 'home' && showSettings ? (
        <div className="settings">
          <EndTime endTime={endTime} setEndTime={setEndTime} />
          <DurationSelector setDuration={setDuration} />
          <button className="buttons" onClick={handleStart}>
            Start Timer
          </button>
        </div>
      ) : currentPage === 'timer' ? (
        <div className="contain_Timer">
          <Timer
            endTime={endTime}
            duration={duration}
            elapsedTime={elapsedTime}
            setElapsedTime={setElapsedTime}
            handleBack={handleBack}
            handleStartAfresh={handleStartAfresh}
            resetTimer={resetTimer}
            handleEndTimer={handleEndTimer}
            autoStart={true}
          />
        </div>
      ) : (
        <EndPage handleBackToTimer={handleBackToTimer} />
      )}
    </main>
  );
}

function DurationSelector({ setDuration }) {
  const options = Array.from({ length: 60 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} minutes`
  }));

  const handleChange = (selectedOption) => {
    setDuration(selectedOption.value);
  };

  return (
    <div className="duration" style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="duration" style={{ marginRight: '10px' }}>
        Select Duration:
      </label>
      <Select
        id="duration"
        options={options}
        defaultValue={options[44]}
        onChange={handleChange}
        isSearchable={false}
        styles={{
          control: (provided, state) => ({
            ...provided,
            width: '210px',
            fontFamily: 'Raleway, system-ui',
            backgroundColor: '#1abc9c',
            color: '#fff',
            padding: '3px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '1.8rem',
            boxShadow: state.isFocused
              ? '0 0 5px rgba(26, 188, 156, 0.5)'
              : provided.boxShadow,
            '&:hover': {
              boxShadow: '0 0 7px rgba(26, 188, 156, 0.5)'
            }
          }),
          singleValue: (provided) => ({
            ...provided,
            color: '#fff'
          }),
          menu: (provided) => ({
            ...provided,
            width: '200px'
          }),
          option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? '#fff' : 'grey',
            backgroundColor: state.isSelected
              ? '#1abc9c'
              : state.isFocused
              ? '#d5f5e3'
              : 'white',
            fontSize: '1.8rem'
          })
        }}
        components={{
          IndicatorSeparator: () => null
        }}
      />
    </div>
  );
}

export default App;
