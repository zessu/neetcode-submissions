# Spiral Matrix - LeetCode 54

## Problem Description

Given an `m x n` matrix, return all elements of the matrix in spiral order.

You start at the top-left cell and move: **right** across the top row, **down** the right column, **left** across the bottom row, **up** the left column — then repeat one layer inward, until every cell has been visited exactly once.

## Examples

### Example 1:
```
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]
```

### Example 2:
```
Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]
Output: [1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10]
```

### Example 3 (single column):
```
Input: matrix = [[1],[2],[3]]
Output: [1,2,3]
```

## Constraints

- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 10`
- `-100 <= matrix[i][j] <= 100`

## Topics

- Array
- Matrix
- Simulation

## Company Tags

- Amazon
- Google
- Microsoft
- Apple

## Solution Approaches

### 1. Layer Peeling with `shift` / `pop` (Implemented)

**Intuition**: Treat the matrix as a stack of layers. Each loop peels exactly one full ring off the remaining submatrix: top row (left→right), right column (top→bottom), bottom row (right→left), left column (bottom→top). Because `shift`, `pop`, and `reverse` mutate the input in place, the "window" shrinks automatically and no boundary bookkeeping is needed.

**Algorithm**:
1. `shift()` the top row off and append it to the result.
2. If rows remain, `pop()` the last element of every remaining row (the right column).
3. If rows remain, `pop()` the bottom row, `reverse()` it, and append.
4. If rows remain, `shift()` the first element of every row from bottom to top (the left column).
5. Repeat until the matrix is empty. Rows that have been emptied are skipped by an `arr.length` guard.

**Time Complexity**: O(m * n) elements are visited once; each `shift()`/`pop()` on a row is O(row length), so the constant factors are higher than pointer-based approaches.
**Space Complexity**: O(1) extra space besides the output array — but the input matrix is **destroyed** (mutated).

### 2. Boundary Pointers (Optimal)

**Intuition**: Keep four boundaries — `top`, `bottom`, `left`, `right` — and walk the four edges of the current window, shrinking the relevant boundary after each edge.

**Algorithm**:
1. Walk `matrix[top][left..right]`, then `top++`.
2. Walk `matrix[top..bottom][right]`, then `right--`.
3. If `top <= bottom`, walk `matrix[bottom][right..left]`, then `bottom--`.
4. If `left <= right`, walk `matrix[top..bottom][left]`, then `left++`.
5. Stop when `top > bottom` or `left > right`.

**Time Complexity**: O(m * n)
**Space Complexity**: O(1) extra space, input left untouched

### 3. Direction Vector + Visited Set

**Intuition**: Encode the four moves as `(dr, dc)` pairs: right → down → left → up. Walk one direction until you hit the boundary or an already-visited cell, then rotate 90° clockwise.

**Algorithm**:
1. Start at `(0, 0)` facing right, with a `visited` matrix.
2. Move while the next cell is in bounds and unvisited; otherwise turn right.
3. Stop after `m * n` cells have been visited.

**Time Complexity**: O(m * n)
**Space Complexity**: O(m * n) for the `visited` set

## Visual Explanation

```
matrix = [[ 1,  2,  3,  4],
          [ 5,  6,  7,  8],
          [ 9, 10, 11, 12],
          [13, 14, 15, 16]]

Layer 0 (outer ring):
  top row    : 1  2  3  4
  right col  :        8  12  16
  bottom row : 16  15  14  13
  left col   : 13   9   5
  → [1,2,3,4,8,12,16,15,14,13,9,5]

Layer 1 (inner ring, remaining [[6,7],[10,11]]):
  top row    : 6  7
  right col  :     11
  bottom row : 11  10
  → append 6,7,11,10

Final: [1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10]
```

## Common Pitfalls

1. **Empty rows after peeling** — When the remaining window is 1 column wide, step 2 / step 4 can empty a row. If that row is left in the matrix, the *next* iteration `shift()`s or `pop()`s from an empty array and pushes `undefined` into the result. Guard with `if (arr.length)` (as this submission does) or drop empty rows.
2. **Single row / single column** — `1 x n` and `n x 1` matrices must not double-count the corner cells. The `if (nums.length)` checks before steps 2–4 handle this.
3. **Mutating the input** — `shift`, `pop`, and `reverse` destroy the caller's matrix. Use boundary pointers if the input must be preserved.
4. **`console.log` vs `return`** — This submission prints the result; a LeetCode-ready version should `return res`.
5. **`Array.prototype.shift` cost** — `shift` is O(k) in JavaScript, so this approach is slower in practice than the boundary-pointer version despite the same asymptotic class.
