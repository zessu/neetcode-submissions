# Contains Duplicate - LeetCode 217

## Problem Description

Given an integer array `nums`, return `true` if any element appears at least twice in the array, and return `false` if every element is distinct.

## Examples

### Example 1:
```
Input: nums = [1,2,3,1]
Output: true
```

### Example 2:
```
Input: nums = [1,2,3,4]
Output: false
```

### Example 3:
```
Input: nums = [1,1,1,3,3,4,3,3,2,4,2]
Output: true
```

## Constraints

- `1 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`

## Topics

- Array
- Hash Table
- Sorting

## Company Tags

- Amazon
- Google
- Bloomberg

## Hint 1

A brute force solution would be to check all pairs - this takes O(n²) time.

## Hint 2

Sorting the array can help determine duplicates more efficiently.

## Hint 3

Use a HashSet to check for duplicates in O(n) time.

## Solution Approaches

### 1. Brute Force

**Intuition**: Compare every pair of elements to check for duplicates.

**Time Complexity**: `O(n²)`
**Space Complexity**: `O(1)`

### 2. Sorting

**Intuition**: Sorting the array brings duplicates together as adjacent elements.

**Algorithm**:
1. Sort the input array `nums`.
2. Iterate from `i = 1` to `n-1`:
   - If `nums[i] == nums[i-1]`, return `true`.
3. Return `false`.

**Time Complexity**: `O(n log n)` due to sorting.
**Space Complexity**: `O(1)` or `O(n)` depending on the sorting implementation.

### 3. Hash Set (Optimal)

**Intuition**: Use a hash set to store elements we've seen so far. Hash sets provide average `O(1)` lookup time.

**Algorithm**:
1. Initialize an empty hash set.
2. For each number in `nums`:
   - If number is in the set, return `true`.
   - Add number to the set.
3. Return `false`.

**Time Complexity**: `O(n)`
**Space Complexity**: `O(n)` to store elements in the set.