# Longest Palindromic Substring - LeetCode 5

## Problem Description

Given a string `s`, return the **longest palindromic substring** in `s`.

A palindrome reads the same forward and backward. If there are multiple longest palindromic substrings, any one of them is accepted. The method signature used in this repository is `longestPalindrome(s)`.

## Examples

### Example 1:

```
Input: s = "babad"
Output: "bab"
```

**Explanation:** `"bab"` is a palindrome, and so is `"aba"`. Both have length 3, which is the maximum possible here. Either answer is accepted.

### Example 2:

```
Input: s = "cbbd"
Output: "bb"
```

**Explanation:** The longest palindrome is `"bb"` (even length). The single characters are palindromes too, but they are shorter.

### Example 3:

```
Input: s = "a"
Output: "a"
```

**Explanation:** A single character is always a palindrome.

### Example 4:

```
Input: s = "forgeeksskeegfor"
Output: "geeksskeeg"
```

**Explanation:** The palindrome starts at index 3 and ends at index 12. Its length is 10, and the two `"for"` fragments on the outside do not match.

## Constraints

- `1 <= s.length <= 1000`
- `s` consists of English letters and digits.
- A single character is a valid palindrome, so the answer always exists.

## Topics

- String
- Dynamic Programming
- Two Pointers
- Expand Around Center
- Manacher's Algorithm

## Company Tags

- Amazon
- Microsoft
- Adobe
- Facebook
- Bloomberg

## Solution Approaches

### 1. Brute Force

**Intuition**: Enumerate every substring, check whether it is a palindrome, and remember the longest one.

**Algorithm**:
1. For every start index `i` and end index `j >= i`:
   - Check whether `s[i..j]` reads the same in both directions.
   - If it does and `j - i + 1` is larger than the best length, record the substring.
2. Return the recorded substring.

**Time Complexity**: `O(n^3)` — there are `O(n^2)` substrings and each palindrome check can take `O(n)`.
**Space Complexity**: `O(1)` extra space (not counting the output or temporary substrings).

This is correct but far too slow for `n = 1000`: roughly `10^9` character comparisons in the worst case.

### 2. Interval Dynamic Programming

**Intuition**: A substring `s[i..j]` is a palindrome exactly when `s[i] === s[j]` and the inner substring `s[i+1..j-1]` is also a palindrome. Cache those inner answers instead of rechecking them.

**Algorithm**:
1. Create a boolean table `dp[i][j]` meaning "`s[i..j]` is a palindrome".
2. Every single character is a palindrome: `dp[i][i] = true`.
3. For lengths from `2` to `n`:
   - If `s[i] === s[j]` and (`j - i < 2` or `dp[i + 1][j - 1]`), set `dp[i][j] = true` and update the best range.
4. Return `s.substring(bestStart, bestEnd + 1)`.

**Time Complexity**: `O(n^2)` — each of the `O(n^2)` intervals is filled once.
**Space Complexity**: `O(n^2)` for the table.

The table makes the recurrence explicit, but at `n = 1000` it stores about one million booleans and is more code than the center-expansion approach.

### 3. Expand Around Center (Implemented)

**Intuition**: A palindrome is determined by its center and expands symmetrically outward. There are `2n - 1` possible centers: one for each character (odd length) and one between each pair of characters (even length). Expand every center as far as possible and keep the longest match.

**Algorithm**:
1. For each index `i` from `0` to `n - 1`:
   - Expand around `(i, i)` for odd-length palindromes.
   - Expand around `(i, i + 1)` for even-length palindromes.
2. In an expansion, while `left >= 0`, `right < n`, and `s[left] === s[right]`:
   - Compute the current length `(right + 1) - left`.
   - If it is longer than the best, record the best length and the inclusive `[left, right]` coordinates.
   - Move `left--` and `right++`.
3. Return `s.substring(bestStart, bestEnd + 1)`.

**Time Complexity**: `O(n^2)` — there are `O(n)` centers and each expansion can scan up to `O(n)` characters.
**Space Complexity**: `O(1)` extra space; only indices and the best length are stored.

This is the approach used in `submission-7.ts`. It avoids the `O(n^2)` table and is usually faster than the DP in practice because it stops as soon as the characters stop matching.

### 4. Manacher's Algorithm

**Intuition**: Reuse information from previously computed palindromes. Manacher transforms the string by inserting separators (for example `"aba"` becomes `"#a#b#a#"`), which makes every palindrome odd-length around a single transformed index. A mirror property lets the algorithm skip characters that are already known to match.

**Algorithm**:
1. Build the transformed string with separators.
2. Maintain the center and right boundary of the rightmost palindrome found so far.
3. For each position, initialize its radius from the mirrored position when it lies inside the current boundary; otherwise start at `1`.
4. Expand explicitly while the characters match, then update the best center/radius and the right boundary.
5. Map the best transformed radius back to an index range in the original string.

**Time Complexity**: `O(n)` — each position is expanded at most once overall.
**Space Complexity**: `O(n)` for the transformed string and radius array.

Manacher is the asymptotically optimal solution and is worth knowing, but it has many index details and is easy to get wrong under interview pressure. Center expansion is fast enough for `n = 1000` and much simpler to explain.

## Visual Explanation

```
s = "babad"

Odd centers:
  i = 0  "b"            length 1
  i = 1  "a" -> "bab"   length 3   <-- best so far
  i = 2  "b" -> "aba"   length 3   (not longer, keep "bab")
  i = 3  "a"            length 1
  i = 4  "d"            length 1

Even centers:
  (0,1) 'b' vs 'a'  no match
  (1,2) 'a' vs 'b'  no match
  (2,3) 'b' vs 'a'  no match
  (3,4) 'a' vs 'd'  no match

Answer: "bab" (length 3)
```

For `"cbbd"`, the odd centers only ever find single characters, but the even center `(1, 2)` expands over `"bb"` and records length 2. That is why both center types are required.

## Common Pitfalls

1. **Only checking odd centers**: palindromes such as `"bb"` and `"abba"` have even length and need a center between two characters.
2. **Using the wrong center count**: there are `2n - 1` centers, not `n`.
3. **Inclusive indices**: `substring(left, right + 1)` is required because JavaScript's `substring` end index is exclusive.
4. **Recording a shorter palindrome**: only update the answer when the new length is strictly greater than the best length.
5. **Class-level state across calls**: the submitted class stores `originalString`, `longestLength`, and `coordinates` as fields. A fresh `Solution` instance works correctly, but if the same instance is reused for another input, `longestLength` must be reset; otherwise a previous longer answer can leak into the next call.
6. **Assuming a unique answer**: `"babad"` has both `"bab"` and `"aba"`; the problem accepts either, so tie-breaking does not matter.
