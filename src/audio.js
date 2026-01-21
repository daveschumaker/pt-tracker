import {
  AUDIO_FREQUENCIES,
  AUDIO_DURATION,
  AUDIO_GAIN
} from './constants.js';

let audioContext = null;

/**
 * Gets or creates the Web Audio API context
 * @returns {AudioContext} Audio context instance
 */
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Plays a chime sound (single tone at 880Hz)
 */
function playChime() {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = AUDIO_FREQUENCIES.CHIME;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(AUDIO_GAIN, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + AUDIO_DURATION.CHIME);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + AUDIO_DURATION.CHIME);
  } catch (error) {
    console.log('Audio not available', error);
  }
}

/**
 * Plays a bell sound (three-note sequence: 523Hz, 659Hz, 784Hz)
 */
function playBell() {
  try {
    const ctx = getAudioContext();

    AUDIO_FREQUENCIES.BELL.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + (i * 0.1);
      gainNode.gain.setValueAtTime(AUDIO_GAIN, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + AUDIO_DURATION.BELL);

      oscillator.start(startTime);
      oscillator.stop(startTime + AUDIO_DURATION.BELL);
    });
  } catch (error) {
    console.log('Audio not available', error);
  }
}

export {
  playChime,
  playBell
};
