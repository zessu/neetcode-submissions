# Min Stack - Solution

## Solution Code

```javascript
class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
    }

    push(val) {
        this.stack.push(val);
        // Push min so far - either val or previous minimum
        if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
            this.minStack.push(val);
        } else {
            this.minStack.push(this.minStack[this.minStack.length - 1]);
        }
    }

    pop() {
        this.stack.pop();
        this.minStack.pop();
    }

    top() {
        return this.stack[this.stack.length - 1];
    }

    getMin() {
        return this.minStack[this.minStack.length - 1];
    }
}
```

## Approach

Use **two stacks**:
1. `stack`: stores actual values
2. `minStack`: stores the minimum at each level

For each push, we record what the minimum would be AFTER this push.

## Complexity

- **All operations**: O(1) time
- **Space**: O(n) for minStack

## Walkthrough

```
Operations:
push(-2) → stack: [-2], minStack: [-2]
push(0)  → stack: [-2, 0], minStack: [-2, -2]
push(-3) → stack: [-2, 0, -3], minStack: [-2, -2, -3]

getMin()  → -3 ✓
pop()     → stack: [-2, 0], minStack: [-2, -2]
top()     → 0 ✓
getMin()  → -2 ✓
```

## Key Insight

The solution stores the minimum at each "level" of the stack, allowing O(1) retrieval of the current minimum at any point.