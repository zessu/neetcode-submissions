# Valid Parentheses - Solution

## Solution Code

```javascript
class Solution {
    isValid(s) {
        const openingPairs = ["(", "{", "["];
        const closingPairs = [")", "}", "]"];

        const matchingPairs = {
            "}": "{",
            ")": "(",
            "]": "["
        };

        const stack = [];

        const splitString = s.split('');
        if (s.length % 2) return false;

        for (let count = 0; count < s.length; count++) {
            const bracket = splitString[count];
            if (openingPairs.indexOf(bracket) !== -1) {
                stack.push(bracket);
            } else if (closingPairs.indexOf(bracket) !== -1) {
                const comp = stack.pop();
                if (matchingPairs[bracket] === comp) continue;
                return false;
            } else {
                return false;
            }
        }
        return stack.length === 0;
    }
}
```

## Approach

1. **Push opening brackets** onto stack
2. **When closing bracket**: check if it matches the top of stack
3. **At end**: stack must be empty for valid string

## Complexity Analysis

- **Time**: O(n) - single pass through the string.
- **Space**: O(n) - in the worst case (all opening brackets).

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force** | O(n²) | O(n) | Easy to understand | Extremely slow for long strings |
| **Stack** | O(n) | O(n) | Optimal performance | Requires stack knowledge |

The **Stack** approach is the definitive way to solve this problem, providing linear performance by ensuring each bracket is processed only twice (push and pop).

## Walkthrough

```
s = "()[]{}"

i=0: '(' → push → stack=['(']
i=1: ')' → pop '(' matches → stack=[]
i=2: '[' → push → stack=['[']
i=3: ']' → pop '[' matches → stack=[]
i=4: '{' → push → stack=['{']
i=5: '}' → pop '{' matches → stack=[]

Stack empty → valid! ✓

s = "(]"

i=0: '(' → push → stack=['(']
i=1: ']' → pop '(' doesn't match → invalid! ✗
```