/**
 * Validates exercise input data
 * @param {Object} data - Exercise data to validate
 * @param {string} data.name - Exercise name
 * @param {number} data.targetReps - Target repetitions
 * @param {number} data.targetSets - Target sets
 * @param {number} data.holdTime - Hold time in seconds
 * @returns {Object} Validation result { valid: boolean, error?: string }
 */
export function validateExercise({ name, targetReps, targetSets, holdTime }) {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Please enter an exercise name' };
  }

  if (targetReps < 1) {
    return { valid: false, error: 'Target reps must be at least 1' };
  }

  if (targetSets < 1) {
    return { valid: false, error: 'Target sets must be at least 1' };
  }

  if (holdTime < 0) {
    return { valid: false, error: 'Hold time cannot be negative' };
  }

  return { valid: true };
}
