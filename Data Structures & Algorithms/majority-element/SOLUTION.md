# Majority Element - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    majorityElement(nums: number[]): number {
        const mid = Math.floor(nums.length/2);
        const map = new Map<number, number>();
        for(const num of nums) {
            const occurences = map.get(num) ?? 0;
            map.set(num, occurences + 1);
            if(occurences >= mid) return num;
        }
    }
}
```

## Approach

The solution uses a **hash map** to count occurrences and returns as soon as a count passes the majority threshold.

1. **Compute the threshold.** `mid = Math.floor(n / 2)`. A majority element must occur at least `mid + 1` times, which is exactly "more than `⌊n / 2⌋`".
2. **Read the previous count.** For each `num`, `map.get(num) ?? 0` returns its count so far (or `0` if unseen).
3. **Increment and store.** `map.set(num, occurences + 1)` records the new count.
4. **Check before incrementing.** `occurences` is the count *before* this element. If `occurences >= mid`, the new count is at least `mid + 1`, so `num` is now a majority and can be returned immediately.
5. **Guaranteed termination.** The input always contains a majority element, so the loop always returns.

- **Time Complexity**: `O(n)` expected — one pass, with `O(1)` expected `Map` get/set operations.
- **Space Complexity**: `O(n)` — in the worst case, every value is distinct and stored in the map.

> The variable name `occurences` (a misspelling of "occurrences") is kept exactly as in the submission. The function has no final `return` because the majority guarantee makes the loop's return exhaustive. Under a strict `noImplicitReturns` TypeScript configuration, a trailing `return nums[0]` or `throw` would be needed to satisfy the compiler, but it is unreachable for valid inputs.

### Why `occurences >= mid` is the correct check

| `n` | `mid = ⌊n/2⌋` | Required count | Condition on previous count | New count |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 0 | `>= 1` | `previous >= 0` | `1` |
| 3 | 1 | `>= 2` | `previous >= 1` | `2` |
| 6 | 3 | `>= 4` | `previous >= 3` | `4` |
| 7 | 3 | `>= 4` | `previous >= 3` | `4` |

In every case, `previous >= floor(n/2)` means the new count is at least `floor(n/2) + 1`, which is strictly greater than `floor(n/2)`.

## Walkthrough

### Example 1: `nums = [3,2,3]`

`n = 3`, `mid = 1`.

| Step | `num` | Previous count | New count | `previous >= mid`? | Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 3 | 0 | 1 | `0 >= 1` false | continue |
| 2 | 2 | 0 | 1 | `0 >= 1` false | continue |
| 3 | 3 | 1 | 2 | `1 >= 1` true | return `3` |

The value `3` reaches count `2 > 1.5`, so it is the majority.

### Example 2: `nums = [2,2,1,1,1,2,2]`

`n = 7`, `mid = 3`.

| Step | `num` | Previous count | New count | `previous >= 3`? | Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 2 | 0 | 1 | false | continue |
| 2 | 2 | 1 | 2 | false | continue |
| 3 | 1 | 0 | 1 | false | continue |
| 4 | 1 | 1 | 2 | false | continue |
| 5 | 1 | 2 | 3 | false | continue |
| 6 | 2 | 3 | 4 | true | return `2` |

After step 5, `1` has count `3`, which is not more than `3.5`; it is not yet a majority. At step 6, `2` reaches `4`, which is more than `3.5`, so the function returns `2` without needing to read the final element.

### Example 3: `nums = [1]`

`n = 1`, `mid = 0`. The first element has previous count `0`, and `0 >= 0` is true, so the function returns `1` immediately. The condition also handles the smallest valid input.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is / is not preferred |
| :--- | :--- | :--- | :--- |
| **Hash Map (implemented)** | `O(n)` expected | `O(n)` | Simple, one pass, and exits as soon as the majority is reached. It also produces full counts, which is useful if the problem is extended (for example, top-k frequent elements). The cost is linear extra memory and expected (not worst-case guaranteed) hash performance. |
| **Boyer-Moore Voting** | `O(n)` | `O(1)` | The asymptotically optimal answer and the intended follow-up ("linear time and `O(1)` space"). It is harder to justify and, without the majority guarantee, requires a verification pass. |
| **Sorting** | `O(n log n)` | `O(1)`–`O(n)` (engine-dependent) | The shortest code (`nums.sort(...); return nums[n >> 1]`) and very fast in practice for `n = 5 * 10^4`. It reorders the input and is asymptotically slower. |
| **Brute Force** | `O(n^2)` | `O(1)` | Useful only as a baseline; it repeats the same counts and is far too slow at the upper constraint. |

**Why the implemented approach is preferred**: it is the most direct application of the definition ("count occurrences, check whether the count exceeds half"). Early termination means it often stops before scanning the whole array, and the code handles negative values and large values naturally because `Map` keys are actual numbers.

**When an alternative wins**:
- **Boyer-Moore** is preferable when the interviewer asks for `O(1)` extra space, or when memory is constrained. It is the standard "optimal" follow-up.
- **Sorting** wins when the array may be sorted anyway, or when a very short implementation is valued over asymptotics. It is also easy to reason about via the median argument.
- **Hash Map** remains the best choice when counts are needed for more than one query, or when the majority guarantee is absent and a full frequency table is required.

## Key Insights

1. **The threshold is strict.** A majority is `> ⌊n / 2⌋`, so for even `n` a value appearing exactly `n / 2` times does not qualify.
2. **Only one value can be a majority.** Two values each exceeding half is impossible, so returning early is safe.
3. **Check the previous count.** Testing before incrementing avoids writing `occurences + 1 > mid` and makes the off-by-one explicit.
4. **`Map` handles numeric keys safely.** A plain object would stringify keys, which can cause surprising collisions for values such as `-1` and `"-1"`.
5. **The majority guarantee removes the final return.** For valid inputs, the loop is guaranteed to return; the missing fallback is unreachable rather than a logic error.
6. **Boyer-Moore is the space-optimal follow-up.** It exploits the fact that the majority outnumbers all other values combined, so pairwise cancellations cannot eliminate it.
