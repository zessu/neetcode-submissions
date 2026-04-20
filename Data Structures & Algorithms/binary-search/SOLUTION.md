# Binary Search - Solution

## Solution Code

```javascript
class Solution {
    /**
     * @param {number[]} nums
     * @param {number} target
     * @return {number}
     */
    search(nums, target) {
        let left = 0;
        let right = nums.length - 1;

        while (left <= right) {
            // Prevent integer overflow
            const mid = Math.floor(left + (right - left) / 2);
            
            if (nums[mid] === target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return -1;
    }
}
```

## Approach

The solution uses **Iterative Binary Search**:

1. **Initialize pointers**: `left` starts at 0, `right` at the last index
2. **Calculate mid safely**: Use `left + (right - left) / 2` to prevent integer overflow
3. **Compare and adjust**: 
   - If `nums[mid] === target`: found, return index
   - If `nums[mid] < target`: search right half
   - If `nums[mid] > target`: search left half
4. **Return -1**: If loop completes without finding target

## Complexity Analysis

- **Time Complexity**: `O(log n)` - Each iteration halves the search space
- **Space Complexity**: `O(1)` - Only uses a few variables

## Walkthrough

```
Input: nums = [-1, 0, 3, 5, 9, 12], target = 9

Iteration 1:
  left = 0, right = 5
  mid = 2, nums[2] = 3
  3 < 9 → left = 3

Iteration 2:
  left = 3, right = 5
  mid = 4, nums[4] = 9
  9 === 9 → Return 4

Output: 4
```

## Recursive Alternative

```javascript
class Solution {
    search(nums, target) {
        return this.binarySearch(nums, target, 0, nums.length - 1);
    }

    binarySearch(nums, target, left, right) {
        if (left > right) return -1;
        
        const mid = Math.floor(left + (right - left) / 2);
        
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) return this.binarySearch(nums, target, mid + 1, right);
        return this.binarySearch(nums, target, left, mid - 1);
    }
}
```

## Key Insights

1. **Why binary search works**: The array is sorted, so we can eliminate half the search space with each comparison
2. **Why `left + (right - left) / 2`**: Prevents integer overflow that could occur with `(left + right) / 2` for large arrays
3. **Why `<=`**: Using `<=` ensures we check all elements including both boundaries