import React, { useState, useEffect, useRef } from 'react';
import { pathfindingAlgos, pathfindingComplexity, pathfindingPseudocode } from '../algorithms/pathfindingAlgos';

const ROWS = 15;
const COLS = 32;

export default function PathfindingVisualizer({ setGlobalTelemetry, runner, setHighlightedLine, updateCodeLines }) {
  const [algo, setAlgo] = useState('astar');
  const [drawMode, setDrawMode] = useState('wall'); // 'wall' | 'weight' | 'start' | 'end'

  const [startNode, setStartNode] = useState({ r: 7, c: 4 });
  const [endNode, setEndNode] = useState({ r: 7, c: 27 });
  const [grid, setGrid] = useState([]);

  // Drag and drop node states
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragNode, setDragNode] = useState(null); // 'start' | 'end' | null

  const visitedCountRef = useRef(0);

  // Initialize grid
  const initializeGrid = (start = startNode, end = endNode, clearWalls = true) => {
    runner.stop();
    visitedCountRef.current = 0;
    setHighlightedLine(-1);

    const newGrid = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        const isStart = r === start.r && c === start.c;
        const isEnd = r === end.r && c === end.c;

        let cellType = 'empty';
        let cellWeight = 1;

        if (isStart) cellType = 'start';
        else if (isEnd) cellType = 'end';
        else if (!clearWalls && grid[r]?.[c]) {
          // preserve walls and weights
          const existing = grid[r][c];
          if (existing.type === 'wall') cellType = 'wall';
          if (existing.type === 'weight') {
            cellType = 'weight';
            cellWeight = 5;
          }
        }

        row.push({
          r,
          c,
          type: cellType,
          weight: cellWeight
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  };

  useEffect(() => {
    initializeGrid(startNode, endNode, true);
  }, []);

  // Synchronize telemetry
  useEffect(() => {
    setGlobalTelemetry({
      status: runner.status,
      comparisons: 0,
      swaps: visitedCountRef.current,
      elapsedTime: runner.elapsedTime,
      complexity: pathfindingComplexity[algo],
      swapsLabel: 'VISITED NODES'
    });
  }, [runner.status, runner.elapsedTime, algo]);

  // Clear path (keeps walls & weights)
  const handleClearPath = () => {
    runner.stop();
    setHighlightedLine(-1);
    visitedCountRef.current = 0;

    setGrid(prevGrid =>
      prevGrid.map(row =>
        row.map(cell => {
          if (cell.type === 'visited' || cell.type === 'path' || cell.type === 'current') {
            return { ...cell, type: 'empty' };
          }
          return cell;
        })
      )
    );
  };

  // Clear everything
  const handleClearAll = () => {
    initializeGrid(startNode, endNode, true);
  };

  // Maze Generator (Randomized weights and walls)
  const handleGenerateMaze = () => {
    runner.stop();
    visitedCountRef.current = 0;
    setHighlightedLine(-1);

    const newGrid = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        const isStart = r === startNode.r && c === startNode.c;
        const isEnd = r === endNode.r && c === endNode.c;

        let type = 'empty';
        let weight = 1;

        if (isStart) {
          type = 'start';
        } else if (isEnd) {
          type = 'end';
        } else {
          const rand = Math.random();
          if (rand < 0.25) {
            type = 'wall';
          } else if (rand < 0.38) {
            type = 'weight';
            weight = 5;
          }
        }

        row.push({ r, c, type, weight });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  };

  // Run pathfinder
  const handleRun = () => {
    if (runner.isRunning) {
      if (runner.isPaused) {
        runner.resume();
      } else {
        runner.pause();
      }
      return;
    }

    // Clean previous paths first
    handleClearPath();

    // Create copy of grid with paths stripped
    const cleanGrid = grid.map(row =>
      row.map(cell => {
        if (cell.type === 'visited' || cell.type === 'path' || cell.type === 'current') {
          return { ...cell, type: 'empty' };
        }
        return cell;
      })
    );

    visitedCountRef.current = 0;

    const generator = pathfindingAlgos[algo](cleanGrid, startNode, endNode, ROWS, COLS);

    runner.start(
      generator,
      (step) => {
        setHighlightedLine(step.line);

        setGrid(prev => {
          const updated = prev.map(row => row.map(cell => ({ ...cell })));
          const cell = updated[step.r]?.[step.c];

          if (cell && cell.type !== 'start' && cell.type !== 'end') {
            if (step.type === 'visit') {
              cell.type = 'visited';
              visitedCountRef.current += 1;
            } else if (step.type === 'path') {
              cell.type = 'path';
            } else if (step.type === 'current') {
              cell.type = 'current';
            }
          }
          return updated;
        });

        setGlobalTelemetry({
          status: runner.status,
          comparisons: 0,
          swaps: visitedCountRef.current,
          elapsedTime: runner.elapsedTime,
          complexity: pathfindingComplexity[algo],
          swapsLabel: 'VISITED NODES'
        });
      },
      () => {
        // complete callback
      }
    );
  };

  // Mouse Action Handlers
  const handleMouseDown = (r, c) => {
    if (runner.isRunning) return;
    setIsMouseDown(true);

    const cell = grid[r][c];
    if (cell.type === 'start') {
      setDragNode('start');
    } else if (cell.type === 'end') {
      setDragNode('end');
    } else {
      applyCellDrawing(r, c);
    }
  };

  const handleMouseEnter = (r, c) => {
    if (!isMouseDown) return;

    if (dragNode === 'start') {
      if (r === endNode.r && c === endNode.c) return;
      setStartNode({ r, c });
      updateEndpoints(r, c, endNode);
    } else if (dragNode === 'end') {
      if (r === startNode.r && c === startNode.c) return;
      setEndNode({ r, c });
      updateEndpoints(startNode, r, c);
    } else {
      applyCellDrawing(r, c);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDragNode(null);
  };

  const updateEndpoints = (start, endR, endC) => {
    // Check if end is passed as separate coordinates or object
    const finalEnd = typeof endR === 'object' ? endR : { r: endR, c: endC };
    const finalStart = start;

    setGrid(prev =>
      prev.map((row, r) =>
        row.map((cell, c) => {
          const isStart = r === finalStart.r && c === finalStart.c;
          const isEnd = r === finalEnd.r && c === finalEnd.c;

          if (isStart) return { ...cell, type: 'start', weight: 1 };
          if (isEnd) return { ...cell, type: 'end', weight: 1 };

          // remove legacy start/end types
          if (cell.type === 'start' || cell.type === 'end') {
            return { ...cell, type: 'empty' };
          }
          return cell;
        })
      )
    );
  };

  const applyCellDrawing = (r, c) => {
    if ((r === startNode.r && c === startNode.c) || (r === endNode.r && c === endNode.c)) return;

    setGrid(prev => {
      const copy = prev.map(row => row.map(cell => ({ ...cell })));
      const cell = copy[r][c];

      if (drawMode === 'wall') {
        cell.type = cell.type === 'wall' ? 'empty' : 'wall';
        cell.weight = 1;
      } else if (drawMode === 'weight') {
        cell.type = cell.type === 'weight' ? 'empty' : 'weight';
        cell.weight = cell.type === 'weight' ? 5 : 1;
      }
      return copy;
    });
  };

  const getCellClass = (cell) => {
    if (cell.type === 'start') return 'start';
    if (cell.type === 'end') return 'end';
    if (cell.type === 'wall') return 'wall';
    if (cell.type === 'weight') return 'weight';
    if (cell.type === 'current') return 'current';
    if (cell.type === 'visited') return 'visited';
    if (cell.type === 'path') return 'path';
    return '';
  };

  return (
    <div className="visualizer-container">
      <aside className="controls">
        <div className="control-group">
          <label htmlFor="path-algo">Algorithm</label>
          <select
            id="path-algo"
            value={algo}
            disabled={runner.isRunning}
            onChange={(e) => {
              const selectedAlgo = e.target.value;
              setAlgo(selectedAlgo);
              updateCodeLines(pathfindingPseudocode[selectedAlgo]);
            }}
          >
            <option value="astar">A* Search</option>
            <option value="dijkstra">Dijkstra</option>
            <option value="bfs">Breadth-First Search</option>
            <option value="dfs">Depth-First Search</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="path-speed">
            Speed <span>{runner.speed}</span>
          </label>
          <input
            type="range"
            id="path-speed"
            min="1"
            max="10"
            value={runner.speed}
            onChange={(e) => runner.setSpeed(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Draw Mode</label>
          <div className="btn-row flex-column">
            <button
              onClick={() => setDrawMode('wall')}
              className={`btn btn-toggle ${drawMode === 'wall' ? 'active' : ''}`}
              disabled={runner.isRunning}
            >
              Wall Barrier
            </button>
            <button
              onClick={() => setDrawMode('weight')}
              className={`btn btn-toggle ${drawMode === 'weight' ? 'active' : ''}`}
              disabled={runner.isRunning}
            >
              Weight (Cost: 5)
            </button>
          </div>
        </div>

        <div className="control-group btn-row">
          <button onClick={handleGenerateMaze} className="btn btn-ghost" disabled={runner.isRunning}>
            Random Maze
          </button>
          <button onClick={handleClearPath} className="btn btn-ghost" disabled={runner.isRunning && !runner.isPaused}>
            Clear Path
          </button>
          <button onClick={handleClearAll} className="btn btn-ghost" disabled={runner.isRunning}>
            ↻ Reset Grid
          </button>
        </div>

        <div className="control-group btn-row">
          <button onClick={handleRun} className="btn btn-primary">
            {runner.isRunning ? (runner.isPaused ? '▶ Resume' : '▮▮ Pause') : '▶ Run'}
          </button>

          {runner.isPaused && (
            <button onClick={runner.stepNext} className="btn btn-ghost">
              ↷ Step
            </button>
          )}

          <button onClick={runner.stop} className="btn btn-ghost" disabled={!runner.isRunning}>
            ■ Stop
          </button>
        </div>

        <div className="legend">
          <div><span className="swatch start"></span> Start (Drag to move)</div>
          <div><span className="swatch end"></span> End (Drag to move)</div>
          <div><span className="swatch wall"></span> Wall (Blocker)</div>
          <div><span className="swatch weight"></span> Weight (Cost: 5)</div>
          <div><span className="swatch visited"></span> Visited</div>
          <div><span className="swatch path"></span> Shortest Path</div>
        </div>
      </aside>

      <div className="viewport">
        <div
          className="grid-container"
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`cell ${getCellClass(cell)}`}
                  onMouseDown={() => handleMouseDown(r, c)}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                >
                  {cell.type === 'weight' && <span className="cell-icon">⛰</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
