/**
 * localStorage key names
 */
export const STORAGE_KEYS = {
  EXERCISES: 'ptExercises',
  HISTORY: 'ptHistory'
};

/**
 * Default duration in seconds for rest timer between sets
 */
export const REST_TIMER_SECONDS = 60;

/**
 * Maximum number of history entries to keep
 */
export const MAX_HISTORY_ENTRIES = 100;

/**
 * Audio frequencies for sound effects (in Hz)
 */
export const AUDIO_FREQUENCIES = {
  CHIME: 880,
  BELL: [523, 659, 784]
};

/**
 * Duration in seconds for audio sounds
 */
export const AUDIO_DURATION = {
  CHIME: 0.3,
  BELL: 0.5
};

/**
 * Volume gain for audio sounds (0-1)
 */
export const AUDIO_GAIN = 0.3;

/**
 * Default values for exercise form inputs
 */
export const DEFAULT_VALUES = {
  TARGET_REPS: 10,
  TARGET_SETS: 3,
  HOLD_TIME: 0
};

/**
 * Vibration pattern for timer completion [on, off, on] in milliseconds
 */
export const VIBRATION_PATTERN = [200, 100, 200];
