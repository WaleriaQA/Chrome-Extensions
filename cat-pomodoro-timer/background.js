// Run the alarm every second (periodInMinutes = 1/60)
chrome.alarms.create("pomodoro_tick", { periodInMinutes: 1 / 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "pomodoro_tick") return;

  chrome.storage.local.get(
    [
      "timer",
      "isRunning",
      "mode",
      "workMinutes",
      "breakMinutes",
      "sessionsCompleted",
      "autoStart",
    ],
    (res) => {
      const timer = "timer" in res ? res.timer : 0;
      const isRunning = "isRunning" in res ? res.isRunning : false;
      const mode = res.mode || "work"; // 'work' or 'break'
      const workMinutes = res.workMinutes || 25;
      const breakMinutes = res.breakMinutes || 5;
      const sessionsCompleted = res.sessionsCompleted || 0;
      const autoStart = res.autoStart || false;

      if (!isRunning) return;

      let newTimer = timer + 1;
      const targetSeconds = (mode === "work" ? workMinutes : breakMinutes) * 60;

      if (newTimer >= targetSeconds) {
        // Session finished
        const nextMode = mode === "work" ? "break" : "work";
        const updatedSessions =
          mode === "work" ? sessionsCompleted + 1 : sessionsCompleted;

        // Create notification
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: mode === "work" ? "Work session finished" : "Break finished",
          message:
            mode === "work"
              ? `You finished ${workMinutes} minutes. Time for a break!`
              : `Break of ${breakMinutes} minutes finished. Time to work!`,
        });

        // Save new state. If autoStart true — keep isRunning true, else pause.
        chrome.storage.local.set({
          timer: 0,
          mode: nextMode,
          isRunning: !!autoStart,
          sessionsCompleted: updatedSessions,
          lastSessionFinishedAt: Date.now(),
        });
      } else {
        // just update timer
        chrome.storage.local.set({
          timer: newTimer,
        });
      }
    }
  );
});

// Initialize defaults on install / startup
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(
    [
      "timer",
      "isRunning",
      "mode",
      "workMinutes",
      "breakMinutes",
      "sessionsCompleted",
      "autoStart",
    ],
    (res) => {
      chrome.storage.local.set({
        timer: "timer" in res ? res.timer : 0,
        isRunning: "isRunning" in res ? res.isRunning : false,
        mode: "mode" in res ? res.mode : "work",
        workMinutes: "workMinutes" in res ? res.workMinutes : 25,
        breakMinutes: "breakMinutes" in res ? res.breakMinutes : 5,
        sessionsCompleted:
          "sessionsCompleted" in res ? res.sessionsCompleted : 0,
        autoStart: "autoStart" in res ? res.autoStart : false,
      });
    }
  );
});
