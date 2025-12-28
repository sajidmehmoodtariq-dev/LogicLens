import { Braces } from 'lucide-react';
import './Visualizer.css';

export default function Visualizer() {
  return (
    <div className="visualizer-panel">
      <div className="visualizer-header">
        <div className="visualizer-title">
          <Braces size={18} className="visualizer-icon" />
          <span>Memory Visualization</span>
        </div>
      </div>
      <div className="visualizer-content">
        <div className="visualizer-placeholder">
          <h3>Visualizer Area</h3>
          <p>Logic flow visualization will appear here</p>
        </div>
      </div>
    </div>
  );
}
