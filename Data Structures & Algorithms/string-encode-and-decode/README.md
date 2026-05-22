# Encode and Decode Strings - LeetCode 271

## Problem Description

Design an algorithm to encode a list of strings into a single string and decode it back. The encoded string is sent over the network.

## Examples

```
Input: ["neet","code"]
Output: "neet#code" (or similar format)
```

## Topics

- String
- Design

## Solution Approaches

### 1. Special Delimiter
- Join strings with a character that doesn't appear in the strings (difficult if all ASCII is allowed).
- **Time Complexity**: O(n)
- **Space Complexity**: O(k) for delimiter

### 2. Length Prefix (Optimal)
- For each string, store its length followed by a delimiter and the string itself: `4#neet4#code`.
- **Time Complexity**: O(n)
- **Space Complexity**: O(1) additional per string