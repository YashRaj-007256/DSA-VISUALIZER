/* ==========================================================================
   PATHFINDING ALGORITHM GENERATORS
   Each generator yields step objects for visual playback & code highlighting:
   - type: 'visit' | 'path' | 'current'
   - r, c: cell coordinates
   - line: line of pseudocode (0-indexed) to highlight
   ========================================================================== */

export const pathfindingComplexity = {
  bfs: { time: 'O(V + E)', space: 'O(V)', label: 'Breadth-First Search' },
  dfs: { time: 'O(V + E)', space: 'O(V)', label: 'Depth-First Search' },
  dijkstra: { time: 'O(E log V)', space: 'O(V)', label: "Dijkstra's Algorithm" },
  astar: { time: 'O(E)', space: 'O(V)', label: 'A* Search' }
};

export const pathfindingPseudocode = {
  bfs: {
    pseudocode: [
      'queue = [start], visited = {start}',
      'while (queue is not empty) {',
      '  current = queue.shift()',
      '  if (current == end) return reconstructPath()',
      '  for neighbor of current.neighbors {',
      '    if (neighbor not visited and not wall) {',
      '      visited.add(neighbor)',
      '      queue.push(neighbor)',
      '    }',
      '  }',
      '}'
    ],
    python: [
      'queue = [start]; visited = {start}',
      'while queue:',
      '  current = queue.pop(0)',
      '  if current == end: return reconstruct_path()',
      '  for neighbor in current.neighbors:',
      '    if neighbor not in visited and not wall:',
      '      visited.add(neighbor)',
      '      queue.append(neighbor)',
      '    # end if',
      '  # end for',
      '# end while'
    ],
    java: [
      'Queue queue = new LinkedList(start); visited.add(start);',
      'while (!queue.isEmpty()) {',
      '  Node current = queue.poll();',
      '  if (current == end) return reconstructPath();',
      '  for (Node neighbor : current.neighbors) {',
      '    if (!visited.contains(neighbor) && !neighbor.wall) {',
      '      visited.add(neighbor);',
      '      queue.add(neighbor);',
      '    }',
      '  }',
      '}'
    ],
    cpp: [
      'queue.push(start); visited.insert(start);',
      'while (!queue.empty()) {',
      '  Node current = queue.front(); queue.pop();',
      '  if (current == end) return reconstructPath();',
      '  for (Node neighbor : current.neighbors) {',
      '    if (!visited.count(neighbor) && !neighbor.wall) {',
      '      visited.insert(neighbor);',
      '      queue.push(neighbor);',
      '    }',
      '  }',
      '}'
    ],
    c: [
      'enqueue(queue, start); add(visited, start);',
      'while (!isEmpty(queue)) {',
      '  Node current = dequeue(queue);',
      '  if (current == end) return reconstructPath();',
      '  for (int i = 0; i < current.num_neighbors; i++) {',
      '    if (!isVisited(neighbor) && !isWall(neighbor)) {',
      '      add(visited, neighbor);',
      '      enqueue(queue, neighbor);',
      '    }',
      '  }',
      '}'
    ]
  },
  dfs: {
    pseudocode: [
      'stack = [start], visited = {start}',
      'while (stack is not empty) {',
      '  current = stack.pop()',
      '  if (current == end) return reconstructPath()',
      '  for neighbor of current.neighbors {',
      '    if (neighbor not visited and not wall) {',
      '      visited.add(neighbor)',
      '      stack.push(neighbor)',
      '    }',
      '  }',
      '}'
    ],
    python: [
      'stack = [start]; visited = {start}',
      'while stack:',
      '  current = stack.pop()',
      '  if current == end: return reconstruct_path()',
      '  for neighbor in current.neighbors:',
      '    if neighbor not in visited and not wall:',
      '      visited.add(neighbor)',
      '      stack.append(neighbor)',
      '    # end if',
      '  # end for',
      '# end while'
    ],
    java: [
      'Stack stack = new Stack(); stack.push(start); visited.add(start);',
      'while (!stack.isEmpty()) {',
      '  Node current = stack.pop();',
      '  if (current == end) return reconstructPath();',
      '  for (Node neighbor : current.neighbors) {',
      '    if (!visited.contains(neighbor) && !neighbor.wall) {',
      '      visited.add(neighbor);',
      '      stack.push(neighbor);',
      '    }',
      '  }',
      '}'
    ],
    cpp: [
      'stack.push(start); visited.insert(start);',
      'while (!stack.empty()) {',
      '  Node current = stack.top(); stack.pop();',
      '  if (current == end) return reconstructPath();',
      '  for (Node neighbor : current.neighbors) {',
      '    if (!visited.count(neighbor) && !neighbor.wall) {',
      '      visited.insert(neighbor);',
      '      stack.push(neighbor);',
      '    }',
      '  }',
      '}'
    ],
    c: [
      'push(stack, start); add(visited, start);',
      'while (!isEmpty(stack)) {',
      '  Node current = pop(stack);',
      '  if (current == end) return reconstructPath();',
      '  for (int i = 0; i < current.num_neighbors; i++) {',
      '    if (!isVisited(neighbor) && !isWall(neighbor)) {',
      '      add(visited, neighbor);',
      '      push(stack, neighbor);',
      '    }',
      '  }',
      '}'
    ]
  },
  dijkstra: {
    pseudocode: [
      'dist[start] = 0, pq = [start]',
      'while (pq is not empty) {',
      '  current = pq.extractMin()',
      '  if (current == end) return reconstructPath()',
      '  for neighbor of current.neighbors {',
      '    new_dist = dist[current] + weight(neighbor)',
      '    if (new_dist < dist[neighbor]) {',
      '      dist[neighbor] = new_dist',
      '      pq.insertOrUpdate(neighbor)',
      '    }',
      '  }',
      '}'
    ],
    python: [
      'dist[start] = 0; pq = [start]',
      'while pq:',
      '  current = pq.extract_min()',
      '  if current == end: return reconstruct_path()',
      '  for neighbor in current.neighbors:',
      '    new_dist = dist[current] + weight(neighbor)',
      '    if new_dist < dist[neighbor]:',
      '      dist[neighbor] = new_dist',
      '      pq.insert_or_update(neighbor)',
      '    # end if',
      '  # end for',
      '# end while'
    ],
    java: [
      'dist[start] = 0; pq.add(start);',
      'while (!pq.isEmpty()) {',
      '  Node current = pq.poll();',
      '  if (current == end) return reconstructPath();',
      '  for (Node neighbor : current.neighbors) {',
      '    int new_dist = dist[current] + weight(neighbor);',
      '    if (new_dist < dist[neighbor]) {',
      '      dist[neighbor] = new_dist;',
      '      pq.add(neighbor);',
      '    }',
      '  }',
      '}'
    ],
    cpp: [
      'dist[start] = 0; pq.push(start);',
      'while (!pq.empty()) {',
      '  Node current = pq.top(); pq.pop();',
      '  if (current == end) return reconstructPath();',
      '  for (Node neighbor : current.neighbors) {',
      '    int new_dist = dist[current] + weight(neighbor);',
      '    if (new_dist < dist[neighbor]) {',
      '      dist[neighbor] = new_dist;',
      '      pq.push(neighbor);',
      '    }',
      '  }',
      '}'
    ],
    c: [
      'dist[start] = 0; pq_push(pq, start);',
      'while (!pq_empty(pq)) {',
      '  Node current = pq_pop(pq);',
      '  if (current == end) return reconstructPath();',
      '  for (int i = 0; i < current.num_neighbors; i++) {',
      '    int new_dist = dist[current] + weight(neighbor);',
      '    if (new_dist < dist[neighbor]) {',
      '      dist[neighbor] = new_dist;',
      '      pq_push(pq, neighbor);',
      '    }',
      '  }',
      '}'
    ]
  },
  astar: {
    pseudocode: [
      'g[start] = 0, f[start] = h(start), open = [start]',
      'while (open is not empty) {',
      '  current = open.extractMinByF()',
      '  if (current == end) return reconstructPath()',
      '  for neighbor of current.neighbors {',
      '    tentative_g = g[current] + weight(neighbor)',
      '    if (tentative_g < g[neighbor]) {',
      '      g[neighbor] = tentative_g',
      '      f[neighbor] = tentative_g + h(neighbor)',
      '      open.insertOrUpdate(neighbor)',
      '    }',
      '  }',
      '}'
    ],
    python: [
      'g[start] = 0; f[start] = h(start); open_set = [start]',
      'while open_set:',
      '  current = open_set.extract_min_by_f()',
      '  if current == end: return reconstruct_path()',
      '  for neighbor in current.neighbors:',
      '    tentative_g = g[current] + weight(neighbor)',
      '    if tentative_g < g[neighbor]:',
      '      g[neighbor] = tentative_g',
      '      f[neighbor] = tentative_g + h(neighbor)',
      '      open_set.insert_or_update(neighbor)',
      '    # end if',
      '  # end for',
      '# end while'
    ],
    java: [
      'g[start] = 0; f[start] = h(start); open.add(start);',
      'while (!open.isEmpty()) {',
      '  Node current = open.poll();',
      '  if (current == end) return reconstructPath();',
      '  for (Node neighbor : current.neighbors) {',
      '    int tentative_g = g[current] + weight(neighbor);',
      '    if (tentative_g < g[neighbor]) {',
      '      g[neighbor] = tentative_g;',
      '      f[neighbor] = tentative_g + h(neighbor);',
      '      open.add(neighbor);',
      '    }',
      '  }',
      '}'
    ],
    cpp: [
      'g[start] = 0; f[start] = h(start); open.push(start);',
      'while (!open.empty()) {',
      '  Node current = open.top(); open.pop();',
      '  if (current == end) return reconstructPath();',
      '  for (Node neighbor : current.neighbors) {',
      '    int tentative_g = g[current] + weight(neighbor);',
      '    if (tentative_g < g[neighbor]) {',
      '      g[neighbor] = tentative_g;',
      '      f[neighbor] = tentative_g + h(neighbor);',
      '      open.push(neighbor);',
      '    }',
      '  }',
      '}'
    ],
    c: [
      'g[start] = 0; f[start] = h(start); pq_push(open, start);',
      'while (!pq_empty(open)) {',
      '  Node current = pq_pop(open);',
      '  if (current == end) return reconstructPath();',
      '  for (int i = 0; i < current.num_neighbors; i++) {',
      '    int tentative_g = g[current] + weight(neighbor);',
      '    if (tentative_g < g[neighbor]) {',
      '      g[neighbor] = tentative_g;',
      '      f[neighbor] = tentative_g + h(neighbor);',
      '      pq_push(open, neighbor);',
      '    }',
      '  }',
      '}'
    ]
  }
};

