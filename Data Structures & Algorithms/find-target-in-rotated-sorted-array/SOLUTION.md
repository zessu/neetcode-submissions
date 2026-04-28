# Search in Rotated Sorted Array - Solution

## Solution Code

```javascript
class Solution {
    search(nums, target) {
        let left = 0;
        let right = nums.length - 1;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);

            if (nums[mid] === target) return mid;

            if (nums[mid] < nums[right]) {
                // Right half is sorted
                if (target > nums[mid] && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            } else {
                // Left half is sorted
                if (target >= nums[left] && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }
        }

        return -1;
    }
}
```

## Approach

The solution uses **Modified Binary Search** that handles the rotation.

1. **At each iteration**:
   - Calculate mid point
   - If `nums[mid] === target`, found it
   - Determine which half is properly sorted
   - Check if target lies within the sorted half's range
   - Narrow search accordingly

2. **How to identify sorted half**:
   - If `nums[mid] < nums[right]`, right half is sorted
   - Otherwise, left half is sorted

3. **Target range check**:
   - Right half sorted: target in (nums[mid], nums[right]] → go right
   - Left half sorted: target in [nums[left], nums[mid)) → go left

## Complexity Analysis

- **Time Complexity**: O(log n) - each iteration halves the search space
- **Space Complexity**: O(1) - only uses a few variables

## Walkthrough

```
Input: nums = [4, 5, 6, 7, 0, 1, 2], target = 0

Iteration 1:
  left = 0, right = 6, mid = 3
  nums[mid] = 7, nums[right] = 2
  7 > 2 → right half [0,1,2] is sorted
  target = 0 in [nums[mid]=7, nums[right]=2]? No
  target = 0 in [nums[left]=4, nums[mid]=7)? No
  → Search right: left = 4

Iteration 2:
  left = 4, right = 6, mid = 5
  nums[mid] = 1, nums[right] = 2
  1 < 2 → right half [0,1,2] is sorted
  target = 0 in (1, 2]? No
  target = 0 in [0, 1)? Yes
  → Search left: right = 4

Iteration 3:
  left = 4, right = 4, mid = 4
  nums[mid] = 0 === target = 0 → Found! Return 4

Output: 4
```

## Key Insights

1. **Why this works**: At least one half is always sorted in a rotated array
2. **Sorted half identification**: By comparing nums[mid] with nums[right], we know which half is sorted
3. **Eliminate half**: Once we know which half is sorted and whether target is in it, we can eliminate the other half