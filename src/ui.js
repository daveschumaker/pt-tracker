import { getExercises, getHistory, getEditingHistory, getExercise } from './state.js';
import { isHolding } from './timers.js';
import { DEFAULT_VALUES } from './constants.js';

/**
 * Creates HTML string for an exercise card
 * @param {Object} exercise - Exercise object
 * @param {number} index - Exercise index
 * @returns {string} HTML string for the exercise
 */
function createExerciseHTML(exercise, index) {
  const setsComplete = exercise.currentSet > exercise.targetSets;
  const repsComplete = exercise.currentReps >= exercise.targetReps;
  const hasHold = exercise.holdTime > 0;
  const holding = isHolding(index);
  // Use the active field from state, default to false if not set
  const isActive = exercise.active === true;

  let cardClass = 'exercise-card';
  if (setsComplete) {
    cardClass += ' exercise-complete';
  } else if (isActive) {
    cardClass += ' exercise-active';
  }

  let holdTimerHTML = '';
  if (hasHold) {
    holdTimerHTML = `
      <div class="hold-timer${holding ? ' active' : ''}">
        <div class="hold-timer-display" id="hold-display-${index}">0:00</div>
        <div class="hold-timer-label">Hold</div>
      </div>
    `;
  }

  const repButtonText = hasHold ? 'Start Hold' : '+1 Rep';
  const repButtonDisabled = setsComplete || holding;

  if (setsComplete) {
    return `
      <div class="${cardClass}">
        <div class="exercise-header">
          <div class="exercise-title">${exercise.name}${hasHold ? ' (' + exercise.holdTime + 's hold)' : ''}</div>
          ${isActive ? '<span class="badge-active">Active</span>' : ''}
        </div>

        <div class="stats">
          <div class="stat">
            <div class="stat-label">Set</div>
            <div class="stat-value done">${exercise.targetSets} / ${exercise.targetSets}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Reps</div>
            <div class="stat-value${repsComplete ? ' done' : ''}">${exercise.currentReps} / ${exercise.targetReps}</div>
          </div>
        </div>

        ${holdTimerHTML}

        <button class="btn btn-primary" onclick="resetExercise(${index})" style="width: 100%;">
          Start Again
        </button>

        <button class="accordion-toggle" onclick="toggleAccordion(${index})" id="accordion-toggle-${index}">
          More Options
        </button>

        <div class="accordion-content" id="accordion-${index}">
          <div class="controls">
            <button class="btn" onclick="editExercise(${index})">Edit</button>
            <button class="btn" onclick="removeExercise(${index})" style="color: #999;">Remove</button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="${cardClass}">
      <div class="exercise-header">
        <div class="exercise-title">${exercise.name}${hasHold ? ' (' + exercise.holdTime + 's hold)' : ''}</div>
        ${isActive ? '<span class="badge-active">Active</span>' : ''}
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">Set</div>
          <div class="stat-value${setsComplete ? ' done' : ''}">${exercise.currentSet} / ${exercise.targetSets}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Reps</div>
          <div class="stat-value${repsComplete ? ' done' : ''}">${exercise.currentReps} / ${exercise.targetReps}</div>
        </div>
      </div>

      ${holdTimerHTML}

      <button class="btn btn-primary" onclick="addRep(${index})" style="width: 100%;"${repButtonDisabled ? ' disabled' : ''}>${repButtonText}</button>

      ${repsComplete && !holding ? `
      <button class="btn btn-success" onclick="completeSet(${index})" style="width: 100%; margin-top: 0.5rem;">
        Complete Set
      </button>
      ` : ''}

      <div id="timer-${index}" class="timer">
        <div class="timer-display" id="timer-display-${index}">0:00</div>
        <div class="timer-label">Rest</div>
      </div>

      <button class="accordion-toggle" onclick="toggleAccordion(${index})" id="accordion-toggle-${index}">
        More Options
      </button>

      <div class="accordion-content" id="accordion-${index}">
        <div class="controls">
          <button class="btn" onclick="subtractRep(${index})"${holding ? ' disabled' : ''}>-1 Rep</button>
          <button class="btn btn-success" onclick="completeSet(${index})"${setsComplete || holding ? ' disabled' : ''}>Complete Set</button>
        </div>

        <div class="controls">
          <button class="btn" onclick="resetExercise(${index})">Reset</button>
          <button class="btn" onclick="editExercise(${index})">Edit</button>
          <button class="btn" onclick="removeExercise(${index})" style="color: #999;">Remove</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders all exercises to the DOM
 */
function renderExercises() {
  const container = document.getElementById('exercises-container');
  container.innerHTML = getExercises().map((exercise, index) => createExerciseHTML(exercise, index)).join('');
}

/**
 * Toggles the visibility of exercise options accordion
 * @param {number} index - Exercise index
 */
function toggleAccordion(index) {
  const content = document.getElementById(`accordion-${index}`);
  const toggle = document.getElementById(`accordion-toggle-${index}`);
  content.classList.toggle('open');
  toggle.classList.toggle('open');
}

/**
 * Shows the exercise modal (add or edit mode)
 * @param {number|null} index - Exercise index to edit, or null for new exercise
 */
function showModal(index = null) {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const submitBtn = document.getElementById('modal-submit');

  if (index !== null) {
    const exercise = getExercise(index);
    modalTitle.textContent = 'Edit Exercise';
    submitBtn.textContent = 'Save';
    document.getElementById('exercise-name').value = exercise.name;
    document.getElementById('target-reps').value = exercise.targetReps;
    document.getElementById('target-sets').value = exercise.targetSets;
    document.getElementById('hold-time').value = exercise.holdTime;
  } else {
    modalTitle.textContent = 'Add Exercise';
    submitBtn.textContent = 'Add';
    document.getElementById('exercise-name').value = '';
    document.getElementById('target-reps').value = DEFAULT_VALUES.TARGET_REPS;
    document.getElementById('target-sets').value = DEFAULT_VALUES.TARGET_SETS;
    document.getElementById('hold-time').value = DEFAULT_VALUES.HOLD_TIME;
  }

  modal.classList.add('active');
  document.getElementById('exercise-name').focus();
}

/**
 * Hides the exercise modal
 */
function hideModal() {
  document.getElementById('modal').classList.remove('active');
}

function renderHistory() {
  const container = document.getElementById('history-section');
  const history = getHistory();
  const editingHistory = getEditingHistory();

  if (history.length === 0) {
    container.innerHTML = '';
    return;
  }

  const grouped = {};
  history.forEach((entry, originalIndex) => {
    const date = new Date(entry.timestamp);
    const dateKey = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push({ ...entry, originalIndex });
  });

  const editingClass = editingHistory ? 'editing' : '';
  const editButtonText = editingHistory ? 'Done' : 'Edit';

  let html = `
    <div class="section-header">
      <span class="section-title">History</span>
      <div>
        ${editingHistory ? '<button class="clear-history" onclick="clearHistory()">Clear All</button> | ' : ''}
        <button class="edit-history" onclick="toggleEditHistory()">${editButtonText}</button>
      </div>
    </div>
  `;

  for (const [date, entries] of Object.entries(grouped)) {
    html += `<div class="history-card ${editingClass}">`;
    html += `<div class="history-date">${date}</div>`;

    entries.forEach((entry) => {
      const time = new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      html += `
        <div class="history-entry">
          <span class="history-name">${entry.name}</span>
          <div class="history-right">
            <span class="history-time">${time}</span>
            <button class="history-delete" onclick="deleteHistoryEntry(${entry.originalIndex})">X</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
  }

  container.innerHTML = html;
}

export {
  renderExercises,
  renderHistory,
  toggleAccordion,
  showModal,
  hideModal
};
