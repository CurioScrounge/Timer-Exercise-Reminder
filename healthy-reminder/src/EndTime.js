import React from 'react';
import './App.css';

function EndTime({ endTime, setEndTime }) {
  const { hours, minutes } = endTime;

  const handleHourChange = (e) => {
    setEndTime({ ...endTime, hours: parseInt(e.target.value) });
  };

  const handleMinuteChange = (e) => {
    setEndTime({ ...endTime, minutes: parseInt(e.target.value) });
  };

  return (
    <div>
      <h1>Run timer until</h1>
      <div className="time-picker">
        <div className="time-picker__sliders">
          <div className="time-picker__slider">
            <input
              type="range"
              min="4"
              max="23"
              value={hours}
              onChange={handleHourChange}
              className="slider"
            />
          </div>
          <label>Hours</label>
        </div>
        <div className="time-picker__output">
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}
        </div>
        <div className="time-picker__sliders">
          <div className="time-picker__slider">
            <input
              type="range"
              min="0"
              max="59"
              value={minutes}
              onChange={handleMinuteChange}
              className="slider"
            />
          </div>
          <label>Minutes</label>
        </div>
      </div>
    </div>
  );
}

export default EndTime;