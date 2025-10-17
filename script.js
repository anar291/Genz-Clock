document.addEventListener('DOMContentLoaded', () => {
    // --- General UI Elements ---
    const navButtons = document.querySelectorAll('.nav-button');
    const views = document.querySelectorAll('.view');

    // --- Clock Elements ---
    const clockTime = document.getElementById('clock-time');
    const clockDate = document.getElementById('clock-date');

    // --- Stopwatch Elements ---
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const swStartStopBtn = document.getElementById('sw-start-stop-btn');
    const swLapResetBtn = document.getElementById('sw-lap-reset-btn');
    const lapsContainer = document.getElementById('laps-container');

    // --- Timer Elements ---
    const timerDisplay = document.getElementById('timer-display');
    const timerSetup = document.getElementById('timer-setup');
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const timerStartStopBtn = document.getElementById('timer-start-stop-btn');
    const timerCancelBtn = document.getElementById('timer-cancel-btn');

    // --- State Variables ---
    let clockInterval;
    let stopwatchInterval;
    let timerInterval;
    let swState = { running: false, startTime: 0, elapsedTime: 0, laps: [] };
    let timerState = { running: false, totalSeconds: 0 };
    
    // --- NAVIGATION LOGIC ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetView = button.dataset.view;

            // Update button styles
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show the target view
            views.forEach(view => {
                if (view.id === `${targetView}-view`) {
                    view.classList.remove('hidden');
                    view.classList.add('active-view');
                } else {
                    view.classList.add('hidden');
                    view.classList.remove('active-view');
                }
            });
        });
    });

    // --- CLOCK LOGIC ---
    function updateClock() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        clockTime.textContent = now.toLocaleTimeString();
        clockDate.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // --- STOPWATCH LOGIC ---
    function formatStopwatchTime(ms) {
        const date = new Date(ms);
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0').slice(0, 2);
        return `${minutes}:${seconds}.${milliseconds}`;
    }

    function renderLaps() {
        lapsContainer.innerHTML = '';
        swState.laps.forEach((lap, index) => {
            const lapEl = document.createElement('div');
            lapEl.className = 'lap-item';
            lapEl.innerHTML = `<span>Lap ${index + 1}</span><span>${lap}</span>`;
            lapsContainer.prepend(lapEl);
        });
    }

    swStartStopBtn.addEventListener('click', () => {
        swState.running = !swState.running;
        if (swState.running) {
            swState.startTime = Date.now() - swState.elapsedTime;
            stopwatchInterval = setInterval(() => {
                swState.elapsedTime = Date.now() - swState.startTime;
                stopwatchDisplay.textContent = formatStopwatchTime(swState.elapsedTime);
            }, 10);
            swStartStopBtn.textContent = 'Pause';
            swStartStopBtn.classList.add('pause');
            swLapResetBtn.textContent = 'Lap';
            swLapResetBtn.disabled = false;
        } else {
            clearInterval(stopwatchInterval);
            swStartStopBtn.textContent = 'Start';
            swStartStopBtn.classList.remove('pause');
            swLapResetBtn.textContent = 'Reset';
        }
    });

    swLapResetBtn.addEventListener('click', () => {
        if (swState.running) { // Lap functionality
            swState.laps.push(formatStopwatchTime(swState.elapsedTime));
            renderLaps();
        } else { // Reset functionality
            swState = { running: false, startTime: 0, elapsedTime: 0, laps: [] };
            stopwatchDisplay.textContent = '00:00.00';
            swLapResetBtn.textContent = 'Reset';
            swLapResetBtn.disabled = true;
            renderLaps();
        }
    });

    // --- TIMER LOGIC ---
    function formatTimerDisplay(totalSeconds) {
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    timerStartStopBtn.addEventListener('click', () => {
        if (!timerState.running && timerState.totalSeconds === 0) { // First start
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            timerState.totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
            if (timerState.totalSeconds <= 0) return;
        }

        timerState.running = !timerState.running;

        if (timerState.running) {
            timerSetup.classList.add('hidden');
            timerDisplay.classList.remove('hidden');
            timerStartStopBtn.textContent = 'Pause';
            timerStartStopBtn.classList.add('pause');
            timerCancelBtn.classList.remove('hidden');
            timerInterval = setInterval(() => {
                timerState.totalSeconds--;
                timerDisplay.textContent = formatTimerDisplay(timerState.totalSeconds);
                if (timerState.totalSeconds <= 0) {
                    clearInterval(timerInterval);
                    alert('Timer finished!');
                    // Reset state
                    timerState = { running: false, totalSeconds: 0 };
                    timerDisplay.classList.add('hidden');
                    timerSetup.classList.remove('hidden');
                    timerStartStopBtn.textContent = 'Start';
                    timerStartStopBtn.classList.remove('pause');
                    timerCancelBtn.classList.add('hidden');
                }
            }, 1000);
        } else {
            clearInterval(timerInterval);
            timerStartStopBtn.textContent = 'Start';
            timerStartStopBtn.classList.remove('pause');
        }
    });
    
    timerCancelBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerState = { running: false, totalSeconds: 0 };
        timerDisplay.classList.add('hidden');
        timerSetup.classList.remove('hidden');
        timerStartStopBtn.textContent = 'Start';
        timerStartStopBtn.classList.remove('pause');
        timerCancelBtn.classList.add('hidden');
        timerDisplay.textContent = '00:00';
    });


    // --- INITIALIZE ---
    function initialize() {
        // Start the main clock
        clockInterval = setInterval(updateClock, 1000);
        updateClock();
    }

    initialize();
});