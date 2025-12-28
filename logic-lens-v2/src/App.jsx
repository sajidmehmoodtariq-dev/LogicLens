import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Visualizer from './components/Visualizer';
import ControlBar from './components/ControlBar';
import './App.css';

function App() {
  const [code, setCode] = useState(`// Write your logic code here
function example() {
  let x = 10;
  if (x > 5) {
    console.log("Greater than 5");
  } else {
    console.log("Less than or equal to 5");
  }
  return x;
}`);

  const handleRun = () => {
    console.log('Run clicked');
    // TODO: Execute code
  };

  const handleNext = () => {
    console.log('Next clicked');
    // TODO: Step to next execution point
  };

  const handleReset = () => {
    console.log('Reset clicked');
    // TODO: Reset execution state
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <CodeEditor value={code} onChange={setCode} />
        <Visualizer />
      </div>
      <ControlBar onRun={handleRun} onNext={handleNext} onReset={handleReset} />
    </div>
  );
}

export default App;
