import { describe, it, expect } from 'vitest';
import {
  STORAGE_KEYS,
  REST_TIMER_SECONDS,
  MAX_HISTORY_ENTRIES,
  AUDIO_FREQUENCIES,
  AUDIO_DURATION,
  AUDIO_GAIN,
  DEFAULT_VALUES,
  VIBRATION_PATTERN
} from '../src/constants.js';

describe('Constants Module', () => {
  describe('STORAGE_KEYS', () => {
    it('should have correct exercise key', () => {
      expect(STORAGE_KEYS.EXERCISES).toBe('ptExercises');
    });

    it('should have correct history key', () => {
      expect(STORAGE_KEYS.HISTORY).toBe('ptHistory');
    });
  });

  describe('REST_TIMER_SECONDS', () => {
    it('should be 60 seconds', () => {
      expect(REST_TIMER_SECONDS).toBe(60);
    });
  });

  describe('MAX_HISTORY_ENTRIES', () => {
    it('should be 100', () => {
      expect(MAX_HISTORY_ENTRIES).toBe(100);
    });
  });

  describe('AUDIO_FREQUENCIES', () => {
    it('should have chime frequency', () => {
      expect(AUDIO_FREQUENCIES.CHIME).toBe(880);
    });

    it('should have bell frequencies array', () => {
      expect(AUDIO_FREQUENCIES.BELL).toEqual([523, 659, 784]);
    });
  });

  describe('AUDIO_DURATION', () => {
    it('should have chime duration', () => {
      expect(AUDIO_DURATION.CHIME).toBe(0.3);
    });

    it('should have bell duration', () => {
      expect(AUDIO_DURATION.BELL).toBe(0.5);
    });
  });

  describe('AUDIO_GAIN', () => {
    it('should be 0.3', () => {
      expect(AUDIO_GAIN).toBe(0.3);
    });
  });

  describe('DEFAULT_VALUES', () => {
    it('should have default target reps', () => {
      expect(DEFAULT_VALUES.TARGET_REPS).toBe(10);
    });

    it('should have default target sets', () => {
      expect(DEFAULT_VALUES.TARGET_SETS).toBe(3);
    });

    it('should have default hold time', () => {
      expect(DEFAULT_VALUES.HOLD_TIME).toBe(0);
    });
  });

  describe('VIBRATION_PATTERN', () => {
    it('should be vibration pattern array', () => {
      expect(VIBRATION_PATTERN).toEqual([200, 100, 200]);
    });
  });
});
