import { Play, SkipForward, RotateCcw } from 'lucide-react';
import './ControlBar.css';

export default function ControlBar({ onRun, onNext, onReset }) {
  return (
    <div className="control-bar">
      <button className="control-btn reset-btn" onClick={onReset}>
        <RotateCcw size={18} />
        <span>Reset</span>
      </button>
      <button className="control-btn run-btn" onClick={onRun}>
        <Play size={18} />
        <span>Run</span>
      </button>
      <button className="control-btn next-btn" onClick={onNext}>
        <SkipForward size={18} />
        <span>Next</span>
      </button>
    </div>
  );
}
