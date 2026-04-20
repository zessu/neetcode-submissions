# Two Sum - Solution

## Solution Code

```javascript
class Solution {
    elements = new Map();

    twoSum(nums, target) {
        for(let i = 0; i < nums.length; i++) {
            const rem = target - nums[i];
            if(this.elements.has(rem)) {
                return [this.elements.get(rem), i];
            }
            this.elements.set(nums[i], i);
        }
    }
}
```

## Approach

**Key Idea**: For each num, check if (target - num) exists in our map.

1. Iterate through array
2. Calculate complement = target - num
3. If complement exists in map, we found the pair
4. Otherwise, add current num and index to map

## Complexity

- **Time**: O(n) - single pass
- **Space**: O(n) - map stores elements

## Walkthrough

```
nums = [2, 7, 11, 15], target = 9

i=0: num=2, rem=7, map={} → map={2:0}
i=1: num=7, rem=2, map={2:0} → FOUND! return [0,1] ✓
```

Explanation: `2 + 7 = 9`, and their indices are 0 and 1.