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

## Solution Approaches

### 1. Brute Force
- For each number, check if the next consecutive number exists by scanning the entire array.
- **Time Complexity**: O(n³)
- **Space Complexity**: O(1)

### 2. Sorting
- Sort the array and iterate through to find the longest consecutive sequence.
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(1) or O(n)

### 3. HashSet (Optimal)
- Store all numbers in a HashSet and only start counting from a number if `num - 1` is not in the set.
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)