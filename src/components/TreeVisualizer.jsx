import React, { useState, useEffect, useRef } from 'react';
import { useAlgorithmRunner } from '../hooks/useAlgorithmRunner';
import {
  treeComplexity,
  treePseudocode,
  cloneTree,
  layoutTree,
  treeInsertGen,
  treeFindGen,
  treeDeleteGen,
  treeTraverseGen
} from '../algorithms/treeAlgos';

export default function TreeVisualizer({ setGlobalTelemetry, runner, setHighlightedLine, updateCodeLines }) {
  const [treeRoot, setTreeRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activeNodeId, setActiveNodeId] = useState(null);

  const [travType, setTravType] = useState('inorder');
  const [traversalPath, setTraversalPath] = useState([]);

  // Track operations for telemetry
  const opCountRef = useRef(0);
  const currentOpRef = useRef('insert');

  // Synchronize telemetry
  useEffect(() => {
    setGlobalTelemetry({
      status: runner.status,
      comparisons: 0,
      swaps: opCountRef.current,
      elapsedTime: runner.elapsedTime,
      complexity: treeComplexity[currentOpRef.current],
      swapsLabel: 'OPERATIONS RUN'
    });
  }, [runner.status, runner.elapsedTime]);

  const handleClear = () => {
    runner.stop();
    setTreeRoot(null);
    setActiveNodeId(null);
    setTraversalPath([]);
    opCountRef.current = 0;
    setHighlightedLine(-1);
  };

  // Generate random tree
  const handleGenerateRandomTree = () => {
    runner.stop();
    setActiveNodeId(null);
    setTraversalPath([]);
    setHighlightedLine(-1);

    // Insert 6-8 random keys
    const keys = [];
    while (keys.length < 7) {
      const val = Math.floor(Math.random() * 80) + 10;
      if (!keys.includes(val)) keys.push(val);
    }

    let root = null;
    const insertHelper = (node, val) => {
      if (!node) {
        return { id: Math.floor(Math.random() * 1000000), val, left: null, right: null };
      }
      if (val < node.val) node.left = insertHelper(node.left, val);
      else node.right = insertHelper(node.right, val);
      return node;
    };

    keys.forEach((val) => {
      root = insertHelper(root, val);
    });

    layoutTree(root);
    setTreeRoot(root);
    opCountRef.current = keys.length;
  };

  // Insert Action
  const handleInsert = (e) => {
    e.preventDefault();
    if (runner.isRunning) return;
    const val = parseInt(inputValue.trim(), 10);
    if (isNaN(val)) return;
    setInputValue('');

    currentOpRef.current = 'insert';
    setTraversalPath([]);
    updateCodeLines(treePseudocode.insert);

    const generator = treeInsertGen(treeRoot, val);
    runner.start(
      generator,
      (step) => {
        setHighlightedLine(step.line);
        if (step.tree) setTreeRoot(step.tree);
        setActiveNodeId(step.activeId);
      },
      () => {
        setActiveNodeId(null);
        opCountRef.current += 1;
      }
    );
  };

  // Search Action
  const handleSearch = () => {
    if (runner.isRunning) return;
    const val = parseInt(inputValue.trim(), 10);
    if (isNaN(val)) return;
    setInputValue('');

    currentOpRef.current = 'find';
    setTraversalPath([]);
    updateCodeLines(treePseudocode.find);

    const generator = treeFindGen(treeRoot, val);
    runner.start(
      generator,
      (step) => {
        setHighlightedLine(step.line);
        setActiveNodeId(step.activeId);
      },
      () => {
        // finished
        opCountRef.current += 1;
      }
    );
  };

  // Delete Action
  const handleDelete = () => {
    if (runner.isRunning) return;
    const val = parseInt(inputValue.trim(), 10);
    if (isNaN(val)) return;
    setInputValue('');

    currentOpRef.current = 'delete';
    setTraversalPath([]);
    updateCodeLines(treePseudocode.delete);

    const generator = treeDeleteGen(treeRoot, val);
    runner.start(
      generator,
      (step) => {
        setHighlightedLine(step.line);
        if (step.tree !== undefined) setTreeRoot(step.tree);
        setActiveNodeId(step.activeId);
      },
      () => {
        setActiveNodeId(null);
        opCountRef.current += 1;
      }
    );
  };

  // Traversal Action
  const handleTraversal = () => {
    if (runner.isRunning) return;
    if (!treeRoot) return;

    currentOpRef.current = 'traverse';
    setTraversalPath([]);
    updateCodeLines(treePseudocode.traverse);

    const generator = treeTraverseGen(treeRoot, travType);
    runner.start(
      generator,
      (step) => {
        setHighlightedLine(step.line);
        setActiveNodeId(step.activeId);
        if (step.path) setTraversalPath(step.path);
      },
      () => {
        setActiveNodeId(null);
        opCountRef.current += 1;
      }
    );
  };

  // SVG Render Helper: Traverse and build line paths
  const renderLines = (node) => {
    if (!node) return null;
    const lines = [];
    if (node.left) {
      lines.push(
        <line
          key={`l-${node.id}-${node.left.id}`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          className="tree-edge"
        />
      );
      lines.push(...(renderLines(node.left) || []));
    }
    if (node.right) {
      lines.push(
        <line
          key={`l-${node.id}-${node.right.id}`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          className="tree-edge"
        />
      );
      lines.push(...(renderLines(node.right) || []));
    }
    return lines;
  };

  // SVG Render Helper: Traverse and build node markers
  const renderNodes = (node) => {
    if (!node) return null;
    const nodes = [];
    const isActive = activeNodeId === node.id;

    nodes.push(
      <g key={`g-${node.id}`} className={`tree-node-group ${isActive ? 'active' : ''}`}>
        <circle
          cx={node.x}
          cy={node.y}
          r="18"
          className="tree-node-circle"
        />
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          className="tree-node-text"
        >
          {node.val}
        </text>
      </g>
    );
    nodes.push(...(renderNodes(node.left) || []));
    nodes.push(...(renderNodes(node.right) || []));
    return nodes;
  };

  return (
    <div className="visualizer-container">
      <aside className="controls">
        <div className="control-group">
          <label htmlFor="tree-value">Node value</label>
          <div className="flex-row">
            <input
              type="number"
              id="tree-value"
              placeholder="e.g. 45"
              value={inputValue}
              disabled={runner.isRunning}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={handleInsert} className="btn btn-primary" disabled={runner.isRunning}>
              Insert
            </button>
          </div>
          <div className="flex-row" style={{ marginTop: '8px', gap: '8px' }}>
            <button onClick={handleSearch} className="btn btn-ghost" disabled={runner.isRunning || !treeRoot} style={{ flex: 1 }}>
              Find
            </button>
            <button onClick={handleDelete} className="btn btn-ghost" disabled={runner.isRunning || !treeRoot} style={{ flex: 1 }}>
              Delete
            </button>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="trav-select">Traversals</label>
          <select
            id="trav-select"
            value={travType}
            disabled={runner.isRunning}
            onChange={(e) => setTravType(e.target.value)}
          >
            <option value="inorder">In-Order Traversal</option>
            <option value="preorder">Pre-Order Traversal</option>
            <option value="postorder">Post-Order Traversal</option>
          </select>
          <button
            onClick={handleTraversal}
            className="btn btn-ghost"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={runner.isRunning || !treeRoot}
          >
            ▶ Run Traversal
          </button>
        </div>

        <div className="control-group">
          <label htmlFor="tree-speed">
            Speed <span>{runner.speed}</span>
          </label>
          <input
            type="range"
            id="tree-speed"
            min="1"
            max="10"
            value={runner.speed}
            onChange={(e) => runner.setSpeed(Number(e.target.value))}
          />
        </div>

        <div className="control-group btn-row">
          <button onClick={handleGenerateRandomTree} className="btn btn-ghost" disabled={runner.isRunning}>
            Random Tree
          </button>
          <button onClick={handleClear} className="btn btn-ghost" disabled={runner.isRunning}>
            Clear
          </button>
        </div>

        {runner.isRunning && (
          <div className="control-group btn-row">
            <button onClick={runner.stop} className="btn btn-ghost" style={{ width: '100%' }}>
              ■ Stop
            </button>
          </div>
        )}

        <div className="legend">
          <div><span className="swatch start"></span> Visited / Selected</div>
          <div><span className="swatch compare"></span> Exploring Node</div>
          <div><span className="swatch idle"></span> Idle Node</div>
        </div>
      </aside>

      <div className="viewport flex-column">
        <div className="tree-viewport-inner">
          {treeRoot ? (
            <svg viewBox="0 0 800 360" className="tree-svg">
              <g>{renderLines(treeRoot)}</g>
              <g>{renderNodes(treeRoot)}</g>
            </svg>
          ) : (
            <div className="empty-placeholder">BST EMPTY. GENERATE A RANDOM TREE OR INSERT VALUES.</div>
          )}
        </div>

        {traversalPath.length > 0 && (
          <div className="traversal-path-display">
            <span className="t-label">TRAVERSAL PATH:</span>
            <div className="path-values">
              {traversalPath.map((v, i) => (
                <span key={i} className="path-node-badge">
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
