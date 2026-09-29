/* ============================================
   PATHFINDING VISUALIZER
   ============================================ */

const PathfindingModule = (() => {
  const ROWS = 15;
  const COLS = 32;

  let gridEl = null;
  let cells = [];          // DOM refs [row][col]
  let grid = [];           // logical state: 'empty' | 'wall'
  let start = { r: 7, c: 4 };
  let end = { r: 7, c: 27 };
  let drawMode = 'wall';
  let isMouseDown = false;
  let running = false;
  let stopRequested = false;

  const complexities = {
    astar: 'O(E)',
    dijkstra: 'O(E log V)',
    bfs: 'O(V + E)',
    dfs: 'O(V + E)',
  };

  function init(container) {
    gridEl = container;
    gridEl.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
    build();

    gridEl.addEventListener('mousedown', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      isMouseDown = true;
      handleCellAction(+cell.dataset.r, +cell.dataset.c);
    });
    gridEl.addEventListener('mouseover', (e) => {
      if (!isMouseDown) return;
      const cell = e.target.closest('.cell');
      if (!cell) return;
      handleCellAction(+cell.dataset.r, +cell.dataset.c, true);
    });
    document.addEventListener('mouseup', () => { isMouseDown = false; });
  }

  function build() {
    gridEl.innerHTML = '';
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill('empty'));
    cells = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const div = document.createElement('div');
        div.className = 'cell';
        div.dataset.r = r;
        div.dataset.c = c;
        gridEl.appendChild(div);
        cells[r][c] = div;
      }
    }
    paintEndpoints();
  }

  function paintEndpoints() {
    cells[start.r][start.c].classList.add('start');
    cells[end.r][end.c].classList.add('end');
  }

  function setDrawMode(mode) { drawMode = mode; }

  function handleCellAction(r, c, isDrag = false) {
    if (running) return;
    if (drawMode === 'wall') {
      if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) return;
      const isWall = grid[r][c] === 'wall';
      grid[r][c] = isWall ? 'empty' : 'wall';
      cells[r][c].classList.toggle('wall', !isWall);
    } else if (drawMode === 'start' && !isDrag) {
      cells[start.r][start.c].classList.remove('start');
      start = { r, c };
      grid[r][c] = 'empty';
      cells[r][c].classList.remove('wall');
      cells[r][c].classList.add('start');
    } else if (drawMode === 'end' && !isDrag) {
      cells[end.r][end.c].classList.remove('end');
      end = { r, c };
      grid[r][c] = 'empty';
      cells[r][c].classList.remove('wall');
      cells[r][c].classList.add('end');
    }
  }

  function clearGrid() {
    build();
  }

  function randomMaze() {
    build();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) continue;
        if (Math.random() < 0.28) {
          grid[r][c] = 'wall';
          cells[r][c].classList.add('wall');
        }
      }
    }
  }

  function clearPathVisuals() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        cells[r][c].classList.remove('visited', 'path');
      }
    }
  }

  function neighbors(r, c) {
    const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const result = [];
    for (const [dr, dc] of deltas) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] !== 'wall') {
        result.push([nr, nc]);
      }
    }
    return result;
  }

  function key(r, c) { return r + ',' + c; }

  /* ---------- Generators yielding {type:'visit'|'path', r, c} ---------- */

  function* bfs() {
    const visited = new Set([key(start.r, start.c)]);
    const queue = [[start.r, start.c]];
    const prev = new Map();
    while (queue.length) {
      const [r, c] = queue.shift();
      if (r !== start.r || c !== start.c) yield { type: 'visit', r, c };
      if (r === end.r && c === end.c) { yield* buildPath(prev); return; }
      for (const [nr, nc] of neighbors(r, c)) {
        const k = key(nr, nc);
        if (!visited.has(k)) {
          visited.add(k);
          prev.set(k, [r, c]);
          queue.push([nr, nc]);
        }
      }
    }
  }

  function* dfs() {
    const visited = new Set([key(start.r, start.c)]);
    const stack = [[start.r, start.c]];
    const prev = new Map();
    while (stack.length) {
      const [r, c] = stack.pop();
      if (r !== start.r || c !== start.c) yield { type: 'visit', r, c };
      if (r === end.r && c === end.c) { yield* buildPath(prev); return; }
      for (const [nr, nc] of neighbors(r, c)) {
        const k = key(nr, nc);
        if (!visited.has(k)) {
          visited.add(k);
          prev.set(k, [r, c]);
          stack.push([nr, nc]);
        }
      }
    }
  }

  function* dijkstra() {
    const dist = new Map();
    dist.set(key(start.r, start.c), 0);
    const visited = new Set();
    const prev = new Map();
    // simple priority queue via array (grid is small, fine for teaching purposes)
    const pq = [[0, start.r, start.c]];

    while (pq.length) {
      pq.sort((a, b) => a[0] - b[0]);
      const [d, r, c] = pq.shift();
      const k = key(r, c);
      if (visited.has(k)) continue;
      visited.add(k);
      if (r !== start.r || c !== start.c) yield { type: 'visit', r, c };
      if (r === end.r && c === end.c) { yield* buildPath(prev); return; }

      for (const [nr, nc] of neighbors(r, c)) {
        const nk = key(nr, nc);
        const nd = d + 1;
        if (nd < (dist.has(nk) ? dist.get(nk) : Infinity)) {
          dist.set(nk, nd);
          prev.set(nk, [r, c]);
          pq.push([nd, nr, nc]);
        }
      }
    }
  }

  function* astar() {
    const h = (r, c) => Math.abs(r - end.r) + Math.abs(c - end.c);
    const gScore = new Map([[key(start.r, start.c), 0]]);
    const open = [[h(start.r, start.c), start.r, start.c]];
    const visited = new Set();
    const prev = new Map();

    while (open.length) {
      open.sort((a, b) => a[0] - b[0]);
      const [, r, c] = open.shift();
      const k = key(r, c);
      if (visited.has(k)) continue;
      visited.add(k);
      if (r !== start.r || c !== start.c) yield { type: 'visit', r, c };
      if (r === end.r && c === end.c) { yield* buildPath(prev); return; }

      for (const [nr, nc] of neighbors(r, c)) {
        const nk = key(nr, nc);
        const tentative = gScore.get(k) + 1;
        if (tentative < (gScore.has(nk) ? gScore.get(nk) : Infinity)) {
          gScore.set(nk, tentative);
          prev.set(nk, [r, c]);
          open.push([tentative + h(nr, nc), nr, nc]);
        }
      }
    }
  }

  function* buildPath(prev) {
    const path = [];
    let cur = [end.r, end.c];
    while (cur) {
      path.push(cur);
      cur = prev.get(key(cur[0], cur[1]));
    }
    path.reverse();
    for (const [r, c] of path) {
      if ((r === start.r && c === start.c) || (r === end.r && c === end.c)) continue;
      yield { type: 'path', r, c };
    }
  }

  const algorithms = { bfs, dfs, dijkstra, astar };

  function delayForSpeed(speed) {
    return Math.max(3, 90 - speed * 8);
  }

  async function run(algoKey, speed, onTick) {
    running = true;
    stopRequested = false;
    clearPathVisuals();
    const gen = algorithms[algoKey]();
    let visited = 0;
    const delay = delayForSpeed(speed);

    for (const step of gen) {
      if (stopRequested) break;
      if (step.type === 'visit') {
        visited++;
        cells[step.r][step.c].classList.add('visited');
        onTick({ visited });
        await new Promise(res => setTimeout(res, delay));
      } else if (step.type === 'path') {
        cells[step.r][step.c].classList.add('path');
        await new Promise(res => setTimeout(res, delay * 2));
      }
    }
    running = false;
    return { visited };
  }

  function stop() { stopRequested = true; }
  function isRunning() { return running; }
  function getComplexity(key) { return complexities[key]; }

  return { init, setDrawMode, clearGrid, randomMaze, run, stop, isRunning, getComplexity };
})();
