document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Telemetry ---------------- */
  const tStatus = document.getElementById('t-status');
  const tCompares = document.getElementById('t-compares');
  const tSwaps = document.getElementById('t-swaps');
  const tTime = document.getElementById('t-time');
  const tComplexity = document.getElementById('t-complexity');

  let startTime = 0;
  let timerInterval = null;

  function pad(n) { return String(n).padStart(4, '0'); }

  function setStatus(text, cls) {
    tStatus.textContent = text;
    tStatus.className = 't-value' + (cls ? ' ' + cls : '');
  }

  function startTimer() {
    startTime = performance.now();
    timerInterval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      tTime.textContent = elapsed.toFixed(2) + 's';
    }, 40);
  }
  function stopTimer() { clearInterval(timerInterval); }

  function resetTelemetry(complexityLabel) {
    tCompares.textContent = '0000';
    tSwaps.textContent = '0000';
    tTime.textContent = '00.00s';
    tComplexity.textContent = complexityLabel;
    setStatus('STANDBY');
  }

  /* ---------------- Mode switching ---------------- */
  const modeBtns = document.querySelectorAll('.mode-btn');
  const panels = { sort: document.getElementById('sort-panel'), path: document.getElementById('path-panel') };

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      Object.values(panels).forEach(p => p.classList.remove('active'));
      panels[btn.dataset.mode].classList.add('active');
      resetTelemetry(btn.dataset.mode === 'sort'
        ? SortingModule.getComplexity(sortAlgoSel.value)
        : PathfindingModule.getComplexity(pathAlgoSel.value));
    });
  });

  /* ================= SORTING ================= */
  const barsContainer = document.getElementById('bars');
  SortingModule.init(barsContainer);

  const sortAlgoSel = document.getElementById('sort-algo');
  const sortSize = document.getElementById('sort-size');
  const sortSizeVal = document.getElementById('sort-size-val');
  const sortSpeed = document.getElementById('sort-speed');
  const sortSpeedVal = document.getElementById('sort-speed-val');
  const sortShuffleBtn = document.getElementById('sort-shuffle');
  const sortStartBtn = document.getElementById('sort-start');
  const sortStopBtn = document.getElementById('sort-stop');

  SortingModule.randomArray(+sortSize.value);
  tComplexity.textContent = SortingModule.getComplexity(sortAlgoSel.value);

  sortSize.addEventListener('input', () => {
    sortSizeVal.textContent = sortSize.value;
    SortingModule.randomArray(+sortSize.value);
  });
  sortSpeed.addEventListener('input', () => { sortSpeedVal.textContent = sortSpeed.value; });
  sortAlgoSel.addEventListener('change', () => {
    tComplexity.textContent = SortingModule.getComplexity(sortAlgoSel.value);
  });
  sortShuffleBtn.addEventListener('click', () => {
    if (SortingModule.isRunning()) return;
    SortingModule.randomArray(+sortSize.value);
    resetTelemetry(SortingModule.getComplexity(sortAlgoSel.value));
  });

  sortStartBtn.addEventListener('click', async () => {
    if (SortingModule.isRunning()) return;
    sortStartBtn.disabled = true;
    sortStopBtn.disabled = false;
    sortShuffleBtn.disabled = true;
    setStatus('RUNNING', 'running');
    startTimer();

    const result = await SortingModule.run(sortAlgoSel.value, +sortSpeed.value, ({ compares, swaps }) => {
      tCompares.textContent = pad(compares);
      tSwaps.textContent = pad(swaps);
    });

    stopTimer();
    setStatus('COMPLETE', 'done');
    sortStartBtn.disabled = false;
    sortStopBtn.disabled = true;
    sortShuffleBtn.disabled = false;
  });

  sortStopBtn.addEventListener('click', () => {
    SortingModule.stop();
    stopTimer();
    setStatus('STOPPED');
    sortStartBtn.disabled = false;
    sortStopBtn.disabled = true;
    sortShuffleBtn.disabled = false;
  });

  /* ================= PATHFINDING ================= */
  const gridContainer = document.getElementById('grid');
  PathfindingModule.init(gridContainer);

  const pathAlgoSel = document.getElementById('path-algo');
  const pathSpeed = document.getElementById('path-speed');
  const pathSpeedVal = document.getElementById('path-speed-val');
  const pathStartBtn = document.getElementById('path-start');
  const pathStopBtn = document.getElementById('path-stop');
  const pathClearBtn = document.getElementById('path-clear');
  const pathMazeBtn = document.getElementById('path-maze');
  const drawToggleBtns = document.querySelectorAll('.btn-toggle');

  pathSpeed.addEventListener('input', () => { pathSpeedVal.textContent = pathSpeed.value; });

  drawToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      drawToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      PathfindingModule.setDrawMode(btn.dataset.draw);
    });
  });

  pathClearBtn.addEventListener('click', () => {
    if (PathfindingModule.isRunning()) return;
    PathfindingModule.clearGrid();
    resetTelemetry(PathfindingModule.getComplexity(pathAlgoSel.value));
  });

  pathMazeBtn.addEventListener('click', () => {
    if (PathfindingModule.isRunning()) return;
    PathfindingModule.randomMaze();
    resetTelemetry(PathfindingModule.getComplexity(pathAlgoSel.value));
  });

  pathStartBtn.addEventListener('click', async () => {
    if (PathfindingModule.isRunning()) return;
    pathStartBtn.disabled = true;
    pathStopBtn.disabled = false;
    setStatus('RUNNING', 'running');
    tComplexity.textContent = PathfindingModule.getComplexity(pathAlgoSel.value);
    startTimer();

    const result = await PathfindingModule.run(pathAlgoSel.value, +pathSpeed.value, ({ visited }) => {
      tSwaps.textContent = pad(visited);
    });

    stopTimer();
    setStatus('COMPLETE', 'done');
    pathStartBtn.disabled = false;
    pathStopBtn.disabled = true;
  });

  pathStopBtn.addEventListener('click', () => {
    PathfindingModule.stop();
    stopTimer();
    setStatus('STOPPED');
    pathStartBtn.disabled = false;
    pathStopBtn.disabled = true;
  });

});
