import { playChime, playBell } from './audio.js';
import { REST_TIMER_SECONDS, VIBRATION_PATTERN } from './constants.js';

let timers = {};
let holdTimers = {};

/**
 * Formats seconds as MM:SS
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Starts a hold timer for an exercise (e.g., for planks)
 * @param {number} index - Exercise index
 * @param {number} holdTime - Hold time in seconds
 * @param {Function} onComplete - Callback when timer completes
 */
function startHoldTimer(index, holdTime, onComplete) {
  if (holdTimers[index]) return;

  console.log('startHoldTimer called', { index, holdTime, displayElementId: `hold-display-${index}` });

  let seconds = holdTime;
  holdTimers[index] = true;
  playChime();

  setTimeout(() => {
    const displayElement = document.getElementById(`hold-display-${index}`);
    if (!displayElement) {
      delete holdTimers[index];
      return;
    }

    const updateDisplay = () => {
      displayElement.textContent = formatTime(seconds);
    };

    updateDisplay();

    holdTimers[index] = setInterval(() => {
      seconds--;
      updateDisplay();

      if (seconds <= 0) {
        clearInterval(holdTimers[index]);
        delete holdTimers[index];

        if (onComplete) onComplete();

        playBell();
        if (navigator.vibrate) {
          navigator.vibrate(VIBRATION_PATTERN);
        }
      }
    }, 1000);
  }, 10);
}

/**
 * Starts a rest timer between sets
 * @param {number} index - Exercise index
 * @param {Function} onComplete - Callback when timer completes
 */
function startRestTimer(index, onComplete) {
  if (timers[index]) {
    clearInterval(timers[index]);
  }

  let seconds = REST_TIMER_SECONDS;
  const timerElement = document.getElementById(`timer-${index}`);
  const displayElement = document.getElementById(`timer-display-${index}`);

  if (!timerElement || !displayElement) return;

  timerElement.classList.add('active');

  timers[index] = setInterval(() => {
    displayElement.textContent = formatTime(seconds);

    if (seconds <= 0) {
      clearInterval(timers[index]);
      delete timers[index];
      timerElement.classList.remove('active');

      playBell();

      if (navigator.vibrate) {
        navigator.vibrate(VIBRATION_PATTERN);
      }

      if (onComplete) onComplete();
    } else {
      seconds--;
    }
  }, 1000);
}

/**
 * Clears any active timers for an exercise
 * @param {number} index - Exercise index
 */
function clearTimer(index) {
  if (timers[index]) {
    clearInterval(timers[index]);
    delete timers[index];
  }
  if (holdTimers[index]) {
    clearInterval(holdTimers[index]);
    delete holdTimers[index];
  }
}

/**
 * Checks if any timers are currently active
 * @returns {boolean} True if any hold or rest timer is running
 */
function hasActiveTimers() {
  return Object.keys(timers).length > 0 || Object.keys(holdTimers).length > 0;
}

/**
 * Checks if an exercise is currently holding
 * @param {number} index - Exercise index
 * @returns {boolean} True if hold timer is running for this exercise
 */
function isHolding(index) {
  return holdTimers[index] !== undefined;
}

export {
  formatTime,
  startHoldTimer,
  startRestTimer,
  clearTimer,
  hasActiveTimers,
  isHolding
};
