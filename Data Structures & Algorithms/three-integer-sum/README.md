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

## Solution: Sort + Two Pointers

Fix one element, use two pointers for the other two.