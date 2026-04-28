# Find Minimum in Rotated Sorted Array - Solution

## Solution Code

```javascript
class Solution {
    findMin(nums) {
        let start = 0;
        let end = nums.length - 1;

        while (start < end) {
            let mid = Math.floor((start + end) / 2);

            if (nums[mid] > nums[end]) {
                start = mid + 1;
            } else {
                end = mid;
            }
        }

        return nums[start];
    }
}
```

## Approach

The solution uses **Binary Search** to find the minimum element in a rotated sorted array.

1. **Key observation**: In a rotated sorted array, the minimum element is the pivot point where the array "wraps around"
2. **Compare with right**: 
   - If `nums[mid] > nums[end]`: minimum is to the right of mid
   - Otherwise: minimum is at mid or to the left
3. **Narrow down**: Continue until start equals end (the minimum index)
4. **Return**: `nums[start]`

## Complexity Analysis

- **Time Complexity**: O(log n) - each iteration halves the search space
- **Space Complexity**: O(1) - only uses a few variables

## Walkthrough

```
Input: nums = [4, 5, 6, 7, 0, 1, 2]

Iteration 1:
  start = 0, end = 6
  mid = 3, nums[3] = 7, nums[6] = 2
  7 > 2 → start = 3 + 1 = 4

Iteration 2:
  start = 4, end = 6
  mid = 5, nums[5] = 1, nums[6] = 2
  1 < 2 → end = 5

Iteration 3:
  start = 4, end = 5
  mid = 4, nums[4] = 0, nums[5] = 1
  0 < 1 → end = 4

start = end = 4
Return nums[4] = 0
```

## Key Insights

1. **Why compare with right**: Comparing with right works even for non-rotated arrays (where minimum is at index 0)
2. **Why not compare with left**: For non-rotated arrays, nums[mid] < nums[left] would always be true, causing incorrect behavior
3. **Pivot property**: The minimum element is the only place where the next element is smaller (in a rotated array)