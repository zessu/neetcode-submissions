# Min Stack - LeetCode 155

## Problem Description

Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

## Examples

```
Input: ["MinStack","push","push","push","getMin","pop","top","getMin"]
       [[],[-2],[0],[-3],[],[],[],[]]
Output: [null,null,null,null,-3,null,0,-2]
```

## Topics

- Stack
- Design

## Solution Approaches

### 1. Brute Force
- For every `getMin` call, iterate through the entire stack to find the minimum.
- **Time Complexity**: `push`/`pop`: O(1), `getMin`: O(n)
- **Space Complexity**: O(n)

### 2. Auxiliary Min Stack (Optimal)
- Maintain a second stack that stores the minimum value at each level of the main stack.
- **Time Complexity**: All operations O(1)
- **Space Complexity**: O(n)