/**
 * Memory Manager - Handles stack frames, heap, and pointer tracking
 */

export class Memory {
  constructor() {
    this.stack = [];
    this.currentFrame = null;
    this.heap = {}; // Maps address -> object
    this.addressCounter = 0x1000; // Start at 0x1000 for realistic addresses
  }

  /**
   * Allocate memory on the heap (like malloc/new)
   * @param {string} className - The type/class being allocated
   * @returns {string} - Memory address as hex string
   */
  malloc(className = 'Object') {
    const address = `0x${this.addressCounter.toString(16)}`;
    this.heap[address] = {
      type: className,
      fields: {},
      address: address,
    };
    this.addressCounter += 8; // Increment by 8 bytes
    console.log(`Allocated ${className} at ${address}`);
    return address;
  }

  /**
   * Free memory (optional - for explicit deallocation)
   */
  free(address) {
    if (this.heap[address]) {
      delete this.heap[address];
      console.log(`Freed memory at ${address}`);
    }
  }

  /**
   * Get heap object at address
   */
  getHeapObject(address) {
    return this.heap[address] || null;
  }

  /**
   * Set field on heap object
   */
  setHeapField(address, field, value) {
    if (this.heap[address]) {
      this.heap[address].fields[field] = value;
    }
  }

  /**
   * Get field from heap object
   */
  getHeapField(address, field) {
    return this.heap[address]?.fields[field];
  }

  /**
   * Push a new stack frame (for function calls)
   */
  pushFrame(functionName) {
    const frame = {
      name: functionName,
      variables: {},
      line: null,
    };
    this.stack.push(frame);
    this.currentFrame = frame;
    return frame;
  }

  /**
   * Pop the top stack frame (when function returns)
   */
  popFrame() {
    this.stack.pop();
    this.currentFrame = this.stack[this.stack.length - 1] || null;
    return this.currentFrame;
  }

  /**
   * Update variables in the current frame
   */
  updateVariables(variables) {
    if (this.currentFrame) {
      this.currentFrame.variables = { ...this.currentFrame.variables, ...variables };
    }
  }

  /**
   * Set the current line number
   */
  setLine(lineNumber) {
    if (this.currentFrame) {
      this.currentFrame.line = lineNumber;
    }
  }

  /**
   * Get the current stack state (for visualization)
   */
  getStackState() {
    return this.stack.map(frame => ({
      name: frame.name,
      variables: { ...frame.variables },
      line: frame.line,
    }));
  }

  /**
   * Get heap state for visualization
   */
  getHeapState() {
    return { ...this.heap };
  }

  /**
   * Get all variables in the current frame
   */
  getCurrentVariables() {
    return this.currentFrame ? { ...this.currentFrame.variables } : {};
  }

  /**
   * Clear all memory
   */
  clear() {
    this.stack = [];
    this.currentFrame = null;
    this.heap = {};
    this.addressCounter = 0x1000;
  }
}

export default Memory;
