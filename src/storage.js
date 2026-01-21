import { STORAGE_KEYS } from './constants.js';

/**
 * Reads a value from localStorage
 * @param {string} key - localStorage key
 * @returns {any|null} Parsed value or null if not found
 */
function getFromStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return null;
  }
}

/**
 * Saves a value to localStorage
 * @param {string} key - localStorage key
 * @param {any} value - Value to save (will be JSON stringified)
 * @returns {boolean} True if save succeeded
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
    return false;
  }
}

/**
 * Loads exercises from localStorage
 * @returns {Array} Array of exercise objects
 */
function loadExercises() {
  return getFromStorage(STORAGE_KEYS.EXERCISES) || [];
}

/**
 * Saves exercises to localStorage
 * @param {Array} exercises - Array of exercise objects
 * @returns {boolean} True if save succeeded
 */
function saveExercises(exercises) {
  return saveToStorage(STORAGE_KEYS.EXERCISES, exercises);
}

/**
 * Loads history from localStorage
 * @returns {Array} Array of history objects
 */
function loadHistory() {
  return getFromStorage(STORAGE_KEYS.HISTORY) || [];
}

/**
 * Saves history to localStorage
 * @param {Array} history - Array of history objects
 * @returns {boolean} True if save succeeded
 */
function saveHistory(history) {
  return saveToStorage(STORAGE_KEYS.HISTORY, history);
}

export {
  STORAGE_KEYS,
  loadExercises,
  saveExercises,
  loadHistory,
  saveHistory
};
