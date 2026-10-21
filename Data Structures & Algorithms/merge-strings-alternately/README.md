# Merge Strings Alternately - LeetCode 1768

## Problem Description

You are given two strings `word1` and `word2`. Merge the strings by adding letters in **alternating order**, starting with `word1`. If one string is longer than the other, append the additional letters onto the end of the merged string.

Return the merged string.

## Examples

### Example 1:

```
Input: word1 = "abc", word2 = "pqr"
Output: "apbqcr"
```

**Explanation:** The merged string is built as:

```
word1:  a   b   c
word2:    p   q   r
merged: a p b q c r
```

The strings have equal length, so the alternation simply interleaves all six characters.

### Example 2:

```
Input: word1 = "ab", word2 = "pqrs"
Output: "apbqrs"
```

**Explanation:** `word1` runs out after two characters, so the remaining `"rs"` of `word2` is appended at the end:

```
word1:  a   b
word2:    p   q   r   s
merged: a p b q r s
```

### Example 3:

```
Input: word1 = "abcd", word2 = "pq"
Output: "apbqcd"
```

**Explanation:** `word2` runs out after two characters, so the remaining `"cd"` of `word1` is appended:

```
word1:  a   b   c   d
word2:    p   q
merged: a p b q c d
```

## Constraints

- `1 <= word1.length, word2.length <= 100`
- `word1` and `word2` consist of lowercase English letters.

## Topics

- Two Pointers
- String

## Company Tags

- Meta
- Amazon
- Bloomberg

## Solution Approaches

### 1. Repeatedly Slice Off the First Character (Implemented)

**Intuition**: Follow the definition literally. While both strings still have characters, take the first character of each (in `word1`, `word2` order), append both to the result, and drop those characters from the working copies. When one string empties, append the whole remainder of the other and stop.

**Algorithm**:
1. Start with `result = ""`.
2. While `word1` or `word2` is non-empty:
   - If `word1` is empty, append all of `word2` and break.
   - If `word2` is empty, append all of `word1` and break.
   - Append `word1.slice(0, 1)`, then `word2.slice(0, 1)`.
   - Replace `word1` with `word1.slice(1)` and `word2` with `word2.slice(1)`.
3. Return `result`.

**Time Complexity**: `O(L1 + L2)` character appends. Modern engines (V8, SpiderMonkey) represent substrings and concatenations as sliced/rope strings, so each `slice`/`+=` is effectively constant-time. On an engine that copies on every slice, the repeated shrinking makes it `O(L1^2 + L2^2)` — see the pitfalls.
**Space Complexity**: `O(L1 + L2)` for the result and the intermediate strings.

### 2. Index Two Pointers (Optimal, Non-Destructive)

**Intuition**: Instead of modifying the strings, keep one index `i` and read `word1[i]` and `word2[i]` while both exist. This makes the "which string ran out?" logic explicit and never allocates intermediate strings.

**Algorithm**:
1. Let `limit = max(word1.length, word2.length)`.
2. For `i = 0 .. limit - 1`:
   - If `i < word1.length`, push `word1[i]` into an array.
   - If `i < word2.length`, push `word2[i]` into the array.
3. Join the array into a string and return it.

**Time Complexity**: `O(L1 + L2)` — each character is visited and appended once.
**Space Complexity**: `O(L1 + L2)` for the output (plus the array of characters).

### 3. Recursive Merge

**Intuition**: The problem has a natural recursive shape: the answer is `word1[0] + word2[0]` followed by the merge of the two remainders. Base cases handle either string being empty.

**Algorithm**:
1. If `word1` is empty, return `word2`.
2. If `word2` is empty, return `word1`.
3. Return `word1[0] + word2[0] + merge(word1.slice(1), word2.slice(1))` — but note the base cases must return the remainder unchanged, not one character.

**Time Complexity**: `O(L1 + L2)` calls/character operations in the ideal model; `O((L1+L2)^2)` if slicing copies.
**Space Complexity**: `O(L1 + L2)` recursion depth.

## Comparison of Approaches

| Approach | Time | Space | Mutates inputs? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Repeated slicing (implemented)** | `O(L1+L2)`* | `O(L1+L2)` | No (rebinds locals) | Very direct translation; short and readable |
| Index two pointers | `O(L1+L2)` | `O(L1+L2)` | No | Guaranteed linear; explicit length handling |
| Recursive merge | `O(L1+L2)`* | `O(L1+L2)` | No | Elegant but risks deep stacks; no advantage at these sizes |

\* assuming constant-time slicing/concatenation as on modern engines; `O(L1^2 + L2^2)` if each slice copies the remainder.

## Visual Explanation

```
word1 = "ab",  word2 = "pqrs"

index:    0    1    2    3
word1:    a    b    -    -
word2:    p    q    r    s
          |    |    |    |
merged:   a    p    b    q    r    s
                ^              ^
          alternate        word1 exhausted at i=2,
          while both       so append word2[2..] verbatim

Result: "apbqrs"
```

The implemented loop removes the first character of each string every iteration:

```
iteration 1: word1="ab"   word2="pqrs"  append "a" + "p" -> result="ap"
             word1="b"    word2="qrs"
iteration 2: word1="b"    word2="qrs"   append "b" + "q" -> result="apbq"
             word1=""     word2="rs"
iteration 3: word1 empty  -> append "rs", break
result = "apbqrs"
```

## Common Pitfalls

1. **Forgetting the tail.** When the strings differ in length, the leftover characters must be appended in order. The implemented loop handles this with an explicit `break` after appending the remainder.
2. **Alternating past the end.** Reading `word1[i]` for `i >= word1.length` yields `undefined`, which silently becomes the text `"undefined"` if concatenated. Guard every read with a length check.
3. **Starting with the wrong string.** The first character always comes from `word1`, even if `word2` is longer.
4. **Off-by-one in the loop bound.** Use `Math.max(L1, L2)` (or loop while either string has characters). Looping `min(L1, L2)` times and stopping leaves the tail unprocessed.
5. **Mutating the inputs.** JavaScript strings are immutable, so `word1 = word1.slice(1)` only rebinds the local parameter; the caller's string is untouched. Code that *assumes* it mutated the caller would be wrong.
6. **Relying on `slice` cost.** The implemented version creates a shorter string each iteration. At `L <= 100` this is irrelevant, but on a copying engine it is quadratic. The index version avoids the question entirely.
7. **Unicode.** `slice(0, 1)` and `word[i]` operate on UTF-16 code units, so they can split an emoji or other astral character. The constraints restrict inputs to lowercase English letters, so this is safe here — but not in general.
8. **Empty strings.** Constraints guarantee at least one character, but a robust implementation should still return the other string when one side is empty.
