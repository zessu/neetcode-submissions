# Find the Duplicate Number - LeetCode 287

## Problem Description

Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.

There is only one repeated number in `nums`, return this repeated number.

You must solve the problem without modifying the array `nums` and using only constant extra space.

## Examples

### Example 1:
```
Input: nums = [1,3,4,2,2]
Output: 2
```

### Example 2:
```
Input: nums = [3,1,3,4,2]
Output: 3
```

### Example 3:
```
Input: nums = [3,3,3,3,3]
Output: 3
```

## Constraints

- `1 <= n <= 10^5`
- `nums.length == n + 1`
- `1 <= nums[i] <= n`
- All integers in `nums` appear only once except for precisely one integer which appears two or more times.

## Topics

- Array
- Two Pointers
- Binary Search
- Bit Manipulation

## Company Tags

- Facebook
- Google
- Microsoft

## Solution Approaches

### 1. Hash Set

**Intuition**: Track seen numbers in a set. The first number already in the set is the duplicate.

**Algorithm**:
1. Initialize an empty set.
2. Iterate through the array.
3. If the current number is already in the set, return it.
4. Otherwise, add it to the set.

**Time Complexity**: `O(n)`
**Space Complexity**: `O(n)` for the hash set.

### 2. Floyd's Cycle Detection (Optimal - O(1) Space)

**Intuition**: Treat the array as a linked list where `nums[i]` points to index `nums[i]`. Since there's a duplicate, there must be a cycle. Use Floyd's tortoise and hare algorithm to find the cycle entrance.

**Algorithm**:
1. Initialize two pointers: `slow = nums[0]`, `fast = nums[nums[0]]`.
2. Move slow one step (`slow = nums[slow]`) and fast two steps (`fast = nums[nums[fast]]`) until they meet.
3. Reset one pointer to the start and move both one step at a time until they meet again.
4. The meeting point is the duplicate number.

**Time Complexity**: `O(n)`
**Space Complexity**: `O(1)`

## Visual Explanation

```
nums = [1, 3, 4, 2, 2]
Index: 0  1  2  3  4

Treat as linked list: 0 -> 1 -> 3 -> 2 -> 4 -> 2 -> 4 -> ...
                                              ^         |
                                              |_________|
Cycle detected at value 2, which is the duplicate.
```

## Common Pitfalls

1. **Modifying the array**: Some solutions sort or mark the array, which violates the constraint.
2. **O(n) space**: Using a hash set works but doesn't meet the optimal space requirement.
3. **Cycle detection**: Understanding why the array maps to a linked list with a cycle is the key insight.
