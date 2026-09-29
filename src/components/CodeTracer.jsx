import React from 'react';

export default function CodeTracer({ codeObj = null, highlightedLine = -1, selectedLanguage = 'pseudocode', setSelectedLanguage }) {
  if (!codeObj) {
    return (
      <div className="code-tracer empty">
        <p className="trace-status">// No active algorithm tracer</p>
      </div>
    );
  }

  // Support both the new object format and the legacy array format
  let lines = [];
  if (Array.isArray(codeObj)) {
    lines = codeObj;
  } else {
    lines = codeObj[selectedLanguage] || codeObj['pseudocode'] || [];
  }

  if (lines.length === 0) {
    return (
      <div className="code-tracer empty">
        <p className="trace-status">// No active algorithm tracer</p>
      </div>
    );
  }

  return (
    <div className="code-tracer">
      <div className="tracer-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="tracer-dot"></span> Live Telemetry Tracer
        </div>
        {setSelectedLanguage && (
          <select 
            value={selectedLanguage} 
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{ width: 'auto', padding: '4px 8px', fontSize: '11px', background: 'var(--panel-raised)', border: '1px solid var(--line)', borderRadius: '4px', color: 'var(--text)' }}
          >
            <option value="pseudocode">Pseudocode</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
        )}
      </div>
      <div className="code-container">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={`code-line ${highlightedLine === idx ? 'highlighted' : ''}`}
          >
            <span className="line-num">{String(idx + 1).padStart(2, '0')}</span>
            <pre className="line-text">{line}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
