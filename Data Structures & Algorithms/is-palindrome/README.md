# Valid Palindrome - LeetCode 125

## Problem Description

Given a string `s`, return `true` if it is a palindrome (considering only alphanumeric characters and ignoring case), or `false` otherwise.

A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

## Examples

### Example 1:
```
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: After cleaning: "amanaplanacanalpanama"
```

### Example 2:
```
Input: s = "race a car"
Output: false
Explanation: After cleaning: "raceacar"
```

### Example 3:
```
Input: s = " "
Output: true
Explanation: Empty string is a palindrome
```

## Constraints

- `s` consists only of printable ASCII characters.
- `1 <= s.length <= 2 * 10^5`

## Topics

- Two Pointers
- String

## Solution Approaches

### 1. Two Pointers
- Left pointer at start, right at end
- Skip non-alphanumeric, move inward
- Compare characters (case-insensitive)

### 2. Clean and Reverse
- Remove non-alphanumeric, convert to lowercase
- Compare with reversed string