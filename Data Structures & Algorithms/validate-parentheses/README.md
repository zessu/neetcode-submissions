# Valid Parentheses - LeetCode 20

## Problem Description

Given a string s containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of bracket.
2. Open brackets must be closed in the correct order.

## Examples

```
Input: s = "()"
Output: true

Input: s = "()[]{}"
Output: true

Input: s = "(]"
Output: false
```

## Topics

- String
- Stack

## Solution Approaches

### 1. String Replacement (Brute Force)
- Repeatedly replace `()`, `[]`, and `{}` with an empty string until none remain. If the final string is empty, it's valid.
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1) or O(n) depending on string implementation

### 2. Stack (Optimal)
- Use a stack to push opening brackets and pop/match when a closing bracket is encountered.
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)