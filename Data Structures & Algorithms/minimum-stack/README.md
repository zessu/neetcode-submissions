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

## Solution: Auxiliary Min Stack

Store minimum at each level alongside the value.