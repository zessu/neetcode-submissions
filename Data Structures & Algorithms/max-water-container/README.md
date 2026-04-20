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

## Solution: Two Pointers

Start with widest container, always move the shorter line inward.