# Two Sum II - LeetCode 167

## Problem Description

Given a sorted array and target, return indices of two numbers that add to target (1-indexed).

## Examples

```
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
```

## Topics

- Array
- Two Pointers
- Binary Search

## Solution Approaches

### 1. Brute Force
- Check every pair of numbers.
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)

### 2. Binary Search
- For each element `numbers[i]`, binary search for `target - numbers[i]` in the remainder of the array.
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(1)

### 3. Two Pointers (Optimal)
- Since the array is sorted, move pointers inward based on whether the current sum is less than or greater than the target.
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)