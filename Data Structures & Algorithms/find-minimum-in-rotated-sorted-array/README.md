# Find Minimum in Rotated Sorted Array - LeetCode 153

## Problem Description

Suppose an array of length `n` sorted in ascending order is rotated between `1` and `n` times.

For example, the array `nums = [0,1,2,4,5,6,7]` might become:
- `[4,5,6,7,0,1,2]` if it was rotated 4 times
- `[0,1,2,4,5,6,7]` if it was rotated 0 times

Given the rotated sorted array `nums`, return the minimum element.

## Examples

### Example 1:
```
Input: nums = [3,4,5,1,2]
Output: 1
```

### Example 2:
```
Input: nums = [4,5,6,7,0,1,2]
Output: 0
```

### Example 3:
```
Input: nums = [11,13,15,17]
Output: 11
```

## Constraints

- `1 <= nums.length <= 5000`
- `-5000 <= nums[i] <= 5000`
- All the integers of `nums` are unique.
- `nums` is sorted in ascending order and rotated.

## Topics

- Array
- Binary Search

## Company Tags

- Microsoft
- Bloomberg
- Uber

## Solution Approaches

### Binary Search

**Intuition**: In a rotated sorted array, one half is sorted and the other contains the minimum. Use binary search to find the pivot point.

**Algorithm**:
1. Initialize `left = 0`, `right = nums.length - 1`
2. While `left < right`:
   - Calculate `mid = (left + right) / 2`
   - If `nums[mid] > nums[right]`, minimum is in right half → `left = mid + 1`
   - Otherwise, minimum is in left half (including mid) → `right = mid`
3. Return `nums[left]`

**Time Complexity**: O(log n)
**Space Complexity**: O(1)

## Visual Explanation

```
nums = [4,5,6,7,0,1,2], left=0, right=6

Step 1: mid=3, nums[3]=7 > nums[6]=2
        min in right half → left = 4

Step 2: left=4, right=6, mid=5, nums[5]=1 < nums[6]=2
        min in left half → right = 5

Step 3: left=4, right=5, mid=4, nums[4]=0 < nums[5]=1
        min in left half → right = 4

left = right = 4, nums[4] = 0 → Minimum!
```

## Common Pitfalls

1. **Compare with right**: Always compare `nums[mid]` with `nums[right]`, not `nums[left]`
2. **Update left to mid + 1**: When min is in right half, discard left portion
3. **Update right to mid**: When min is in left half, keep mid as potential answer