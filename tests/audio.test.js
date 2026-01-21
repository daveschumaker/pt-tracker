import { describe, it, expect, beforeEach, vi } from 'vitest';
import { playChime, playBell } from '../src/audio.js';

const originalAudioContext = window.AudioContext;

describe('Audio Module', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    window.AudioContext = originalAudioContext;
  });

  it('should not throw when playing chime', () => {
    expect(() => playChime()).not.toThrow();
  });

  it('should not throw when playing bell', () => {
    expect(() => playBell()).not.toThrow();
  });
});
