# Remove Element - Solution

## Solution Code

```typescript
class Solution {
    removeElement(nums: number[], val: number): number {
        for(let count=0; count<nums.length; count++) {
            if(nums[count] === val) {
                nums.splice(count, 1, Infinity);
            }
        }
        nums = nums.sort();
        return nums.reduce((acc, curr) => acc += curr === Infinity ? 0: 1, 0);
    }
}
```

## Approach

The implemented solution is a **mark-with-a-sentinel, sort, count** strategy.

1. **Mark every occurrence.** The loop visits each index. When `nums[count] === val`, `nums.splice(count, 1, Infinity)` removes one element and inserts `Infinity` in its place. Because one element is removed and one is inserted, the array length is unchanged and all later indices stay put — so `count` can safely increment and the scan sees every cell exactly once.
2. **Sort to collect the sentinels.** `nums.sort()` with no comparator sorts by string conversion. The string `"Infinity"` starts with `I`, which comes after every digit and after `-`, so all sentinels move to the end of the array. The surviving values end up in the prefix `nums[0..k-1]`.
3. **Count the survivors.** `reduce` walks the array and adds `1` for every entry that is not `Infinity`. That total is `k`, the number of elements not equal to `val`.
4. **Return `k`.** Nothing else is needed: the non-`Infinity` values already occupy the first `k` cells.

Two details make this work on LeetCode 27 specifically:

- **Order does not matter.** The judge sorts `nums[0..k-1]` before comparing, so the default lexicographic order of the survivors is irrelevant. (It is *not* numeric order: `10` would sort before `2`.)
- **The constraints make `Infinity` unambiguous.** `nums[i] <= 50` and `val <= 100`, so no real value can equal the sentinel.

A note on mutation: `nums.sort()` sorts the caller's array in place; the assignment `nums = nums.sort()` only rebinds the local parameter to the same array. The `Infinity` markers therefore remain in the caller's array after the method returns, which is allowed because the tail is ignored.

- **Time Complexity**: `O(n log n)` — the sort dominates. The marking loop is `O(n)` on engines that implement a one-for-one `splice` as a direct replacement (V8 does); on an engine that shifts the tail on every splice it could be `O(n^2)`, so the safe worst-case bound is `O(n^2)`, with `O(n log n)` in practice.
- **Space Complexity**: `O(1)` extra — all work happens inside `nums`. The engine's sort may use `O(log n)` stack space.

## Walkthrough

### Example 1: `nums = [3,2,2,3]`, `val = 3`

**Marking loop**

| `count` | `nums[count]` | Action | `nums` after |
| :--- | :--- | :--- | :--- |
| 0 | 3 | equals `val` &rarr; `splice(0, 1, Infinity)` | `[Infinity, 2, 2, 3]` |
| 1 | 2 | keep | `[Infinity, 2, 2, 3]` |
| 2 | 2 | keep | `[Infinity, 2, 2, 3]` |
| 3 | 3 | equals `val` &rarr; `splice(3, 1, Infinity)` | `[Infinity, 2, 2, Infinity]` |

**Sort** (string comparison): `["Infinity","2","2","Infinity"]` &rarr; `["2","2","Infinity","Infinity"]`, i.e. `[2, 2, Infinity, Infinity]`.

**Reduce**: two entries are not `Infinity`, so the method returns **2**. The first two cells are `[2,2]`, matching the expected survivors.

### Example 2: `nums = [0,1,2,2,3,0,4,2]`, `val = 2`

**Marking loop** replaces indices 2, 3, and 7:

```
[0, 1, Infinity, Infinity, 3, 0, 4, Infinity]
```

**Sort** (string order):

```
[0, 0, 1, 3, 4, Infinity, Infinity, Infinity]
```

Note that the survivors are rearranged relative to their original order (`3` moved before the second `0`); this is fine because the judge accepts any order.

**Reduce**: `0, 0, 1, 3, 4` are real values, so the method returns **5**, and `nums[0..4] = [0,0,1,3,4]` — a valid answer even though the statement's example displays `[0,1,4,0,3]`.

### Example 3: `nums = []`, `val = 0`

The loop body never runs, `[].sort()` is `[]`, and `reduce` with no initial value on an empty array throws a `TypeError`. LeetCode's constraints allow `nums.length === 0`, so the empty case is a genuine edge case for this implementation. The write-pointer variant handles it naturally by returning `0`; if this code is reused outside the judge, guard with `if (nums.length === 0) return 0;`.

### Example 4: `nums = [1]`, `val = 1`

Marking gives `[Infinity]`; sorting leaves it unchanged; `reduce` returns **0**. The judge validates nothing beyond `k = 0`.

## Comparison with the Alternatives

| Approach | Time | Space | Stable? | Why it loses / wins |
| :--- | :--- | :--- | :--- | :--- |
| **Mark + sort + count (implemented)** | `O(n log n)` (worst-case `O(n^2)` if splice shifts) | `O(1)` | No | Wins on conceptual simplicity: one marking pass reuses the "any order" freedom, and no pointer arithmetic is needed. Loses asymptotically to a single-pass compaction, relies on the sentinel being outside the value range, and has an empty-array hole because `reduce` needs an initial value. |
| Write pointer | `O(n)` | `O(1)` | Yes | Strictly better: one pass, no sorting, no sentinels, preserves order, and handles empty input. The expected interview answer. |
| Swap with end | `O(n)` | `O(1)` | No | Also optimal, and performs the fewest writes when many elements are removed. Slightly trickier because a swapped-in element must be re-inspected. |
| Filter + copy back | `O(n)` | `O(n)` | Yes | Simplest to read, but allocates a second array. |

**Why the implemented approach is acceptable here.** `n <= 100`, so the sort costs at most a few hundred comparisons and the sentinel trick is easy to verify: every `val` becomes `Infinity`, and `Infinity` is guaranteed to sort after all legal values. It also leaves the array length unchanged, which can be convenient if a caller expects a fixed-size buffer.

**When an alternative wins.**

- **Choose the write pointer** whenever the input can be larger, when stability matters, or when you want a clean `O(n)` guarantee with a trivial empty-array case. It is the canonical solution and needs no sentinel.
- **Choose swap-with-end** when removals are frequent and writes are expensive: it touches only the cells it must, at the cost of reordering.
- **Choose filtering** when producing a new array is acceptable and clarity is the priority.
- **Never rely on the default sort for numeric ordering.** If any later step needs sorted survivors, replace `nums.sort()` with `nums.sort((a, b) => a - b)` — but note that with numbers present, `Infinity` still sorts last under a numeric comparator as well.

## Key Insights

1. **`splice(i, 1, x)` replaces, `splice(i, 1)` deletes.** The three-argument form keeps the length and the indices stable, which is why the forward loop is correct. The two-argument form would shift the tail and skip elements.
2. **`Infinity` is a safe sentinel under these constraints.** Values are bounded by `50`, and the string `"Infinity"` sorts after digits and the minus sign, so sentinels collect at the end.
3. **Sorting is optional given the judge.** Since any order of survivors is accepted, the sort exists only to group the sentinels at the back. A single compaction pass achieves the same grouping in `O(n)`.
4. **The count is the return value, and the prefix is invisible to the caller.** The method does not truncate `nums`; it only guarantees that the first `k` cells hold survivors.
5. **`reduce` without an initial value is unsafe on empty input.** `nums.length` can be `0`, so the strictly correct version of this style would pass `0` as the initial accumulator.
6. **Mutation semantics.** Arrays are reference types, so `splice` and `sort` are visible to the caller even though `nums = ...` rebinds a local; the `Infinity` markers persist in the tail, which the problem explicitly permits.
