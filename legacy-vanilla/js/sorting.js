/* ============================================
   SORTING VISUALIZER
   Each algorithm is a generator function that yields
   "steps" describing what happened. A runner plays
   those steps back with a delay, updating the DOM
   and telemetry as it goes.
   ============================================ */

const SortingModule = (() => {
  let array = [];
  let barsEl = null;
  let running = false;
  let stopRequested = false;

  const complexities = {
    bubble: 'O(n²)',
    selection: 'O(n²)',
    insertion: 'O(n²)',
    merge: 'O(n log n)',
    quick: 'O(n log n) avg',
  };

  function init(container) {
    barsEl = container;
  }

  function randomArray(size) {
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 380) + 20);
    render();
  }

  function render() {
    barsEl.innerHTML = '';
    array.forEach((val) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = val + 'px';
      barsEl.appendChild(bar);
    });
  }

  function setBarState(i, cls) {
    const bar = barsEl.children[i];
    if (!bar) return;
    bar.classList.remove('compare', 'swap', 'sorted');
    if (cls) bar.classList.add(cls);
  }

  function setBarHeight(i, val) {
    const bar = barsEl.children[i];
    if (bar) bar.style.height = val + 'px';
  }

  /* ---------- Generators: each yields a step object ---------- */

  function* bubbleSort(arr) {
    const a = arr.slice();
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        yield { type: 'compare', indices: [j, j + 1] };
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          yield { type: 'swap', indices: [j, j + 1], array: a.slice() };
        }
      }
      yield { type: 'sorted', indices: [n - i - 1] };
    }
    yield { type: 'sorted', indices: [0] };
  }

  function* selectionSort(arr) {
    const a = arr.slice();
    const n = a.length;
    for (let i = 0; i < n; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) {
        yield { type: 'compare', indices: [min, j] };
        if (a[j] < a[min]) min = j;
      }
      if (min !== i) {
        [a[i], a[min]] = [a[min], a[i]];
        yield { type: 'swap', indices: [i, min], array: a.slice() };
      }
      yield { type: 'sorted', indices: [i] };
    }
  }

  function* insertionSort(arr) {
    const a = arr.slice();
    const n = a.length;
    for (let i = 1; i < n; i++) {
      let j = i - 1;
      const key = a[i];
      yield { type: 'compare', indices: [i, j] };
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        yield { type: 'swap', indices: [j, j + 1], array: a.slice() };
        j--;
        if (j >= 0) yield { type: 'compare', indices: [j, j + 1] };
      }
      a[j + 1] = key;
      yield { type: 'swap', indices: [j + 1], array: a.slice() };
    }
    for (let i = 0; i < n; i++) yield { type: 'sorted', indices: [i] };
  }

  function* mergeSort(arr) {
    const a = arr.slice();
    function* sort(lo, hi) {
      if (hi - lo <= 1) return;
      const mid = Math.floor((lo + hi) / 2);
      yield* sort(lo, mid);
      yield* sort(mid, hi);
      const left = a.slice(lo, mid);
      const right = a.slice(mid, hi);
      let i = 0, j = 0, k = lo;
      while (i < left.length && j < right.length) {
        yield { type: 'compare', indices: [lo + i, mid + j] };
        if (left[i] <= right[j]) {
          a[k] = left[i++];
        } else {
          a[k] = right[j++];
        }
        yield { type: 'swap', indices: [k], array: a.slice() };
        k++;
      }
      while (i < left.length) { a[k] = left[i++]; yield { type: 'swap', indices: [k], array: a.slice() }; k++; }
      while (j < right.length) { a[k] = right[j++]; yield { type: 'swap', indices: [k], array: a.slice() }; k++; }
    }
    yield* sort(0, a.length);
    for (let i = 0; i < a.length; i++) yield { type: 'sorted', indices: [i] };
  }

  function* quickSort(arr) {
    const a = arr.slice();
    function* qs(lo, hi) {
      if (lo >= hi) return;
      const pivot = a[hi];
      let i = lo - 1;
      for (let j = lo; j < hi; j++) {
        yield { type: 'compare', indices: [j, hi] };
        if (a[j] < pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
          yield { type: 'swap', indices: [i, j], array: a.slice() };
        }
      }
      [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
      yield { type: 'swap', indices: [i + 1, hi], array: a.slice() };
      yield { type: 'sorted', indices: [i + 1] };
      yield* qs(lo, i);
      yield* qs(i + 2, hi);
    }
    yield* qs(0, a.length - 1);
    for (let i = 0; i < a.length; i++) yield { type: 'sorted', indices: [i] };
  }

  const algorithms = {
    bubble: bubbleSort,
    selection: selectionSort,
    insertion: insertionSort,
    merge: mergeSort,
    quick: quickSort,
  };

  function delayForSpeed(speed) {
    // speed 1 (slow) -> ~200ms, speed 10 (fast) -> ~2ms
    return Math.max(2, 220 - speed * 22);
  }

  async function run(algoKey, speed, onTick) {
    running = true;
    stopRequested = false;
    const gen = algorithms[algoKey](array);
    let compares = 0, swaps = 0;
    const delay = delayForSpeed(speed);

    for (const step of gen) {
      if (stopRequested) break;

      if (step.type === 'compare') {
        compares++;
        step.indices.forEach(i => setBarState(i, 'compare'));
      } else if (step.type === 'swap') {
        swaps++;
        if (step.array) array = step.array;
        step.indices.forEach(i => {
          if (step.array) setBarHeight(i, step.array[i]);
          setBarState(i, 'swap');
        });
      } else if (step.type === 'sorted') {
        step.indices.forEach(i => setBarState(i, 'sorted'));
      }

      onTick({ compares, swaps });
      await new Promise(res => setTimeout(res, delay));

      if (step.type !== 'sorted') {
        step.indices.forEach(i => {
          if (barsEl.children[i] && !barsEl.children[i].classList.contains('sorted')) {
            setBarState(i, null);
          }
        });
      }
    }

    // mark everything sorted at the end if not stopped
    if (!stopRequested) {
      Array.from(barsEl.children).forEach(bar => bar.classList.add('sorted'));
    }
    running = false;
    return { compares, swaps };
  }

  function stop() { stopRequested = true; }
  function isRunning() { return running; }
  function getArray() { return array; }
  function getComplexity(key) { return complexities[key]; }

  return { init, randomArray, render, run, stop, isRunning, getArray, getComplexity };
})();
