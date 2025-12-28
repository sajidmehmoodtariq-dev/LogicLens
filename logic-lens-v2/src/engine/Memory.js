/**
 * Memory Manager - Handles stack frames and variable tracking
 */

export class Memory {
  constructor() {
    this.stack = [];
    this.currentFrame = null;
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
  }
}

export default Memory;
