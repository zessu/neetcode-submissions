# Container With Most Water - LeetCode 11

## Problem Description

Given an array `height` of n non-negative integers, find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water.

## Examples

```
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49

Input: height = [1,1]
Output: 1
```

## Topics

- Array
- Two Pointers
- Greedy

## Solution Approaches

### 1. Brute Force
- Check every possible pair of lines and calculate the water trapped between them.
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)

### 2. Two Pointers (Optimal)
- Start with pointers at both ends and move the pointer pointing to the shorter line inward.
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)