# Majority Element II - Solution

## Solution Code

```typescript
class Solution {
  /**
   * @param {number[]} nums
   * @return {number[]}
   */
  majorityElement(nums: number[]): number[] {
    const target = nums.length / 3;
    const map = new Map<number, number>();
    const result = new Set<number>();
    for (const [_, val] of nums.entries()) {
      map.set(val, (map.get(val) ?? 0) + 1);
      if (map.get(val) && map.get(val)! > target) {
        result.add(val);
      }
    }
    return [...result];
  }
}
```

## Approach

The implemented solution uses **one-pass hash-map counting**.

1. **Set the threshold.** `target = nums.length / 3`. Counts are integers, so testing `count > target` is exactly the same as testing `count > ⌊n / 3⌋` — the strictness required by the problem. Keeping it as a fraction avoids an off-by-one from `Math.floor`.
2. **Count and check in the same pass.** For every value, `map.set(val, (map.get(val) ?? 0) + 1)` increments its frequency, defaulting a missing entry to `0`.
3. **Add as soon as the threshold is crossed.** `map.get(val)! > target` is checked immediately after the increment. A count only ever grows, so once a value crosses `n / 3` it stays qualified; there is no need for a second pass.
4. **Deduplicate with a `Set`.** The condition is true on every occurrence after the crossing point (for example, the 3rd, 4th, and 5th copies of a value), but the answer must list the value once. A `Set` makes the insertions idempotent, and `[...result]` produces the returned array.
5. **Order is irrelevant** to LeetCode here, so the set's insertion order is a perfectly good output order.

One readability note: `nums.entries()` yields `[index, value]` pairs, so in `for (const [_, val] of ...)` the name `_` is the array index and `val` is the element. The index is intentionally ignored. The guard `map.get(val) &&` is redundant after the increment (the count is always at least 1) but harmless.

- **Time Complexity**: `O(n)` — one pass over `nums`; each `Map`/`Set` operation is `O(1)` on average.
- **Space Complexity**: `O(n)` — the frequency map may hold up to `n` distinct values. The result set holds at most two values (at most two elements can exceed `n / 3`).

## Walkthrough

### Example: `nums = [1,1,1,3,3,2,2,2]`

`n = 8`, so `target = 8 / 3 = 2.666...`. A value needs a count of at least `3`.

| Step | `val` | Map after increment | Count `> 2.666`? | Result set |
| :--- | :--- | :--- | :--- | :--- |
| 0 | 1 | `{1:1}` | no | `{}` |
| 1 | 1 | `{1:2}` | no | `{}` |
| 2 | 1 | `{1:3}` | **yes** | `{1}` |
| 3 | 3 | `{1:3, 3:1}` | no | `{1}` |
| 4 | 3 | `{1:3, 3:2}` | no | `{1}` |
| 5 | 2 | `{1:3, 3:2, 2:1}` | no | `{1}` |
| 6 | 2 | `{1:3, 3:2, 2:2}` | no | `{1}` |
| 7 | 2 | `{1:3, 3:2, 2:3}` | **yes** | `{1, 2}` |

Return `[1, 2]`. The value `3` stops at two occurrences, which is not greater than `2.666`, so it is correctly excluded even though it is the second-most frequent value.

### Example: `nums = [3,2,3]`

`target = 1`. Counts evolve as `3:1`, `3:1 / 2:1`, `3:2`. Only `3` has a count greater than `1`, so the answer is `[3]`.

### Edge case: `nums = [1,2]`

`target = 2 / 3 = 0.666...`. After the first element, `1 > 0.666` adds `1`; after the second, `1 > 0.666` adds `2`. The answer is `[1,2]`. This is correct: `⌊2 / 3⌋ = 0`, and both values appear more than zero times. A common bug is to hard-code "more than `n/3`" as "at least 2 occurrences", which would wrongly return `[]`.

### Edge case: `nums = [1]`

`target = 0.333...`, the single occurrence `1 > 0.333` qualifies, and the answer is `[1]`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it loses / wins |
| :--- | :--- | :--- | :--- |
| Brute Force | `O(n^2)` | `O(1)` | Conceptually simplest, but `n = 5 * 10^4` gives ~2.5 billion comparisons. Not viable. |
| **Hash Map (implemented)** | `O(n)` | `O(n)` | Best balance of clarity and speed. One pass, no sorting, does not mutate the input. The only cost is memory for distinct values. |
| Sorting + runs | `O(n log n)` | `O(1)`* | Avoids the map, but pays `n log n` and (if in place) destroys the caller's ordering. Only attractive when the array is already sorted or when memory is extremely tight and `O(n log n)` is acceptable. |
| Boyer-Moore (2 candidates) | `O(n)` | `O(1)` | The only approach that satisfies the `O(1)`-space follow-up. It is strictly better asymptotically than the hash map on space, but needs two passes and careful reasoning about cancellation and verification. |

\* extra space; the sort itself may use `O(log n)` stack space.

**Why the implemented hash map was a reasonable choice.** It meets the primary `O(n)` time bound with the least amount of subtle logic: no cancellation invariants, no verification pass, and no risk of an off-by-one in the threshold. It also leaves `nums` untouched, unlike the sorting approach.

**When the alternatives win.**

- **Boyer-Moore** wins on the follow-up requirement (`O(1)` space) and on very large inputs where the frequency map would be memory-heavy — for example, streaming data where you cannot store all distinct values. Its two-pass structure is also fine here because the input is a materialized array.
- **Sorting** wins when the data is already sorted (then run-counting is `O(n)` with `O(1)` extra space), or when the array may be reordered and allocation must be avoided.
- **Brute force** only wins as a first correct draft or in an interview where you are asked to start simple and then optimize; it is never the right final answer at these constraints.

## Key Insights

1. **At most two answers.** Three values each strictly above `n / 3` would require more than `n` total elements. This bound is what makes both the `O(1)`-space result set and the two-candidate algorithm possible.
2. **`count > n/3` is a monotone predicate.** Once true it never becomes false, which is why the implemented solution can add to the result mid-pass instead of collecting counts and filtering afterwards.
3. **Strictness is the whole problem.** The difference between `>` and `>=` only shows up when a value appears exactly `⌊n/3⌋` times — a case the examples do not always cover, but the judge does.
4. **Small `n` breaks intuition.** For `n <= 2` the floor is `0`, so every distinct value is a valid answer. Guard against early-return optimizations that assume an answer needs at least two occurrences.
5. **Boyer-Moore is a cancellation argument, not a counting argument.** Three distinct votes cancel one occurrence of each of two candidates plus the newcomer; whatever survives must be a strict majority in the reduced sequence, and therefore a candidate for the real answer — but it still needs verification.
