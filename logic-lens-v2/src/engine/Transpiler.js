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
  
  // FIRST: Handle STL containers before other conversions
  // Match: std::stack<int> s; → let s = new CppStack(memory, 's');
  jsCode = jsCode.replace(/std::stack<[^>]+>\s+(\w+)/g, (match, varName) => {
    return `let ${varName} = new CppStack(memory, '${varName}')`;
  });
  
  // Match: std::queue<int> q; → let q = new CppQueue(memory, 'q');
  jsCode = jsCode.replace(/std::queue<[^>]+>\s+(\w+)/g, (match, varName) => {
    return `let ${varName} = new CppQueue(memory, '${varName}')`;
  });
  
  // IMPORTANT: Process function declarations FIRST (before variable declarations)
  // Match: int main() { → async function main() {
  // Match: void func() { → async function func() {
  // Also handle parameters: int add(int a, int b) → async function add(a, b)
  jsCode = jsCode.replace(/\b(int|float|double|void|bool|string)\s+(\w+)\s*\(([^)]*)\)/g, (match, returnType, funcName, params) => {
    // Remove type declarations from parameters
    const cleanParams = params.replace(/\b(int|float|double|bool|string)\s+/g, '');
    return `async function ${funcName}(${cleanParams})`;
  });
  
  // Handle pointer declarations: Node* ptr → let ptr
  // Match: Node* a = → let a =
  jsCode = jsCode.replace(/\b(\w+)\s*\*\s*(\w+)/g, 'let $2');
  
  // Handle array declarations with initialization
  // Match: int arr[] = {1,2,3}; → let arr = [1,2,3];
  jsCode = jsCode.replace(/\b(int|float|double|long|short|char|bool|string)\s+(\w+)\s*\[\]\s*=\s*\{([^}]+)\}/g, 
    'let $2 = [$3]');
  
  // Handle array declarations with size
  // Match: int arr[5]; → let arr = new Array(5);
  jsCode = jsCode.replace(/\b(int|float|double|long|short|char|bool|string)\s+(\w+)\s*\[(\d+)\]/g, 
    'let $2 = new Array($3)');
  
  // Then replace C++ types with let (for variable declarations)
  // Match: int x = 10; → let x = 10;
  jsCode = jsCode.replace(/\b(int|float|double|long|short|char|bool|string)\s+(\w+)/g, 'let $2');
  
  // Convert new ClassName() to memory.malloc('ClassName')
  // Match: new Node() → memory.malloc('Node')
  jsCode = jsCode.replace(/new\s+(\w+)\s*\(\s*\)/g, 'memory.malloc(\'$1\')');
  
  // Convert pointer dereference: ptr->field to memory.getHeapField(ptr, 'field')
  // Or for assignment: ptr->field = value to memory.setHeapField(ptr, 'field', value)
  // This is complex, so we'll handle it in a separate step
  jsCode = convertPointerAccess(jsCode);
  
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
  
  // Convert function calls to await (for user-defined functions)
  // This will be refined during step injection to avoid built-in functions
  
  return jsCode;
}

/**
 * Convert pointer access (ptr->field) to memory API calls
 */
function convertPointerAccess(code) {
  let result = code;
  
  // Handle assignments: ptr->field = value;
  result = result.replace(/(\w+)\s*->\s*(\w+)\s*=\s*([^;]+);/g, 
    'memory.setHeapField($1, \'$2\', $3);');
  
  // Handle reads: ptr->field (not in assignment context)
  result = result.replace(/(\w+)\s*->\s*(\w+)/g, 
    'memory.getHeapField($1, \'$2\')');
  
  return result;
}

/**
 * Inject step() calls after each executable statement
 */
function injectSteps(code) {
  const lines = code.split('\n');
  const transpiledLines = [];
  const declaredVars = new Set(); // Track declared variables in current scope
  const definedFunctions = new Set(); // Track user-defined functions
  
  // First pass: identify all user-defined functions
  lines.forEach(line => {
    const funcMatch = line.trim().match(/^async function\s+(\w+)\s*\(/);
    if (funcMatch) {
      definedFunctions.add(funcMatch[1]);
    }
  });
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const lineNumber = index + 1;
    
    // Skip empty lines and comments
    if (trimmedLine === '' || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
      transpiledLines.push(line);
      return;
    }
    
    // Reset variable tracking when entering a new function and track parameters
    if (trimmedLine.startsWith('function ') || trimmedLine.startsWith('async function ')) {
      declaredVars.clear(); // Clear variables from previous function scope
      
      // Extract and track function parameters
      const paramMatch = trimmedLine.match(/\(([^)]*)\)/);
      if (paramMatch && paramMatch[1].trim()) {
        const params = paramMatch[1].split(',').map(p => p.trim());
        params.forEach(param => {
          if (param) declaredVars.add(param);
        });
      }
      
      transpiledLines.push(line);
      return;
    }
    
    // Clear variables when exiting function scope
    if (trimmedLine === '}' || trimmedLine === '};') {
      // Add a final step to clear the stack before returning
      const indent = line.match(/^\s*/)[0];
      transpiledLines.push(`${indent}await step(${lineNumber}, {});`);
      transpiledLines.push(line);
      return;
    }
    
    // Track variable declarations (let x = ...)
    const varMatch = trimmedLine.match(/^let\s+(\w+)/);
    if (varMatch) {
      declaredVars.add(varMatch[1]);
    }
    
    // Track variable assignments (x = ...)
    const assignMatch = trimmedLine.match(/^(\w+)\s*=/);
    if (assignMatch && !trimmedLine.startsWith('let ')) {
      declaredVars.add(assignMatch[1]);
    }
    
    // Add await before user-defined function calls
    let processedLine = line;
    definedFunctions.forEach(funcName => {
      // Match function calls: funcName(...) but not in function declaration
      const funcCallRegex = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
      if (funcCallRegex.test(trimmedLine) && !trimmedLine.startsWith('async function')) {
        processedLine = processedLine.replace(new RegExp(`\\b${funcName}\\s*\\(`, 'g'), `await ${funcName}(`);
      }
    });
    
    // Add the processed line
    transpiledLines.push(processedLine);
    
    // Check if line has executable code
    const hasExecutableCode = 
      trimmedLine.endsWith(';') || 
      trimmedLine.endsWith('{') ||
      trimmedLine.startsWith('if ') ||
      trimmedLine.startsWith('else if') ||
      trimmedLine.startsWith('else') ||
      trimmedLine.startsWith('for ') ||
      trimmedLine.startsWith('while ') ||
      trimmedLine.startsWith('return');
    
    // Add step after statements ending with ; OR after if/else conditionals
    if (hasExecutableCode && (trimmedLine.endsWith(';') || trimmedLine.match(/^(if|else\s*if|else)\s*\(/))) {
      // Build scope object with all declared variables
      const indent = line.match(/^\s*/)[0];
      
      if (declaredVars.size > 0) {
        // Create object capturing current variable values
        const varList = Array.from(declaredVars).join(', ');
        const scopeCapture = Array.from(declaredVars)
          .map(v => `${v}: typeof ${v} !== 'undefined' ? ${v} : undefined`)
          .join(', ');
        transpiledLines.push(`${indent}await step(${lineNumber}, { ${scopeCapture} });`);
      } else {
        transpiledLines.push(`${indent}await step(${lineNumber});`);
      }
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
  // Note: memory instance is provided by the runner context
  if (jsCode.includes('function main()')) {
    jsCode = jsCode + '\nawait main();';
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
