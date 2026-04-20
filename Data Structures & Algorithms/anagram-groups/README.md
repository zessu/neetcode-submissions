# NeetCode Logo
# Group Anagrams

## Problem Description

Given an array of strings `strs`, group the anagrams together into sublists. You may return the output in any order.

An **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

## Examples

### Example 1:
```
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

### Example 2:
```
Input: strs = [""]
Output: [[""]]
```

### Example 3:
```
Input: strs = ["a"]
Output: [["a"]]
```

## Constraints

- `1 <= strs.length <= 10^4`
- `0 <= strs[i].length <= 100`
- `strs[i]` consists of lowercase English letters.

## Topics

- Array
- Hash Table
- String
- Sorting

## Company Tags

- Amazon
- Facebook
- Google
- Microsoft
- Bloomberg
- Apple

## Hint 1

A brute force solution would be to sort each string and group them using a hash map. This would be an `O(m * n log n)` solution, where m is the number of strings.

## Hint 2

By the definition of an anagram, we only care about the frequency of each character in a string. How is this helpful?

## Hint 3

We can simply use an array of size 26, since the character set is `a` through `z` (26 continuous characters), to count character frequencies.

## Solution Approaches

### 1. Sorting Approach

**Intuition**: Anagrams become identical when their characters are sorted. For example, "eat", "tea", and "ate" all become "aet" after sorting. By using the sorted version of each string as a key, we can group all anagrams together.

**Algorithm**:
1. Iterate through each string in the input list
2. Sort the characters of the string to form a key
3. Append the original string to the list corresponding to this key
4. After processing all strings, return all values from the hash map

**Time Complexity**: `O(m * n log n)` where m is the number of strings and n is the length of the longest string
**Space Complexity**: `O(m * n)`

### 2. Character Count Signature Approach

**Intuition**: Instead of sorting each string, we can represent every string by the frequency of each character. Two strings that are anagrams will have the same character count signature.

**Algorithm**:
1. Create a count array of size 26 for each string
2. Convert the count array to a unique key string (e.g., "a1b2c1...")
3. Use this key in a hash map to group anagrams
4. Return all grouped values

**Time Complexity**: `O(m * n)` where m is the number of strings and n is the average length
**Space Complexity**: `O(m * n)`

## Visual Explanation

```
Input: ["eat","tea","tan","ate","nat","bat"]

Sorted Keys:
- "eat" → "aet"
- "tea" → "aet"
- "tan" → "ant"
- "ate" → "aet"
- "nat" → "ant"
- "bat" → "abt"

Grouping by key:
"aet" → ["eat", "tea", "ate"]
"ant" → ["tan", "nat"]
"abt" → ["bat"]

Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
```

## Common Pitfalls

1. **Forgetting empty strings**: The problem allows empty strings (length 0), so your solution must handle them correctly.
2. **Case sensitivity**: All strings are lowercase, so you don't need to handle uppercase.
3. **Duplicate handling**: Each valid triplet should only appear once in the output.