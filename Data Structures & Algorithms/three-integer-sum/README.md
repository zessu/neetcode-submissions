# 3Sum - LeetCode 15

## Problem Description

Given an integer array nums, return all triplets [nums[i], nums[j], nums[k] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0.

## Examples

```
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
```

## Topics

- Array
- Two Pointers
- Sorting

## Solution Approaches

### 1. Brute Force
- Three nested loops to check all possible triplets. Use a set to avoid duplicates.
- **Time Complexity**: O(n³)
- **Space Complexity**: O(k) where k is number of unique triplets

### 2. Hash Map (Two Sum Variation)
- Sort the array, then for each element, solve Two Sum for the remainder.
- **Time Complexity**: O(n²)
- **Space Complexity**: O(n) for the hash map

### 3. Sort + Two Pointers (Optimal)
- Sort the array, then for each element, use two pointers to find pairs that sum to the negative of that element.
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1) (excluding output)