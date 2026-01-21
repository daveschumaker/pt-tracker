import { loadExercises, saveExercises, loadHistory, saveHistory } from './storage.js';
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

function setExercises(newExercises) {
  exercises = newExercises;
  saveExercises(exercises);
}

function addExercise(exercise) {
  exercises.push(exercise);
  saveExercises(exercises);
}

function updateExercise(index, updates) {
  Object.assign(exercises[index], updates);
  saveExercises(exercises);
}

function removeExercise(index) {
  exercises.splice(index, 1);
  saveExercises(exercises);
}

function getExercise(index) {
  return exercises[index];
}

/**
 * Gets the current history array
 * @returns {Array} Array of history objects
 */
function getHistory() {
  return history;
}

function setHistory(newHistory) {
  history = newHistory;
  saveHistory(history);
}

function addHistoryEntry(name) {
  history.unshift({
    name,
    timestamp: Date.now()
  });

  if (history.length > MAX_HISTORY_ENTRIES) {
    history = history.slice(0, MAX_HISTORY_ENTRIES);
  }

  saveHistory(history);
}

function removeHistoryEntry(index) {
  history.splice(index, 1);
  saveHistory(history);
}

function clearHistory() {
  history = [];
  saveHistory(history);
}

function getEditingIndex() {
  return editingIndex;
}

function setEditingIndex(index) {
  editingIndex = index;
}

function getEditingHistory() {
  return editingHistory;
}

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
  toggleEditingHistory
};
