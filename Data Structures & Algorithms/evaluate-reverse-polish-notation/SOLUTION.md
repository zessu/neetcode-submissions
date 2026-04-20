# Evaluate Reverse Polish Notation - Solution

## Solution Code

```javascript
class Solution {
  stack = [];

  isOperator(val) {
    const operators = ["+", "/", "*", "-"];
    return operators.includes(val);
  }

  isOperand(val) {
    return parseInt(val);
  }

  operate(op1, op2, operator) {
    switch (operator) {
      case "+":
        return op1 + op2;
      case "-":
        return op2 - op1;  // Note: order matters!
      case "*":
        return op1 * op2;
      case "/":
        return Math.trunc(op2 / op1);  // Truncate towards zero
      default:
        throw new Error("operand not supported");
    }
  }

  evalRPN(tokens) {
    for (const item in tokens) {
      const value = tokens[item];
      if (!Number.isNaN(this.isOperand(value))) {
        this.stack.push(parseInt(value));
      } else if (this.isOperator(value)) {
        const op1 = this.stack.pop();
        const op2 = this.stack.pop();
        const res = this.operate(op1, op2, value);
        this.stack.push(res);
      } else {
        throw new Error(`value not supported ${value}`);
      }
    }

    return this.stack.pop();
  }
}
```

## Approach

The solution uses a **Stack** to evaluate Reverse Polish Notation:

1. **Parse tokens**: Each token is either a number or operator
2. **Push numbers**: If token is a number, push to stack
3. **Apply operator**: If token is operator, pop two operands, apply operation, push result
4. **Return result**: After processing, the final result is on the stack

## Complexity Analysis

- **Time Complexity**: `O(n)` - each token processed once
- **Space Complexity**: `O(n)` - stack stores at most n/2 numbers

## Walkthrough

```
Input: tokens = ["2","1","+","3","*"]

Token by token:
- "2": number → push [2]
- "1": number → push [2,1]
- "+": operator → pop 1,2 → compute 2+1=3 → push [3]
- "3": number → push [3,3]
- "*": operator → pop 3,3 → compute 3*3=9 → push [9]

Result: 9 ✓
```

## Key Insights

1. **Order matters**: For `-` and `/`, the FIRST popped is the RIGHT operand, SECOND is LEFT:
   - `op2 - op1` (not `op1 - op2`)
   - `op2 / op1` (not `op1 / op2`)

2. **Integer division**: Use `Math.trunc()` to truncate towards zero (different from `Math.floor()` for negative numbers)