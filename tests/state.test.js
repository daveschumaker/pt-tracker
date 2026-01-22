import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as Storage from '../src/storage.js';

vi.mock('../src/storage.js');

describe('State Module', () => {
  let State;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    // Mock storage functions before importing state
    Storage.loadExercises.mockReturnValue([]);
    Storage.loadHistory.mockReturnValue([]);
    Storage.saveExercises.mockReturnValue(true);
    Storage.saveHistory.mockReturnValue(true);

    // Fresh import for each test
    State = await import('../src/state.js');
  });

  describe('Exercise management', () => {
    it('should get empty exercises array initially', () => {
      expect(State.getExercises()).toEqual([]);
    });

    it('should add an exercise', () => {
      const exercise = { name: 'Squats', targetReps: 10, targetSets: 3, holdTime: 0 };
      State.addExercise(exercise);

      expect(State.getExercises()).toContainEqual(exercise);
      expect(Storage.saveExercises).toHaveBeenCalled();
    });

    it('should get exercise by index', () => {
      const exercise = { name: 'Pushups', targetReps: 15, targetSets: 3, holdTime: 0 };
      State.addExercise(exercise);

      expect(State.getExercise(0)).toEqual(exercise);
    });

    it('should update an exercise', () => {
      State.addExercise({ name: 'Plank', targetReps: 1, targetSets: 3, holdTime: 30, currentReps: 0 });

      State.updateExercise(0, { currentReps: 1 });

      expect(State.getExercise(0).currentReps).toBe(1);
      expect(Storage.saveExercises).toHaveBeenCalled();
    });

    it('should remove an exercise', () => {
      State.addExercise({ name: 'Exercise 1' });
      State.addExercise({ name: 'Exercise 2' });

      State.removeExercise(0);

      expect(State.getExercises()).toHaveLength(1);
      expect(State.getExercise(0).name).toBe('Exercise 2');
      expect(Storage.saveExercises).toHaveBeenCalled();
    });

    it('should set all exercises', () => {
      const exercises = [
        { name: 'Ex1' },
        { name: 'Ex2' }
      ];
      State.setExercises(exercises);

      expect(State.getExercises()).toEqual(exercises);
      expect(Storage.saveExercises).toHaveBeenCalledWith(exercises);
    });
  });

  describe('History management', () => {
    it('should get empty history array initially', () => {
      expect(State.getHistory()).toEqual([]);
    });

    it('should add a history entry', () => {
      State.addHistoryEntry('Squats');

      const history = State.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].name).toBe('Squats');
      expect(history[0].timestamp).toBeDefined();
      expect(Storage.saveHistory).toHaveBeenCalled();
    });

    it('should add new entries at the beginning', () => {
      State.addHistoryEntry('First');
      State.addHistoryEntry('Second');

      const history = State.getHistory();
      expect(history[0].name).toBe('Second');
      expect(history[1].name).toBe('First');
    });

    it('should remove a history entry', () => {
      State.addHistoryEntry('Entry 1');
      State.addHistoryEntry('Entry 2');

      State.removeHistoryEntry(0);

      expect(State.getHistory()).toHaveLength(1);
      expect(State.getHistory()[0].name).toBe('Entry 1');
    });

    it('should clear all history', () => {
      State.addHistoryEntry('Entry 1');
      State.addHistoryEntry('Entry 2');

      State.clearHistory();

      expect(State.getHistory()).toHaveLength(0);
      expect(Storage.saveHistory).toHaveBeenCalledWith([]);
    });

    it('should truncate history to MAX_HISTORY_ENTRIES', async () => {
      // Add more than 100 entries
      for (let i = 0; i < 105; i++) {
        State.addHistoryEntry(`Entry ${i}`);
      }

      // History should be truncated to 100 entries
      expect(State.getHistory().length).toBeLessThanOrEqual(100);
    });
  });

  describe('Editing state', () => {
    it('should set and get editing index', () => {
      expect(State.getEditingIndex()).toBeNull();

      State.setEditingIndex(5);
      expect(State.getEditingIndex()).toBe(5);

      State.setEditingIndex(null);
      expect(State.getEditingIndex()).toBeNull();
    });

    it('should toggle editing history', () => {
      expect(State.getEditingHistory()).toBe(false);

      State.toggleEditingHistory();
      expect(State.getEditingHistory()).toBe(true);

      State.toggleEditingHistory();
      expect(State.getEditingHistory()).toBe(false);
    });
  });
});
