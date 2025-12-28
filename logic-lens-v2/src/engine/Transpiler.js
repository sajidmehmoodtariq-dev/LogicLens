/**
 * Transpiler V2 - C++ to JavaScript conversion + step injection
 * 
 * Converts C++ syntax to JavaScript and injects step() calls for debugging.
 */

/**
 * Convert C++ code to JavaScript
 */
function cppToJs(code) {
  let jsCode = code;
  
  // IMPORTANT: Process function declarations FIRST (before variable declarations)
  // Match: int main() { → async function main() {
  // Match: void func() { → async function func() {
  jsCode = jsCode.replace(/\b(int|float|double|void|bool|string)\s+(\w+)\s*\(/g, 'async function $2(');
  
  // Then replace C++ types with let (for variable declarations)
  // Match: int x = 10; → let x = 10;
  jsCode = jsCode.replace(/\b(int|float|double|long|short|char|bool|string)\s+(\w+)/g, 'let $2');
  
  // Replace cout statements with console.log
  // Match: cout << "hello" << x; → console.log("hello", x);
  jsCode = jsCode.replace(/cout\s*<<\s*([^;]+);/g, (match, content) => {
    // Split by << and clean up
    const parts = content.split('<<').map(part => part.trim());
    const logArgs = parts.join(', ');
    return `console.log(${logArgs});`;
  });
  
  // Replace endl with empty string (or newline character)
  jsCode = jsCode.replace(/\s*<<\s*endl/g, '');
  
  // Remove #include statements
  jsCode = jsCode.replace(/#include\s*<[^>]+>/g, '');
  jsCode = jsCode.replace(/#include\s*"[^"]+"/g, '');
  
  // Remove using namespace std;
  jsCode = jsCode.replace(/using\s+namespace\s+\w+\s*;/g, '');
  
  return jsCode;
}

/**
 * Inject step() calls after each executable statement
 */
function injectSteps(code) {
  const lines = code.split('\n');
  const transpiledLines = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const lineNumber = index + 1;
    
    // Skip empty lines and comments
    if (trimmedLine === '' || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
      transpiledLines.push(line);
      return;
    }
    
    // Skip function declarations
    if (trimmedLine.startsWith('function ') || trimmedLine.startsWith('async function ')) {
      transpiledLines.push(line);
      return;
    }
    
    // Skip closing braces
    if (trimmedLine === '}' || trimmedLine === '};') {
      transpiledLines.push(line);
      return;
    }
    
    // Add the original line
    transpiledLines.push(line);
    
    // Check if line has executable code
    const hasExecutableCode = 
      trimmedLine.endsWith(';') || 
      trimmedLine.endsWith('{') ||
      trimmedLine.startsWith('if ') ||
      trimmedLine.startsWith('else') ||
      trimmedLine.startsWith('for ') ||
      trimmedLine.startsWith('while ') ||
      trimmedLine.startsWith('return');
    
    if (hasExecutableCode && trimmedLine.endsWith(';')) {
      // Add step call with proper indentation
      const indent = line.match(/^\s*/)[0];
      transpiledLines.push(`${indent}await step(${lineNumber});`);
    }
  });
  
  return transpiledLines.join('\n');
}

/**
 * Main transpile function
 */
export function transpile(code) {
  // Step 1: Convert C++ to JS
  let jsCode = cppToJs(code);
  
  // Step 2: Inject step() calls
  jsCode = injectSteps(jsCode);
  
  // Step 3: Auto-start main() if it exists
  if (jsCode.includes('function main()')) {
    jsCode += '\nawait main();';
  }
  
  return jsCode;
}

/**
 * Example usage:
 * Input:  let a = 1;
 *         let b = 2;
 *         console.log(a + b);
 * 
 * Output: let a = 1;
 *         await step(1);
 *         let b = 2;
 *         await step(2);
 *         console.log(a + b);
 *         await step(3);
 */
