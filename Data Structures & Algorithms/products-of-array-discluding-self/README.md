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

## Solution: Prefix and Suffix Products

Compute products to the left and right of each index, then multiply.