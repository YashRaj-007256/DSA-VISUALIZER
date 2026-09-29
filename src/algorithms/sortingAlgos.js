/* ==========================================================================
   SORTING ALGORITHM GENERATORS
   Each generator yields step objects for visual playback & code highlighting:
   - type: 'compare' | 'swap' | 'sorted' | 'overwrite' | 'select'
   - indices: array of indexes being operated on
   - array: a copy of the current state of the array
   - line: line of pseudocode (0-indexed) to highlight
   ========================================================================== */

export const sortingComplexity = {
  bubble: { time: 'O(n²)', space: 'O(1)', label: 'Bubble Sort' },
  selection: { time: 'O(n²)', space: 'O(1)', label: 'Selection Sort' },
  insertion: { time: 'O(n²)', space: 'O(1)', label: 'Insertion Sort' },
  merge: { time: 'O(n log n)', space: 'O(n)', label: 'Merge Sort' },
  quick: { time: 'O(n log n) avg', space: 'O(log n)', label: 'Quick Sort' },
  heap: { time: 'O(n log n)', space: 'O(1)', label: 'Heap Sort' }
};

export const sortingPseudocode = {
  bubble: {
    pseudocode: [
      'for i from 0 to n-1 {',
      '  for j from 0 to n-i-1 {',
      '    if array[j] > array[j+1] {',
      '      swap(array[j], array[j+1])',
      '    }',
      '  }',
      '}'
    ],
    python: [
      'for i in range(n):',
      '  for j in range(n - i - 1):',
      '    if array[j] > array[j+1]:',
      '      array[j], array[j+1] = array[j+1], array[j]',
      '    # end if',
      '  # end inner',
      '# end outer'
    ],
    java: [
      'for (int i = 0; i < n; i++) {',
      '  for (int j = 0; j < n - i - 1; j++) {',
      '    if (array[j] > array[j+1]) {',
      '      swap(array, j, j + 1);',
      '    }',
      '  }',
      '}'
    ],
    cpp: [
      'for (int i = 0; i < n; i++) {',
      '  for (int j = 0; j < n - i - 1; j++) {',
      '    if (array[j] > array[j+1]) {',
      '      std::swap(array[j], array[j+1]);',
      '    }',
      '  }',
      '}'
    ],
    c: [
      'for (int i = 0; i < n; i++) {',
      '  for (int j = 0; j < n - i - 1; j++) {',
      '    if (array[j] > array[j+1]) {',
      '      swap(&array[j], &array[j+1]);',
      '    }',
      '  }',
      '}'
    ]
  },
  selection: {
    pseudocode: [
      'for i from 0 to n-1 {',
      '  min_idx = i',
      '  for j from i+1 to n-1 {',
      '    if array[j] < array[min_idx] {',
      '      min_idx = j',
      '    }',
      '  }',
      '  if min_idx != i swap(array[i], array[min_idx])',
      '}'
    ],
    python: [
      'for i in range(n):',
      '  min_idx = i',
      '  for j in range(i + 1, n):',
      '    if array[j] < array[min_idx]:',
      '      min_idx = j',
      '    # end if',
      '  # end inner loop',
      '  if min_idx != i: array[i], array[min_idx] = array[min_idx], array[i]',
      '# end outer loop'
    ],
    java: [
      'for (int i = 0; i < n; i++) {',
      '  int min_idx = i;',
      '  for (int j = i + 1; j < n; j++) {',
      '    if (array[j] < array[min_idx]) {',
      '      min_idx = j;',
      '    }',
      '  }',
      '  if (min_idx != i) swap(array, i, min_idx);',
      '}'
    ],
    cpp: [
      'for (int i = 0; i < n; i++) {',
      '  int min_idx = i;',
      '  for (int j = i + 1; j < n; j++) {',
      '    if (array[j] < array[min_idx]) {',
      '      min_idx = j;',
      '    }',
      '  }',
      '  if (min_idx != i) std::swap(array[i], array[min_idx]);',
      '}'
    ],
    c: [
      'for (int i = 0; i < n; i++) {',
      '  int min_idx = i;',
      '  for (int j = i + 1; j < n; j++) {',
      '    if (array[j] < array[min_idx]) {',
      '      min_idx = j;',
      '    }',
      '  }',
      '  if (min_idx != i) swap(&array[i], &array[min_idx]);',
      '}'
    ]
  },
  insertion: {
    pseudocode: [
      'for i from 1 to n-1 {',
      '  key = array[i]',
      '  j = i - 1',
      '  while j >= 0 and array[j] > key {',
      '    array[j+1] = array[j]',
      '    j = j - 1',
      '  }',
      '  array[j+1] = key',
      '}'
    ],
    python: [
      'for i in range(1, n):',
      '  key = array[i]',
      '  j = i - 1',
      '  while j >= 0 and array[j] > key:',
      '    array[j+1] = array[j]',
      '    j -= 1',
      '  # end while',
      '  array[j+1] = key',
      '# end for'
    ],
    java: [
      'for (int i = 1; i < n; i++) {',
      '  int key = array[i];',
      '  int j = i - 1;',
      '  while (j >= 0 && array[j] > key) {',
      '    array[j+1] = array[j];',
      '    j = j - 1;',
      '  }',
      '  array[j+1] = key;',
      '}'
    ],
    cpp: [
      'for (int i = 1; i < n; i++) {',
      '  int key = array[i];',
      '  int j = i - 1;',
      '  while (j >= 0 && array[j] > key) {',
      '    array[j+1] = array[j];',
      '    j = j - 1;',
      '  }',
      '  array[j+1] = key;',
      '}'
    ],
    c: [
      'for (int i = 1; i < n; i++) {',
      '  int key = array[i];',
      '  int j = i - 1;',
      '  while (j >= 0 && array[j] > key) {',
      '    array[j+1] = array[j];',
      '    j = j - 1;',
      '  }',
      '  array[j+1] = key;',
      '}'
    ]
  },
  merge: {
    pseudocode: [
      'function mergeSort(arr, lo, hi) {',
      '  if (hi - lo <= 1) return',
      '  mid = floor((lo + hi) / 2)',
      '  mergeSort(arr, lo, mid)',
      '  mergeSort(arr, mid, hi)',
      '  merge(arr, lo, mid, hi)',
      '}'
    ],
    python: [
      'def merge_sort(arr, lo, hi):',
      '  if hi - lo <= 1: return',
      '  mid = (lo + hi) // 2',
      '  merge_sort(arr, lo, mid)',
      '  merge_sort(arr, mid, hi)',
      '  merge(arr, lo, mid, hi)',
      '# end def'
    ],
    java: [
      'void mergeSort(int[] arr, int lo, int hi) {',
      '  if (hi - lo <= 1) return;',
      '  int mid = (lo + hi) / 2;',
      '  mergeSort(arr, lo, mid);',
      '  mergeSort(arr, mid, hi);',
      '  merge(arr, lo, mid, hi);',
      '}'
    ],
    cpp: [
      'void mergeSort(vector<int>& arr, int lo, int hi) {',
      '  if (hi - lo <= 1) return;',
      '  int mid = (lo + hi) / 2;',
      '  mergeSort(arr, lo, mid);',
      '  mergeSort(arr, mid, hi);',
      '  merge(arr, lo, mid, hi);',
      '}'
    ],
    c: [
      'void mergeSort(int* arr, int lo, int hi) {',
      '  if (hi - lo <= 1) return;',
      '  int mid = (lo + hi) / 2;',
      '  mergeSort(arr, lo, mid);',
      '  mergeSort(arr, mid, hi);',
      '  merge(arr, lo, mid, hi);',
      '}'
    ]
  },
  quick: {
    pseudocode: [
      'function quickSort(arr, lo, hi) {',
      '  if (lo >= hi) return',
      '  pivot_idx = partition(arr, lo, hi)',
      '  quickSort(arr, lo, pivot_idx - 1)',
      '  quickSort(arr, pivot_idx + 1, hi)',
      '}'
    ],
    python: [
      'def quick_sort(arr, lo, hi):',
      '  if lo >= hi: return',
      '  pivot_idx = partition(arr, lo, hi)',
      '  quick_sort(arr, lo, pivot_idx - 1)',
      '  quick_sort(arr, pivot_idx + 1, hi)',
      '# end def'
    ],
    java: [
      'void quickSort(int[] arr, int lo, int hi) {',
      '  if (lo >= hi) return;',
      '  int pivot_idx = partition(arr, lo, hi);',
      '  quickSort(arr, lo, pivot_idx - 1);',
      '  quickSort(arr, pivot_idx + 1, hi);',
      '}'
    ],
    cpp: [
      'void quickSort(vector<int>& arr, int lo, int hi) {',
      '  if (lo >= hi) return;',
      '  int pivot_idx = partition(arr, lo, hi);',
      '  quickSort(arr, lo, pivot_idx - 1);',
      '  quickSort(arr, pivot_idx + 1, hi);',
      '}'
    ],
    c: [
      'void quickSort(int* arr, int lo, int hi) {',
      '  if (lo >= hi) return;',
      '  int pivot_idx = partition(arr, lo, hi);',
      '  quickSort(arr, lo, pivot_idx - 1);',
      '  quickSort(arr, pivot_idx + 1, hi);',
      '}'
    ]
  },
  heap: {
    pseudocode: [
      'function heapSort(arr) {',
      '  buildMaxHeap(arr)',
      '  for i from n-1 down to 1 {',
      '    swap(arr[0], arr[i])',
      '    maxHeapify(arr, 0, i)',
      '  }',
      '}'
    ],
    python: [
      'def heap_sort(arr):',
      '  build_max_heap(arr)',
      '  for i in range(n - 1, 0, -1):',
      '    arr[0], arr[i] = arr[i], arr[0]',
      '    max_heapify(arr, 0, i)',
      '  # end for',
      '# end def'
    ],
    java: [
      'void heapSort(int[] arr) {',
      '  buildMaxHeap(arr);',
      '  for (int i = arr.length - 1; i > 0; i--) {',
      '    swap(arr, 0, i);',
      '    maxHeapify(arr, 0, i);',
      '  }',
      '}'
    ],
    cpp: [
      'void heapSort(vector<int>& arr) {',
      '  buildMaxHeap(arr);',
      '  for (int i = arr.size() - 1; i > 0; i--) {',
      '    std::swap(arr[0], arr[i]);',
      '    maxHeapify(arr, 0, i);',
      '  }',
      '}'
    ],
    c: [
      'void heapSort(int* arr, int n) {',
      '  buildMaxHeap(arr, n);',
      '  for (int i = n - 1; i > 0; i--) {',
      '    swap(&arr[0], &arr[i]);',
      '    maxHeapify(arr, 0, i);',
      '  }',
      '}'
    ]
  }
};

