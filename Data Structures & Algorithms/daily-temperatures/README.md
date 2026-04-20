# Daily Temperatures - LeetCode 739

## Problem Description

Given an array `temperatures` representing daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day where this is possible, keep `answer[i] == 0`.

## Examples

### Example 1:
```
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
```

### Example 2:
```
Input: temperatures = [30,60,90]
Output: [1,1,0]
```

### Example 3:
```
Input: temperatures = [30,38,30,36,35,40,28]
Output: [1,4,1,2,1,0,0]
```

## Constraints

- `1 <= temperatures.length <= 10^5`
- `30 <= temperatures[i] <= 100`

## Topics

- Array
- Stack
- Monotonic Stack

## Company Tags

- Amazon
- Apple
- Goldman Sachs

## Prerequisites

- Understanding of **Stack** data structure
- Knowledge of **O(n)** algorithm design
- Familiarity with the monotonic stack pattern

## Solution Approaches

### 1. Brute Force

**Intuition**: For each day, scan forward until a warmer temperature is found.

**Time Complexity**: `O(n²)` - too slow for large inputs
**Space Complexity**: `O(1)`

### 2. Monotonic Stack

**Intuition**: Use a stack to track indices of days that haven't found a warmer day yet. When a warmer day is found, pop and calculate the answer.

**Algorithm**:
1. Create a stack storing indices of days waiting for warmer weather
2. Iterate through each day:
   - While current temperature > temperature at stack's top, calculate days and pop
   - Push current index onto stack
3. Remaining indices in stack have no warmer day → answer is 0

**Time Complexity**: `O(n)` - each element pushed and popped at most once
**Space Complexity**: `O(n)` for stack

### 3. Dynamic Programming (Forward Scan)

**Algorithm**:
1. Create result array initialized to 0
2. Iterate from right to left
3. For each day, scan forward using a while loop to find next warmer day
4. Optimization: If the next day is cooler and has 0 answer, skip its answer days

## Visual Explanation

```
Input: [73,74,75,71,69,72,76,73]

Stack Process:
Day 0 (73): Stack empty → push 0
Day 1 (74): 74 > 73 → pop 0, answer[0]=1-0=1 → push 1
Day 2 (75): 75 > 74 → pop 1, answer[1]=2-1=1 → push 2
Day 3 (71): 71 < 75 → push 3
Day 4 (69): 69 < 71 → push 4
Day 5 (72): 72 > 69 → pop 4, answer[4]=5-4=1
             72 > 71 → pop 3, answer[3]=5-3=2
             push 5
Day 6 (76): 76 > 72 → pop 5, answer[5]=6-5=1
            76 > 75 → pop 2, answer[2]=6-2=4
            push 6
Day 7 (73): 73 < 76 → push 7 (stack has 0,7)
```

Final: [1,1,4,2,1,1,0,0]