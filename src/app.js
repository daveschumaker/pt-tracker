import * as Storage from './storage.js';
import * as Timers from './timers.js';
import * as State from './state.js';
import * as UI from './ui.js';
import { DEFAULT_VALUES } from './constants.js';
import { validateExercise } from './validation.js';

let wakeLock = null;

/**
 * Requests screen wake lock to prevent device from sleeping
 */
async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock released');
      });
      console.log('Wake Lock acquired');
    } catch (err) {
      console.log('Wake Lock error:', err.message);
    }
  }
}

/**
 * Releases the screen wake lock
 */
function releaseWakeLock() {
  if (wakeLock !== null) {
    wakeLock.release();
    wakeLock = null;
  }
}

document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible') {
    if (Timers.hasActiveTimers()) {
      await requestWakeLock();
    }
  }
});

/**
 * Logs exercise completion to history
 * @param {string} exerciseName - Name of completed exercise
 */
function logCompletion(exerciseName) {
  State.addHistoryEntry(exerciseName);
  UI.renderHistory();
}

window.addRep = function(index) {
  const exercise = State.getExercise(index);

  if (exercise.holdTime > 0) {
    requestWakeLock();

    // Cancel any existing hold timer on other exercises
    const exercises = State.getExercises();
    exercises.forEach((ex, i) => {
      if (i !== index && Timers.isHolding(i)) {
        console.log(`Cancelling hold timer for exercise ${i}`);
        Timers.clearTimer(i);
      }
    });

    // Deactivate all other exercises and activate this one
    console.log(`Starting hold for exercise ${index}. Total exercises: ${exercises.length}`);
    exercises.forEach((ex, i) => {
      console.log(`Exercise ${i}: active=${ex.active}, name=${ex.name}`);
      if (i !== index) {
        console.log(`Deactivating exercise ${i}`);
        State.updateExercise(i, { active: false });
      }
    });
    console.log(`Activating exercise ${index}`);
    State.updateExercise(index, { active: true });

    setTimeout(() => {
      Timers.startHoldTimer(index, exercise.holdTime, () => {
        const currentExercise = State.getExercise(index);
        // Don't deactivate - keep this exercise active as the most recently completed one
        State.updateExercise(index, { currentReps: currentExercise.currentReps + 1 });
        UI.renderExercises();

        if (!Timers.hasActiveTimers()) {
          releaseWakeLock();
        }
      });
      UI.renderExercises();
    }, 0);
  } else {
    State.updateExercise(index, { currentReps: exercise.currentReps + 1 });
    UI.renderExercises();
  }
};

window.subtractRep = function(index) {
  const exercise = State.getExercise(index);
  if (exercise.currentReps > 0) {
    State.updateExercise(index, { currentReps: exercise.currentReps - 1 });
    UI.renderExercises();
  }
};

window.completeSet = function(index) {
  const exercise = State.getExercise(index);

  State.updateExercise(index, {
    currentSet: exercise.currentSet + 1,
    currentReps: 0
  });
  UI.renderExercises();

  if (exercise.currentSet + 1 <= exercise.targetSets) {
    Timers.startRestTimer(index, () => {
      if (!Timers.hasActiveTimers()) {
        releaseWakeLock();
      }
    });
    requestWakeLock();
  } else {
    logCompletion(exercise.name);
  }
};

window.resetExercise = function(index) {
  // Complete any other active exercises first
  const exercises = State.getExercises();
  exercises.forEach((exercise, i) => {
    if (i !== index) {
      const isActive = exercise.currentSet <= exercise.targetSets &&
                       (exercise.currentReps > 0 || exercise.currentSet > 1);
      if (isActive) {
        State.updateExercise(i, {
          currentSet: exercise.targetSets + 1,
          currentReps: 0
        });
        Timers.clearTimer(i);
      }
    }
  });

  // Reset the selected exercise
  State.updateExercise(index, {
    currentSet: 1,
    currentReps: 0
  });
  Timers.clearTimer(index);
  UI.renderExercises();
};

window.removeExercise = function(index) {
  if (confirm('Remove this exercise?')) {
    Timers.clearTimer(index);
    State.removeExercise(index);
    UI.renderExercises();
  }
};

window.editExercise = function(index) {
  UI.showModal(index);
};

window.saveExercise = function() {
  const name = document.getElementById('exercise-name').value.trim();
  const targetReps = parseInt(document.getElementById('target-reps').value) || DEFAULT_VALUES.TARGET_REPS;
  const targetSets = parseInt(document.getElementById('target-sets').value) || DEFAULT_VALUES.TARGET_SETS;
  const holdTime = parseInt(document.getElementById('hold-time').value) || DEFAULT_VALUES.HOLD_TIME;

  const validation = validateExercise({ name, targetReps, targetSets, holdTime });
  if (!validation.valid) {
    alert(validation.error);
    return;
  }

  const editingIndex = State.getEditingIndex();

  if (editingIndex !== null) {
    State.updateExercise(editingIndex, {
      name,
      targetReps,
      targetSets,
      holdTime
    });
  } else {
    State.addExercise({
      name,
      targetReps,
      targetSets,
      holdTime,
      currentSet: 1,
      currentReps: 0,
      active: false
    });
  }

  UI.renderExercises();
  UI.hideModal();
  State.setEditingIndex(null);
};

window.toggleEditHistory = function() {
  State.toggleEditingHistory();
  UI.renderHistory();
};

window.clearHistory = function() {
  if (confirm('Clear all history?')) {
    State.clearHistory();
    State.toggleEditingHistory();
    UI.renderHistory();
  }
};

window.deleteHistoryEntry = function(index) {
  if (confirm('Delete this entry?')) {
    State.removeHistoryEntry(index);
    UI.renderHistory();
  }
};

window.toggleAccordion = UI.toggleAccordion;
window.showModal = UI.showModal;
window.hideModal = UI.hideModal;

UI.renderExercises();
UI.renderHistory();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration.scope);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
}
