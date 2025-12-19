const workMinEl = document.getElementById("work-min");
const breakMinEl = document.getElementById("break-min");
const autoStartEl = document.getElementById("auto-start");
const saveBtn = document.getElementById("save-btn");

chrome.storage.local.get(
  ["workMinutes", "breakMinutes", "autoStart"],
  (res) => {
    workMinEl.value = res.workMinutes || 25;
    breakMinEl.value = res.breakMinutes || 5;
    autoStartEl.checked = !!res.autoStart;
  }
);

saveBtn.addEventListener("click", () => {
  const w = Math.max(1, Math.min(60, Number(workMinEl.value) || 25));
  const b = Math.max(1, Math.min(60, Number(breakMinEl.value) || 5));
  const a = !!autoStartEl.checked;

  chrome.storage.local.set(
    { workMinutes: w, breakMinutes: b, autoStart: a },
    () => {
      chrome.storage.local.set({ timer: 0, mode: "work", isRunning: false });

      animateSaveButton();
    }
  );
});

function animateSaveButton() {
  const btn = saveBtn;

  btn.classList.add("saving");
  btn.textContent = "Saved!";

  setTimeout(() => {
    btn.classList.remove("saving");
    btn.textContent = "Save";
  }, 1200);
}
