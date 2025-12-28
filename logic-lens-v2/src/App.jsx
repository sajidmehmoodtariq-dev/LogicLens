import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Visualizer from './components/Visualizer';
import ControlBar from './components/ControlBar';
import useCodeRunner from './hooks/useCodeRunner';
import { transpile } from './engine/Transpiler';
import './App.css';

function App() {
  const [code, setCode] = useState(`// Write C++ code here!
int main() {
   int x = 10;
   x = 11;
   int y = 20;
   cout << "X = " << x;
   cout << "Y = " << y;
}`);

  const { isRunning, currentLine, variables, handleRun, handleNext, handleReset } = useCodeRunner();

  const onRun = () => {
    console.log('=== Starting Execution ===');
    const transpiledCode = transpile(code);
    console.log('Transpiled code:', transpiledCode);
    handleRun(transpiledCode);
  };

  const onNext = () => {
    console.log('Next clicked - continuing execution');
    handleNext();
  };

  const onReset = () => {
    console.log('Reset clicked');
    handleReset();
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <CodeEditor value={code} onChange={setCode} />
        <Visualizer variables={variables} currentLine={currentLine} />
      </div>
      <ControlBar 
        onRun={onRun} 
        onNext={onNext} 
        onReset={onReset}
        isRunning={isRunning}
        currentLine={currentLine}
      />
    </div>
  );
}

export default App;
