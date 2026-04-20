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

### 1. HashSet Approach
- Iterate through array, add each element to a Set
- If element already exists in Set, return true
- Otherwise, return false

### 2. Sorting Approach
- Sort the array
- Check if any adjacent elements are equal