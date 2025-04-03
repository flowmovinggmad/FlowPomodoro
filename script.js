const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const settingsBtn = document.getElementById('settings-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const settingsOverlay = document.getElementById('settings-overlay');
const closeSettingsBtn = document.getElementById('close-settings');
const resetAllBtn = document.getElementById('reset-all-btn');

// Timer settings inputs
const pomodoroDurationInput = document.getElementById('pomodoro-duration');
const shortBreakDurationInput = document.getElementById('short-break-duration');
const longBreakDurationInput = document.getElementById('long-break-duration');
const longBreakIntervalInput = document.getElementById('long-break-interval');

// Timer durations in seconds
let POMODORO_TIME = 25 * 60;
let SHORT_BREAK_TIME = 5 * 60;
let LONG_BREAK_TIME = 15 * 60;

let timeLeft = POMODORO_TIME;
let timerId = null;
let isRunning = false;
let currentMode = 'pomodoro';

// Load saved timer settings
function loadTimerSettings() {
    const savedSettings = {
        pomodoro: localStorage.getItem('pomodoroDuration') || 25,
        shortBreak: localStorage.getItem('shortBreakDuration') || 5,
        longBreak: localStorage.getItem('longBreakDuration') || 15
    };

    pomodoroDurationInput.value = savedSettings.pomodoro;
    shortBreakDurationInput.value = savedSettings.shortBreak;
    longBreakDurationInput.value = savedSettings.longBreak;

    POMODORO_TIME = savedSettings.pomodoro * 60;
    SHORT_BREAK_TIME = savedSettings.shortBreak * 60;
    LONG_BREAK_TIME = savedSettings.longBreak * 60;

    // Update current timer if needed
    if (!isRunning) {
        timeLeft = getCurrentModeTime();
        updateDisplay();
    }
}

// Save timer settings
function saveTimerSettings() {
    localStorage.setItem('pomodoroDuration', pomodoroDurationInput.value);
    localStorage.setItem('shortBreakDuration', shortBreakDurationInput.value);
    localStorage.setItem('longBreakDuration', longBreakDurationInput.value);

    POMODORO_TIME = pomodoroDurationInput.value * 60;
    SHORT_BREAK_TIME = shortBreakDurationInput.value * 60;
    LONG_BREAK_TIME = longBreakDurationInput.value * 60;

    // Update current timer if not running
    if (!isRunning) {
        timeLeft = getCurrentModeTime();
        updateDisplay();
    }
}

function getCurrentModeTime() {
    switch(currentMode) {
        case 'pomodoro':
            return POMODORO_TIME;
        case 'short-break':
            return SHORT_BREAK_TIME;
        case 'long-break':
            return LONG_BREAK_TIME;
        default:
            return POMODORO_TIME;
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (isRunning) {
        clearInterval(timerId);
        startBtn.textContent = 'start';
        isRunning = false;
        return;
    }

    isRunning = true;
    startBtn.textContent = 'pause';
    
    timerId = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerId);
            isRunning = false;
            startBtn.textContent = 'start';
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    startBtn.textContent = 'start';
    timeLeft = getCurrentModeTime();
    updateDisplay();
}

function switchMode(e) {
    const mode = e.target.dataset.mode;
    currentMode = mode;
    modeBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    clearInterval(timerId);
    isRunning = false;
    startBtn.textContent = 'start';

    timeLeft = getCurrentModeTime();
    updateDisplay();
}

// Settings functionality
const themeSelect = document.getElementById('theme-select');

function toggleSettings() {
    settingsOverlay.classList.add('show');
}

function closeSettings() {
    settingsOverlay.classList.remove('show');
}

// Reset all settings
function resetAllSettings() {
    // Reset theme
    themeSelect.value = '';
    document.body.style.backgroundImage = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    
    // Remove blur div if it exists
    const blurElement = document.querySelector('.bg-blur');
    if (blurElement) blurElement.remove();
    
    // Reset timer settings
    pomodoroDurationInput.value = '25';
    shortBreakDurationInput.value = '5';
    longBreakDurationInput.value = '15';
    longBreakIntervalInput.value = '4';
    
    // Clear all localStorage
    localStorage.clear();
    
    // Reset timer durations
    POMODORO_TIME = 25 * 60;
    SHORT_BREAK_TIME = 5 * 60;
    LONG_BREAK_TIME = 15 * 60;
    
    // Reset timer to pomodoro mode
    currentMode = 'pomodoro';
    modeBtns.forEach(btn => btn.classList.remove('active'));
    modeBtns[0].classList.add('active');
    timeLeft = POMODORO_TIME;
    clearInterval(timerId);
    isRunning = false;
    startBtn.textContent = 'start';
    updateDisplay();
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
modeBtns.forEach(btn => btn.addEventListener('click', switchMode));
settingsBtn.addEventListener('click', toggleSettings);
closeSettingsBtn.addEventListener('click', closeSettings);
resetAllBtn.addEventListener('click', resetAllSettings);

// Timer settings event listeners
pomodoroDurationInput.addEventListener('change', saveTimerSettings);
shortBreakDurationInput.addEventListener('change', saveTimerSettings);
longBreakDurationInput.addEventListener('change', saveTimerSettings);

// Preload images
const themeImages = {
    'GreenJapan': '/FlowPomodoro/themes/GreenJapan.jpg',
    'Evening': '/FlowPomodoro/themes/Evening.jpg',
    'Library': '/FlowPomodoro/themes/Library.png'
};

// Preload all theme images
Object.values(themeImages).forEach(src => {
    const img = new Image();
    img.src = src;
});

// Theme handling
themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    if (selectedTheme) {
        // Remove existing blur div if present
        const existingBlur = document.querySelector('.bg-blur');
        if (existingBlur) existingBlur.remove();
        
        // Create and insert blur div at the start of body
        const blurDiv = document.createElement('div');
        blurDiv.className = 'bg-blur';
        document.body.insertBefore(blurDiv, document.body.firstChild);
        
        // Apply background with loading state
        document.body.style.transition = 'none';
        blurDiv.style.transition = 'none';
        document.body.style.opacity = '0.5';
        
        // Create a new image to check loading
        const img = new Image();
        img.onload = () => {
            // Set background on both body and blur div
            document.body.style.backgroundImage = `url(${selectedTheme})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            blurDiv.style.backgroundImage = `url(${selectedTheme})`;
            blurDiv.style.backgroundSize = 'cover';
            blurDiv.style.backgroundPosition = 'center';
            
            // Fade in smoothly
            requestAnimationFrame(() => {
                document.body.style.transition = 'opacity 0.3s ease';
                document.body.style.opacity = '1';
            });
            
            // Save theme preference
            localStorage.setItem('selectedTheme', selectedTheme);
        };
        img.src = selectedTheme;
    } else {
        document.body.style.backgroundImage = '';
        const blurElement = document.querySelector('.bg-blur');
        if (blurElement) blurElement.remove();
        localStorage.removeItem('selectedTheme');
    }
});

// Load saved theme on startup
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        themeSelect.value = savedTheme;
        // Trigger change event to load the theme
        themeSelect.dispatchEvent(new Event('change'));
    }
});

// Background image functionality
const setBgBtn = document.getElementById('set-bg-btn');
const removeBgBtn = document.getElementById('remove-bg-btn');
const bgInput = document.getElementById('bg-input');
let bgWrapper = null;

// Create background wrapper if it doesn't exist
function ensureBgWrapper() {
    if (!bgWrapper) {
        bgWrapper = document.createElement('div');
        bgWrapper.className = 'bg-wrapper';
        document.body.insertBefore(bgWrapper, document.body.firstChild);
    }
    return bgWrapper;
}

setBgBtn.addEventListener('click', () => {
    bgInput.click();
});

bgInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const wrapper = ensureBgWrapper();
            wrapper.style.backgroundImage = `url(${e.target.result})`;
            wrapper.classList.remove('fade-out');
            document.body.classList.add('has-bg');
            
            // Save to localStorage
            localStorage.setItem('pomodoroBackground', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

removeBgBtn.addEventListener('click', () => {
    if (bgWrapper) {
        bgWrapper.classList.add('fade-out');
        
        // Remove background and classes after animation
        setTimeout(() => {
            bgWrapper.remove();
            bgWrapper = null;
            document.body.classList.remove('has-bg');
            localStorage.removeItem('pomodoroBackground');
        }, 500); // Match the CSS transition duration
    }
});

// Load saved background on page load
window.addEventListener('load', () => {
    const savedBg = localStorage.getItem('pomodoroBackground');
    if (savedBg) {
        const wrapper = ensureBgWrapper();
        wrapper.style.backgroundImage = `url(${savedBg})`;
        document.body.classList.add('has-bg');
    }
}); 