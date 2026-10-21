# Longest Common Prefix - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {string[]} strs
     * @return {string}
     */
    longestCommonPrefix(strs: string[]): string {
        let ans = "";
        if(!strs.length) return ans;
        const word = strs[0];
        const wordChars = word.split('');
        for(let count=0; count<wordChars.length; count++) {
            if(!strs.every(str => str[count] === wordChars[count])) return ans;
            ans += wordChars[count];
        } 
        return ans;
    }
}
```

## Approach

The solution uses **vertical scanning**: it compares all strings one character column at a time.

1. **Defensive empty check.** If `strs` is empty, return `""`. (The constraints guarantee at least one string, but this keeps the function safe.)
2. **Choose a reference.** `strs[0]` fixes the maximum possible length and supplies the characters to test. The prefix cannot be longer than this string.
3. **Scan columns.** For each index `count` in the reference:
   - `strs.every(...)` checks that every string has the same character at `count`.
   - If any string is shorter, `str[count]` is `undefined`, which differs from the reference character and correctly ends the scan.
   - If any string has a different character, the scan also ends.
4. **Extend the answer.** If every string agrees at this column, append the character to `ans`.
5. **Return `ans`.** If the loop finishes, the entire reference word is the common prefix.

- **Time Complexity**: `O(n * m)`, where `n = strs.length` and `m` is the length of the shortest string (bounded by `strs[0].length`). At most `n` comparisons are made for each of at most `m` columns, so this is also `O(S)` where `S` is the total number of characters.
- **Space Complexity**: `O(m)`. `wordChars` is a copy of the reference string and `ans` grows to at most `m` characters.

## Walkthrough

### Example 1: `strs = ["flower","flow","flight"]`

| Column `count` | Reference char | `flower[count]` | `flow[count]` | `flight[count]` | All equal? | `ans` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | `f` | `f` | `f` | `f` | Yes | `"f"` |
| 1 | `l` | `l` | `l` | `l` | Yes | `"fl"` |
| 2 | `o` | `o` | `o` | `i` | No | `"fl"` |

At column 2, `flight[2] === "i"` differs from the reference `"o"`, so `every` returns `false` and the function returns `"fl"` immediately.

### Example 2: `strs = ["dog","racecar","car"]`

| Column `count` | Reference char | `dog[count]` | `racecar[count]` | `car[count]` | All equal? | `ans` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | `d` | `d` | `r` | `c` | No | `""` |

The very first column fails, so the function returns `""`.

### Example 3: `strs = ["a"]`

Column 0 matches (the only string is compared with itself), so `ans` becomes `"a"`. The loop ends and returns `"a"`.

### Example 4: `strs = ["ab","a"]`

| Column `count` | Reference char | `"ab"[count]` | `"a"[count]` | All equal? | `ans` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | `a` | `a` | `a` | Yes | `"a"` |
| 1 | `b` | `b` | `undefined` | No | `"a"` |

The shorter string runs out at index 1, so the scan stops and returns `"a"`. This is why no explicit length check is needed: `undefined` is never equal to a character.

> The implemented code includes `strs[0]` in the `every` check. That comparison is redundant but harmless; it always matches the reference character.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is / is not preferred |
| :--- | :--- | :--- | :--- |
| **Vertical Scanning (implemented)** | `O(n * m)` / `O(S)` | `O(m)` | Stops at the first mismatching column, which is ideal when the common prefix is short. It only stores the answer and a copy of the reference. |
| **Horizontal Scanning** | `O(n * m)` / `O(S)` | `O(1)` auxiliary | Uses less auxiliary memory and is equally simple. It can rescan a long candidate prefix for several strings before truncating it, whereas vertical scanning fails fast at the first bad column. |
| **Sorting** | `O(n log n * L)` | `O(1)`–`O(n)` (engine-dependent) | Elegant observation (only the first and last sorted strings matter), but sorting is asymptotically more expensive than a linear scan. It wins when the input is already sorted or when the strings are needed in order anyway. |
| **Trie** | `O(S)` | `O(S)` | Linear and natural for repeated prefix queries, but allocating a node per character is heavy for a single query. It is the right choice if the same set of strings will answer many prefix questions. |

**Why the implemented approach is preferred**: it is a single linear pass with early termination. The moment any string disagrees at a column, there is no need to inspect that column for the remaining strings or to look at later columns. The input is not modified, and the implementation handles short strings and empty strings without special cases.

**When an alternative wins**:
- **Horizontal scanning** is preferable when auxiliary memory must be minimal, or when the first string is expected to be a close upper bound and truncation happens quickly.
- **Sorting** is attractive if the strings are already sorted or if the caller needs sorted output as well; the first-vs-last comparison is then almost free.
- **Trie** wins when the array is static and many prefix queries will be made; the build cost is amortized across queries.

## Key Insights

1. **The prefix can only shrink.** Once a column fails, no longer prefix is possible, so vertical scanning can return immediately.
2. **`undefined` is a useful sentinel.** Comparing `str[count]` against the reference character naturally detects strings that are too short: there is no character at that index, so the equality is false.
3. **Use the first string as the bound.** No answer can be longer than `strs[0]`, so the outer loop never needs to inspect indices beyond its length.
4. **Empty string short-circuits the answer.** If any input is `""`, the first column comparison fails and the result is `""`.
5. **The `every` check includes the reference.** It is a harmless extra comparison; excluding it would save one comparison per column but complicate the code.
6. **`split('')` is not free.** It makes the implementation `O(m)` auxiliary rather than `O(1)`. For the given constraints this is insignificant, but indexing the string directly avoids the copy.
