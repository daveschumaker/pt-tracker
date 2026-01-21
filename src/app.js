        let exercises = JSON.parse(localStorage.getItem('ptExercises') || '[]');
        let history = JSON.parse(localStorage.getItem('ptHistory') || '[]');
        let timers = {};
        let holdTimers = {};
        let editingHistory = false;
        let audioContext = null;
        let wakeLock = null;

        // Register service worker for offline support
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration.scope);
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        }

        // Wake Lock API - prevent screen from sleeping
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

        function releaseWakeLock() {
            if (wakeLock !== null) {
                wakeLock.release();
                wakeLock = null;
            }
        }

        // Re-acquire wake lock when page becomes visible again
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'visible') {
                // Check if any timers are running
                const hasActiveTimers = Object.keys(timers).length > 0 || Object.keys(holdTimers).length > 0;
                if (hasActiveTimers) {
                    await requestWakeLock();
                }
            }
        });

        function getAudioContext() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            return audioContext;
        }

        function playChime() {
            try {
                const ctx = getAudioContext();
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.value = 880; // A5 note
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + 0.3);
            } catch (e) {
                console.log('Audio not available');
            }
        }

        function playBell() {
            try {
                const ctx = getAudioContext();

                // Play two tones for a bell effect
                [523, 659, 784].forEach((freq, i) => {
                    const oscillator = ctx.createOscillator();
                    const gainNode = ctx.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(ctx.destination);

                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';

                    const startTime = ctx.currentTime + (i * 0.1);
                    gainNode.gain.setValueAtTime(0.3, startTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

                    oscillator.start(startTime);
                    oscillator.stop(startTime + 0.5);
                });
            } catch (e) {
                console.log('Audio not available');
            }
        }

        function saveData() {
            localStorage.setItem('ptExercises', JSON.stringify(exercises));
        }

        function saveHistory() {
            localStorage.setItem('ptHistory', JSON.stringify(history));
        }

        function logCompletion(exerciseName) {
            history.unshift({
                name: exerciseName,
                timestamp: Date.now()
            });
            // Keep only last 100 entries
            if (history.length > 100) {
                history = history.slice(0, 100);
            }
            saveHistory();
            renderHistory();
        }

        function toggleEditHistory() {
            editingHistory = !editingHistory;
            renderHistory();
        }

        function clearHistory() {
            if (confirm('Clear all history?')) {
                history = [];
                editingHistory = false;
                saveHistory();
                renderHistory();
            }
        }

        function deleteHistoryEntry(index) {
            if (confirm('Delete this entry?')) {
                history.splice(index, 1);
                saveHistory();
                renderHistory();
            }
        }

        function renderHistory() {
            const container = document.getElementById('history-section');

            if (history.length === 0) {
                container.innerHTML = '';
                editingHistory = false;
                return;
            }

            // Group by date, keeping track of original index
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

        function createExerciseHTML(exercise, index) {
            const setsComplete = exercise.currentSet > exercise.targetSets;
            const repsComplete = exercise.currentReps >= exercise.targetReps;
            const isActive = !setsComplete && (exercise.currentReps > 0 || exercise.currentSet > 1);
            const hasHold = exercise.holdTime > 0;
            const isHolding = holdTimers[index] !== undefined;

            let cardClass = 'exercise-card';
            if (setsComplete) {
                cardClass += ' exercise-complete';
            } else if (isActive) {
                cardClass += ' exercise-active';
            }

            let holdTimerHTML = '';
            if (hasHold && isHolding) {
                holdTimerHTML = `
                    <div class="hold-timer">
                        <div class="hold-timer-display" id="hold-display-${index}">0:00</div>
                        <div class="hold-timer-label">Hold</div>
                    </div>
                `;
            }

            const repButtonText = hasHold ? 'Start Hold' : '+1 Rep';
            const repButtonDisabled = setsComplete || isHolding;

            return `
                <div class="${cardClass}">
                    <div class="exercise-header">
                        <div class="exercise-title">${exercise.name}${hasHold ? ' (' + exercise.holdTime + 's hold)' : ''}</div>
                        ${isActive ? '<span class="badge-active">Active</span>' : ''}
                    </div>

                    <div class="stats">
                        <div class="stat">
                            <div class="stat-label">Set</div>
                            <div class="stat-value${setsComplete ? ' done' : ''}">${setsComplete ? exercise.targetSets : exercise.currentSet} / ${exercise.targetSets}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Reps</div>
                            <div class="stat-value${repsComplete ? ' done' : ''}">${exercise.currentReps} / ${exercise.targetReps}</div>
                        </div>
                    </div>

                    ${holdTimerHTML}

                    ${setsComplete ? `
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
                    ` : `
                    <button class="btn btn-primary" onclick="addRep(${index})" style="width: 100%;"${repButtonDisabled ? ' disabled' : ''}>${repButtonText}</button>

                    ${repsComplete && !isHolding ? `
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
                            <button class="btn" onclick="subtractRep(${index})"${isHolding ? ' disabled' : ''}>-1 Rep</button>
                            <button class="btn btn-success" onclick="completeSet(${index})"${setsComplete || isHolding ? ' disabled' : ''}>Complete Set</button>
                        </div>

                        <div class="controls">
                            <button class="btn" onclick="resetExercise(${index})">Reset</button>
                            <button class="btn" onclick="editExercise(${index})">Edit</button>
                            <button class="btn" onclick="removeExercise(${index})" style="color: #999;">Remove</button>
                        </div>
                    </div>
                    `}
                </div>
            `;
        }

        function renderExercises() {
            const container = document.getElementById('exercises-container');
            container.innerHTML = exercises.map((exercise, index) => createExerciseHTML(exercise, index)).join('');
        }

        function toggleAccordion(index) {
            const content = document.getElementById(`accordion-${index}`);
            const toggle = document.getElementById(`accordion-toggle-${index}`);
            content.classList.toggle('open');
            toggle.classList.toggle('open');
        }

        let editingIndex = null;

        function showModal(index = null) {
            editingIndex = index;
            const modal = document.getElementById('modal');
            const modalTitle = document.getElementById('modal-title');
            const submitBtn = document.getElementById('modal-submit');

            if (index !== null) {
                // Edit mode
                const exercise = exercises[index];
                modalTitle.textContent = 'Edit Exercise';
                submitBtn.textContent = 'Save';
                document.getElementById('exercise-name').value = exercise.name;
                document.getElementById('target-reps').value = exercise.targetReps;
                document.getElementById('target-sets').value = exercise.targetSets;
                document.getElementById('hold-time').value = exercise.holdTime;
            } else {
                // Add mode
                modalTitle.textContent = 'Add Exercise';
                submitBtn.textContent = 'Add';
                document.getElementById('exercise-name').value = '';
                document.getElementById('target-reps').value = '10';
                document.getElementById('target-sets').value = '3';
                document.getElementById('hold-time').value = '0';
            }

            modal.classList.add('active');
            document.getElementById('exercise-name').focus();
        }

        function hideModal() {
            document.getElementById('modal').classList.remove('active');
            editingIndex = null;
        }

        function editExercise(index) {
            showModal(index);
        }

        function saveExercise() {
            const name = document.getElementById('exercise-name').value.trim();
            const targetReps = parseInt(document.getElementById('target-reps').value) || 10;
            const targetSets = parseInt(document.getElementById('target-sets').value) || 3;
            const holdTime = parseInt(document.getElementById('hold-time').value) || 0;

            if (name) {
                if (editingIndex !== null) {
                    // Update existing exercise
                    exercises[editingIndex].name = name;
                    exercises[editingIndex].targetReps = targetReps;
                    exercises[editingIndex].targetSets = targetSets;
                    exercises[editingIndex].holdTime = holdTime;
                } else {
                    // Add new exercise
                    exercises.push({
                        name: name,
                        targetReps: targetReps,
                        targetSets: targetSets,
                        holdTime: holdTime,
                        currentSet: 1,
                        currentReps: 0
                    });
                }
                saveData();
                renderExercises();
                hideModal();
            }
        }

        function addRep(index) {
            const exercise = exercises[index];

            if (exercise.holdTime > 0) {
                startHoldTimer(index);
            } else {
                exercise.currentReps++;
                saveData();
                renderExercises();
            }
        }

        function startHoldTimer(index) {
            if (holdTimers[index]) return;

            let seconds = exercises[index].holdTime;

            // Set a placeholder so isHolding is true when we render
            holdTimers[index] = true;
            playChime();
            requestWakeLock();
            renderExercises();

            // Need to wait for DOM to update
            setTimeout(() => {
                const displayElement = document.getElementById(`hold-display-${index}`);
                if (!displayElement) {
                    delete holdTimers[index];
                    return;
                }

                const updateDisplay = () => {
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    displayElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
                };

                updateDisplay();

                holdTimers[index] = setInterval(() => {
                    seconds--;
                    updateDisplay();

                    if (seconds <= 0) {
                        clearInterval(holdTimers[index]);
                        delete holdTimers[index];

                        exercises[index].currentReps++;
                        saveData();

                        playBell();
                        if (navigator.vibrate) {
                            navigator.vibrate([200, 100, 200]);
                        }

                        // Release wake lock if no more timers running
                        if (Object.keys(holdTimers).length === 0 && Object.keys(timers).length === 0) {
                            releaseWakeLock();
                        }

                        renderExercises();
                    }
                }, 1000);
            }, 10);
        }

        function subtractRep(index) {
            if (exercises[index].currentReps > 0) {
                exercises[index].currentReps--;
                saveData();
                renderExercises();
            }
        }

        function completeSet(index) {
            exercises[index].currentSet++;
            exercises[index].currentReps = 0;
            saveData();
            renderExercises();

            // Only start rest timer if there are more sets to do
            if (exercises[index].currentSet <= exercises[index].targetSets) {
                startRestTimer(index);
            } else {
                // Exercise complete - log to history
                logCompletion(exercises[index].name);
            }
        }

        function resetExercise(index) {
            exercises[index].currentSet = 1;
            exercises[index].currentReps = 0;
            if (timers[index]) {
                clearInterval(timers[index]);
                delete timers[index];
            }
            if (holdTimers[index]) {
                clearInterval(holdTimers[index]);
                delete holdTimers[index];
            }
            saveData();
            renderExercises();
        }

        function removeExercise(index) {
            if (confirm('Remove this exercise?')) {
                if (timers[index]) {
                    clearInterval(timers[index]);
                    delete timers[index];
                }
                if (holdTimers[index]) {
                    clearInterval(holdTimers[index]);
                    delete holdTimers[index];
                }
                exercises.splice(index, 1);
                saveData();
                renderExercises();
            }
        }

        function startRestTimer(index) {
            // Clear any existing timer
            if (timers[index]) {
                clearInterval(timers[index]);
            }

            let seconds = 60; // 60 second rest timer
            const timerElement = document.getElementById(`timer-${index}`);
            const displayElement = document.getElementById(`timer-display-${index}`);

            timerElement.classList.add('active');
            requestWakeLock();

            timers[index] = setInterval(() => {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                displayElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

                if (seconds <= 0) {
                    clearInterval(timers[index]);
                    delete timers[index];
                    timerElement.classList.remove('active');

                    // Play bell sound
                    playBell();

                    // Vibrate if supported
                    if (navigator.vibrate) {
                        navigator.vibrate([200, 100, 200]);
                    }

                    // Release wake lock if no more timers running
                    if (Object.keys(holdTimers).length === 0 && Object.keys(timers).length === 0) {
                        releaseWakeLock();
                    }
                } else {
                    seconds--;
                }
            }, 1000);
        }

        // Initialize the app
        renderExercises();
        renderHistory();
