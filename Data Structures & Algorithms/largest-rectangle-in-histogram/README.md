# Largest Rectangle in Histogram - LeetCode 84

## Problem Description

Given an array of integers `heights` representing the histogram's bar height where the width of each bar is `1`, return the area of the largest rectangle in the histogram.

## Examples

### Example 1:
```
Input: heights = [2,1,5,6,2,3]
Output: 10
Explanation: The largest rectangle is shown in the red area, which has area = 10 units.
```

### Example 2:
```
Input: heights = [2,4]
Output: 4
```

## Constraints

- `0 <= heights[i] <= 10^4`
- `1 <= heights.length <= 10^5`

## Topics

- Array
- Stack
- Monotonic Stack

## Solution Approaches

### 1. Brute Force
For each bar, expand left and right to find width.

### 2. Monotonic Stack (Optimal)
Use a stack to track bars in increasing order of height.