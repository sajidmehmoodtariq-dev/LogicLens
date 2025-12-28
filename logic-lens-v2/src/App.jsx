import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Visualizer from './components/Visualizer';
import ControlBar from './components/ControlBar';
import useCodeRunner from './hooks/useCodeRunner';
import { transpile } from './engine/Transpiler';
import './App.css';

function App() {
  const [code, setCode] = useState(`// C++ with if-else example
int main() {
   int x = 10;
   if (x > 5) {
      x = 15;
   } else {
      cout << "X is not greater than 5";
   }
   int y = 20;
   cout << "Done!";
}`);

  const { isRunning, currentLine, variables, heap, handleRun, handleNext, handleReset } = useCodeRunner();

  const onRun = () => {
    console.log('=== Starting Execution ===');
    const transpiledCode = transpile(code);
    console.log('Transpiled code:', transpiledCode);
    handleRun(transpiledCode);
  };

  const onNext = () => {
    console.log('Next clicked - continuing execution');
    console.log('Current heap:', heap);
    console.log('Current variables:', variables);
    handleNext();
  };

  const onReset = () => {
    console.log('Reset clicked');
    handleReset();
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <CodeEditor value={code} onChange={setCode} currentLine={currentLine} />
        <Visualizer variables={variables} heap={heap} currentLine={currentLine} />
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
