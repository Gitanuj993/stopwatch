
let container = document.getElementById("container");
let titleInput = document.getElementById("titleInput");

let stopwatches = [];
let currentIndex = 0;
const SCREEN_HEIGHT = 520;

function createStopwatch() {

    let stopwatch = {
        title: "",
        time: 0,
        interval: null,
        running: false,
        laps: []
    };

    stopwatches.push(stopwatch);

    let div = document.createElement("div");
    div.className = "stopwatch";

    div.innerHTML = `
        <div class="circle">00:00:00</div>
        <div class="buttons">
            <div class="row">
                <button class="start">Start</button>
                <button class="add-btn">+</button>
            </div>
            <button class="dark-btn lap">Lap</button>
            <button class="dark-btn reset">Reset</button>
        </div>
        <div class="laps"></div>
    `;

    container.appendChild(div);

    let display = div.querySelector(".circle");
    let startBtn = div.querySelector(".start");
    let addBtn = div.querySelector(".add-btn");
    let lapBtn = div.querySelector(".lap");
    let resetBtn = div.querySelector(".reset");
    let lapContainer = div.querySelector(".laps");

    startBtn.onclick = function () {
        if (!stopwatch.running) {
            stopwatch.running = true;
            startBtn.textContent = "Pause";

            stopwatch.interval = setInterval(() => {
                stopwatch.time++;
                display.textContent = formatTime(stopwatch.time);
            }, 1000);

        } else {
            stopwatch.running = false;
            startBtn.textContent = "Start";
            clearInterval(stopwatch.interval);
        }
    };

    addBtn.onclick = createStopwatch;

    lapBtn.onclick = function () {
        if (!stopwatch.running) return;
        stopwatch.laps.unshift(formatTime(stopwatch.time));
        renderLaps();
    };

    function renderLaps() {
        lapContainer.innerHTML = "";
        stopwatch.laps.forEach((lap, index) => {
            let lapDiv = document.createElement("div");
            lapDiv.className = "lap-item";
            lapDiv.textContent =
                `Lap ${stopwatch.laps.length - index} - ${lap}`;
            lapContainer.appendChild(lapDiv);
        });
    }

    resetBtn.onclick = function () {
        stopwatch.running = false;
        clearInterval(stopwatch.interval);
        stopwatch.time = 0;
        stopwatch.laps = [];
        startBtn.textContent = "Start";
        display.textContent = "00:00:00";
        lapContainer.innerHTML = "";
    };

    currentIndex = stopwatches.length - 1;
    updateSlider();
    updateTitle();
}

titleInput.addEventListener("input", function() {
    if (stopwatches[currentIndex]) {
        stopwatches[currentIndex].title = this.value;
    }
});

function updateTitle() {
    if (stopwatches[currentIndex]) {
        titleInput.value = stopwatches[currentIndex].title;
    }
}

function formatTime(seconds) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    return (
        String(hrs).padStart(2, "0") + ":" +
        String(mins).padStart(2, "0") + ":" +
        String(secs).padStart(2, "0")
    );
}

function updateSlider() {
    container.style.transform =
        `translateY(-${currentIndex * SCREEN_HEIGHT}px)`;
    updateTitle();
}

/* Vertical Swipe */
let startY = 0;

document.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", e => {
    let diff = startY - e.changedTouches[0].clientY;

    if (diff > 50 && currentIndex < stopwatches.length - 1) {
        currentIndex++;
    }

    if (diff < -50 && currentIndex > 0) {
        currentIndex--;
    }

    updateSlider();
});

createStopwatch();
