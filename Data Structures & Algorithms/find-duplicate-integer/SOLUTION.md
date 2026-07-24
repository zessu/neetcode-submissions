# Find the Duplicate Number - Solution

## Solution Code

```typescript
class Solution {
    findDuplicate(nums: number[]): number {
        const existing = new Set();

        for(const num in nums) {
            if(existing.has(nums[num])) return nums[num];
            existing.add(nums[num]);
        }
    }
}
```

## Approach

The solution uses a **Hash Set** to detect the first duplicate.

1. **Initialize** an empty set to track seen numbers.
2. **Iterate** through the array using index-based iteration.
3. **Check** if the current number is already in the set.
4. **Return** the number if found; otherwise, add it to the set.

- **Time Complexity**: O(n) where n is the length of the array.
- **Space Complexity**: O(n) for the hash set.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Hash Set** | $O(n)$ | $O(n)$ | Simple, one pass | Uses O(n) extra space |
| **Floyd's Cycle Detection** | $O(n)$ | $O(1)$ | Constant space, no modification | Harder to understand |
| **Binary Search** | $O(n log n)$ | $O(1)$ | No modification, constant space | Slower than O(n) |

## Key Insights

```
Input: nums = [1, 3, 4, 2, 2]

Iteration 0: num = 1, existing = {}, not found, add 1
Iteration 1: num = 3, existing = {1}, not found, add 3
Iteration 2: num = 4, existing = {1, 3}, not found, add 4
Iteration 3: num = 2, existing = {1, 3, 4}, not found, add 2
Iteration 4: num = 2, existing = {1, 3, 4, 2}, FOUND!

Result: 2
```

## Key Insights

1. **Why hash set**: The simplest approach to detect duplicates in a single pass.
2. **Space tradeoff**: Uses O(n) space; for O(1) space, Floyd's cycle detection is preferred.
3. **Index iteration note**: Using `for...in` iterates over indices (strings), so `nums[num]` accesses the actual values.
