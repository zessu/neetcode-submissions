# Longest Consecutive Sequence - LeetCode 128

## Problem Description

Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in O(n) time.

## Examples

### Example 1:
```
Input: nums = [100,4,200,1,3,2]
Output: 4
Explanation: The longest consecutive sequence is [1,2,3,4]
```

### Example 2:
```
Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
```

## Constraints

- `0 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`

## Topics

- Array
- Hash Table
- Union Find

## Solution Approach (HashSet)

**Core Insight**: A number only starts a sequence if `num-1` is NOT in the set.

1. Add all numbers to a HashSet
2. For each number, check if it's a sequence starter
3. If yes, count forward to find the full sequence
4. Track the maximum length