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

## Comparison

| Approach | Time Complexity | Space Complexity | Description |
| :--- | :--- | :--- | :--- |
| Brute Force | O(n²) | O(1) | Expand for each bar. Simple but slow. |
| Monotonic Stack | O(n) | O(n) | Optimal approach using a stack to process bars efficiently. |

**Trade-offs**:
- **Brute Force**: Easy to understand and implement without extra space. However, it is impractical for large histograms because of its quadratic time complexity.
- **Monotonic Stack**: Much more efficient for large datasets, as it processes the histogram in linear time. It requires a deeper understanding of stack-based algorithms and uses extra space to store the indices of the bars.

## Key Insights

1. **Boundary Finding**: The problem boils down to finding the nearest smaller element to the left and right for each bar.
2. **Monotonicity**: Maintaining a monotonic increasing stack allows us to find these boundaries in O(1) time as we iterate.
3. **Sentinel Value**: Using a 0-height sentinel value at the end of the input simplifies the logic by ensuring all remaining bars in the stack are processed.

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