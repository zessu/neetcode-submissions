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
**Intuition**: For every possible pair of bars, find the minimum height between them and calculate the area. Alternatively, for each bar, expand as far as possible to the left and right while the bars are at least as tall as the current bar.

**Algorithm**:
1. Iterate through each bar at index `i`.
2. For each bar, find the leftmost index `L` such that all bars from `L` to `i` have `height >= heights[i]`.
3. Find the rightmost index `R` such that all bars from `i` to `R` have `height >= heights[i]`.
4. The width of the rectangle with height `heights[i]` is `R - L + 1`.
5. Calculate `area = heights[i] * width` and update `maxArea`.

**Time Complexity**: O(n²) - for each bar, we might scan the entire array.
**Space Complexity**: O(1)

### 2. Monotonic Stack (Optimal)
**Intuition**: Use a stack to keep track of bars in non-decreasing order of height. When we encounter a bar shorter than the bar at the top of the stack, we know the rectangle for the top bar cannot extend further to the right.

**Algorithm**:
1. Initialize an empty stack and `maxArea = 0`.
2. Iterate through the `heights` (including a sentinel value of 0 at the end).
3. While the current height is less than the height of the bar at the stack's top index:
   - Pop the top index from the stack.
   - The popped height is the height of the rectangle.
   - The width is determined by the current index and the new top of the stack.
   - Calculate area and update `maxArea`.
4. Push the current index onto the stack.

**Time Complexity**: O(n) - each bar is pushed and popped exactly once.
**Space Complexity**: O(n) - for the stack.