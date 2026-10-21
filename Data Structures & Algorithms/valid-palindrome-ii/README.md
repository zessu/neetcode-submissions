# Valid Palindrome II - LeetCode 680

## Problem Description

Given a string `s`, return `true` if `s` can be a **palindrome after deleting at most one character** from it.

A palindrome reads the same forward and backward. "At most one" means zero deletions are also allowed, so an already-palindromic string is valid.

## Examples

### Example 1:
```
Input: s = "aba"
Output: true
```
**Explanation:** `"aba"` is already a palindrome, so no deletion is needed. Deleting zero characters is allowed.

### Example 2:
```
Input: s = "abca"
Output: true
```
**Explanation:** The first and last characters (`a`) match. The inner pair is `b` and `c`, which differ. Deleting `b` gives `"aca"`, a palindrome; deleting `c` gives `"aba"`, also a palindrome. Either deletion works.

### Example 3:
```
Input: s = "abc"
Output: false
```
**Explanation:** The outer pair `a`/`c` differs. Deleting `a` leaves `"bc"`, not a palindrome; deleting `c` leaves `"ab"`, not a palindrome. Deleting `b` leaves `"ac"`, also not a palindrome. No single deletion helps.

### Example 4:
```
Input: s = "deeee"
Output: true
```
**Explanation:** Deleting the leading `d` leaves `"eeee"`, a palindrome.

### Example 5:
```
Input: s = "cabbad"
Output: false
```
**Explanation:** The outer pair `c`/`d` differs. Deleting either one still leaves a string that is not a palindrome, and deleting an inner character cannot fix the outer mismatch.

## Constraints

- `1 <= s.length <= 10^5`
- `s` consists of lowercase English letters.

## Topics

- Two Pointers
- String
- Greedy

## Company Tags

- Meta
- Amazon
- Microsoft
- Google
- Bloomberg

## Solution Approaches

### 1. Brute Force: Try Every Deletion

**Intuition**: Remove each character in turn and test whether the resulting string is a palindrome. Also test the original string, since zero deletions are allowed.

**Algorithm**:
1. If `s` is already a palindrome, return `true`.
2. For each index `i` from `0` to `n - 1`:
   - Build `candidate = s.slice(0, i) + s.slice(i + 1)`.
   - Check whether `candidate` equals its reverse.
   - If it does, return `true`.
3. Return `false` if no deletion works.

**Time Complexity**: `O(n^2)` — `n` candidates, each built and checked in `O(n)`.
**Space Complexity**: `O(n)` — each candidate string needs `O(n)` memory (and reversing creates another copy).

### 2. Two Pointers with Candidate Deletion (Implemented)

**Intuition**: Compare characters from both ends. As long as they match, move inward. At the **first mismatch**, any valid solution must delete either the left character or the right character — no other deletion can fix that pair. Test those two possibilities and accept if either remaining substring is a palindrome.

**Algorithm**:
1. Compare `s` with its reverse. If equal, return `true` (already a palindrome).
2. Set `left = 0`, `right = n - 1`.
3. While `left < right`:
   - If `s[left] === s[right]`, move both pointers inward.
   - Otherwise, this is a mismatch. Build two candidates:
     - `leftStr`: `s` with index `left` removed.
     - `rightStr`: `s` with index `right` removed.
   - If either candidate is a palindrome, return `true`.
   - If neither is, continue moving the pointers inward.
4. Return `false` if the loop ends without a match.

**Time Complexity**: `O(n^2)` worst case **as implemented** — each mismatch builds and reverses `O(n)` strings, and the loop can encounter `O(n)` mismatches. It is `O(n)` on inputs where a candidate succeeds early or the string is already a palindrome. Adding `return false` immediately after both candidates fail makes it a single `O(n)` check.
**Space Complexity**: `O(n)` — the temporary slice and reversed copies.

