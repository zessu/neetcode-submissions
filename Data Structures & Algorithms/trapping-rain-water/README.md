# Trapping Rain Water - LeetCode 42

## Problem Description

Given n non-negative integers representing an elevation map, compute how much water can be trapped after raining.

## Examples

```
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6

Input: height = [4,2,0,3,2,5]
Output: 9
```

## Topics

- Array
- Two Pointers
- Dynamic Programming
- Stack
- Monotonic Stack

## Solution: Two Pointers / DP

Water at each position = min(maxLeft, maxRight) - height[i]