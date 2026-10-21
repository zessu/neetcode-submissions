# Remove Element - LeetCode 27

## Problem Description

Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in `nums` **in place**. The order of the elements may be changed.

Then return the number of elements in `nums` that are **not equal to `val`**, call it `k`.

To be accepted, you must:

1. Change the array `nums` so that the **first `k` elements** contain the elements that are not equal to `val`. The remaining elements, and the final length of `nums`, do not matter.
2. Return `k`.

Because the order may change, the judge sorts the first `k` cells before comparing them with the expected values. Any arrangement of the surviving values in `nums[0..k-1]` is accepted.

## Examples

### Example 1:

```
Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
```

**Explanation:** The two `3`s must be removed. The remaining values are `2` and `2`, so `k = 2`. The underscores stand for whatever is left in the tail; they are not checked.

### Example 2:

```
Input: nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,4,0,3,_,_,_]
```

**Explanation:** Removing every `2` leaves `0, 1, 3, 0, 4` — five values. The example shows one valid ordering `[0,1,4,0,3]`; any order works because the judge sorts the first `k` cells.

### Example 3:

```
Input: nums = [], val = 0
Output: 0, nums = []
```

**Explanation:** There is nothing to remove, so `k = 0`. The array stays empty.

### Example 4:

```
Input: nums = [1], val = 1
Output: 0, nums = [_]
```

**Explanation:** The only element is removed, so `k = 0` and no cell is checked.

## Constraints

- `0 <= nums.length <= 100`
- `0 <= nums[i] <= 50`
- `0 <= val <= 100`

## Topics

- Array
- Two Pointers

## Company Tags

- Amazon
- Meta
- Google
- Bloomberg

## Solution Approaches

### 1. Mark, Sort, Count (Implemented)

**Intuition**: Replace every occurrence of `val` with a sentinel that cannot be a valid value (`Infinity`), sort so the sentinels collect at one end, and count the real values that remain. The count is the answer, and the real values occupy the prefix.

**Algorithm**:
1. Loop over every index `count`. If `nums[count] === val`, replace that single cell with `Infinity` using `nums.splice(count, 1, Infinity)`. The replacement keeps the array length unchanged, so indices stay stable and the loop does not skip anything.
2. Sort `nums` with the default comparator, which converts values to strings. Digits and `-` sort before the letter `I` of `"Infinity"`, so all sentinels end up at the end.
3. Count the entries that are not `Infinity` with `reduce`, adding `1` for each real value.
4. Return that count as `k`.

**Time Complexity**: `O(n log n)` — dominated by the sort (the marking loop is `O(n)` when `splice` replaces a single element without shifting; `O(n^2)` on an engine that shifts the tail on every splice).
**Space Complexity**: `O(1)` extra — everything happens inside `nums` (the engine's sort may use `O(log n)` stack space).

*Caveat*: this relies on the judge accepting any order in the first `k` cells. The default sort is lexicographic, so the surviving values are **not** in numeric order (e.g. `10` lands before `2`). That is fine for LeetCode 27, but it would be wrong for a problem that requires sorted output.

### 2. Write Pointer / Read Pointer (Optimal, Stable)

**Intuition**: Keep a `write` index for the next cell to accept a survivor. Scan with `read`; whenever `nums[read] !== val`, copy it to `nums[write]` and advance `write`. Values equal to `val` are simply never copied, so they disappear from the prefix.

**Algorithm**:
1. Set `write = 0`.
2. For `read = 0 .. n - 1`:
   - If `nums[read] !== val`, set `nums[write] = nums[read]` and increment `write`.
3. Return `write`.

**Time Complexity**: `O(n)` — each element is read once and copied at most once.
**Space Complexity**: `O(1)` — one index.

### 3. Swap With the End (Optimal, Unstable)

**Intuition**: When the current element should be removed, swap it with the last still-unprocessed element and shrink the active range. This avoids copying survivors and performs at most one write per removed element. Because the problem allows reordering, the disruption caused by the swap is harmless.

**Algorithm**:
1. Set `i = 0`, `last = n - 1`.
2. While `i <= last`:
   - If `nums[i] === val`, set `nums[i] = nums[last]` and decrement `last`. Do **not** advance `i` — the new value at `i` has not been inspected.
   - Otherwise increment `i`.
3. Return `last + 1`.

**Time Complexity**: `O(n)` — each iteration either advances `i` or shrinks `last`.
**Space Complexity**: `O(1)`.

### 4. Filter Into a New Array, Then Copy Back

**Intuition**: Collect the survivors in a fresh array and copy them back into the front of `nums`.

**Algorithm**:
1. `const kept = nums.filter(x => x !== val)`.
2. Copy `kept[i]` into `nums[i]` for every `i`.
3. Return `kept.length`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(n)` — the filtered array.

## Comparison of Approaches

| Approach | Time | Space | Stable? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Mark + sort + count (implemented)** | `O(n log n)` | `O(1)` extra | No | Uses `Infinity` as a sentinel; relies on any-order acceptance |
| Write pointer | `O(n)` | `O(1)` | Yes | Optimal; preserves relative order |
| Swap with end | `O(n)` | `O(1)` | No | Fewest writes when many elements are removed |
| Filter + copy back | `O(n)` | `O(n)` | Yes | Clear, but allocates |

## Visual Explanation

```
nums = [0,1,2,2,3,0,4,2], val = 2

Write-pointer view
------------------
read scans; write marks the next survivor slot.

index:   0  1  2  3  4  5  6  7
nums:    0  1  2  2  3  0  4  2
         w
         r

r=0: 0 != 2 -> nums[0]=0, w=1
r=1: 1 != 2 -> nums[1]=1, w=2
r=2: 2 == 2 -> skip
r=3: 2 == 2 -> skip
r=4: 3 != 2 -> nums[2]=3, w=3
r=5: 0 != 2 -> nums[3]=0, w=4
r=6: 4 != 2 -> nums[4]=4, w=5
r=7: 2 == 2 -> skip

nums[0..4] = [0,1,3,0,4], k = 5


Implemented view
----------------
mark:  [0,1,Inf,Inf,3,0,4,Inf]
sort:  [0,0,1,3,4,Inf,Inf,Inf]      ("Infinity" sorts after every digit)
count:  5 values are not Infinity  ->  k = 5
```

## Common Pitfalls

1. **Returning the filtered array instead of `k`.** The answer is a number; the mutation of `nums` is checked separately.
2. **Deleting with `splice(count, 1)` while iterating forward.** The tail shifts left and the next element lands on an index already passed, so some occurrences are skipped. The implemented code replaces a cell (`splice(count, 1, Infinity)`) instead of deleting, which keeps indices stable.
3. **Forgetting to write the survivors into `nums`.** Building a filtered copy without copying it back fails the in-place check.
4. **Clearing the tail.** Unnecessary — only `nums[0..k-1]` is validated.
5. **Assuming sorted output.** LeetCode 27 accepts any order, which is why the default (lexicographic) sort is tolerated here. For a problem requiring numeric order you must pass `(a, b) => a - b`.
6. **Using a sentinel that can collide with real data.** `Infinity` is safe because the constraints cap values at `50`; a sentinel like `-1` or `0` would not be.
7. **Advancing `i` after a swap.** In the swap-with-end variant, the element moved into position `i` still needs inspection; incrementing immediately skips it.
8. **Empty array.** `nums.length === 0` must return `0` without touching `nums[0]`; both the write-pointer and swap variants handle this naturally.
9. **Off-by-one in the swap variant.** The active range is `0..last` inclusive, so the result is `last + 1`, not `last`.
