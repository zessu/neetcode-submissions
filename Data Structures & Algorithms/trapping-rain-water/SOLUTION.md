# Trapping Rain Water - Solution

## Solution Code (Two Pointers - Optimal)

```javascript
class Solution {
    trap(height) {
        let left = 0;
        let right = height.length - 1;
        let leftMax = 0;
        let rightMax = 0;
        let water = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    water += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    water += rightMax - height[right];
                }
                right--;
            }
        }
        return water;
    }
}
```

## Solution Code (Brute Force / DP)

```javascript
class Solution {
    trap(height) {
        let sum = 0;
        for(let count = 0; count < height.length; count++) {
            let maxLeft = 0;
            let maxRight = 0;

            for(let i = 0; i < count; i++) {
                maxLeft = Math.max(maxLeft, height[i]);
            }
            for(let j = height.length - 1; j > count; j--) {
                maxRight = Math.max(maxRight, height[j]);
            }

            sum += Math.min(maxLeft, maxRight) - height[count];
        }
        return sum;
    }
}
```

## Approach

**Key Insight**: Water at each position = min(maxLeft, maxRight) - height[i]

- **Two Pointers**: Track leftMax and rightMax while moving inward
- **DP**: Precompute leftMax and rightMax arrays

## Complexity Analysis

- **Two Pointers**: O(n) time, O(1) space
- **Dynamic Programming**: O(n) time, O(n) space
- **Brute Force**: O(n²) time, O(1) space

## Comparison

| Approach | Time Complexity | Space Complexity | Notes |
| :--- | :--- | :--- | :--- |
| **Brute Force** | O(n²) | O(1) | Scans for max left/right on every bar |
| **Dynamic Programming**| O(n) | O(n) | Precomputes max values in arrays |
| **Two Pointers** | O(n) | O(1) | Optimal: replaces arrays with variables |

The **Two Pointers** approach is considered the most optimal as it achieves linear time complexity while using only constant additional space.

## Walkthrough

```
height = [0,1,0,2,1,0,1,3,2,1,2,1]

Position 0: min(0,3) - 0 = 0
Position 1: min(2,3) - 1 = 1
Position 2: min(2,3) - 0 = 2
Position 3: min(2,3) - 2 = 0
Position 4: min(2,2) - 1 = 1
Position 5: min(2,2) - 0 = 0
Position 6: min(2,2) - 1 = 0
Position 7: min(2,2) - 3 = 0
... etc

Total = 6 ✓
```

## Visual

```
     █
   █ █ █
 █ █ █ █
[0,1,0,2,1,0,1,3,2,1,2,1]

Water can pool in the "valleys" between bars.
```