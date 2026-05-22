# Median of Two Sorted Arrays - LeetCode 4

## Problem Description

Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be `O(log (m+n))`.

## Examples

### Example 1:
```
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
```

### Example 2:
```
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
```

## Constraints

- `nums1.length == m`
- `nums2.length == n`
- `0 <= m <= 1000`
- `0 <= n <= 1000`
- `1 <= m + n <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`

## Topics

- Array
- Binary Search
- Divide and Conquer

## Company Tags
## Topics

- Array
- Binary Search
- Divide and Conquer

## Solution Approaches

### 1. Merge and Sort
- Combine both arrays into one, sort it, and find the median.
- **Time Complexity**: O((m+n) log (m+n))
- **Space Complexity**: O(m+n)

### 2. Two Pointers (Linear Merge)
- Use two pointers to simulate the merge process and stop at the middle element(s).
- **Time Complexity**: O(m+n)
- **Space Complexity**: O(1)

### 3. Binary Search (Partitioning) (Optimal)
- Find a partition point such that elements on the left side are smaller than those on the right.
- **Time Complexity**: O(log(min(m, n)))
- **Space Complexity**: O(1)


## Visual Explanation

```
nums1 = [1, 3], nums2 = [2]
m = 2, n = 1, total = 3

Partition:
Left: [1, 2], Right: [3]
Median = max(1, 2) = 2
```

## Common Pitfalls

1. **Empty Arrays**: Handle cases where one array is empty.
2. **Index Out of Bounds**: Carefully manage indices near the start and end of the arrays.
3. **Integer Division**: Ensure correct calculation of partition indices.