// Generates Bubble Sort steps
export function* bubbleSortGen(arr) {
  const a = arr.slice();
  const n = a.length;
  yield { type: 'select', indices: [], array: a.slice(), line: 0 };
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', indices: [j, j + 1], array: a.slice(), line: 1 };
      yield { type: 'compare', indices: [j, j + 1], array: a.slice(), line: 2 };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { type: 'swap', indices: [j, j + 1], array: a.slice(), line: 3 };
      }
    }
    yield { type: 'sorted', indices: [n - i - 1], array: a.slice(), line: 6 };
  }
}

// Generates Selection Sort steps
export function* selectionSortGen(arr) {
  const a = arr.slice();
  const n = a.length;
  yield { type: 'select', indices: [], array: a.slice(), line: 0 };
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    yield { type: 'select', indices: [minIdx], array: a.slice(), line: 1 };
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', indices: [j, minIdx], array: a.slice(), line: 2 };
      yield { type: 'compare', indices: [j, minIdx], array: a.slice(), line: 3 };
      if (a[j] < a[minIdx]) {
        minIdx = j;
        yield { type: 'select', indices: [minIdx], array: a.slice(), line: 4 };
      }
    }
    yield { type: 'compare', indices: [i, minIdx], array: a.slice(), line: 7 };
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { type: 'swap', indices: [i, minIdx], array: a.slice(), line: 7 };
    }
    yield { type: 'sorted', indices: [i], array: a.slice(), line: 8 };
  }
}