// Helper: Get neighbors (grid size configuration)
function getNeighbors(r, c, rows, cols, grid) {
  const deltas = [
    [-1, 0], // Up
    [1, 0],  // Down
    [0, -1], // Left
    [0, 1]   // Right
  ];
  const result = [];
  for (const [dr, dc] of deltas) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      const type = grid[nr]?.[nc]?.type;
      if (type !== 'wall') {
        result.push({ r: nr, c: nc });
      }
    }
  }
  return result;
}

const key = (r, c) => `${r},${c}`;

// Helper: Reconstruct path
function* reconstructPathGen(prevMap, start, end) {
  const path = [];
  let curr = end;
  while (curr) {
    path.push(curr);
    curr = prevMap.get(key(curr.r, curr.c));
  }
  path.reverse();
  for (const cell of path) {
    if ((cell.r === start.r && cell.c === start.c) || (cell.r === end.r && cell.c === end.c)) continue;
    yield { type: 'path', r: cell.r, c: cell.c, line: 3 };
  }
}

// 1. BFS Generator
export function* bfsGen(grid, start, end, rows, cols) {
  const startKey = key(start.r, start.c);
  const visited = new Set([startKey]);
  const queue = [start];
  const prevMap = new Map();

  yield { type: 'current', r: start.r, c: start.c, line: 0 };

  while (queue.length) {
    yield { type: 'current', r: queue[0].r, r: queue[0].c, line: 1 };
    const curr = queue.shift();
    const currKey = key(curr.r, curr.c);

    if (curr.r !== start.r || curr.c !== start.c) {
      yield { type: 'visit', r: curr.r, c: curr.c, line: 2 };
    }

    if (curr.r === end.r && curr.c === end.c) {
      yield* reconstructPathGen(prevMap, start, end);
      return;
    }

    const neighbors = getNeighbors(curr.r, curr.c, rows, cols, grid);
    for (const neighbor of neighbors) {
      const nKey = key(neighbor.r, neighbor.c);
      yield { type: 'current', r: neighbor.r, c: neighbor.c, line: 4 };
      if (!visited.has(nKey)) {
        visited.add(nKey);
        prevMap.set(nKey, curr);
        queue.push(neighbor);
        yield { type: 'current', r: neighbor.r, c: neighbor.c, line: 6 };
      }
    }
  }
}

