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

- Google
- Amazon
- Microsoft
- Apple

## Solution Approaches

### Binary Search (Partitioning)

**Intuition**: Instead of merging the arrays, we can find a partition point in both arrays such that the elements on the left side are smaller than the elements on the right side. Since both arrays are sorted, we can use binary search to find this partition.

**Algorithm**:
1. Ensure `nums1` is the smaller array to minimize the binary search range.
2. Define a search space `[0, m]` on the smaller array.
3. Partition both arrays such that the total number of elements on the left is `(m + n + 1) / 2`.
4. Check if the partition is valid:
   - `maxLeft1 <= minRight2`
   - `maxLeft2 <= minRight1`
5. If valid, calculate the median based on whether the total length is even or odd.
6. If not valid, adjust the binary search range.

**Time Complexity**: O(log(min(m, n)))
**Space Complexity**: O(1) (ignoring slice operations if used)

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
