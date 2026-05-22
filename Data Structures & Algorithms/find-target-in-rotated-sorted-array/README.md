# Search in Rotated Sorted Array - LeetCode 33

## Problem Description

There is an integer array `nums` sorted in ascending order (with distinct values).

Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (`1 <= k < nums.length`) so that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`.

Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.

You must write an algorithm with `O(log n)` time complexity.

## Examples

### Example 1:
```
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```

### Example 2:
```
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
```

### Example 3:
```
Input: nums = [1], target = 0
Output: -1
```

## Constraints

- `1 <= nums.length <= 5000`
- `-5000 <= nums[i] <= 5000`
- All values of `nums` are unique.
- `nums` is an ascending array that is possibly rotated.
- `-5000 <= target <= 5000`

## Topics

- Array
- Binary Search

## Company Tags

- Microsoft
- Facebook
- Amazon
- Bloomberg
- Uber

## Solution Approaches

### 1. Brute Force
**Intuition**: Iterate through the entire array and check if any element matches the target.

**Algorithm**:
1. Iterate through `nums` from index 0 to `n-1`.
2. If `nums[i] === target`, return `i`.
3. If the loop completes without finding the target, return `-1`.

**Time Complexity**: O(n)
**Space Complexity**: O(1)

### 2. Modified Binary Search (Optimal)
**Intuition**: At each step, determine which half is properly sorted, then check if target lies within that sorted half.

**Algorithm**:
1. Initialize `left = 0`, `right = nums.length - 1`
2. While `left <= right`:
   - Calculate `mid = (left + right) / 2`
   - If `nums[mid] === target`, return `mid`
   - Check if left half is sorted (`nums[left] <= nums[mid]`):
     - If yes, check if target is in left half range → adjust right
     - Otherwise, search right half → adjust left
   - Else right half is sorted:
     - If target is in right half range → adjust left
     - Otherwise, search left half → adjust right
3. Return `-1` if not found

**Time Complexity**: O(log n)
**Space Complexity**: O(1)

## Visual Explanation

```
nums = [4,5,6,7,0,1,2], target = 0

Step 1: left=0, right=6, mid=3
        nums[mid]=7, nums[right]=2
        Left half [4,5,6,7] is sorted (nums[0] <= nums[3])
        Target 0 is not in [4, 7] → Search right half
        left = mid + 1 = 4

Step 2: left=4, right=6, mid=5
        nums[mid]=1, nums[right]=2
        Right half [1,2] is sorted (nums[5] <= nums[6])
        Target 0 is not in [1, 2] → Search left half
        right = mid - 1 = 4

Step 3: left=4, right=4, mid=4
        nums[mid]=0 === target → Return 4
```

## Common Pitfalls

1. **Determining sorted half**: Check `nums[left] <= nums[mid]` to determine which half is sorted
2. **Boundary conditions**: Be careful with `<=` vs `<` comparisons
3. **Target range check**: Ensure correct comparisons for target in sorted half