// Generates Insertion Sort steps
export function* insertionSortGen(arr) {
  const a = arr.slice();
  const n = a.length;
  yield { type: 'select', indices: [], array: a.slice(), line: 0 };
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    yield { type: 'select', indices: [i], array: a.slice(), line: 1 };
    yield { type: 'select', indices: [i, j], array: a.slice(), line: 2 };
    
    yield { type: 'compare', indices: [j, j + 1], array: a.slice(), line: 3 };
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      yield { type: 'swap', indices: [j, j + 1], array: a.slice(), line: 4 };
      j--;
      yield { type: 'select', indices: [j >= 0 ? j : 0], array: a.slice(), line: 5 };
      if (j >= 0) {
        yield { type: 'compare', indices: [j, j + 1], array: a.slice(), line: 3 };
      }
    }
    a[j + 1] = key;
    yield { type: 'overwrite', indices: [j + 1], array: a.slice(), line: 7 };
  }
  for (let i = 0; i < n; i++) {
    yield { type: 'sorted', indices: [i], array: a.slice(), line: 8 };
  }
}

// Generates Merge Sort steps
export function* mergeSortGen(arr) {
  const a = arr.slice();
  
  function* sort(lo, hi) {
    yield { type: 'select', indices: [lo, hi - 1], array: a.slice(), line: 0 };
    if (hi - lo <= 1) {
      yield { type: 'select', indices: [lo], array: a.slice(), line: 1 };
      return;
    }
    const mid = Math.floor((lo + hi) / 2);
    yield { type: 'select', indices: [mid], array: a.slice(), line: 2 };
    
    yield* sort(lo, mid);
    yield* sort(mid, hi);
    
    // Merge process
    const left = a.slice(lo, mid);
    const right = a.slice(mid, hi);
    let i = 0, j = 0, k = lo;
    
    yield { type: 'select', indices: [lo, mid, hi - 1], array: a.slice(), line: 5 };
    while (i < left.length && j < right.length) {
      yield { type: 'compare', indices: [lo + i, mid + j], array: a.slice(), line: 5 };
      if (left[i] <= right[j]) {
        a[k] = left[i++];
      } else {
        a[k] = right[j++];
      }
      yield { type: 'overwrite', indices: [k], array: a.slice(), line: 5 };
      k++;
    }
    while (i < left.length) {
      a[k] = left[i++];
      yield { type: 'overwrite', indices: [k], array: a.slice(), line: 5 };
      k++;
    }
    while (j < right.length) {
      a[k] = right[j++];
      yield { type: 'overwrite', indices: [k], array: a.slice(), line: 5 };
      k++;
    }
  }

  yield* sort(0, a.length);
  for (let i = 0; i < a.length; i++) {
    yield { type: 'sorted', indices: [i], array: a.slice(), line: 6 };
  }
}

