// Elements
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start-timer-btn");
const resetBtn = document.getElementById("reset-timer-btn");
const addTaskBtn = document.getElementById("add-task-btn");
const taskContainer = document.getElementById("task-container");
const catWrap = document.getElementById("cat-wrap");
const audioInput = document.getElementById("audio-input");
const audioFilenameEl = document.getElementById("audio-filename");
const alarmAudio = document.getElementById("alarm-audio");

chrome.storage.local.get(["alarmAudioName"], (res) => {
  if (res.alarmAudioName) {
    audioFilenameEl.textContent = `✅ ${res.alarmAudioName}`;
  }
});

let tasks = [];

// Helper: format remaining time
function formatRemaining(timerSec, totalMinutes) {
  const totalSec = totalMinutes * 60;
  const remaining = Math.max(0, totalSec - timerSec);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

// Update UI every second
function updateUI() {
  chrome.storage.local.get(
    [
      "timer",
      "isRunning",
      "mode",
      "workMinutes",
      "breakMinutes",
      "lastSessionFinishedAt",
      "alarmAudio",
      "startTimestamp",
    ],
    (res) => {
      const isRunning = !!res.isRunning;
      const mode = res.mode || "work";
      const workMinutes = res.workMinutes || 25;
      const breakMinutes = res.breakMinutes || 5;

      // Set time text
      const totalMinutes = mode === "work" ? workMinutes : breakMinutes;
      let elapsedSeconds = res.timer || 0;
      if (isRunning && res.startTimestamp) {
        elapsedSeconds = Math.floor((Date.now() - res.startTimestamp) / 1000);
      }

      timeEl.textContent = formatRemaining(elapsedSeconds, totalMinutes);

      // Set button text
      startBtn.textContent = isRunning ? "Pause" : "Start";

      // Set cat state
      if (mode === "break") {
        catWrap.classList.add("break");
      } else {
        catWrap.classList.remove("break");
      }

      updateCat(mode);

      // Play sound if session just finished
      if (res.lastSessionFinishedAt) {
        const diff = Date.now() - res.lastSessionFinishedAt;
        if (diff < 2500) {
          if (res.alarmAudio) {
            alarmAudio.src = res.alarmAudio;
          }
          alarmAudio.currentTime = 0;
          alarmAudio.play().catch(() => {});
        }
      }
    }
  );
}

updateUI();
setInterval(updateUI, 1000);

function updateCat(mode) {
  const catImg = document.getElementById("cat-img");
  catImg.src =
    mode === "work" ? "../images/cat_work.gif" : "../images/cat7.gif";
}

// Start/Pause toggle
startBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning", "timer", "startTimestamp"], (res) => {
    if (!res.isRunning) {
      const now = Date.now();
      const elapsed = res.timer || 0;
      chrome.storage.local.set({
        isRunning: true,
        startTimestamp: now - elapsed * 1000,
      });
    } else {
      chrome.storage.local.set({
        isRunning: false,
      });
    }
  });
});

// Reset button
resetBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    isRunning: false,
    startTimestamp: null,
  });
});

// Tasks: load and display
chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks || [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({ tasks });
}

function renderTask(taskNum) {
  const taskRow = document.createElement("div");
  taskRow.style.display = "flex";
  taskRow.style.gap = "6px";

  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task...";
  text.value = tasks[taskNum] || "";
  text.className = "task-name";
  text.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = text.value.trim();
      if (!value) return;
      tasks[taskNum] = value;
      saveTasks();
      if (taskNum === tasks.length - 1) {
        tasks.push("");
        saveTasks();
        renderTasks();
        setTimeout(() => {
          const inputs = document.querySelectorAll(".task-name");
          inputs[inputs.length - 1]?.focus();
        }, 0);
      }
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.style.width = "32px";
  deleteBtn.addEventListener("click", () => {
    tasks.splice(taskNum, 1);
    renderTasks();
    saveTasks();
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);
  taskContainer.appendChild(taskRow);
}

function renderTasks() {
  taskContainer.textContent = "";
  tasks.forEach((_, i) => renderTask(i));
}

addTaskBtn.addEventListener("click", () => {
  tasks.push("");
  renderTasks();
  saveTasks();
});

// Audio upload: store as DataURL in storage
audioInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  audioFilenameEl.textContent = "Uploading...";

  const reader = new FileReader();
  reader.onload = function (ev) {
    const dataUrl = ev.target.result;
    chrome.storage.local.set(
      { alarmAudio: dataUrl, alarmAudioName: file.name },
      () => {
        alarmAudio.src = dataUrl;
        audioFilenameEl.textContent = `✅ ${file.name}`;
      }
    );
  };

  reader.readAsDataURL(file);
});
