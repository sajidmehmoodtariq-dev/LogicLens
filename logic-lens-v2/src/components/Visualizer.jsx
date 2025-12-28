import { Braces, Box } from 'lucide-react';
import StackVisualizer from './StackVisualizer';
import HeapVisualizer from './HeapVisualizer';
import './Visualizer.css';

export default function Visualizer({ variables, heap, currentLine }) {
  const hasVariables = variables && Object.keys(variables).length > 0;
  const hasHeap = heap && Object.keys(heap).length > 0;

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
      <div className="visualizer-content-split">
        {/* Stack Section */}
        <div className="stack-section">
          <div className="section-header">
            <Braces size={16} />
            <span>Stack</span>
          </div>
          <div className="section-canvas">
            <StackVisualizer variables={variables} />
          </div>
        </div>

        {/* Heap Section */}
        <div className="heap-section">
          <div className="section-header">
            <Box size={16} />
            <span>Heap</span>
          </div>
          <div className="heap-canvas">
            <HeapVisualizer heap={heap} />
          </div>
        </div>
      </div>
    </div>
  );
}
