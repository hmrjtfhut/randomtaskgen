document.addEventListener("DOMContentLoaded", () => {
    const tasks = {
        easy: ["Task 1 (Easy)", "Task 2 (Easy)"],
        medium: ["Task 1 (Medium)", "Task 2 (Medium)"],
        hard: ["Task 1 (Hard)", "Task 2 (Hard)"],
        impossible: ["Task 1 (Impossible)", "Task 2 (Impossible)"]
    };

    const pointsDisplay = document.getElementById("points-display");
    const getTaskBtn = document.getElementById("get-task-btn");
    const completeTaskBtn = document.getElementById("complete-task-btn");
    const taskDisplay = document.getElementById("task-display");
    const settingsBtn = document.getElementById("settings-btn");
    const infoBtn = document.getElementById("info-btn");
    const settingsPopup = document.getElementById("settings-popup");
    const infoPopup = document.getElementById("info-popup");
    const volumeSlider = document.getElementById("volume-slider");
    const backgroundMusic = document.getElementById("background-music");

    let points = parseInt(localStorage.getItem("points")) || 0;
    let currentTask = localStorage.getItem("currentTask");
    let timerEndTime = localStorage.getItem("timerEndTime");

    pointsDisplay.textContent = `Points: ${points}`;

    if (currentTask) {
        taskDisplay.textContent = currentTask;
        updateTimer();
    }

    function savePoints() {
        localStorage.setItem("points", points);
    }

    function getRandomTask(difficulty) {
        const taskArray = tasks[difficulty];
        const randomIndex = Math.floor(Math.random() * taskArray.length);
        return taskArray[randomIndex];
    }

    function startTimer(duration) {
        const now = Date.now();
        timerEndTime = now + duration;
        localStorage.setItem("timerEndTime", timerEndTime);
        updateTimer();
    }

    function updateTimer() {
        const now = Date.now();
        if (timerEndTime && now < timerEndTime) {
            const timeRemaining = timerEndTime - now;
            const minutes = Math.floor(timeRemaining / 60000);
            const seconds = Math.floor((timeRemaining % 60000) / 1000);
            completeTaskBtn.textContent = `Complete Task (${minutes}:${seconds < 10 ? "0" : ""}${seconds})`;
            completeTaskBtn.disabled = true;
            requestAnimationFrame(updateTimer);
        } else {
            completeTaskBtn.textContent = "Complete Task";
            completeTaskBtn.disabled = false;
        }
    }

    function openPopup(popupId) {
        document.getElementById(popupId).classList.add("visible");
    }

    function closePopup(popupId) {
        document.getElementById(popupId).classList.remove("visible");
    }

    function resetTask() {
        currentTask = null;
        taskDisplay.textContent = "";
        localStorage.removeItem("currentTask");
        localStorage.removeItem("timerEndTime");
        completeTaskBtn.textContent = "Complete Task";
        completeTaskBtn.disabled = true;
    }

    getTaskBtn.addEventListener("click", () => {
        if (!currentTask) {
            const difficulties = ["easy", "medium", "hard", "impossible"];
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            currentTask = getRandomTask(difficulty);
            taskDisplay.textContent = currentTask;
            localStorage.setItem("currentTask", currentTask);

            let duration;
            switch (difficulty) {
                case "easy":
                    duration = 10 * 60 * 1000;
                    break;
                case "medium":
                    duration = 30 * 60 * 1000;
                    break;
                case "hard":
                    duration = 60 * 60 * 1000;
                    break;
                case "impossible":
                    taskDisplay.textContent += " - The rest of your life";
                    return;
                default:
                    duration = 0;
            }
            startTimer(duration);
        }
    });

    completeTaskBtn.addEventListener("click", () => {
        if (!completeTaskBtn.disabled && currentTask) {
            points++;
            savePoints();
            pointsDisplay.textContent = `Points: ${points}`;
            resetTask();
        }
    });

    settingsBtn.addEventListener("click", () => {
        openPopup("settings-popup");
    });

    infoBtn.addEventListener("click", () => {
        openPopup("info-popup");
    });

    volumeSlider.addEventListener("input", () => {
        const volume = volumeSlider.value / 100;
        backgroundMusic.volume = volume;
    });

    document.addEventListener("mousemove", () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
        }
    });

    document.addEventListener("click", () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
        }
    });
});
