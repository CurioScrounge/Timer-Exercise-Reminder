import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './App.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PlayTimer from './PlayTimer';
import PauseTimer from './PauseTimer';

function Timer({
  endTime,
  duration,
  elapsedTime,
  setElapsedTime,
  handleBack,
  resetTimer,
  handleEndTimer,
  autoStart
}) {
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const calculateEndTime = useCallback(() => {
    const now = new Date();
    const end = new Date();
    end.setHours(endTime.hours, endTime.minutes, 0, 0);

    if (end <= now) {
      end.setDate(end.getDate() + 1);
    }

    return end > now;
  }, [endTime]);

  const startTimer = useCallback(() => {
    if (!calculateEndTime()) return;
    setIsRunning(true);
    const totalDuration = duration * 60 * 1000;
    const startTime = new Date().getTime() - elapsedTime;

    timerRef.current = setInterval(() => {
      const now = new Date().getTime();
      const timePassed = now - startTime;
      const timeRemaining = totalDuration - timePassed;
      if (timeRemaining <= 0) {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setElapsedTime(0);
        handleEndTimer();
      } else {
        setElapsedTime(timePassed);
      }
    }, 1000);
  }, [calculateEndTime, duration, elapsedTime, handleEndTimer, setElapsedTime]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
  }, [autoStart, startTimer]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const timeRemaining = duration * 60 * 1000 - elapsedTime;
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <div className="timer">
      <button className="back-button" onClick={handleBack}>Back</button>
      <div className="end-time-display">
        End Time: {endTime.hours.toString().padStart(2, '0')}:
        {endTime.minutes.toString().padStart(2, '0')}
      </div>
      <CircularProgressbar
        value={timeRemaining}
        maxValue={duration * 60 * 1000}
        text={`${minutes}:${seconds.toString().padStart(2, '0')}`}
        strokeWidth={5}
        styles={buildStyles({
          pathColor: '#A28B55',
          trailColor: '#CBE2B5',
          textColor: '#E7FBE6',
        })}
      />
      {!isRunning ? (
        <PlayTimer onClick={startTimer} />
      ) : (
        <PauseTimer onClick={pauseTimer} />
      )}
      <button className="reset" onClick={resetTimer}>Reset Timer Settings</button>
    </div>
  );
}

export default Timer;
