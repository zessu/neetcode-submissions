# Valid Palindrome II - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {string} s
     * @return {boolean}
     */
    validPalindrome(s: string): boolean {
        if(s === s.split('').reverse().join('')) return true;
        let left = 0;
        let right = s.length - 1;
        while(left < right) {
            if(!(s[left] === s[right])) {
                const leftstr = s.slice(0, left) + s.slice(left + 1);
                const rightstr = s.slice(0, right) + s.slice(right + 1);
                if(leftstr === leftstr.split('').reverse().join('') || rightstr === rightstr.split('').reverse().join('')) return true;
            }
            left++;
            right--;
        }
        return false;
    }
}
```

## Approach

The solution uses **two pointers plus the first-mismatch insight**.

1. **Fast path for zero deletions**: `s === s.split('').reverse().join('')` checks whether `s` is already a palindrome. If so, return `true` immediately. This handles the "at most one" part without special-casing later.
2. **Compare from both ends**: `left` starts at `0`, `right` at `n - 1`. Matching characters are fine; move inward.
3. **On the first mismatch**, the pair `s[left]` and `s[right]` cannot both stay. Any valid palindrome must delete one of them, so there are only two candidates:
   - `leftstr = s.slice(0, left) + s.slice(left + 1)` removes `s[left]`.
   - `rightstr = s.slice(0, right) + s.slice(right + 1)` removes `s[right]`.
4. **Check both candidates**: reverse each and compare with itself. If either is a palindrome, return `true`. Both substrings are constructed before the condition, but the reverse comparison of `rightstr` is skipped by `||` when `leftstr` already succeeds.
5. **Otherwise keep scanning**: if neither candidate works, the loop advances both pointers and eventually returns `false`.

### Correctness

At the first mismatch, every character outside `[left, right]` has already been matched. If a valid palindrome exists after one deletion, the deleted character must be one of the two mismatched characters: deleting anything inside leaves both `s[left]` and `s[right]` in place, and they would still be at symmetric positions, so the result could not be a palindrome. Testing exactly those two deletions is therefore sufficient.

The implementation continues scanning when both candidates fail rather than returning `false` immediately. That is still correct — later candidates cannot succeed because the outer mismatch remains — but it repeats work.

### Complexity

- **Best case**: `O(n)` when `s` is already a palindrome or a candidate succeeds at the first mismatch. The initial reverse check and the candidate checks are each linear.
- **Worst case**: `O(n^2)` as written. The loop can encounter `O(n)` mismatches, and each mismatch builds two `O(n)` substrings and reverses them, costing `O(n)` per mismatch.
- **Space**: `O(n)` for the temporary candidate strings and their reversed copies. The pointers themselves are `O(1)`.

> Using an index-based `isPalindrome(lo, hi)` helper and returning `false` as soon as both candidates fail reduces this to `O(n)` time and `O(1)` space.

## Walkthrough

### Example 1: `s = "aba"`

1. `s.split('').reverse().join('')` produces `"aba"`, which equals `s`.
2. Return `true` immediately without entering the loop.

This confirms that **zero deletions** are allowed.

### Example 2: `s = "abca"`

1. Reverse is `"acba"`, which differs from `"abca"`, so the fast path does not fire.
2. `left = 0`, `right = 3`: `s[0] = 'a'`, `s[3] = 'a'` → match. Move inward: `left = 1`, `right = 2`.
3. `s[1] = 'b'`, `s[2] = 'c'` → mismatch.
4. Build candidates:

| Candidate | Construction | Value | Palindrome? |
| :--- | :--- | :--- | :--- |
| Delete `left` (`b`) | `s.slice(0,1) + s.slice(2)` = `"a" + "ca"` | `"aca"` | Yes |
| Delete `right` (`c`) | `s.slice(0,2) + s.slice(3)` = `"ab" + "a"` | `"aba"` | Yes |

5. `leftstr` is a palindrome, so the `||` short-circuits and returns `true`.

**Result:** `true`. Either deletion produces a valid palindrome.

### Example 3: `s = "abc"`

1. Reverse is `"cba"` ≠ `"abc"`.
2. `left = 0`, `right = 2`: `'a'` vs `'c'` → mismatch.
3. Candidates:
   - Delete `'a'`: `"" + "bc"` = `"bc"`; reverse `"cb"` → not equal.
   - Delete `'c'`: `"ab" + ""` = `"ab"`; reverse `"ba"` → not equal.
4. Neither works. `left = 1`, `right = 1`, so the loop exits.
5. Return `false`.

**Result:** `false`.

### Example 4: `s = "deeee"`

1. Reverse is `"eeeed"` ≠ `"deeee"`.
2. `left = 0`, `right = 4`: `'d'` vs `'e'` → mismatch.
3. Delete `'d'`: `"" + "eeee"` = `"eeee"`, which is a palindrome → return `true`.

**Result:** `true`.

### Example 5: `s = "cabbad"`

1. Reverse is `"dabbac"` ≠ `"cabbad"`.
2. `left = 0`, `right = 5`: `'c'` vs `'d'` → mismatch.
3. Delete `'c'` → `"abbad"` (reverse `"dabba"`, not equal). Delete `'d'` → `"cabba"` (reverse `"abbac"`, not equal).
4. The loop continues: `left = 1`, `right = 4` (`'a'`/`'a'`), then `left = 2`, `right = 3` (`'b'`/`'b'`), then the pointers cross.
5. Return `false`.

**Result:** `false`. The inner characters match, but the unfixable outer mismatch remains, exactly as the correctness argument predicts.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Two Pointers + Candidate Deletion (implemented)** | `O(n)` typical; `O(n^2)` worst as written | `O(n)` | Simple and correct. The first-mismatch insight reduces the search to two candidates. Repeated slicing/reversing and the missing early `false` weaken the worst case. |
| Greedy + Helper | `O(n)` | `O(1)` | Strictly better: the same logic without building strings, and an immediate `false` after both candidates fail. This is the expected interview solution. |
| Brute Force | `O(n^2)` | `O(n)` | Tries every deletion, including inner ones that cannot possibly fix an outer mismatch. Easy to reason about, but wasteful and slower than necessary. |
| Recursive Deletion | `O(n)` | `O(n)` stack | Expresses the "one skip" budget cleanly, but recursion depth reaches `n / 2`; at `n = 10^5` JavaScript may throw a stack overflow. |

**Why the implemented approach is preferred:** it captures the crucial observation that only the first mismatched pair matters. Once `left` and `right` differ, there are exactly two possible deletions, so the branching factor is two rather than `n`. That makes the code short and the reasoning airtight. The initial reverse check also handles the "zero deletions" case in one line.

**When the alternatives win:**
- **Greedy + helper** wins for large inputs and for the follow-up "can you do it in `O(1)` space?". It avoids all substring allocation and returns as soon as both candidates fail. For `n = 10^5`, it is the difference between a fast solution and a potential timeout.
- **Brute force** wins only for very short strings or when clarity for beginners matters more than efficiency. It also makes the definition of "delete one character" explicit.
- **Recursion** wins when the interviewer wants to see the decision-tree structure, but it is not advisable for the maximum input size.

## Key Insights

1. **Only the first mismatch matters**: after matching outer pairs, a mismatch forces the deletion to be one of those two characters. All other deletions would leave the mismatch in place.
2. **Two candidates, not `n`**: the implemented approach tests `leftstr` and `rightstr` rather than every possible deletion, which is why it is much faster than brute force on typical inputs.
3. **"At most one" includes zero**: the initial full-palindrome check is not just an optimization; it is required for inputs like `"aba"`.
4. **Deletion indices are easy to get wrong**: deleting index `left` uses `s.slice(0, left) + s.slice(left + 1)`. The helper version instead scans `[left + 1, right]`.
5. **Reversing is `O(n)` and allocating**: doing it once is fine, doing it at every mismatch is not. A pair of indices avoids both the time and the memory.
6. **Early `false` is the missing optimization**: when both candidates fail, return `false` immediately. The implemented loop continues, which is correct but can degrade to `O(n^2)`.
7. **The remaining substring must be an exact palindrome**: once one character is deleted, no further deletions are allowed. The helper must not carry a deletion budget.
