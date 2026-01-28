import {
  loadExercises,
  saveExercises,
  loadHistory,
  saveHistory,
} from './storage.js';
import { MAX_HISTORY_ENTRIES } from './constants.js';

let exercises = loadExercises();
let history = loadHistory();
let editingIndex = null;
let editingHistory = false;

/**
 * Gets the current exercises array
 * @returns {Array} Array of exercise objects
 */
function getExercises() {
  return exercises;
}

/**
 * Replaces all exercises with a new array
 * @param {Array} newExercises - New array of exercise objects
 */
function setExercises(newExercises) {
  exercises = newExercises;
  saveExercises(exercises);
}

/**
 * Adds a new exercise to the list
 * @param {Object} exercise - Exercise object to add
 * @param {string} exercise.name - Exercise name
 * @param {boolean} exercise.active - Exercise is currently active and highlighted
 * @param {number} exercise.targetReps - Target repetitions per set
 * @param {number} exercise.targetSets - Target number of sets
 * @param {number} exercise.holdTime - Hold time in seconds (0 for non-hold exercises)
 * @param {number} [exercise.currentSet=1] - Current set number
 * @param {number} [exercise.currentReps=0] - Current rep count
 */
function addExercise(exercise) {
  exercises.push(exercise);
  saveExercises(exercises);
}

/**
 * Updates an existing exercise with new values
 * @param {number} index - Index of the exercise to update
 * @param {Object} updates - Object containing properties to update
 */
function updateExercise(index, updates) {
  Object.assign(exercises[index], updates);
  saveExercises(exercises);
}

/**
 * Removes an exercise from the list
 * @param {number} index - Index of the exercise to remove
 */
function removeExercise(index) {
  exercises.splice(index, 1);
  saveExercises(exercises);
}

/**
 * Gets a specific exercise by index
 * @param {number} index - Index of the exercise to retrieve
 * @returns {Object} Exercise object at the specified index
 */
function getExercise(index) {
  return exercises[index];
}

/**
 * Gets the current history array
 * @returns {Array} Array of history entry objects
 */
function getHistory() {
  return history;
}

/**
 * Replaces all history entries with a new array
 * @param {Array} newHistory - New array of history entry objects
 */
function setHistory(newHistory) {
  history = newHistory;
  saveHistory(history);
}

/**
 * Adds a new entry to the history (at the beginning)
 * Automatically truncates history to MAX_HISTORY_ENTRIES
 * @param {string} name - Name of the completed exercise
 */
function addHistoryEntry(name) {
  history.unshift({
    name,
    timestamp: Date.now(),
  });

  if (history.length > MAX_HISTORY_ENTRIES) {
    history = history.slice(0, MAX_HISTORY_ENTRIES);
  }

  saveHistory(history);
}

/**
 * Removes a history entry by index
 * @param {number} index - Index of the history entry to remove
 */
function removeHistoryEntry(index) {
  history.splice(index, 1);
  saveHistory(history);
}

/**
 * Clears all history entries
 */
function clearHistory() {
  history = [];
  saveHistory(history);
}

/**
 * Gets the index of the exercise currently being edited
 * @returns {number|null} Index of exercise being edited, or null if not editing
 */
function getEditingIndex() {
  return editingIndex;
}

/**
 * Sets the index of the exercise being edited
 * @param {number|null} index - Index of exercise to edit, or null to clear
 */
function setEditingIndex(index) {
  editingIndex = index;
}

/**
 * Gets whether history editing mode is active
 * @returns {boolean} True if history editing mode is enabled
 */
function getEditingHistory() {
  return editingHistory;
}

/**
 * Toggles history editing mode on/off
 */
function toggleEditingHistory() {
  editingHistory = !editingHistory;
}

export {
  getExercises,
  setExercises,
  addExercise,
  updateExercise,
  removeExercise,
  getExercise,
  getHistory,
  setHistory,
  addHistoryEntry,
  removeHistoryEntry,
  clearHistory,
  getEditingIndex,
  setEditingIndex,
  getEditingHistory,
  toggleEditingHistory,
};
