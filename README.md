# PT Tracker

A simple, mobile-friendly Progressive Web App (PWA) for tracking physical therapy exercises, reps, sets, and rest periods.

**Live Demo:** [https://dave.ly/tools/pt-tracker/](https://dave.ly/tools/pt-tracker/)

## Features

- **Rep & Set Tracking** - Count reps and sets with configurable targets
- **Hold Timer** - For exercises requiring timed holds (e.g., planks)
- **Rest Timer** - 60-second countdown between sets with audio notification
- **History Log** - Track completed exercises grouped by day
- **Offline Support** - Works without internet after first visit
- **Installable** - Add to home screen on iOS/Android for full-screen app experience
- **Dark Mode** - Automatically matches system theme
- **Wake Lock** - Prevents screen from sleeping during timers

## Tech Stack

- Vanilla HTML, CSS, JavaScript (no frameworks)
- Progressive Web App (PWA) with Service Worker
- Web Audio API for timer sounds
- Screen Wake Lock API
- localStorage for data persistence
- Vitest for testing

## Installation

### As a Web App (Recommended)

1. Visit the live demo URL on your mobile device
2. **iOS:** Tap Share > "Add to Home Screen"
3. **Android:** Tap menu > "Add to Home Screen" or "Install"

### Self-Hosting

1. Clone this repository
2. Serve the files from any static web server (requires HTTPS for PWA features)
3. Update `manifest.json` with your deployment path:
   - `start_url`: Your app's URL path
   - `scope`: Your app's URL path

## Development

### Running Development Server

```bash
npm install
npm run dev
```

This will start a local server at `http://localhost:3000` and automatically open your browser.

### Running Tests

```bash
npm test
```

Run tests with the Vitest UI:
```bash
npm run test:ui
```

## Files

```
pt-tracker/
├── src/
│   ├── index.html      # Main app HTML
│   ├── app.js          # Application logic
│   ├── manifest.json   # PWA manifest
│   ├── sw.js           # Service worker for offline support
│   └── icon.png        # App icon (512x512)
├── tests/
│   └── example.test.js # Example tests
├── vitest.config.js    # Vitest configuration
├── package.json        # NPM dependencies
└── README.md
```

## Privacy

All data is stored locally in your browser's localStorage. Nothing is sent to any server. Each device/browser has its own separate data.

- No accounts required
- No cookies
- No tracking
- No analytics
- 100% private

## License

MIT
