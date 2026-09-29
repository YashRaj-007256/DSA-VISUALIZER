import React, { useState, useEffect, useRef } from 'react';
import { sortingAlgos, sortingPseudocode, sortingComplexity } from '../algorithms/sortingAlgos';
import { useAlgorithmRunner } from '../hooks/useAlgorithmRunner';

export default function SortingVisualizer({ setGlobalTelemetry, runner, setHighlightedLine, updateCodeLines }) {
  const [algo, setAlgo] = useState('bubble');
  const [size, setSize] = useState(50);
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState('');

  // Local arrays and indices states
  const [array, setArray] = useState([]);
  const [compareIdxs, setCompareIdxs] = useState([]);
  const [swapIdxs, setSwapIdxs] = useState([]);
  const [sortedIdxs, setSortedIdxs] = useState(new Set());
  const [selectIdxs, setSelectIdxs] = useState([]);
  
  // Counters for telemetry
  const comparesRef = useRef(0);
  const swapsRef = useRef(0);

  // Generate random array
  const generateRandomArray = (n) => {
    runner.stop();
    setCompareIdxs([]);
    setSwapIdxs([]);
    setSelectIdxs([]);
    setSortedIdxs(new Set());
    comparesRef.current = 0;
    swapsRef.current = 0;
    setHighlightedLine(-1);
    setCustomError('');

    const newArray = Array.from({ length: n }, () => Math.floor(Math.random() * 360) + 40);
    setArray(newArray);
  };

  // Run on mount or size change
  useEffect(() => {
    generateRandomArray(size);
  }, [size]);

  // Synchronize global telemetry when status, speed, or values change
  useEffect(() => {
    setGlobalTelemetry({
      status: runner.status,
      comparisons: comparesRef.current,
      swaps: swapsRef.current,
      elapsedTime: runner.elapsedTime,
      complexity: sortingComplexity[algo],
      swapsLabel: 'SWAPS / OVERWRITES'
    });
  }, [runner.status, runner.elapsedTime, algo]);

  // Triggered when the algorithm finishes
  const handleFinish = () => {
    // Highlight all elements as sorted at completion
    const allSorted = new Set(Array.from({ length: array.length }, (_, i) => i));
    setSortedIdxs(allSorted);
    setCompareIdxs([]);
    setSwapIdxs([]);
    setSelectIdxs([]);
  };

  // Run selected algorithm
  const handleRun = () => {
    if (runner.isRunning) {
      if (runner.isPaused) {
        runner.resume();
      } else {
        runner.pause();
      }
      return;
    }

    setCompareIdxs([]);
    setSwapIdxs([]);
    setSelectIdxs([]);
    setSortedIdxs(new Set());
    comparesRef.current = 0;
    swapsRef.current = 0;

    const generator = sortingAlgos[algo](array);
    
    runner.start(
      generator,
      (step) => {
        // Step Tick Callback
        setHighlightedLine(step.line);
        if (step.array) {
          setArray(step.array);
        }

        if (step.type === 'compare') {
          comparesRef.current += 1;
          setCompareIdxs(step.indices);
          setSwapIdxs([]);
          setSelectIdxs([]);
        } else if (step.type === 'swap') {
          swapsRef.current += 1;
          setSwapIdxs(step.indices);
          setCompareIdxs([]);
          setSelectIdxs([]);
        } else if (step.type === 'overwrite') {
          swapsRef.current += 1;
          setSwapIdxs(step.indices);
          setCompareIdxs([]);
          setSelectIdxs([]);
        } else if (step.type === 'select') {
          setSelectIdxs(step.indices);
          setCompareIdxs([]);
          setSwapIdxs([]);
        } else if (step.type === 'sorted') {
          setSortedIdxs((prev) => {
            const next = new Set(prev);
            step.indices.forEach(idx => next.add(idx));
            return next;
          });
        }

        // Live telemetry updates
        setGlobalTelemetry({
          status: runner.status,
          comparisons: comparesRef.current,
          swaps: swapsRef.current,
          elapsedTime: runner.elapsedTime,
          complexity: sortingComplexity[algo],
          swapsLabel: 'SWAPS / OVERWRITES'
        });
      },
      handleFinish
    );
  };

  const handleCustomInputSubmit = (e) => {
    e.preventDefault();
    runner.stop();
    setCompareIdxs([]);
    setSwapIdxs([]);
    setSelectIdxs([]);
    setSortedIdxs(new Set());
    comparesRef.current = 0;
    swapsRef.current = 0;
    setHighlightedLine(-1);
    setCustomError('');

    const values = customInput
      .split(',')
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(Number);

    if (values.some(isNaN)) {
      setCustomError('Please enter valid numbers separated by commas.');
      return;
    }

    if (values.length < 5 || values.length > 100) {
      setCustomError('Please enter between 5 and 100 numbers.');
      return;
    }

    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    // Scale values so they render nicely within 50px to 400px height
    const scaledValues = values.map((val) => {
      if (maxVal === minVal) return 200;
      return 50 + ((val - minVal) / (maxVal - minVal)) * 320;
    });

    setArray(scaledValues);
    setSize(values.length);
  };

  // Get color state of individual bars
  const getBarClass = (idx) => {
    if (swapIdxs.includes(idx)) return 'swap';
    if (compareIdxs.includes(idx)) return 'compare';
    if (selectIdxs.includes(idx)) return 'select';
    if (sortedIdxs.has(idx)) return 'sorted';
    return '';
  };

  return (
    <div className="visualizer-container">
      <aside className="controls">
        <div className="control-group">
          <label htmlFor="sort-algo">Algorithm</label>
          <select
            id="sort-algo"
            value={algo}
            disabled={runner.isRunning}
            onChange={(e) => {
              const selectedAlgo = e.target.value;
              setAlgo(selectedAlgo);
              updateCodeLines(sortingPseudocode[selectedAlgo]);
            }}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
            <option value="heap">Heap Sort</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort-size">
            Array size <span>{size}</span>
          </label>
          <input
            type="range"
            id="sort-size"
            min="10"
            max="120"
            value={size}
            disabled={runner.isRunning}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label htmlFor="sort-speed">
            Speed <span>{runner.speed}</span>
          </label>
          <input
            type="range"
            id="sort-speed"
            min="1"
            max="10"
            value={runner.speed}
            onChange={(e) => runner.setSpeed(Number(e.target.value))}
          />
        </div>

        <form className="control-group custom-input-group" onSubmit={handleCustomInputSubmit}>
          <label htmlFor="custom-array">Custom Input (csv)</label>
          <div className="flex-row">
            <input
              type="text"
              id="custom-array"
              placeholder="e.g. 10, 80, 30, 90, 40"
              value={customInput}
              disabled={runner.isRunning}
              onChange={(e) => setCustomInput(e.target.value)}
            />
            <button type="submit" className="btn btn-ghost small" disabled={runner.isRunning}>
              Load
            </button>
          </div>
          {customError && <p className="error-text">{customError}</p>}
        </form>

        <div className="control-group btn-row">
          <button
            onClick={() => generateRandomArray(size)}
            className="btn btn-ghost"
            disabled={runner.isRunning && !runner.isPaused}
          >
            ↻ New Array
          </button>
          
          <button onClick={handleRun} className="btn btn-primary">
            {runner.isRunning ? (runner.isPaused ? '▶ Resume' : '▮▮ Pause') : '▶ Run'}
          </button>

          {runner.isPaused && (
            <button onClick={runner.stepNext} className="btn btn-ghost">
              ↷ Step
            </button>
          )}

          <button
            onClick={runner.stop}
            className="btn btn-ghost"
            disabled={!runner.isRunning}
          >
            ■ Stop
          </button>
        </div>

        <div className="legend">
          <div><span className="swatch idle"></span> Idle</div>
          <div><span className="swatch select"></span> Selected / Partition</div>
          <div><span className="swatch compare"></span> Comparing</div>
          <div><span className="swatch swap"></span> Swapping / Overwriting</div>
          <div><span className="swatch sorted"></span> Sorted</div>
        </div>
      </aside>

      <div className="viewport">
        <div className="bars-container">
          <div className="bars">
            {array.map((val, idx) => (
              <div
                key={idx}
                className={`bar ${getBarClass(idx)}`}
                style={{ height: `${val}px` }}
              >
                {size <= 25 && <span className="bar-label">{Math.round(val)}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
