# Spiral Matrix - Solution

## Solution Code

```typescript
const spiral = (nums: number[][] = [[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]) => {
  let res: number[] = [];
  while(nums.length) {
    // 1. attach front
    // res = [...res, ...nums.shift()!];
    res.push(...nums.shift()!);


    // 2. append last items
    if(nums.length) {
      for(let arr of nums) {
        if(arr.length) res.push(arr.pop()!);
      }
    }

    // 3. add from last array in reverse
    if(nums.length) {
      const last = nums.pop()!;
      res.push(...last.reverse()!);
    }

    // 4. copy first elements
    if(nums.length) {
      for(let count = nums.length - 1; count >= 0; count --) {
        if(nums[count].length) res.push(nums[count].shift()!);
      }
    }
  }

  console.log(res);
}


spiral();
```

## Approach

The solution uses **layer peeling**: each pass of the `while` loop removes exactly one complete ring from the remaining submatrix, so the outer loop only needs to run `ceil(min(m, n) / 2)` times.

1. **Top row** — `nums.shift()` removes the first row and spreads it into `res` (left → right).
2. **Right column** — every remaining row `pop()`s its last element (top → bottom).
3. **Bottom row** — `nums.pop()` removes the last row; `reverse()` makes it run right → left.
4. **Left column** — iterate the remaining rows **backwards** and `shift()` their first element (bottom → top).
5. Repeat until `nums` is empty. The `if (arr.length)` / `if (nums[count].length)` guards skip rows that were emptied by an earlier step.

- **Time Complexity**: O(m * n) elements are appended once; the `shift`/`pop` calls themselves are O(row length) in JavaScript, so the constant factor is larger than pointer bookkeeping.
- **Space Complexity**: O(1) extra space beyond the output array — but the input matrix is consumed (mutated in place).

## Why This Approach Over the Alternatives

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Layer Peeling (`shift`/`pop`)** (implemented) | O(m · n) | O(1) extra | No index/boundary bookkeeping; the matrix shrinks itself; very short code | Destroys the input; `shift` is O(k); prints instead of returning |
| **Boundary Pointers** | O(m · n) | O(1) extra | Non-destructive; fastest in practice; interview-standard | More index bookkeeping, easy to double-count corners |
| **Direction Vector + Visited** | O(m · n) | O(m · n) | Handles arbitrary shapes/obstacles uniformly | Extra `visited` memory; more code |

The peel approach is chosen for **readability**: the four spiral edges map one-to-one onto four array operations, and there are no boundary variables to get out of sync. The trade-offs — mutation and `shift` cost — are acceptable because the problem constraints are tiny (`1 <= m, n <= 10`) and the matrix is not reused afterwards.

## Walkthrough

```
matrix = [[ 1,  2,  3,  4],
          [ 5,  6,  7,  8],
          [ 9, 10, 11, 12],
          [13, 14, 15, 16]]

Iteration 1 — window 4x4
  step 1: shift [1,2,3,4]      → res = [1,2,3,4]
                               rows = [[5,6,7,8],[9,10,11,12],[13,14,15,16]]
  step 2: pop each row         → res = [1,2,3,4, 8,12,16]
                               rows = [[5,6,7],[9,10,11],[13,14,15]]
  step 3: pop + reverse [13,14,15] → res = [...,16, 15,14,13]
                               rows = [[5,6,7],[9,10,11]]
  step 4: shift backwards      → res = [...,13, 9, 5]
                               rows = [[6,7],[10,11]]

Iteration 2 — window 2x2
  step 1: shift [6,7]          → res = [...,6,7]
                               rows = [[10,11]]
  step 2: pop                  → res = [...,7, 11]
                               rows = [[10]]
  step 3: pop + reverse [10]   → res = [...,11, 10]
                               rows = []
  step 4: skipped (no rows)

Result: [1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10] ✓
```

## Key Insights

1. **Each loop removes one full ring**, so the matrix shrinks on all four sides without any explicit `top/bottom/left/right` variables.
2. **Direction matters**: the left column must be read bottom → top, hence `for (count = nums.length - 1; count >= 0; count--)`.
3. **The `if (arr.length)` guards are required, not decorative.** When the window is 1 column wide, steps 2 and 4 can fully empty a row. Without the guards, the next iteration `pop()`s/`shift()`s from an empty array and appends `undefined` (hidden by the `!` assertion) — this broke `3x1`, `4x2`, `5x3`, `6x4`, and similar shapes before the fix. Verified against a boundary-pointer reference for every shape from `1x1` to `12x12`.
4. **Guards are enough because rows stay equal-length**: for a rectangular input, every row in the window always has the same number of columns, so rows only become empty when the *whole* window is empty — no partially-empty layer can appear.
5. **Mutation is the point**: `shift`/`pop`/`reverse` do the window bookkeeping for free. If the caller still needs the matrix, switch to boundary pointers instead.
6. **Production shape**: replace `console.log(res)` with `return res` and drop the default parameter before submitting to LeetCode.
