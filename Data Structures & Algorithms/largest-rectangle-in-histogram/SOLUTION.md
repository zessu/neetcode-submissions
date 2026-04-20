# Largest Rectangle in Histogram - Solution

## Solution Code

```javascript
class Solution {
    largestRectangleArea(heights) {
        const stack = [];
        let maxArea = 0;
        
        for (let i = 0; i <= heights.length; i++) {
            const h = i === heights.length ? 0 : heights[i];
            
            while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
                const height = heights[stack.pop()];
                const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        
        return maxArea;
    }
}
```

## Approach

The solution uses the **Monotonic Stack** technique:

1. **Include sentinel**: Add a 0-height bar at the end to flush all bars from stack
2. **Increasing stack**: Stack stores indices of bars in increasing height order
3. **Calculate on pop**: When a shorter bar is found, pop and calculate area using that height as the shortest bar

## Complexity Analysis

- **Time Complexity**: `O(n)` - each bar pushed and popped once
- **Space Complexity**: `O(n)` - worst case stack size

## Walkthrough

```
heights = [2,1,5,6,2,3] (+ 0 at end)

i=0: push 0 (height 2)
i=1: h=1 < 2 → pop, width=1-0-1=0, area=0 → push 1
i=2: push 2 (height 5)
i=3: push 3 (height 6)  
i=4: h=2 < 6 → pop, width=3-2-1=0, area=0
      h=2 < 5 → pop, width=3-1-1=1, area=5
      h=2 < 1? no → push 4
i=5: push 5 (height 3)
i=6: h=0 → pop, width=6-4-1=1, area=3
      pop, width=6-1-1=4, area=2*4=8
      pop, width=6-0-1=5, area=1*5=5
      pop (empty) → push 6

maxArea = 10 ✓
```

## Visual Representation

```
     █
   █ █
 █ █ █
 █ █ █
 █ █ █
[2,1,5,6,2,3]

Largest rectangle: width=5, height=2 → area=10
(using bars at indices 1-5 with height=2)
```