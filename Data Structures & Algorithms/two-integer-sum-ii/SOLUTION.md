# Two Sum II - Solution

## Solution Code (Two Pointers - Optimal)

```javascript
class Solution {
    twoSum(numbers, target) {
        let left = 0;
        let right = numbers.length - 1;
        
        while (left < right) {
            const sum = numbers[left] + numbers[right];
            
            if (sum === target) {
                return [left + 1, right + 1];
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return [-1, -1];
    }
}
```

## Solution Code (Brute Force - from submission)

```javascript
class Solution {
    twoSum(numbers, target) {
        for(let i = 0; i < numbers.length; i++) {
            for(let j = i + 1; j < numbers.length; j++) {
                if(numbers[i] + numbers[j] === target) {
                    return [i + 1, j + 1];
                }
            }
        }
        return [-1, -1];
    }
}
```

## Approach

**Two Pointers** works because the array is sorted:
- If sum < target: move left pointer right (increase sum)
- If sum > target: move right pointer left (decrease sum)

## Complexity Analysis

- **Two Pointers (Optimal)**: O(n), O(1) space
- **Binary Search**: O(n log n), O(1) space
- **Brute Force**: O(n²), O(1) space

## Comparison

| Approach | Time Complexity | Space Complexity | Notes |
| :--- | :--- | :--- | :--- |
| **Brute Force** | O(n²) | O(1) | Slow and doesn't use sorted property |
| **Binary Search** | O(n log n) | O(1) | Better, but not optimal |
| **Two Pointers** | O(n) | O(1) | Optimal use of sorted property |

The **Two Pointers** approach is the best way to solve this problem as it leverages the sorted nature of the array to achieve linear time without extra space.

## Walkthrough

```
numbers = [2, 7, 11, 15], target = 9

left=0, right=3: sum=2+15=17 > 9 → right--
left=0, right=2: sum=2+11=13 > 9 → right--  
left=0, right=1: sum=2+7=9 → FOUND! return [1, 2] ✓
```

Note: Indices are 1-indexed as per problem.