// 2. DFS Generator
export function* dfsGen(grid, start, end, rows, cols) {
  const startKey = key(start.r, start.c);
  const visited = new Set([startKey]);
  const stack = [start];
  const prevMap = new Map();

  yield { type: 'current', r: start.r, c: start.c, line: 0 };

  while (stack.length) {
    yield { type: 'current', r: stack[stack.length - 1].r, c: stack[stack.length - 1].c, line: 1 };
    const curr = stack.pop();
    const currKey = key(curr.r, curr.c);

    if (curr.r !== start.r || curr.c !== start.c) {
      yield { type: 'visit', r: curr.r, c: curr.c, line: 2 };
    }

    if (curr.r === end.r && curr.c === end.c) {
      yield* reconstructPathGen(prevMap, start, end);
      return;
    }

    const neighbors = getNeighbors(curr.r, curr.c, rows, cols, grid);
    for (const neighbor of neighbors) {
      const nKey = key(neighbor.r, neighbor.c);
      yield { type: 'current', r: neighbor.r, c: neighbor.c, line: 4 };
      if (!visited.has(nKey)) {
        visited.add(nKey);
        prevMap.set(nKey, curr);
        stack.push(neighbor);
        yield { type: 'current', r: neighbor.r, c: neighbor.c, line: 6 };
      }
    }
  }
}

