# Longest Common Prefix - LeetCode 14

## Problem Description

Write a function to find the **longest common prefix** string amongst an array of strings.

If there is no common prefix, return an empty string `""`.

## Examples

### Example 1:
```
Input: strs = ["flower","flow","flight"]
Output: "fl"
```
**Explanation:** All three strings start with `"fl"`. The next characters are `"o"`, `"o"`, and `"i"`, so the common prefix stops at `"fl"`.

### Example 2:
```
Input: strs = ["dog","racecar","car"]
Output: ""
```
**Explanation:** The strings do not share even a first character (`"d"`, `"r"`, `"c"`), so there is no common prefix.

### Example 3:
```
Input: strs = ["a"]
Output: "a"
```
**Explanation:** With a single string, the entire string is trivially the longest common prefix.

### Example 4:
```
Input: strs = ["ab","a"]
Output: "a"
```
**Explanation:** The prefix cannot be longer than the shortest string. `"ab"` and `"a"` agree on `"a"`; the second string has no second character.

## Constraints

- `1 <= strs.length <= 200`
- `0 <= strs[i].length <= 200`
- `strs[i]` consists of only lowercase English letters if it is non-empty.

## Topics

- String
- Trie

## Company Tags

- Amazon
- Google
- Microsoft
- Apple
- Adobe

## Solution Approaches

### 1. Vertical Scanning (Implemented)

**Intuition**: Compare the strings **column by column**, starting at character position `0`. For each column, check that every string has the same character at that position. The first column where any string differs (or runs out of characters) marks the end of the prefix.

**Algorithm**:
1. If `strs` is empty, return `""`.
2. Take `word = strs[0]` as the reference.
3. For each character index `i` from `0` to `word.length - 1`:
   - Check every string `str` in `strs`:
     - If `i === str.length` (the string is shorter) or `str[i] !== word[i]`, return the prefix built so far.
   - Append `word[i]` to the answer.
4. If every column matched, return the whole reference word.

**Time Complexity**: `O(n * m)`, where `n = strs.length` and `m` is the length of the shortest string (at most the reference length). This is `O(S)` in the worst case, where `S` is the total number of characters across all strings.
**Space Complexity**: `O(m)` — both the returned prefix and the `wordChars` copy used by the implementation are linear in the reference length. Indexing `word[count]` directly instead of splitting would make the auxiliary space `O(1)`.

### 2. Horizontal Scanning

**Intuition**: Start with the first string as the candidate prefix, then shrink it against each subsequent string until it is a prefix of that string. The candidate never grows, so after processing all strings it is the longest common prefix.

**Algorithm**:
1. If `strs` is empty, return `""`.
2. Set `prefix = strs[0]`.
3. For each string `str` from index `1` to `n - 1`:
   - While `prefix` is not a prefix of `str`, remove its last character.
   - If `prefix` becomes empty, return `""` immediately.
4. Return `prefix`.

**Time Complexity**: `O(n * m)` in the worst case (`n` strings of length `m`), commonly written as `O(S)`, where `S` is the total number of characters.
**Space Complexity**: `O(1)` auxiliary space (the prefix is a slice of the input); `O(m)` if the result is copied.

### 3. Sorting

**Intuition**: After sorting the strings lexicographically, the strings with the most and least in common are the **first** and **last** in sorted order. If the first and last strings share a prefix, every string between them shares it too, because sorting groups strings by their leading characters.

**Algorithm**:
1. Sort a copy of `strs` lexicographically.
2. Compare the first and last strings character by character.
3. Stop at the first mismatch or when either string ends; return the matching prefix.

**Time Complexity**: `O(n log n * L)`, where `L` is the length of the longest string (a string comparison can inspect up to `L` characters), plus `O(L)` for the final comparison. In many practical cases comparisons are much shorter.
**Space Complexity**: `O(1)` auxiliary if the array is sorted in place (implementation-dependent); `O(n)` if a copy is made.

### 4. Trie

**Intuition**: Insert every string into a trie. The longest common prefix is the path from the root that every word follows. As soon as a node has more than one child (a branch) or a word ends, the common prefix stops.

**Algorithm**:
1. Build a trie from all strings.
2. Start at the root and walk down while the current node has exactly one child and is not the end of a word.
3. Append each traversed character to the answer.
4. Stop at the first branch or terminal node and return the answer.

**Time Complexity**: `O(S)` to build the trie, where `S` is the total number of characters, plus `O(L)` to walk the common path (`L` is the answer length).
**Space Complexity**: `O(S)` for the trie nodes and edges.

## Visual Explanation

```
strs = ["flower", "flow", "flight"]

column:      0   1   2   3   4   5
flower:      f   l   o   w   e   r
flow:        f   l   o   w
flight:      f   l   i   g   h   t
             ^   ^   ^
             |   |   |
match:       ✓   ✓   ✗  (o vs o vs i)

Columns 0 and 1 match for every string.
Column 2 fails, so the longest common prefix is "fl".
```

Horizontal scanning view:

```
prefix = "flower"
  vs "flow"   -> "flow"
  vs "flight" -> "fl"   ("flow" and "flight" differ at index 2)
answer = "fl"
```

## Common Pitfalls

1. **Ignoring the shortest string.** A prefix can never be longer than the shortest input. Indexing `str[i]` past its length yields `undefined`, which must be treated as a mismatch (the implemented `every` check does this naturally).
2. **Empty strings are allowed.** If any `strs[i] === ""`, the answer is `""`. The vertical loop compares against `undefined` and returns immediately.
3. **Comparing only adjacent strings.** Checking `strs[0]` against `strs[1]`, then `strs[1]` against `strs[2]`, is not sufficient in general; the prefix must hold for **all** strings.
4. **Growing the prefix.** The common prefix can only shrink as more strings are considered. Horizontal scanning must truncate, never extend, the candidate.
5. **Off-by-one when slicing.** If the mismatch is at index `i`, the answer is the first `i` characters (`slice(0, i)` or the already-built prefix), not `i + 1` characters.
6. **Mutating the input.** Sorting in place changes the caller's array; sort a copy if the original order matters.
7. **Assuming lowercase ASCII for custom comparisons.** The constraints guarantee lowercase English letters, but a manual character-code comparison should still be consistent with the language's ordering.

## Approach Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Vertical Scanning** | `O(n * m)` (worst `O(S)`) | `O(m)` result / `O(1)` auxiliary | Stops as soon as any string disagrees; excellent when a mismatch is early | Repeats a check of the first string at every column |
| **Horizontal Scanning** | `O(n * m)` (worst `O(S)`) | `O(1)` auxiliary | Very short code; no reference indexing | Can scan a long prefix repeatedly before shrinking it |
| **Sorting** | `O(n log n * L)` | `O(1)`–`O(n)` | Only two strings need character comparison after sorting | Sorting cost dominates; modifies order unless copied |
| **Trie** | `O(S)` | `O(S)` | Natural for prefix queries and repeated lookups | Heavy memory overhead for a one-off query |
