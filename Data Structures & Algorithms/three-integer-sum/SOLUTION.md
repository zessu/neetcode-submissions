# 3Sum - Solution

## Solution Code (Optimal)

```javascript
class Solution {
    threeSum(nums) {
        const result = [];
        nums.sort((a, b) => a - b);
        
        for (let i = 0; i < nums.length - 2; i++) {
            // Skip duplicates for first element
            if (i > 0 && nums[i] === nums[i - 1]) continue;
            
            let left = i + 1;
            let right = nums.length - 1;
            
            while (left < right) {
                const sum = nums[i] + nums[left] + nums[right];
                
                if (sum === 0) {
                    result.push([nums[i], nums[left], nums[right]]);
                    // Skip duplicates for left and right
                    while (left < right && nums[left] === nums[left + 1]) left++;
                    while (left < right && nums[right] === nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
}
```

## Solution Code (Brute Force from submission)

```javascript
class Solution {
    threeSum(nums) {
        const keys = new Map();
        const ans = [];

        if(nums.length < 3) return;

        for(let i = 0; i <= nums.length - 3; i++) {
            for(let j = i + 1; j <= nums.length - 2; j++) {
                for(let k = j + 1; k <= nums.length - 1; k++) {
                    if((nums[i] + nums[j] + nums[k]) === 0) {
                        const newArr = [nums[i], nums[j], nums[k]].sort();
                        const key = `${newArr[0]}${newArr[1]}${newArr[2]}`;
                        if(!keys.has(key)) {
                            ans.push(newArr);
                            keys.set(key, true);
                        }
                    }
                }
            }
        }
        return ans;
    }
}
```

## Approach

**Algorithm**:
1. Sort the array
2. For each i, use two pointers (left, right) for the remaining elements
3. Skip duplicates to avoid duplicate triplets

## Complexity

- **Brute Force**: O(n³) - very slow
- **Optimal**: O(n²) - much faster
- **Space**: O(1) extra (ignoring output)

## Walkthrough

```
nums = [-1, 0, 1, 2, -1, -4]
Sorted: [-4, -1, -1, 0, 1, 2]

i = 0 (-4):
  left = 1, right = 5
  sum = -4 + -1 + 2 = -3 < 0 → left++
  sum = -4 + 0 + 2 = -2 < 0 → left++
  sum = -4 + 1 + 2 = -1 < 0 → left++

i = 1 (-1):
  left = 2, right = 5
  sum = -1 + -1 + 2 = 0 → FOUND [-1, -1, 2]
  sum = -1 + 0 + 1 = 0 → FOUND [-1, 0, 1]

Output: [[-1, -1, 2], [-1, 0, 1]] ✓
```