// Generates Quick Sort steps
export function* quickSortGen(arr) {
  const a = arr.slice();

  function* partition(lo, hi) {
    const pivot = a[hi];
    let i = lo - 1;
    yield { type: 'select', indices: [hi], array: a.slice(), line: 2 };
    for (let j = lo; j < hi; j++) {
      yield { type: 'compare', indices: [j, hi], array: a.slice(), line: 2 };
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        yield { type: 'swap', indices: [i, j], array: a.slice(), line: 2 };
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    yield { type: 'swap', indices: [i + 1, hi], array: a.slice(), line: 2 };
    return i + 1;
  }

  function* qs(lo, hi) {
    yield { type: 'select', indices: [lo, hi], array: a.slice(), line: 0 };
    if (lo >= hi) {
      if (lo === hi) yield { type: 'sorted', indices: [lo], array: a.slice(), line: 1 };
      return;
    }
    const pivotIdx = yield* partition(lo, hi);
    yield { type: 'sorted', indices: [pivotIdx], array: a.slice(), line: 2 };
    
    yield* qs(lo, pivotIdx - 1);
    yield* qs(pivotIdx + 1, hi);
  }

  yield* qs(0, a.length - 1);
  for (let i = 0; i < a.length; i++) {
    yield { type: 'sorted', indices: [i], array: a.slice(), line: 4 };
  }
}

// Generates Heap Sort steps
export function* heapSortGen(arr) {
  const a = arr.slice();
  const n = a.length;

  function* maxHeapify(size, idx) {
    let largest = idx;
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;

    yield { type: 'compare', indices: [idx, left < size ? left : idx, right < size ? right : idx], array: a.slice(), line: 4 };
    if (left < size && a[left] > a[largest]) largest = left;
    if (right < size && a[right] > a[largest]) largest = right;

    if (largest !== idx) {
      [a[idx], a[largest]] = [a[largest], a[idx]];
      yield { type: 'swap', indices: [idx, largest], array: a.slice(), line: 4 };
      yield* maxHeapify(size, largest);
    }
  }

  // Build Heap
  yield { type: 'select', indices: [], array: a.slice(), line: 1 };
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* maxHeapify(n, i);
  }

  // Extract from Heap
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    yield { type: 'swap', indices: [0, i], array: a.slice(), line: 3 };
    yield { type: 'sorted', indices: [i], array: a.slice(), line: 3 };
    yield* maxHeapify(i, 0);
  }
  yield { type: 'sorted', indices: [0], array: a.slice(), line: 4 };
}

export const sortingAlgos = {
  bubble: bubbleSortGen,
  selection: selectionSortGen,
  insertion: insertionSortGen,
  merge: mergeSortGen,
  quick: quickSortGen,
  heap: heapSortGen
};
