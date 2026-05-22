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

### 1. Stack (Iterative)

**Intuition**: Reverse Polish Notation is designed to be evaluated using a stack. Numbers are pushed onto the stack, and when an operator is encountered, the top two numbers are popped, the operation is performed, and the result is pushed back.

**Algorithm**:
1. Initialize an empty stack.
2. For each token in the input:
   - If the token is an operand (number), convert it to an integer and push it onto the stack.
   - If the token is an operator (+, -, *, /):
     - Pop the top two elements from the stack (let them be `b` and `a`, where `a` was pushed before `b`).
     - Perform the operation `a operator b`.
     - Push the result back onto the stack.
3. Return the final element remaining in the stack.

**Time Complexity**: `O(n)` where `n` is the number of tokens. Each token is processed once.
**Space Complexity**: `O(n)` for the stack.

### 2. Recursion (Functional)

**Intuition**: RPN can also be viewed as a post-order traversal of an expression tree. We can evaluate it recursively by processing tokens from right to left.

**Algorithm**:
1. Define a recursive function that takes the token list.
2. Pop the last token.
3. If it's a number, return it.
4. If it's an operator, recursively evaluate the right operand then the left operand, then apply the operator.

**Time Complexity**: `O(n)`
**Space Complexity**: `O(n)` for the recursion stack.