// 3. Dijkstra Generator
export function* dijkstraGen(grid, start, end, rows, cols) {
  const dist = new Map();
  const prevMap = new Map();
  const visited = new Set();
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dist.set(key(r, c), Infinity);
    }
  }
  dist.set(key(start.r, start.c), 0);

  // pq entries: [d, r, c]
  const pq = [[0, start.r, start.c]];

  yield { type: 'current', r: start.r, c: start.c, line: 0 };

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    yield { type: 'current', r: pq[0][1], c: pq[0][2], line: 1 };
    const [d, r, c] = pq.shift();
    const currKey = key(r, c);

    if (visited.has(currKey)) continue;
    visited.add(currKey);

    if (r !== start.r || c !== start.c) {
      yield { type: 'visit', r, c, line: 2 };
    }

    if (r === end.r && c === end.c) {
      yield* reconstructPathGen(prevMap, start, end);
      return;
    }

    const neighbors = getNeighbors(r, c, rows, cols, grid);
    for (const neighbor of neighbors) {
      const nKey = key(neighbor.r, neighbor.c);
      if (visited.has(nKey)) continue;

      // Check if grid node is weighted
      const cellWeight = grid[neighbor.r]?.[neighbor.c]?.weight || 1;
      const newDist = d + cellWeight;
      
      yield { type: 'current', r: neighbor.r, c: neighbor.c, line: 4 };
      
      if (newDist < dist.get(nKey)) {
        dist.set(nKey, newDist);
        prevMap.set(nKey, { r, c });
        pq.push([newDist, neighbor.r, neighbor.c]);
        yield { type: 'current', r: neighbor.r, c: neighbor.c, line: 7 };
      }
    }
  }
}

// 4. A* Generator
export function* astarGen(grid, start, end, rows, cols) {
  const h = (r, c) => Math.abs(r - end.r) + Math.abs(c - end.c);
  
  const gScore = new Map();
  const fScore = new Map();
  const prevMap = new Map();
  const visited = new Set();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gScore.set(key(r, c), Infinity);
      fScore.set(key(r, c), Infinity);
    }
  }
  
  gScore.set(key(start.r, start.c), 0);
  fScore.set(key(start.r, start.c), h(start.r, start.c));

  // openSet entries: [fScoreVal, r, c]
  const openSet = [[h(start.r, start.c), start.r, start.c]];

  yield { type: 'current', r: start.r, c: start.c, line: 0 };

  while (openSet.length) {
    openSet.sort((a, b) => a[0] - b[0]);
    yield { type: 'current', r: openSet[0][1], c: openSet[0][2], line: 1 };
    const [, r, c] = openSet.shift();
    const currKey = key(r, c);

    if (visited.has(currKey)) continue;
    visited.add(currKey);

    if (r !== start.r || c !== start.c) {
      yield { type: 'visit', r, c, line: 2 };
    }

    if (r === end.r && c === end.c) {
      yield* reconstructPathGen(prevMap, start, end);
      return;
    }

    const neighbors = getNeighbors(r, c, rows, cols, grid);
    for (const neighbor of neighbors) {
      const nKey = key(neighbor.r, neighbor.c);
      if (visited.has(nKey)) continue;

      const cellWeight = grid[neighbor.r]?.[neighbor.c]?.weight || 1;
      const tentativeG = gScore.get(currKey) + cellWeight;
      
      yield { type: 'current', r: neighbor.r, c: neighbor.c, line: 4 };

      if (tentativeG < gScore.get(nKey)) {
        gScore.set(nKey, tentativeG);
        const f = tentativeG + h(neighbor.r, neighbor.c);
        fScore.set(nKey, f);
        prevMap.set(nKey, { r, c });
        openSet.push([f, neighbor.r, neighbor.c]);
        yield { type: 'current', r: neighbor.r, c: neighbor.c, line: 7 };
      }
    }
  }
}

export const pathfindingAlgos = {
  bfs: bfsGen,
  dfs: dfsGen,
  dijkstra: dijkstraGen,
  astar: astarGen
};
