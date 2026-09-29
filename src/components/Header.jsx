import React from 'react';

export default function Header({ activeMode, setActiveMode, onStop, theme, toggleTheme }) {
  const modes = [
    { id: 'sort', num: '01', name: 'Sorting' },
    { id: 'path', num: '02', name: 'Pathfinding' },
    { id: 'ds', num: '03', name: 'Stack & Queue' },
    { id: 'tree', num: '04', name: 'Binary Tree' }
  ];

  const handleModeChange = (modeId) => {
    if (activeMode === modeId) return;
    onStop();
    setActiveMode(modeId);
  };

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">◎</span>
        <div className="brand-text">
          <h1>DSA<span>VISUALIZER</span></h1>
          <p className="brand-sub">algorithm telemetry console</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <nav className="mode-switch" role="tablist" aria-label="Visualizer mode">
          {modes.map((m) => (
            <button
              key={m.id}
              className={`mode-btn ${activeMode === m.id ? 'active' : ''}`}
              onClick={() => handleModeChange(m.id)}
              role="tab"
              aria-selected={activeMode === m.id}
            >
              <span className="mode-idx">{m.num}</span> {m.name}
            </button>
          ))}
        </nav>
        <button
          onClick={toggleTheme}
          className="btn theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          type="button"
        >
          <span className="theme-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
          <span className="theme-label">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
      </div>
    </header>
  );
}
