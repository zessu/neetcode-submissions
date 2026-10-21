# Sort an Array - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number[]} nums
     * @return {number[]}
     */
    sortArray(nums: number[]): number[] {
        return this.mergeSort(nums);
    }

    mergeSort(nums: number[]) {
        if(nums.length < 2) return nums;
        const mid = Math.floor(nums.length / 2);
        const leftArr = nums.slice(0, mid);
        const rightArr = nums.slice(mid);
        return this.merge(this.mergeSort(leftArr), this.mergeSort(rightArr));
    }

    merge(leftArr: number[], rightArr: number[]) {
        const temp = [];
        while(leftArr.length && rightArr.length) {
            if(leftArr[0] < rightArr[0]) {
                temp.push(leftArr.shift());
            } else {
                temp.push(rightArr.shift());
            }
        }

        return [...temp, ...leftArr, ...rightArr];
    }
}
```

## Approach

The solution uses **top-down merge sort**, a divide-and-conquer algorithm.

1. **Base case**: an array with zero or one element is already sorted, so `mergeSort` returns it unchanged. This stops the recursion.
2. **Divide**: `mid = Math.floor(nums.length / 2)` splits the array into `leftArr = nums.slice(0, mid)` and `rightArr = nums.slice(mid)`. The two halves differ in size by at most one.
3. **Conquer**: recursively call `mergeSort` on each half. Each recursive call returns a new, sorted array.
4. **Merge**: `merge` walks both sorted halves from front to back:
   - Compare `leftArr[0]` and `rightArr[0]`.
   - Remove the smaller front element with `shift()` and push it onto `temp`. Ties go to the right half because the condition is strict `<`.
   - When one half is empty, `[...temp, ...leftArr, ...rightArr]` appends the remaining elements of the other half (at most one of the arrays is non-empty at this point).
5. **Return**: `sortArray` returns the fully merged array.

### Complexity

- **Comparison count**: `O(n log n)`. There are `log n` levels of splitting, and each level merges a total of `n` elements, doing at most one comparison per element taken.
- **Element-movement cost as written**: `O(n^2)` worst case. `Array.prototype.shift()` removes the first element by re-indexing the remaining elements, which costs `O(length)`. A merge of `m` elements can therefore perform `O(m^2)` element moves, and summing `m^2` over all merges gives `O(n^2)`.
- **Space**: `O(n)` auxiliary at peak. The slices plus the temporary merge array are proportional to the current subarray sizes, and the live slices along the recursion path sum to less than `2n`. Total allocations across the whole run are `O(n log n)`, but they are garbage-collected as the recursion unwinds.

> Replacing `shift()` with index pointers (`let i = 0, j = 0` and comparing `leftArr[i] < rightArr[j]`) makes the merge `O(m)` and the whole algorithm true `O(n log n)`. The current version is fast enough for `n = 5 * 10^4` in V8, but the asymptotic cost is worth knowing.

## Walkthrough

### Example 1: `nums = [5,2,3,1]`

**Split phase:**

```
                 [5,2,3,1]              mid = 2
                /         \
            [5,2]         [3,1]         mid = 1
            /   \         /   \
          [5]   [2]     [3]   [1]       length 1 -> base case
```

**Merge phase, bottom-up:**

1. `merge([5], [2])`
   - `5 < 2`? No → take `2`. `temp = [2]`; right half is empty.
   - Append remaining left `[5]` → `[2,5]`.
2. `merge([3], [1])`
   - `3 < 1`? No → take `1`. `temp = [1]`; right half is empty.
   - Append remaining left `[3]` → `[1,3]`.
3. `merge([2,5], [1,3])`

| Step | Left front | Right front | Smaller | `temp` after |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 2 | 1 | 1 | `[1]` |
| 2 | 2 | 3 | 2 | `[1,2]` |
| 3 | 5 | 3 | 3 | `[1,2,3]` |
| 4 | 5 | — | append rest | `[1,2,3,5]` |

**Result:** `[1,2,3,5]`.

### Example 2: `nums = [5,1,1,2,0,0]`

Split into `[5,1,1]` and `[2,0,0]`, then down to singletons. The merges produce `[1,1,5]` and `[0,0,2]`:

| Step | Left front | Right front | Smaller | `temp` after |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 0 | 0 | `[0]` |
| 2 | 1 | 0 | 0 | `[0,0]` |
| 3 | 1 | 2 | 1 | `[0,0,1]` |
| 4 | 1 | 2 | 1 | `[0,0,1,1]` |
| 5 | 5 | 2 | 2 | `[0,0,1,1,2]` |
| 6 | 5 | — | append rest | `[0,0,1,1,2,5]` |

**Result:** `[0,0,1,1,2,5]`. Duplicates are handled naturally: equal values are simply emitted one after another.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Merge Sort (implemented)** | `O(n log n)` comparisons; `O(n^2)` moves with `shift()` | `O(n)` | Predictable, conceptually simple, and never degrades to quadratic comparisons. Loses to counting sort on speed here, and its `shift()`-based merge weakens the asymptotic guarantee. |
| Insertion Sort | `O(n^2)` | `O(1)` | Excellent for tiny or nearly sorted arrays, but ~1.25 billion comparisons at `n = 5 * 10^4`. Not viable. |
| Quick Sort | `O(n log n)` average, `O(n^2)` worst | `O(log n)` stack | Usually the fastest in-place comparison sort and has better cache locality. But a bad pivot (for example, first element on sorted input) gives quadratic time, and the worst case is easy to trigger on adversarial tests. |
| Heap Sort | `O(n log n)` always | `O(1)` | The best worst-case/space combination for a comparison sort. In practice it has poor cache locality and is often slower than merge sort; it is also not stable. |
| Counting Sort | `O(n + R)` | `O(R)` | Fastest possible here because `R = 100001` is fixed by the constraints. It wins outright on this exact problem, but it is not a general sorting algorithm and would be unusable for a wide value range. |

**Why merge sort was chosen:** it is a general-purpose `O(n log n)` comparison sort with a clean recursive structure, guaranteed balanced splits, and no dependence on the value range. Unlike quick sort, its comparison count never becomes quadratic, which makes it a safe default when the input distribution is unknown. It also generalizes to sorting linked lists and external data.

**When the alternatives win:**
- **Counting sort** wins on this problem's exact constraints because values fit in a small fixed range. If the interviewer emphasizes the bounded range, counting sort is the pragmatic choice.
- **Quick sort** wins when in-place operation and average-case speed matter more than the worst-case guarantee, especially with a randomized pivot.
- **Heap sort** wins when both `O(n log n)` worst-case time and `O(1)` extra space are required.
- **Insertion sort** wins only for very small arrays, where its low overhead beats the recursion of merge sort.

## Key Insights

1. **Merging two sorted arrays is linear**: only the two fronts need to be compared; no element behind a front can be smaller than that front.
2. **The recursion depth is `log n`**: halving the array each time gives about 17 levels for `n = 5 * 10^4`, so stack depth is not a concern here.
3. **Slicing keeps the code simple but allocates**: `slice` copies each half. An in-place merge sort with indices avoids most allocations at the cost of more complex code.
4. **`shift()` hides an `O(n)` operation**: the merge loop looks linear, but each `shift()` re-indexes the array. Index pointers are the standard fix and are what most production merge sorts use.
5. **The `<` comparison affects stability**: on ties, this implementation takes from the right half, so equal elements can be reordered. Use `<=` to preserve the original order of equal elements.
6. **Ascending order is a choice**: swapping the comparison to `>` and appending in reverse would produce descending order. The merge logic itself is symmetric.
