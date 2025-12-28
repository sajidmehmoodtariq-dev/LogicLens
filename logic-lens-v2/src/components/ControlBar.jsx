import { Play, SkipForward, RotateCcw } from 'lucide-react';
import './ControlBar.css';

export default function ControlBar({ onRun, onNext, onReset, isRunning, currentLine }) {
  return (
    <div className="control-bar">
      <button 
        className="control-btn reset-btn" 
        onClick={onReset}
        disabled={!isRunning}
      >
        <RotateCcw size={18} />
        <span>Reset</span>
      </button>
      <button 
        className="control-btn run-btn" 
        onClick={onRun}
        disabled={isRunning}
      >
        <Play size={18} />
        <span>Run</span>
      </button>
      <button 
        className="control-btn next-btn" 
        onClick={onNext}
        disabled={!isRunning}
      >
        <SkipForward size={18} />
        <span>Next</span>
      </button>
      {currentLine && (
        <div className="status-indicator">
          Line {currentLine}
        </div>
      )}
    </div>
  );
}
