import React from 'react';

export default function Footer({ status, comparisons, swaps, elapsedTime, complexity, swapsLabel = "SWAPS / VISITED" }) {
  const pad = (n) => String(Math.floor(n)).padStart(4, '0');
  
  const getStatusClass = () => {
    if (status === 'RUNNING') return 'running';
    if (status === 'PAUSED') return 'paused';
    if (status === 'COMPLETE') return 'done';
    return '';
  };

  return (
    <footer className="telemetry">
      <div className="telemetry-item">
        <span className="t-label">STATUS</span>
        <span className={`t-value ${getStatusClass()}`} id="t-status">
          {status}
        </span>
      </div>
      
      <div className="telemetry-item">
        <span className="t-label">COMPARISONS / OP COUNT</span>
        <span className="t-value" id="t-compares">
          {pad(comparisons)}
        </span>
      </div>
      
      <div className="telemetry-item">
        <span className="t-label">{swapsLabel}</span>
        <span className="t-value" id="t-swaps">
          {pad(swaps)}
        </span>
      </div>
      
      <div className="telemetry-item">
        <span className="t-label">ELAPSED TIME</span>
        <span className="t-value" id="t-time">
          {elapsedTime.toFixed(2)}s
        </span>
      </div>
      
      <div className="telemetry-item">
        <span className="t-label">COMPLEXITY (TIME / SPACE)</span>
        <span className="t-value" id="t-complexity">
          {complexity ? `${complexity.time} / ${complexity.space}` : 'N/A'}
        </span>
      </div>
    </footer>
  );
}
