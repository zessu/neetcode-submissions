# Merge Sorted Array - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number[]} nums1
     * @param {number} m
     * @param {number[]} nums2
     * @param {number} n
     * @return {void} Do not return anything, modify nums1 in-place instead.
     */
    merge(nums1: number[], m: number, nums2: number[], n: number): void {
        for(let count = 0; count<nums2.length; count++) {
            nums1[nums1.length - (count + 1)] = nums2[count];
        }
        nums1.sort((a,b) => a - b);
    }
}
```

## Approach

The implemented solution is **"copy `nums2` into the free tail, then sort `nums1`"**.

1. **Find the free cells.** By the problem's contract, `nums1.length === m + n` and its last `n` cells are placeholders. For `count = 0 .. nums2.length - 1`, the target index `nums1.length - (count + 1)` counts down from the very last cell: `m+n-1`, `m+n-2`, …, `m`.
2. **Copy `nums2` back-to-front.** Writing from the end means the first write lands in the last cell and the last write lands exactly at index `m`. The first `m` real values are never touched. The loop iterates until `count < nums2.length`, which equals `n` under the constraints.
3. **Sort numerically.** `nums1.sort((a, b) => a - b)` reorders all `m + n` values in place. The comparator is essential: the default sort converts values to strings, which puts `10` before `9` and misorders negative numbers.
4. **Return nothing.** The method signature is `void`; LeetCode inspects the mutated `nums1`.

Correctness follows directly: after step 2, `nums1` contains exactly the multiset of the two inputs (the placeholders have been overwritten), and step 3 puts that multiset into non-decreasing order. No value is lost or invented.

- **Time Complexity**: `O((m + n) log(m + n))` — the copy is `O(n)`, the sort dominates.
- **Space Complexity**: `O(1)` auxiliary — no buffer is allocated. (The engine's sort may use `O(log(m+n))` stack space.)

One measurement detail: V8/Node's `Array.prototype.sort` is TimSort, which detects existing ascending runs. After the copy, `nums1` consists of two sorted runs (`nums1[0..m-1]` and the copied `nums2` tail), so in practice the sort often finishes in `O(m + n)`. That is an engine-level optimization, **not** a guarantee of the code's complexity, so the honest bound remains `O((m+n) log(m+n))`.

## Walkthrough

### Example 1: `nums1 = [1,2,3,0,0,0]`, `m = 3`, `nums2 = [2,5,6]`, `n = 3`

**Copy phase** (`nums1.length = 6`, so target indices are `5, 4, 3`):

| `count` | `nums2[count]` | Target index | `nums1` after write |
| :--- | :--- | :--- | :--- |
| 0 | 2 | `6 - 1 = 5` | `[1,2,3,0,0,2]` |
| 1 | 5 | `6 - 2 = 4` | `[1,2,3,0,5,2]` |
| 2 | 6 | `6 - 3 = 3` | `[1,2,3,6,5,2]` |

**Sort phase**: `[1,2,3,6,5,2]` &rarr; `[1,2,2,3,5,6]`.

`nums1` is now `[1,2,2,3,5,6]`, which matches the expected output. The placeholder zeros are gone and both duplicates of `2` are present.

### Example 2: `nums1 = [1]`, `m = 1`, `nums2 = []`, `n = 0`

`nums2.length` is `0`, so the copy loop body never executes. Sorting a one-element array is a no-op. `nums1` stays `[1]`.

### Example 3: `nums1 = [0]`, `m = 0`, `nums2 = [1]`, `n = 1`

`count = 0` writes `nums2[0] = 1` to index `1 - 1 = 0`, overwriting the placeholder: `[1]`. The sort leaves it unchanged. This is the case where `m = 0` and the "real" prefix is empty — the placeholder is the only slot, and it is exactly where the answer belongs.

### Stress case: negatives and multi-digit values

`nums1 = [-5,-1,0,0]`, `m = 2`, `nums2 = [-3,10]`, `n = 2` &rarr; the copy fills the tail backwards (`10` at index 2, `-3` at index 3), giving `[-5,-1,10,-3]`; numeric sort gives `[-5,-3,-1,10]`. With a default (string) sort the result would have been `[-1,-3,-5,10]`, which demonstrates why the comparator matters.

## Comparison with the Alternatives

| Approach | Time | Space | Why it loses / wins |
| :--- | :--- | :--- | :--- |
| **Copy + sort (implemented)** | `O((m+n) log(m+n))` | `O(1)` | Three lines, no index arithmetic beyond the tail offset. Wins on brevity and on avoiding aliasing bugs. Loses asymptotically: it re-sorts data that is already sorted twice. Also relies on `nums1.length === m + n`. |
| Three pointers from the end | `O(m+n)` | `O(1)` | Strictly better asymptotically and still allocation-free. Wins on the `O(m+n)` follow-up and on large inputs. Requires reasoning about why backward writes are safe. |
| Extra buffer merge | `O(m+n)` | `O(m+n)` | Easy to verify and order-stable, but allocates a full copy of the output, which the problem's in-place setup is designed to avoid. Wins when clarity matters more than memory or when mutation of `nums1` is undesirable. |

**Why the implemented approach is acceptable.** At the given constraint `m + n <= 200`, `log(200) ≈ 7.6`, so the sort performs only a few hundred comparisons — completely irrelevant in practice. The code is short, obviously correct (multiset equality plus sorting), and never risks the classic forward-merge overwrite bug. It also gracefully handles `n = 0` and `m = 0`.

**When an alternative wins.**

- **Choose three pointers from the end** whenever the input can be large or the interviewer asks for the `O(m+n)` follow-up. It is the canonical answer expected for this problem, and it uses the same `O(1)` space without re-sorting.
- **Choose the extra buffer** if you must keep `nums1`'s original contents intact while producing a separate merged result, or if you want a merge that is trivially stable and does not depend on the spare tail.
- **Do not choose a forward in-place merge** without a buffer: it overwrites `nums1[0..m-1]` before those values are read. This is the single most common failure for this problem.

## Key Insights

1. **The tail is free workspace, not data.** The `n` zeros exist only so the merged result fits. Overwriting them from the back is safe; comparing against them is not.
2. **Backward writing avoids the overwrite problem.** In the three-pointer version, `k` starts at the largest index and both `i` and `j` point at the largest *unconsumed* values. Everything to the right of `k` is already final, and everything to the left of `i` is untouched — so the write target can never hold a value that is still needed.
3. **`m` is a count, not a length.** `nums1.length` is `m + n`; only the first `m` entries are input. The implemented code never reads `m`, which is fine precisely because the constraint fixes the layout.
4. **Always pass a comparator.** The default `sort` is lexicographic by string conversion. This silently breaks inputs with double digits or negatives — exactly the values allowed by the constraints.
5. **`j >= 0` is the only loop condition needed.** Once `nums2` is exhausted, the remaining prefix of `nums1` is already sorted and in its final positions; no cleanup copy is required.
