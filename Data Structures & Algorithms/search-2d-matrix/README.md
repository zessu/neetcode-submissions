# Search a 2D Matrix - LeetCode 74

## Problem Description

You are given an m x n 2D integer array matrix and an integer target. Each row is sorted in non-decreasing order. The first integer of every row is greater than the last integer of the previous row. Return true if target exists in matrix.

## Examples

```
Input: matrix = [[1,2,4,8],[10,11,12,13],[14,20,30,40]], target = 10
Output: true
```

## Topics

- Array
- Binary Search
- Matrix

## Solution Approaches

### 1. Brute Force
- Iterate through every element in the matrix.
- **Time Complexity**: O(m * n)
- **Space Complexity**: O(1)

### 2. Two-Pass Binary Search
- Binary search to find the correct row (compare target with row starts/ends).
- Binary search within that row to find the target.
- **Time Complexity**: O(log m + log n) = O(log(m * n))
- **Space Complexity**: O(1)

### 3. One-Pass Binary Search (Optimal)
- Treat the matrix as a virtual 1D array.
- Convert 1D index to 2D: `row = index / n`, `col = index % n`.
- **Time Complexity**: O(log(m * n))
- **Space Complexity**: O(1)