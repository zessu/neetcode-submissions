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

## Solution Approaches

### 1. Brute Force
- For each bar, find the maximum height to its left and right, then calculate trapped water.
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)

### 2. Dynamic Programming (Prefix/Suffix Arrays)
- Precompute `maxLeft` and `maxRight` for each bar.
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)

### 3. Two Pointers (Optimal)
- Use two pointers and track `leftMax` and `rightMax` on the fly to avoid O(n) space.
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)