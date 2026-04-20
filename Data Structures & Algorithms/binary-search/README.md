# Binary Search - LeetCode 704

## Problem Description

You are given an array of integers `nums` which is sorted in ascending order, and an integer `target`. Write a function to search for `target` in `nums`. If `target` exists, return its index. Otherwise, return `-1`.

You must write an algorithm with `O(log n)` time complexity.

## Examples

### Example 1:
```
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
```

### Example 2:
```
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1
```

## Constraints

- `1 <= nums.length <= 10^4`
- `-9999 <= nums[i] <= 9999`
- All the integers in `nums` are unique.
- `nums` is sorted in ascending order.

## Topics

- Array
- Binary Search

## Company Tags

- Adobe
- Apple
- Microsoft
- Google
- LinkedIn
- Bloomberg

## Prerequisites

Before attempting this problem, you should be comfortable with:

- **Array indexing** - Understanding 0-based indexing and array traversal
- **Mid-point calculation** - Using integer division to find the middle element
- **Search space reduction** - The concept of eliminating half of the search space

## Solution Approaches

### 1. Iterative Binary Search

**Intuition**: Binary search works by repeatedly cutting the search space in half. Check the middle element and decide which half to search next.

**Algorithm**:
1. Initialize `left = 0` and `right = nums.length - 1`
2. While `left <= right`:
   - Calculate `mid = left + (right - left) / 2` (avoids overflow)
   - If `nums[mid] === target`, return `mid`
   - If `nums[mid] < target`, search right half: `left = mid + 1`
   - If `nums[mid] > target`, search left half: `right = mid - 1`
3. Return `-1` if not found

**Time Complexity**: `O(log n)`
**Space Complexity**: `O(1)`

### 2. Recursive Binary Search

**Intuition**: Same as iterative, but using recursion to divide the problem.

**Time Complexity**: `O(log n)`
**Space Complexity**: `O(log n)` for recursion stack

## Visual Explanation

```
Example: nums = [-1, 0, 3, 5, 9, 12], target = 9

Step 1: left = 0, right = 5
        mid = 2, nums[2] = 3
        3 < 9 → search right half

Step 2: left = 3, right = 5
        mid = 4, nums[4] = 9
        9 == 9 → Found! Return 4
```

## Common Pitfalls

1. **Integer overflow**: Use `mid = left + (right - left) / 2` instead of `mid = (left + right) / 2`
2. **Infinite loop**: Make sure to update pointers correctly (`mid + 1` or `mid - 1`)
3. **Off-by-one**: Use `left <= right` in the while condition to include all elements