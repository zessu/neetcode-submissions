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

### 1. Clean and Reverse (Simple)
**Intuition**: Clean the string by removing non-alphanumeric characters and converting it to lowercase, then compare it with its reverse.

**Algorithm**:
1. Filter the string to keep only alphanumeric characters.
2. Convert the resulting string to lowercase.
3. Reverse the cleaned string.
4. Compare the cleaned string with its reverse.

**Time Complexity**: O(n) - multiple passes over the string (filter, lowercase, reverse, compare).
**Space Complexity**: O(n) - requires additional space to store the cleaned and reversed strings.

### 2. Two Pointers (Optimal)
**Intuition**: Use two pointers starting at both ends of the string and move towards the center, skipping non-alphanumeric characters and comparing characters at each step.

**Algorithm**:
1. Initialize `left = 0` and `right = s.length - 1`.
2. While `left < right`:
   - If `s[left]` is not alphanumeric, increment `left`.
   - Else if `s[right]` is not alphanumeric, decrement `right`.
   - Else:
     - If `s[left].toLowerCase() !== s[right].toLowerCase()`, return `false`.
     - Increment `left` and decrement `right`.
3. If the loop completes, return `true`.

**Time Complexity**: O(n) - single pass over the string.
**Space Complexity**: O(1) - constant space used for pointers.