# Pawmodoro 🐾

A cute Pomodoro timer with a cat that keeps you focused — and reminds you to rest.

## What is Pawmodoro?

Pawmodoro is a minimalist Pomodoro Chrome extension designed to help you stay focused without feeling pressured or overwhelmed.

You work.  
You rest.  
A cute cat keeps you company along the way.

The extension is intentionally simple, calm, and distraction-free — perfect for deep work sessions, studying, or mindful productivity.

---

## Features

- ⏱️ Custom Pomodoro intervals  
  Set work and break times from **1 to 60 minutes** — not just the standard 25/5.

- 🔔 Custom alarm sound  
  Upload your own **MP3 file** to use as a notification sound.

- 🐱 Cute cat companion  
  Different cat visuals for **work** and **break** states.

- 💾 Local-only storage  
  All settings are stored locally using Chrome Storage.  
  No accounts, no tracking, no data collection.

- 🎯 Clean and simple UI  
  Minimal design focused on clarity and ease of use.

---

## Privacy

Pawmodoro respects your privacy.

- No personal data is collected
- No browsing activity is tracked
- No analytics or third-party services are used
- All data stays inside your browser

You can read the full Privacy Policy here:  
👉 https://waleriaqa.github.io/pawmodoro-privacy/

---

## Tech Stack

- Vanilla JavaScript
- HTML / CSS
- Chrome Extension APIs (Manifest V3)
- Chrome Storage, Alarms, Notifications

No frameworks, no dependencies — simple and transparent.

---

## Installation (Development)

- Clone or download this repository
- Open chrome://extensions
- Enable Developer mode
- Click Load unpacked
- Select the project folder

## Project Structure (simplified)

```text
pawmodoro/
├── assets/              # Store assets (promo images, screenshots for Chrome Web Store)
├── images/              # UI images (cats, illustrations used in popup and options)
├── options/             # Options page (settings UI and logic)
├── popup/               # Popup UI shown when clicking the extension icon
├── background.js        # Background logic (timer, alarms, notifications)
├── icon.png             # Main extension icon (used by Chrome and the Web Store)
├── icon1.png            # Alternative / additional icon size or variant
├── manifest.json        # Extension manifest (metadata, permissions, entry points)
└── README.md            # Project documentation and overview
```

## Future Ideas

- Some features planned or under consideration:
- Dark theme toggle
- Gentle reminders (morning / evening / every N hours)
- Custom themes
- Basic productivity statistics
- These features may be introduced gradually after the extension reaches an initial user base

❤️ Author
Created with care by an indie developer who loves productivity tools and cats 😻🍅🐾
