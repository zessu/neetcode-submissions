# Contains Duplicate - Solution

## Solution Code

```javascript
class Solution {
    elements = new Map();

    /**
     * @param {number[]} nums
     * @return {boolean}
     */
    hasDuplicate(nums) {
        for(let i=0; i<nums.length; i++) {
            if(this.elements.has(nums[i])) return true;
            this.elements.set(nums[i], 1);
        }
        return false;
    }
}
```

## Approach

The solution uses a **Hash Set / Hash Map** approach:

1. Iterate through each element in the array
2. If the element already exists in the Map, we found a duplicate → return `true`
3. Otherwise, add the element to the Map
4. After completing the loop, no duplicates found → return `false`

## Complexity Analysis

- **Time Complexity**: `O(n)` - single pass through the array
- **Space Complexity**: `O(n)` - worst case stores all n elements

## Walkthrough

```
Input: [1,2,3,1]

i=0: 1 not in Map → add 1 → Map = {1}
i=1: 2 not in Map → add 2 → Map = {1,2}
i=2: 3 not in Map → add 3 → Map = {1,2,3}
i=3: 1 IS in Map → return true

Output: true
```

## Alternative: Sorting Approach

```javascript
class Solution {
    hasDuplicate(nums) {
        nums.sort((a, b) => a - b);
        for (let i = 1; i < nums.length; i++) {
            if (nums[i] === nums[i - 1]) return true;
        }
        return false;
    }
}
```

**Complexity**:
- Time: `O(n log n)` - dominated by sorting
- Space: `O(1)` if in-place sort, `O(n)` otherwise

## Key Insights

1. **Hash vs Sort**: Hash is O(n) time but O(n) space. Sort is O(n log n) but can be O(1) space.
2. **Set vs Map**: Since we only need to check existence, Set is simpler than Map.