The key correctness observation is that if both candidates fail at the *first* mismatch, no single deletion can produce a palindrome, because any later deletion leaves that mismatched outer pair intact. The implementation keeps scanning after both fail, which is correct but does redundant work.

### 3. Greedy Two Pointers with a Palindrome Helper (Optimal)

**Intuition**: Same first-mismatch insight, but check each candidate in place with a helper that scans inward using two pointers. No strings are built, so the check is `O(1)` extra space and the first failure can return immediately.

**Algorithm**:
1. Set `left = 0`, `right = n - 1`.
2. While `left < right`:
   - If `s[left] === s[right]`, increment `left` and decrement `right`.
   - Otherwise, return `isPalindrome(left + 1, right) || isPalindrome(left, right - 1)`.
3. If the loop completes, return `true`.

`isPalindrome(lo, hi)` compares `s[lo]` and `s[hi]` while moving inward.

**Time Complexity**: `O(n)` — after the first mismatch, at most two `O(n)` scans; if there is no mismatch, one `O(n)` scan.
**Space Complexity**: `O(1)` — only indices.

### 4. Recursive Deletion

**Intuition**: Walk inward recursively with a budget of one deletion. When characters differ, spend the budget by skipping either the left or the right character; the answer is true if either branch succeeds.

**Algorithm**:
1. Define `check(left, right, canDelete)`.
2. If `left >= right`, return `true`.
3. If `s[left] === s[right]`, recurse with `check(left + 1, right - 1, canDelete)`.
4. If they differ and `canDelete` is false, return `false`.
5. Otherwise return `check(left + 1, right, false) || check(left, right - 1, false)`.

**Time Complexity**: `O(n)` — the deletion budget allows at most two parallel scans.
**Space Complexity**: `O(n)` — recursion depth can reach `n / 2`, which risks stack overflow at `n = 10^5`.

## Visual Explanation

```
s = "abca"

compare ends:
  a . . a   match -> move inward
    b c     mismatch

Any valid deletion must remove b or c:
  delete b -> "aca"  palindrome ✓
  delete c -> "aba"  palindrome ✓
answer: true
```

```
s = "abc"

  a . c   mismatch
  delete a -> "bc"  ✗
  delete c -> "ab"  ✗
answer: false
```

## Approach Comparison

| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| Brute Force | `O(n^2)` | `O(n)` | Tries every deletion; simple but slow |
| **Two Pointers + Candidate Deletion (implemented)** | `O(n^2)` worst, `O(n)` typical | `O(n)` | Correct; repeated slicing/reversing costs extra time and memory |
| **Greedy + Helper** | `O(n)` | `O(1)` | **Optimal**; the expected interview solution |
| Recursive Deletion | `O(n)` | `O(n)` stack | Elegant, but deep recursion at `n = 10^5` |

## Common Pitfalls

1. **Forgetting that zero deletions are allowed**: An already-palindromic string must return `true`. Do not force exactly one deletion.
2. **Only checking one side of the first mismatch**: At a mismatch, either character could be the one to delete. Both candidates must be tested.
3. **Deleting at the wrong index**: Removing index `left` means `s.slice(0, left) + s.slice(left + 1)`. Using `left - 1` or `left + 2` deletes the wrong character.
4. **Comparing wrong ranges in the helper**: After deleting `left`, the remaining range is `[left + 1, right]`; after deleting `right`, it is `[left, right - 1]`. Reusing `[left, right]` re-checks the deleted character.
5. **Not returning false early**: If both candidates fail at the first mismatch, no single deletion can work. Continuing the scan is correct but can turn an `O(n)` solution into `O(n^2)`.
6. **Using `s.split('').reverse().join('')` inside a loop**: Each call is `O(n)` and allocates. Prefer an index-based palindrome helper for `O(1)` space.
7. **Unicode assumptions**: The constraints guarantee lowercase English letters, so single-index comparison is safe. For general Unicode, code points outside the BMP would need special handling.
