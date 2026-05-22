# Product of Array Except Self - LeetCode 238

## Problem Description

Given an integer array `nums`, return an array `answer` where `answer[i]` equals the product of all elements of `nums` except `nums[i]`.

## Examples

```
Input: nums = [1,2,3,4]
Output: [24,12,8,6]

Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
```

## Topics

- Array
- Prefix Sum

## Solution Approaches

### 1. Brute Force
- For each index `i`, iterate through the entire array and multiply all elements where `j !== i`.
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1) (ignoring output)

### 2. Division (Not allowed if 0 exists)
- Calculate total product of all elements.
- For each index `i`, `result[i] = totalProduct / nums[i]`.
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)

### 3. Prefix and Suffix Products (Optimal)
- Compute products to the left and right of each index, then multiply.
- **Time Complexity**: O(n)
- **Space Complexity**: O(1) extra (ignoring output)