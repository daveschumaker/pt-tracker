import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as Storage from '../src/storage.js';

describe('Storage Module', () => {
  const originalLocalStorage = global.localStorage;

  beforeEach(() => {
    global.localStorage = {
      store: {},
      getItem: function(key) {
        return this.store[key] || null;
      },
      setItem: function(key, value) {
        this.store[key] = String(value);
      },
      clear: function() {
        this.store = {};
      }
    };
  });

  afterEach(() => {
    global.localStorage.clear();
    global.localStorage = originalLocalStorage;
  });

  describe('loadExercises', () => {
    it('should return empty array when no exercises exist', () => {
      const exercises = Storage.loadExercises();
      expect(exercises).toEqual([]);
    });

    it('should load saved exercises from storage', () => {
      const mockExercises = [
        { name: 'Squats', targetReps: 10, targetSets: 3 }
      ];
      localStorage.setItem('ptExercises', JSON.stringify(mockExercises));

      const exercises = Storage.loadExercises();
      expect(exercises).toEqual(mockExercises);
    });
  });

  describe('saveExercises', () => {
    it('should save exercises to storage', () => {
      const exercises = [
        { name: 'Squats', targetReps: 10, targetSets: 3 }
      ];

      const result = Storage.saveExercises(exercises);

      expect(result).toBe(true);
      expect(localStorage.getItem('ptExercises')).toBe(JSON.stringify(exercises));
    });
  });

  describe('loadHistory', () => {
    it('should return empty array when no history exists', () => {
      const history = Storage.loadHistory();
      expect(history).toEqual([]);
    });

    it('should load saved history from storage', () => {
      const mockHistory = [
        { name: 'Squats', timestamp: 1234567890 }
      ];
      localStorage.setItem('ptHistory', JSON.stringify(mockHistory));

      const history = Storage.loadHistory();
      expect(history).toEqual(mockHistory);
    });
  });

  describe('saveHistory', () => {
    it('should save history to storage', () => {
      const history = [
        { name: 'Squats', timestamp: 1234567890 }
      ];

      const result = Storage.saveHistory(history);

      expect(result).toBe(true);
      expect(localStorage.getItem('ptHistory')).toBe(JSON.stringify(history));
    });
  });
});
