# Valid Anagram - LeetCode 242

## Problem Description

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

## Examples

### Example 1:
```
Input: s = "anagram", t = "nagaram"
Output: true
```

### Example 2:
```
Input: s = "rat", t = "car"
Output: false
```

## Constraints

- `s` and `t` consist of lowercase English letters.
- `1 <= s.length, t.length <= 5 * 10^4`

## Topics

- Hash Table
- String
- Sorting

## Solution Approaches

### 1. Sorting Approach
Sort both strings and compare.

### 2. Character Count Approach
Count character frequencies using an array (26 for lowercase letters).

## Visual Explanation

```
s = "anagram", t = "nagaram"

Count in s: a=3, n=1, g=1, m=1, r=1
Count in t: a=3, n=1, g=1, m=1, r=1

Both counts match → true
```