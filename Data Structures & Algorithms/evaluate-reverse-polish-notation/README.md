# Evaluate Reverse Polish Notation - LeetCode 150

## Problem Description

You are given an array of tokens. The tokens are operators and integers. Evaluate and return the result of the arithmetic expression in Reverse Polish Notation (RPN).

Valid operators are: `+`, `-`, `/`, and `*`. Both integers should be in integer division and truncate towards zero.

## Examples

### Example 1:
```
Input: tokens = ["2","1","+","3","*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9
```

### Example 2:
```
Input: tokens = ["4","13","5","/","+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6
```

### Example 3:
```
Input: tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
Output: 22
```

## Constraints

- `1 <= tokens.length <= 10^4`
- Tokens can be integers or operators
- Division truncates towards zero

## Topics

- Array
- Stack
- Math

## Solution Approaches

### Stack Approach
- Push numbers onto stack
- When encountering an operator, pop two operands, apply operation, push result
- Final result is the only item left on the stack