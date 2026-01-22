import { describe, it, expect } from 'vitest';
import { validateExercise } from '../src/validation.js';

describe('Validation Module', () => {
  describe('validateExercise', () => {
    describe('name validation', () => {
      it('should reject empty name', () => {
        const result = validateExercise({
          name: '',
          targetReps: 10,
          targetSets: 3,
          holdTime: 0
        });

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter an exercise name');
      });

      it('should reject whitespace-only name', () => {
        const result = validateExercise({
          name: '   ',
          targetReps: 10,
          targetSets: 3,
          holdTime: 0
        });

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter an exercise name');
      });

      it('should reject null name', () => {
        const result = validateExercise({
          name: null,
          targetReps: 10,
          targetSets: 3,
          holdTime: 0
        });

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter an exercise name');
      });

      it('should accept valid name', () => {
        const result = validateExercise({
          name: 'Squats',
          targetReps: 10,
          targetSets: 3,
          holdTime: 0
        });

        expect(result.valid).toBe(true);
      });
    });

    describe('targetReps validation', () => {
      it('should reject zero reps', () => {
        const result = validateExercise({
          name: 'Exercise',
          targetReps: 0,
          targetSets: 3,
          holdTime: 0
        });

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Target reps must be at least 1');
      });

      it('should reject negative reps', () => {
        const result = validateExercise({
          name: 'Exercise',
          targetReps: -5,
          targetSets: 3,
          holdTime: 0
        });

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Target reps must be at least 1');
      });

      it('should accept 1 rep', () => {
        const result = validateExercise({
          name: 'Plank',
          targetReps: 1,
          targetSets: 3,
          holdTime: 30
        });

        expect(result.valid).toBe(true);
      });
    });

    describe('targetSets validation', () => {
      it('should reject zero sets', () => {
        const result = validateExercise({
          name: 'Exercise',
          targetReps: 10,
          targetSets: 0,
          holdTime: 0
        });

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Target sets must be at least 1');
      });

      it('should reject negative sets', () => {
        const result = validateExercise({
          name: 'Exercise',
          targetReps: 10,
          targetSets: -2,
          holdTime: 0
        });

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Target sets must be at least 1');
      });

      it('should accept 1 set', () => {
        const result = validateExercise({
          name: 'Single Set Exercise',
          targetReps: 10,
          targetSets: 1,
          holdTime: 0
        });

        expect(result.valid).toBe(true);
      });
    });

    describe('holdTime validation', () => {
      it('should reject negative hold time', () => {
        const result = validateExercise({
          name: 'Plank',
          targetReps: 1,
          targetSets: 3,
          holdTime: -10
        });

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Hold time cannot be negative');
      });

      it('should accept zero hold time', () => {
        const result = validateExercise({
          name: 'Regular Exercise',
          targetReps: 10,
          targetSets: 3,
          holdTime: 0
        });

        expect(result.valid).toBe(true);
      });

      it('should accept positive hold time', () => {
        const result = validateExercise({
          name: 'Plank',
          targetReps: 1,
          targetSets: 3,
          holdTime: 60
        });

        expect(result.valid).toBe(true);
      });
    });

    describe('valid exercise data', () => {
      it('should return valid for complete valid data', () => {
        const result = validateExercise({
          name: 'Squats',
          targetReps: 10,
          targetSets: 3,
          holdTime: 0
        });

        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should return valid for hold exercise', () => {
        const result = validateExercise({
          name: 'Wall Sit',
          targetReps: 1,
          targetSets: 3,
          holdTime: 45
        });

        expect(result.valid).toBe(true);
      });
    });
  });
});
