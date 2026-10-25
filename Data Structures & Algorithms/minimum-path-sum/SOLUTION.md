# Minimum Path Sum - Solution

## Solution Code

```typescript
class Solution {
    minPathSum(grid: number[][]): number {
        const rows = grid.length;
        const columns = grid[0].length;
        const cache = new Map();

        const recurr = (grid: number[][], r: number, c: number): number => {
            if (r >= rows || c >= columns) return Infinity;
            if (r === rows - 1 && c === columns - 1) return grid[r][c];
            if (cache.has(`${r}:${c}`)) return cache.get(`${r}:${c}`);

            const right = recurr(grid, r, c + 1);
            const down = recurr(grid, r + 1, c);
            const min = Math.min(right, down);

            cache.set(`${r}:${c}`, min + grid[r][c]);

            return grid[r][c] + min;
        };

        return recurr(grid, 0, 0);
    }
}
```

> `submission-2.ts` and `submission-3.ts` are **byte-for-byte identical** and implement the same memoized DFS with the same `minPathSum(grid)` signature. The latest is `submission-3.ts`, shown above.

## Approach

The solution is a **top-down dynamic program with memoization**, expressed as a recursive DFS from the top-left cell.

1. **Dimensions**: `rows = grid.length` and `columns = grid[0].length`. The constraints guarantee a non-empty grid, so `grid[0]` exists.
2. **State**: `recurr(grid, r, c)` answers "what is the minimum sum of a path from `(r, c)` to the bottom-right cell?" The initial call is `recurr(grid, 0, 0)`.
3. **Base cases**:
   - If `r >= rows` or `c >= columns`, the move stepped outside the grid. Return `Infinity` so this branch can never win the `Math.min`.
   - If `(r, c)` is the destination, return `grid[r][c]`. The path consists of that cell alone.
4. **Memo check**: the cache key is `` `${r}:${c}` `` because a cell is identified by both coordinates; `r + c` would collide (for example `(1, 2)` and `(2, 1)`).
5. **Transition**: the only legal moves are right and down, so compute both:
   - `right = recurr(grid, r, c + 1)`
   - `down = recurr(grid, r + 1, c)`
   - `min = Math.min(right, down)`
   - The best path from this cell is `grid[r][c] + min`.
6. **Cache and return** the result. The destination cell is returned before the cache check, which is fine because it is a constant-time base case.

The recurrence is optimal by the standard optimal-substructure argument: any optimal path from `(r, c)` must begin with either a right move or a down move, and the remainder must be an optimal path from that next cell. Taking the cheaper of the two optimal remainders therefore gives the optimal path from `(r, c)`.

- **Time Complexity**: `O(m * n)` — there are `m * n` cells, and each cell computes two recursive calls and one cache write the first time it is visited.
- **Space Complexity**: `O(m * n)` for the memo cache (one entry per cell) plus `O(m + n)` recursion depth. The longest path from the start to the destination has `m + n - 1` cells, so the stack is at most `m + n` frames. For the maximum `200 x 200` grid, the depth is at most 400, which is safe for JavaScript.

The `cache` is a plain `Map` without generic parameters, so `cache.get(...)` has type `any`. In a stricter TypeScript configuration, declare `new Map<string, number>()` and use a non-null assertion or a local lookup guard.

## Walkthrough

### Example: `grid = [[1,3,1],[1,5,1],[4,2,1]]`

The destination is `(2, 2)`. The recursion starts at `(0, 0)` and explores right before down. The relevant states and their computed values:

| Cell | `right` | `down` | Best child | `dp[r][c]` |
| :--- | :--- | :--- | :--- | :--- |
| `(2,2)` | — | — | destination | `1` |
| `(2,1)` | `1` (from `2,2`) | `Infinity` (outside) | `1` | `2 + 1 = 3` |
| `(1,2)` | `Infinity` (outside) | `1` (from `2,2`) | `1` | `1 + 1 = 2` |
| `(2,0)` | `3` (from `2,1`) | `Infinity` (outside) | `3` | `4 + 3 = 7` |
| `(1,1)` | `2` (from `1,2`) | `3` (from `2,1`) | `2` | `5 + 2 = 7` |
| `(1,0)` | `7` (from `1,1`) | `7` (from `2,0`) | `7` | `1 + 7 = 8` |
| `(0,2)` | `Infinity` (outside) | `2` (from `1,2`) | `2` | `1 + 2 = 3` |
| `(0,1)` | `3` (from `0,2`) | `7` (from `1,1`) | `3` | `3 + 3 = 6` |
| `(0,0)` | `6` (from `0,1`) | `8` (from `1,0`) | `6` | `1 + 6 = 7` |

The final answer is **7**.

Here is the corresponding bottom-up table for the same grid:

```
Original grid:        Cumulative minimum sums:
1  3  1               1  4  5
1  5  1               2  7  6
4  2  1               6  8  7
```

The bottom-right value is `7`, matching the memoized result. Reconstructing the decisions from the table gives `1 -> 3 -> 1 -> 1 -> 1` (right, right, down, down).

### Example: `grid = [[5]]`

`rows = columns = 1`. The call `recurr(grid, 0, 0)` satisfies both the destination check and the bounds check, and returns `grid[0][0] = 5` immediately.

### Example: `grid = [[1,2,3],[4,5,6]]`

The cumulative table is:

```
1  3  6
5  8  12
```

The bottom-right value is `12`, from the path `1 -> 2 -> 3 -> 6`. The alternative through the `5` cell would cost `14`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Memoized DFS (implemented)** | `O(m * n)` | `O(m * n)` + `O(m + n)` stack | The recurrence is a direct translation of "move right or down and take the cheaper result." It only solves cells reachable from the start, and the maximum recursion depth of 400 is safe. The cache of string keys is slightly heavier than an integer table. |
| **Brute-force recursion** | `O(2^(m+n))` | `O(m + n)` | Same code without the cache. Correct, but it re-explores the same cells from different paths and is unusable for a `200 x 200` grid. |
| **Bottom-up DP** | `O(m * n)` | `O(m * n)` or `O(n)` | Iterative and stack-safe. It computes every cell, including cells that might be unreachable from the start in a general graph, but in a grid all cells are reachable. A rolling row reduces space to `O(n)`. |
| **In-place DP** | `O(m * n)` | `O(1)` extra | The most memory-efficient, but it overwrites the input grid, which is usually not acceptable unless the caller agrees. |

**Why the memoized DFS is preferred for this submission**: it expresses the problem exactly as stated — from a cell, choose the cheaper of right and down — and the cache keeps the exponential path explosion from happening. The `Infinity` boundary trick keeps the base cases compact. With `m, n <= 200`, both the cache and the recursion depth are well within practical limits.

**When an alternative wins**: use the **bottom-up DP** when you want an iterative solution with no call-stack risk, or when you also need to reconstruct the path. Use the **in-place DP** when memory is tight and mutating the grid is allowed. Use **brute force** only as a baseline for very small grids or to validate the recurrence.

## Key Insights

1. **The state is a cell**, so both coordinates are required in the cache key.
2. **The destination is a base case**, and it must return its own value rather than zero.
3. **`Infinity` is the correct sentinel for an invalid move**. Returning `0` for an out-of-bounds move would make illegal paths appear free.
4. **Optimal substructure**: the best path from `(r, c)` is the current value plus the best of the two next cells. There is no need to look further ahead.
5. **The recursion depth is bounded by `m + n`**, not by the number of cells, because every move increases either the row or the column. This is why the top-down approach is safe even though the grid can contain 40,000 cells.
