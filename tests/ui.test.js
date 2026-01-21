import { describe, it, expect, vi } from 'vitest';
import { renderHistory } from '../src/ui.js';

describe('UI Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = `
      <div id="exercises-container"></div>
      <div id="history-section"></div>
    `;
  });

  describe('renderHistory', () => {
    it('should clear container when history is empty', () => {
      renderHistory();

      const container = document.getElementById('history-section');
      expect(container.innerHTML).toBe('');
    });
  });
});
