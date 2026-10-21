# Concatenation of Array - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {number[]} nums
     * @return {number[]}
     */
    getConcatenation(nums: number[]): number[] {
        return [...nums, ...nums];
    }
}
```

## Approach

The solution uses **array spread** to create a new array containing two consecutive copies of `nums`.

1. **Spread the first copy.** `...nums` expands the elements of `nums` into the new array literal, producing indices `0..n-1`.
2. **Spread the second copy.** The second `...nums` appends the same elements again, producing indices `n..2n-1`.
3. **Return the new array.** The input array is not modified; the returned array has length `2n`.

This directly implements the definition `ans[i] = nums[i]` and `ans[i + n] = nums[i]`: the first `n` positions come from the first spread and the next `n` positions come from the second.

- **Time Complexity**: `O(n)` — `2n` elements are copied into the result.
- **Space Complexity**: `O(n)` — the result contains `2n` elements, which is linear in `n` (the input is not counted).

## Walkthrough

### Example 1: `nums = [1,2,1]`

```
First spread:  1, 2, 1
Second spread: 1, 2, 1
Combined:      1, 2, 1, 1, 2, 1
Indices:       0  1  2  3  4  5
```

The result is `[1,2,1,1,2,1]`, length `6 = 2 * 3`.

### Example 2: `nums = [1,3,2,1]`

```
First spread:  1, 3, 2, 1
Second spread: 1, 3, 2, 1
Combined:      1, 3, 2, 1, 1, 3, 2, 1
Indices:       0  1  2  3  4  5  6  7
```

The result is `[1,3,2,1,1,3,2,1]`, length `8 = 2 * 4`.

### Example 3: `nums = [5]`

```
First spread:  5
Second spread: 5
Combined:      5, 5
```

The result is `[5,5]`, length `2 = 2 * 1`.

### Index mapping

For any index `i` in the result:

- If `0 <= i < n`, then `ans[i] = nums[i]` (first copy).
- If `n <= i < 2n`, then `ans[i] = nums[i - n]` (second copy).

The spread syntax performs exactly these copies without requiring an explicit loop or modulo.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is / is not preferred |
| :--- | :--- | :--- | :--- |
| **Spread / Concatenation (implemented)** | `O(n)` | `O(n)` | Clearest expression of "two copies back to back". One line, no index math, no risk of off-by-one errors. This is the preferred solution in JavaScript/TypeScript. |
| **Preallocate + Fill** | `O(n)` | `O(n)` | Slightly more explicit and avoids any intermediate spread bookkeeping. It can be faster in engines that optimize fixed-size writes, but it is more code and requires careful allocation of `2n` slots. |
| **Two-Pass Append** | `O(n)` | `O(n)` | Reads like the definition and needs no modulo. It relies on dynamic array growth, which is amortized `O(1)` per push but may reallocate. |
| **Modulo Mapping** | `O(n)` | `O(n)` | A single formula handles both halves, which is useful when the output length is computed dynamically. It performs a modulo per element and is easier to get wrong (array size, divisor). |

**Why the implemented approach is preferred**: the problem's output is defined as a concatenation, and `[...nums, ...nums]` is the language-level expression of that definition. It allocates exactly one result array, copies each element once, and has no mutable loop state to misuse. The earlier modulo implementation in `submission-0.ts`/`submission-1.ts` is also correct, but it obscures the simple "two copies" structure behind index arithmetic.

**When an alternative wins**:
- **Preallocate + Fill** is attractive when writing to a known-size buffer or when working in a language without a spread/concatenation primitive.
- **Two-Pass Append** is a good teaching formulation and avoids modulo, at the cost of two loops.
- **Modulo Mapping** generalizes naturally to repeating an array `k` times: `nums[i % n]`.

## Key Insights

1. **The output is not a nested array.** `[nums, nums]` has two elements (each an array); `[...nums, ...nums]` has `2n` elements. This is the most common mistake with this problem.
2. **The second copy starts at index `n`.** The offset is exactly the input length, which is why `ans[i + n] = nums[i]`.
3. **The input is untouched.** Spread creates a new array, so the caller's `nums` keeps its original length and contents.
4. **`O(n)` is optimal.** Any correct solution must write `2n` values, so it cannot do better than linear time or linear output space.
5. **`n` is at most 1000.** The spread is comfortably within engine argument/array limits; no chunking is needed for these constraints.
