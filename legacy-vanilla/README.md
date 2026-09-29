# DSA Visualizer — Algorithm Telemetry Console

An interactive, pure front-end (HTML/CSS/JavaScript, zero dependencies) visualizer for
sorting algorithms and pathfinding algorithms, styled as a "telemetry console" rather
than a generic dashboard.

## Features

**Sorting Visualizer**
- Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- Adjustable array size (10–150 bars) and animation speed
- Color-coded bar states: idle, comparing, swapping, sorted
- Live telemetry: comparison count, swap count, elapsed time, time complexity

**Pathfinding Visualizer**
- A* Search, Dijkstra, Breadth-First Search, Depth-First Search
- Click-and-drag grid to draw walls, or reposition Start/End nodes
- Random maze generator
- Live telemetry: visited-node count, elapsed time, time complexity

## Why it's a good resume project
- Zero backend, zero build step — runs by just opening `index.html`, and deploys
  for free on GitHub Pages in one click.
- Demonstrates actual understanding of DSA (not just a listed skill) — every
  algorithm is implemented from scratch as a step-generator, no libraries.
- Clean, distinctive UI/UX (custom design system, not a default template).

## Running it

Just open `index.html` in any modern browser. No install, no server required.

To deploy on GitHub Pages:
1. Push this folder to a GitHub repo.
2. Repo Settings → Pages → Deploy from branch → `main` / root.
3. Your live link: `https://<username>.github.io/<repo-name>/`

## Tech stack
- HTML5, CSS3 (custom properties, CSS Grid/Flexbox, no frameworks)
- Vanilla JavaScript (ES6+ generators for step-by-step algorithm playback)
- Google Fonts: Space Grotesk (display), JetBrains Mono (telemetry/data)

## File structure
```
dsa-visualizer/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── sorting.js       # sorting algorithms + bar rendering
│   ├── pathfinding.js   # pathfinding algorithms + grid rendering
│   └── main.js          # UI wiring, telemetry, mode switching
└── README.md
```

## Possible extensions (good talking points in interviews)
- Add Heap Sort / Radix Sort
- Weighted-edge pathfinding (variable terrain cost)
- Bidirectional BFS
- Export run stats as CSV
- Mobile touch-drag support for the grid
