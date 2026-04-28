# Koko Eating Bananas - Solution

## Solution Code

```javascript
class Solution {
    minEatingSpeed(piles, h) {
        let left = 1;
        let right = Math.max(...piles);

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            let hours = 0;

            for (const pile of piles) {
                hours += Math.ceil(pile / mid);
            }

            if (hours <= h) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        return left;
    }
}
```

## Approach

The solution uses **Binary Search** to find the minimum eating speed.

1. **Define search space**: Speed ranges from 1 to max(piles)
2. **Calculate hours at mid speed**: For each pile, calculate ceil(piles[i] / mid) and sum them
3. **Adjust search space**:
   - If hours <= h, speed is sufficient, try lower speeds (right = mid - 1)
   - If hours > h, speed is too slow, need higher speeds (left = mid + 1)
4. **Return left**: When loop exits, left is the minimum valid speed

## Complexity Analysis

- **Time Complexity**: O(n log m) where n = piles.length, m = max(piles)
- **Space Complexity**: O(1)

## Walkthrough

```
Input: piles = [3, 6, 7, 11], h = 8

Iteration 1: left=1, right=11, mid=6
  hours = ceil(3/6) + ceil(6/6) + ceil(7/6) + ceil(11/6)
        = 1 + 1 + 2 + 2 = 6 <= 8
  right = 5

Iteration 2: left=1, right=5, mid=3
  hours = ceil(3/3) + ceil(6/3) + ceil(7/3) + ceil(11/3)
        = 1 + 2 + 3 + 4 = 10 > 8
  left = 4

Iteration 3: left=4, right=5, mid=4
  hours = ceil(3/4) + ceil(6/4) + ceil(7/4) + ceil(11/4)
        = 1 + 2 + 2 + 3 = 8 <= 8
  right = 3

Loop exits: left=4 > right=3
Return 4
```

## Key Insights

1. **Why binary search works**: The feasibility function (can Koko finish in h hours at speed k) is monotonic - if speed k works, any higher speed also works
2. **Math.ceil**: Each pile takes ceil(pile/k) hours to finish
3. **Return value**: Use left because when the loop exits, left is the smallest value where hours <= h