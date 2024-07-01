// Amount of timers made.
let timerCount = 0;
// Index of each timer.
let timers = [null];
// The time within each timer.
let times = [0, 0];

function updateDisplay(timerNumber) {
    // Finds element via 'display' + number
    const display = document.getElementById(`display${timerNumber}`);
    const time = times[timerNumber - 1];
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    display.textContent = `${hours}:${minutes}:${seconds}`;
}

function toggleTimer(timerNumber) {
    const button = document.getElementById(`toggleBtn${timerNumber}`);
    /*
        Fucky-wucky JavaScript logic below:
        
        timers[]
    */


    if (timers[timerNumber - 1]) {
        stopTimer(timerNumber);
        button.textContent = 'Start';
    } else {
        startTimer(timerNumber);
        button.textContent = 'Stop';
    }
}

function startTimer(timerNumber) {
    if (timers[timerNumber - 1]) return;
    timers[timerNumber - 1] = setInterval(() => {
        times[timerNumber - 1]++;
        updateDisplay(timerNumber);
    }, 1000);
}

function stopTimer(timerNumber) {
    clearInterval(timers[timerNumber - 1]);
    timers[timerNumber - 1] = null;
}

function resetTimer(timerNumber) {
    stopTimer(timerNumber);
    times[timerNumber - 1] = 0;
    updateDisplay(timerNumber);
}

function changeColor(timerNumber) {
    const colorInput = document.getElementById(`color${timerNumber}`);
    const timerDiv = document.getElementById(`timer${timerNumber}`);
    const color = colorInput.value;
    timerDiv.style.backgroundColor = color;
    const textColor = isColorDark(color) ? 'white' : 'black';

    // Update text color of display and buttons
    const display = timerDiv.querySelector(`#display${timerNumber}`);
    display.style.color = textColor;

    const buttons = timerDiv.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.color = textColor;
        button.style.borderColor = textColor;
    });

    // Update input type color style
    colorInput.style.backgroundColor = color;
}

function isColorDark(color) {
    const rgb = parseInt(color.substring(1), 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 128; // Threshold for determining dark color
}

// Function to add a new timer
function addTimer() {
    timerCount++;
    timers.push(null);
    times.push(0);

    const timerContainer = document.getElementById('timers-container');

    // Generate initial random color
    const backgroundColor = getRandomColor();
    const textColor = isColorDark(backgroundColor) ? 'white' : 'black';

    // Create timer HTML using the template function
    const timerHTML = createTimerHTML(timerCount, backgroundColor, textColor);

    // Append timer HTML to container
    timerContainer.insertAdjacentHTML('beforeend', timerHTML);

    // Ensure initial display color matches background color
    const display = document.getElementById(`display${timerCount}`);
    display.style.color = textColor;
}

function removeTimer() {
    if (timerCount > 0) {
        const timerContainer = document.getElementById('timers-container');
        const timerToRemove = document.getElementById(`timer${timerCount}`);
        
        timerContainer.removeChild(timerToRemove);

        stopTimer(timerCount);
        timers.pop();
        times.pop();
        timerCount--;
    }
}

function handleNameKeydown(event, timerNumber) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const nameElement = document.getElementById(`name${timerNumber}`);
        nameElement.blur(); // Exit the contenteditable field
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function renameTimer(timerNumber) {
    const nameElement = document.getElementById(`name${timerNumber}`);
    const newName = nameElement.textContent.trim();
    if (newName !== '') {
        nameElement.textContent = newName;
    } else {
        nameElement.textContent = `Timer ${timerNumber}`;
    }
}

// Template for timer HTML
function createTimerHTML(timerCount, backgroundColor, textColor) {
    return `
        <div class="timer" id="timer${timerCount}" style="background-color: ${backgroundColor}; color: ${textColor};">
            <input type="text" id="name${timerCount}" value="Timer ${timerCount}" class="timer-title" onchange="renameTimer(${timerCount})">
            <p id="display${timerCount}">00:00:00</p>
            <button id="toggleBtn${timerCount}" style="color: ${textColor}; border-color: ${textColor}" onclick="toggleTimer(${timerCount})">Start</button>
            <button style="color: ${textColor}; border-color: ${textColor}" onclick="resetTimer(${timerCount})">Reset</button>
            <br><br>
            <label for="color${timerCount}" style="color: ${textColor};">Select Color:</label>
            <input type="color" id="color${timerCount}" value="${backgroundColor}" onchange="changeColor(${timerCount})">
        </div>
    `;
}