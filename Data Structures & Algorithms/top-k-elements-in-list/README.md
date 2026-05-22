# Top K Frequent Elements - LeetCode 347

## Problem Description

Given an integer array nums and integer k, return the k most frequent elements.

## Examples

```
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
```

## Topics

- Array
- Hash Table
- Sort
- Heap (Priority Queue)
- Bucket Sort

## Solution Approaches

### 1. Hash Map + Sorting
- Count frequencies using a hash map.
- Convert map entries to an array and sort by frequency in descending order.
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)

### 2. Heap (Priority Queue)
- Count frequencies with a hash map.
- Use a Min-Heap of size `k` to keep track of the top `k` elements.
- **Time Complexity**: O(n log k)
- **Space Complexity**: O(n)

### 3. Bucket Sort (Optimal)
- Count frequencies with a hash map.
- Create an array of buckets where the index represents the frequency.
- Iterate from right to left through the buckets to pick the top `k` elements.
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)