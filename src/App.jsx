import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CodeTracer from './components/CodeTracer';
import SortingVisualizer from './components/SortingVisualizer';
import PathfindingVisualizer from './components/PathfindingVisualizer';
import DataStructuresVisualizer, { dsPseudocode } from './components/DataStructuresVisualizer';
import TreeVisualizer from './components/TreeVisualizer';
import { treePseudocode } from './algorithms/treeAlgos';
import { useAlgorithmRunner } from './hooks/useAlgorithmRunner';
import { sortingPseudocode } from './algorithms/sortingAlgos';
import { pathfindingPseudocode } from './algorithms/pathfindingAlgos';

export default function App() {
  const [activeMode, setActiveMode] = useState('sort');
  const runner = useAlgorithmRunner();

  // Dark/Light Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [language, setLanguage] = useState(() => localStorage.getItem('codeLanguage') || 'python');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('codeLanguage', language);
  }, [language]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Highlight and pseudocode tracing states
  const [codeObj, setCodeObj] = useState(null);
  const [highlightedLine, setHighlightedLine] = useState(-1);

  // Telemetry details
  const [telemetryData, setTelemetryData] = useState({
    status: 'STANDBY',
    comparisons: 0,
    swaps: 0,
    elapsedTime: 0,
    complexity: null,
    swapsLabel: 'SWAPS / VISITED'
  });

  // Automatically update the CodeTracer lines when changing tabs
  useEffect(() => {
    runner.stop();
    setHighlightedLine(-1);
    if (activeMode === 'sort') {
      setCodeObj(sortingPseudocode.bubble);
    } else if (activeMode === 'path') {
      setCodeObj(pathfindingPseudocode.astar);
    } else if (activeMode === 'ds') {
      setCodeObj(dsPseudocode.stack_push);
    } else if (activeMode === 'tree') {
      setCodeObj(treePseudocode.insert);
    }
  }, [activeMode]);

  // Callback to set active pseudocode (e.g. when changing algorithm dropdowns)
  const handleUpdateCodeLines = (linesObj) => {
    setCodeObj(linesObj);
    setHighlightedLine(-1);
  };

  const renderVisualizer = () => {
    switch (activeMode) {
      case 'sort':
        return (
          <SortingVisualizer
            runner={runner}
            setGlobalTelemetry={setTelemetryData}
            setHighlightedLine={setHighlightedLine}
            updateCodeLines={handleUpdateCodeLines}
          />
        );
      case 'path':
        return (
          <PathfindingVisualizer
            runner={runner}
            setGlobalTelemetry={setTelemetryData}
            setHighlightedLine={setHighlightedLine}
            updateCodeLines={handleUpdateCodeLines}
          />
        );
      case 'ds':
        return (
          <DataStructuresVisualizer
            runner={runner}
            setGlobalTelemetry={setTelemetryData}
            setHighlightedLine={setHighlightedLine}
            updateCodeLines={handleUpdateCodeLines}
          />
        );
      case 'tree':
        return (
          <TreeVisualizer
            runner={runner}
            setGlobalTelemetry={setTelemetryData}
            setHighlightedLine={setHighlightedLine}
            updateCodeLines={handleUpdateCodeLines}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="telemetry-console">
      <Header
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        onStop={runner.stop}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="app-stage">
        {/* Left Side: Active Visualizer + Controls */}
        <div className="visualizer-area">
          {renderVisualizer()}
        </div>

        {/* Right Side: Code execution trace panel */}
        <div className="tracer-area">
          <CodeTracer
            codeObj={codeObj}
            highlightedLine={highlightedLine}
            selectedLanguage={language}
            setSelectedLanguage={setLanguage}
          />
        </div>
      </main>

      <Footer
        status={telemetryData.status}
        comparisons={telemetryData.comparisons}
        swaps={telemetryData.swaps}
        elapsedTime={telemetryData.elapsedTime}
        complexity={telemetryData.complexity}
        swapsLabel={telemetryData.swapsLabel}
      />
    </div>
  );
}
