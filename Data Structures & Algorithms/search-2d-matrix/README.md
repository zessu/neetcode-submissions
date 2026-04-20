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

## Solution: Binary Search (One-Pass)

Treat the matrix as a sorted 1D array by converting indices.