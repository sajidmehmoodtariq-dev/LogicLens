/**
 * Mock C++ STL Data Structures for visualization
 * These classes integrate with the Memory system to show data structure operations
 */

export class CppStack {
  constructor(memory, varName) {
    this.memory = memory;
    this.varName = varName;
    this.items = [];
    this.address = memory.malloc('Stack');
    
    // Store the stack in heap for visualization
    memory.setHeapField(this.address, 'type', 'stack');
    memory.setHeapField(this.address, 'items', []);
    memory.setHeapField(this.address, 'size', 0);
  }
  
  push(value) {
    this.items.push(value);
    this.memory.setHeapField(this.address, 'items', [...this.items]);
    this.memory.setHeapField(this.address, 'size', this.items.length);
  }
  
  pop() {
    if (this.items.length === 0) {
      throw new Error('Stack is empty');
    }
    const value = this.items.pop();
    this.memory.setHeapField(this.address, 'items', [...this.items]);
    this.memory.setHeapField(this.address, 'size', this.items.length);
    return value;
  }
  
  top() {
    if (this.items.length === 0) {
      throw new Error('Stack is empty');
    }
    return this.items[this.items.length - 1];
  }
  
  empty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
  
  // Return the heap address for visualization
  getAddress() {
    return this.address;
  }
}

export class CppQueue {
  constructor(memory, varName) {
    this.memory = memory;
    this.varName = varName;
    this.items = [];
    this.address = memory.malloc('Queue');
    
    // Store the queue in heap for visualization
    memory.setHeapField(this.address, 'type', 'queue');
    memory.setHeapField(this.address, 'items', []);
    memory.setHeapField(this.address, 'size', 0);
  }
  
  push(value) {
    this.items.push(value);
    this.memory.setHeapField(this.address, 'items', [...this.items]);
    this.memory.setHeapField(this.address, 'size', this.items.length);
  }
  
  pop() {
    if (this.items.length === 0) {
      throw new Error('Queue is empty');
    }
    const value = this.items.shift(); // Remove from front
    this.memory.setHeapField(this.address, 'items', [...this.items]);
    this.memory.setHeapField(this.address, 'size', this.items.length);
    return value;
  }
  
  front() {
    if (this.items.length === 0) {
      throw new Error('Queue is empty');
    }
    return this.items[0];
  }
  
  back() {
    if (this.items.length === 0) {
      throw new Error('Queue is empty');
    }
    return this.items[this.items.length - 1];
  }
  
  empty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
  
  // Return the heap address for visualization
  getAddress() {
    return this.address;
  }
}
