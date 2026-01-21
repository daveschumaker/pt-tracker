import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as Storage from '../src/storage.js';
import * as State from '../src/state.js';

vi.mock('../src/storage.js');

describe('State Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.saveExercises.mockReturnValue(true);
    Storage.saveHistory.mockReturnValue(true);
  });

  describe('clearHistory', () => {
    it('should clear all history entries', () => {
      State.clearHistory();

      expect(Storage.saveHistory).toHaveBeenCalledWith([]);
    });
  });

  describe('Editing state', () => {
    it('should set and get editing index', () => {
      State.setEditingIndex(5);
      expect(State.getEditingIndex()).toBe(5);
    });

    it('should toggle editing history', () => {
      const initial = State.getEditingHistory();
      State.toggleEditingHistory();
      expect(State.getEditingHistory()).toBe(!initial);
    });
  });
});
