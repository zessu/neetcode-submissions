# Daily Temperatures - Solution

## Solution Code

```javascript
class Solution {
    /**
     * @param {number[]} temperatures
     * @return {number[]}
     */
    dailyTemperatures(temperatures) {
        const n = temperatures.length;
        const result = new Array(n).fill(0);
        const stack = []; // Stores indices
        
        for (let i = 0; i < n; i++) {
            // While current temp is warmer than the temp at stack's top
            while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
                const prevDay = stack.pop();
                result[prevDay] = i - prevDay;
            }
            stack.push(i);
        }
        
        // Remaining indices in stack already have 0
        return result;
    }
}
```

## Approach

The solution uses the **Monotonic Stack** pattern:

1. **Stack stores indices**: Days that haven't found a warmer temperature yet
2. **Greedy processing**: When we find a warmer day, we immediately answer ALL previous days waiting for it
3. **Single pass**: Each day is pushed and popped at most once

## Complexity Analysis

- **Time Complexity**: `O(n)` - each element pushed and popped at most once
- **Space Complexity**: `O(n)` - worst case stack size

## Walkthrough

```
Input: [73,74,75,71,69,72,76,73]

Step-by-step:
i=0 (73): Stack=[0]
i=1 (74): 74>73 → pop 0, result[0]=1 → Stack=[1]
i=2 (75): 75>74 → pop 1, result[1]=1 → Stack=[2]
i=3 (71): 71<75 → Stack=[2,3]
i=4 (69): 69<71 → Stack=[2,3,4]
i=5 (72): 72>69 → pop 4, result[4]=1 → Stack=[2,3]
           72>71 → pop 3, result[3]=2 → Stack=[2]
           push 5 → Stack=[2,5]
i=6 (76): 76>72 → pop 5, result[5]=1 → Stack=[2]
           76>75 → pop 2, result[2]=4 → Stack=[]
           push 6 → Stack=[6]
i=7 (73): 73<76 → Stack=[6,7]

Final result: [1,1,4,2,1,1,0,0]
```

## Key Insight

The monotonic stack eliminates redundant comparisons by:
- Only keeping days that are still "waiting" for warmer weather
- When a warmer day arrives, it's warmer for ALL days currently waiting (since we iterate in order)