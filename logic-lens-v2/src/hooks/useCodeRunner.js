import { useRef, useState } from 'react';
import Memory from '../engine/Memory';
import { CppStack, CppQueue } from '../engine/StlMocks';

export default function useCodeRunner() {
  const resolverRef = useRef(null);
  const memoryRef = useRef(new Memory());
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [variables, setVariables] = useState({});
  const [heap, setHeap] = useState({});

  // The magic pause function - returns a promise that waits for user to click "Next"
  const step = (lineInfo, scope = {}) => {
    console.log(`Paused at line ${lineInfo}`, scope);
    setCurrentLine(lineInfo);
    setVariables(scope);
    setHeap(memoryRef.current.getHeapState());
    
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  };

  // Called when user clicks "Next" button
  const handleNext = () => {
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    }
  };

  // Called when user clicks "Run" button
  const handleRun = async (transpiledCode) => {
    setIsRunning(true);
    setCurrentLine(null);
    memoryRef.current.clear(); // Clear memory for new execution
    
    try {
      // Create an async function that can use await
      // Pass Memory class, memory instance, and STL mocks to the function context
      const asyncFunc = new Function('step', 'Memory', 'memory', 'CppStack', 'CppQueue', `
        return (async () => {
          ${transpiledCode}
        })();
      `);
      
      // Execute the code with the step function, memory instance, and STL classes
      await asyncFunc(step, Memory, memoryRef.current, CppStack, CppQueue);
      
      console.log('Execution completed');
      setCurrentLine(null);
    } catch (error) {
      console.error('Execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Called when user clicks "Reset" button
  const handleReset = () => {
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    }
    setIsRunning(false);
    setCurrentLine(null);
    setVariables({});
    setHeap({});
    memoryRef.current.clear();
    console.log('Execution reset');
  };

  return {
    isRunning,
    currentLine,
    variables,
    heap,
    handleRun,
    handleNext,
    handleReset,
  };
}
