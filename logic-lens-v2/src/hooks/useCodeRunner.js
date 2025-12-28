import { useRef, useState } from 'react';

export default function useCodeRunner() {
  const resolverRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [variables, setVariables] = useState({});

  // The magic pause function - returns a promise that waits for user to click "Next"
  const step = (lineInfo, scope = {}) => {
    console.log(`Paused at line ${lineInfo}`, scope);
    setCurrentLine(lineInfo);
    setVariables(scope);
    
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
    
    try {
      // Create an async function that can use await
      const asyncFunc = new Function('step', `
        return (async () => {
          ${transpiledCode}
        })();
      `);
      
      // Execute the code with the step function
      await asyncFunc(step);
      
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
    console.log('Execution reset');
  };

  return {
    isRunning,
    currentLine,
    variables,
    handleRun,
    handleNext,
    handleReset,
  };
}
