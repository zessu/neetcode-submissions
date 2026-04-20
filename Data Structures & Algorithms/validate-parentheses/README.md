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

## Solution: Stack

Push opening brackets, match with closing.