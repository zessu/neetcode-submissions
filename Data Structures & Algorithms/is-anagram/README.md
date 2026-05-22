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

### 1. Brute Force
**Intuition**: For each character in `s`, try to find and remove it from `t`.

**Algorithm**:
1. If lengths of `s` and `t` are different, return `false`.
2. Convert `t` to a list of characters.
3. For each character `char` in `s`:
   - Find `char` in the list of `t`.
   - If not found, return `false`.
   - If found, remove it from the list.
4. Return `true` if all characters were matched.

**Time Complexity**: O(n²) - due to searching and removing in a list for each character.
**Space Complexity**: O(n) - to store the list of characters from `t`.

### 2. Sorting
**Intuition**: Anagrams contain the same characters in the same frequencies. Sorting both strings will make them identical if they are anagrams.

**Algorithm**:
1. If lengths of `s` and `t` are different, return `false`.
2. Sort both strings `s` and `t`.
3. Compare the sorted strings. If they are equal, return `true`; otherwise, return `false`.

**Time Complexity**: O(n log n) - dominated by the sorting algorithm.
**Space Complexity**: O(n) or O(log n) depending on the sorting implementation.

### 3. Hash Table / Frequency Counter (Optimal)
**Intuition**: Count the frequency of each character in both strings and compare counts.

**Algorithm**:
1. If lengths of `s` and `t` are different, return `false`.
2. Use a hash map or an array of size 26 (for lowercase English letters) to store frequencies.
3. Iterate through `s` and increment the count for each character.
4. Iterate through `t` and decrement the count for each character.
5. If all counts in the map/array are zero, return `true`.

**Time Complexity**: O(n)
**Space Complexity**: O(1) - since the size of the alphabet (26) is constant.

## Visual Explanation

```
s = "anagram", t = "nagaram"

Count in s: a=3, n=1, g=1, m=1, r=1
Count in t: a=3, n=1, g=1, m=1, r=1

Both counts match → true
```