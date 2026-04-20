# Container With Most Water - Solution

## Solution Code (Two Pointers)

```javascript
class Solution {
    maxArea(heights) {
        let maxWater = 0;
        let left = 0;
        let right = heights.length - 1;
        
        while (left < right) {
            const width = right - left;
            const height = Math.min(heights[left], heights[right]);
            maxWater = Math.max(maxWater, width * height);
            
            if (heights[left] < heights[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxWater;
    }
}
```

## Brute Force

```javascript
class Solution {
    maxArea(heights) {
        let maxWater = 0;
        for(let i=0; i<heights.length; i++) {
            for(let j=i+1; j<heights.length; j++) {
                const width = j - i;
                const height = Math.min(heights[i], heights[j]);
                maxWater = Math.max(maxWater, width * height);
            }
        }
        return maxWater;
    }
}
```

## Approach

**Key Insight**: Always move the pointer with the shorter height.

Why? The width decreases each move, so we can only increase area if the shorter height becomes taller. Moving the taller height can never help.

## Complexity

- **Two Pointers**: Time O(n), Space O(1)
- **Brute Force**: Time O(n²), Space O(1)

## Walkthrough

```
height = [1,8,6,2,5,4,8,3,7]

Initial: left=0, right=8
- width=8, height=min(1,7)=1, area=8
- height[left]=1 < height[right]=7 → left++

left=1, right=8
- width=7, height=min(8,7)=7, area=49 max!
- height[left]=8 > height[right]=7 → right--

Continue until left >= right
Output: 49 ✓
```

## Visual

```
         |
         |         █
     █   |     █
     █   |   █ █
     █   |   █ █
 █   █   |   █ █
 █   █ █   █ █
[1][8][6][2][5][4][8][3][7]
 0   1   2   3   4   5   6   7   8

Area = (8-1) * min(8,7) = 7*7 = 49
```