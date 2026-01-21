import { describe, it, expect, vi } from 'vitest';
import { formatTime } from '../src/timers.js';

describe('Timers Module', () => {
  describe('formatTime', () => {
    it('should format seconds as MM:SS', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(125)).toBe('2:05');
    });

    it('should handle edge cases', () => {
      expect(formatTime(3599)).toBe('59:59');
      expect(formatTime(3600)).toBe('60:00');
    });

    it('should pad seconds with leading zero', () => {
      expect(formatTime(61)).toBe('1:01');
      expect(formatTime(70)).toBe('1:10');
      expect(formatTime(5)).toBe('0:05');
    });
  });
});
