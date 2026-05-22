# Two Sum - LeetCode 1

## Problem Description

Given an array of integers nums and a target, return indices of two numbers that add up to target.

## Examples

```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
```

## Topics

- Array
- Hash Table

## Solution Approaches

### 1. Brute Force
- Check every pair of numbers to see if they sum to the target.
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)

### 2. Sorting + Two Pointers
- Sort the array and use two pointers to find the sum. Note that this requires tracking original indices.
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)

### 3. Hash Map (One-Pass) (Optimal)
- Iterate through the array once, storing the complement of each number in a hash map for O(1) lookup.
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)