import { Braces } from 'lucide-react';
import './Visualizer.css';

export default function Visualizer({ variables, currentLine }) {
  const hasVariables = variables && Object.keys(variables).length > 0;

  return (
    <div className="visualizer-panel">
      <div className="visualizer-header">
        <div className="visualizer-title">
          <Braces size={18} className="visualizer-icon" />
          <span>Memory Visualization</span>
        </div>
        {currentLine && (
          <div className="line-indicator">
            Line {currentLine}
          </div>
        )}
      </div>
      <div className="visualizer-content">
        {hasVariables ? (
          <div className="stack-container">
            <div className="stack-title">Stack Frame</div>
            <div className="variables-list">
              {Object.entries(variables).map(([name, value]) => (
                <div key={name} className="variable-item">
                  <span className="var-name">{name}</span>
                  <span className="var-separator">:</span>
                  <span className="var-value">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="visualizer-placeholder">
            <h3>Memory Visualization</h3>
            <p>Variables will appear here during execution</p>
          </div>
        )}
      </div>
    </div>
  );
}
