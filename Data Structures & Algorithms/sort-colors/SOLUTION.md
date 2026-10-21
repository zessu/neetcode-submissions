# Sort Colors - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number[]} nums
     * @return {void} Do not return anything, modify nums in-place instead.
     */
    sortColors(nums: number[]): void {
        const counts: number[] = Array.from({length:3}).fill(0) as number[];
        for(let count=0; count<nums.length; count++) {
            counts[nums[count]]++;
        }

        let index = 0;
        for(let count=0; count<3; count++) {
            let iter = counts[count];
            while(iter > 0) {
                nums[index] = count;
                iter--;
                index++;
            }
        }
    }
}
```

## Approach

The solution uses **counting sort** specialized to three possible values.

1. **Allocate three counters**: `Array.from({length: 3}).fill(0)` creates `[0, 0, 0]`, one slot for each color. The `.fill(0)` is important because `Array.from({length: 3})` alone would produce `[undefined, undefined, undefined]`, and `undefined++` is `NaN`.
2. **Count in one pass**: for every `x` in `nums`, `counts[x]++`. After the loop, `counts[v]` is the number of times value `v` appears.
3. **Write back in order**: `index` tracks the next output position. For `value = 0, 1, 2`, write `value` into `nums[index]` exactly `counts[value]` times, advancing `index` after each write.
4. **Return nothing**: the writes mutate `nums` in place, matching the required `void` return type.

Because the values are written in increasing order, all `0`s land first, then all `1`s, then all `2`s — exactly the required red/white/blue grouping.

- **Time Complexity**: `O(n)`. The first loop runs `n` times. The second loop runs exactly `counts[0] + counts[1] + counts[2] = n` times, plus 3 outer iterations.
- **Space Complexity**: `O(1)`. The `counts` array always has 3 elements, regardless of `n`. The loop variables are constant.

## Walkthrough

### Example 1: `nums = [2,0,2,1,1,0]`

**Counting pass:**

| Index | Value | `counts` after |
| :--- | :--- | :--- |
| 0 | 2 | `[0,0,1]` |
| 1 | 0 | `[1,0,1]` |
| 2 | 2 | `[1,0,2]` |
| 3 | 1 | `[1,1,2]` |
| 4 | 1 | `[1,2,2]` |
| 5 | 0 | `[2,2,2]` |

**Write-back pass:**

| `value` | `counts[value]` | Writes | `index` after | `nums` after |
| :--- | :--- | :--- | :--- | :--- |
| 0 | 2 | `nums[0] = 0`, `nums[1] = 0` | 2 | `[0,0,2,1,1,0]` |
| 1 | 2 | `nums[2] = 1`, `nums[3] = 1` | 4 | `[0,0,1,1,1,0]` |
| 2 | 2 | `nums[4] = 2`, `nums[5] = 2` | 6 | `[0,0,1,1,2,2]` |

**Result:** `[0,0,1,1,2,2]`.

### Example 2: `nums = [2,0,1]`

Counting gives `counts = [1,1,1]`. The write-back performs one write per value:

```
value 0 -> nums[0] = 0, index = 1
value 1 -> nums[1] = 1, index = 2
value 2 -> nums[2] = 2, index = 3
```

**Result:** `[0,1,2]`.

### Example 3: `nums = [2,2,0,1]`

Counting gives `counts = [1,1,2]`:

```
value 0, count 1 -> nums[0] = 0, index = 1
value 1, count 1 -> nums[1] = 1, index = 2
value 2, count 2 -> nums[2] = 2, nums[3] = 2, index = 4
```

**Result:** `[0,1,2,2]`.

## Comparison with the Alternatives

| Approach | Time | Space | Passes | Why it wins / loses |
| :--- | :--- | :--- | :--- | :--- |
| **Counting Sort (implemented)** | `O(n)` | `O(1)` | 2 | Simple, linear, and constant-space. Loses only on the follow-up: it needs two passes and reads the data twice. |
| Dutch National Flag | `O(n)` | `O(1)` | 1 | Strictly better on the follow-up: one pass, constant space, in place. Slightly trickier pointer manipulation. |
| Comparison Sort | `O(n log n)` | `O(log n)` stack | 1 | Works for arbitrary values, but is asymptotically slower and the built-in version is forbidden. |
| Bubble Sort | `O(n^2)` | `O(1)` | up to `n` | Only useful as a teaching example. Passes at `n <= 300` but is needlessly slow. |

**Why counting sort was chosen:** the input has only three distinct keys, which is the ideal situation for counting sort. It avoids comparisons entirely and runs in `O(n)`, beating the `Ω(n log n)` lower bound that applies to comparison sorts. It also uses constant extra memory because the counter array has a fixed size of three. The implementation is short and hard to get wrong, which makes it a reliable first answer.

**When the alternatives win:**
- **Dutch National Flag** wins when the interviewer asks for the one-pass follow-up, when the input is a stream that can only be read once, or when writes are expensive and you want to finish in a single sweep. It is the expected "optimal" solution for this problem.
- **Comparison sort** wins when the keys are not known in advance or when there are many distinct values. Counting sort would then need `O(R)` space, and a comparison sort becomes the general-purpose choice.
- **Bubble sort** wins only for tiny inputs or as a demonstration of stability and early exit; it has no advantage here.

## Key Insights

1. **Three keys means no comparisons are needed**: counting sort exploits the tiny domain. The information-theoretic `Ω(n log n)` bound applies only to comparison-based sorting.
2. **The write-back is self-sorting**: writing values in increasing order guarantees the grouping. No separate partition step is required.
3. **`O(1)` space is subtle**: an array of size 3 is constant, not `O(n)`. If the colors were arbitrary integers, this would become `O(R)` and would no longer be constant space.
4. **Two passes are the trade-off**: counting sort reads every element once to count and writes every position once to fill. The Dutch National Flag algorithm fuses these into one pass by maintaining three regions.
5. **The follow-up is about passes, not complexity**: both linear solutions are `O(n)` time and `O(1)` space. The one-pass requirement is about minimizing reads/writes and handling streaming input, which is why DNF is considered the stronger answer.
6. **In-place means mutate, not return**: the method returns `void`; all work must happen through assignments into `nums`.
