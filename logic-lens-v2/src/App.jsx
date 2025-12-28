import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Visualizer from './components/Visualizer';
import ControlBar from './components/ControlBar';
import useCodeRunner from './hooks/useCodeRunner';
import { transpile } from './engine/Transpiler';
import './App.css';

function App() {
  const [code, setCode] = useState(`// C++ Linked List Example
int main() {
   Node* a = new Node();
   Node* b = new Node();
   a->next = b;
   cout << "Linked list created!";
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
        <CodeEditor value={code} onChange={setCode} />
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
