# Minimum Path Sum - LeetCode 64

## Problem Description

Given an `m x n` grid filled with non-negative numbers, find a path from the **top-left** cell to the **bottom-right** cell that minimizes the sum of all numbers along the path.

You may only move **right** or **down** at each step. The method signature used in this repository is `minPathSum(grid)`.

## Examples

### Example 1:

```
Input: grid = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1]
]
Output: 7
```

**Explanation:** The optimal path is `1 -> 3 -> 1 -> 1 -> 1`, which sums to `7`. The path moves right, right, down, down. The tempting middle route through `5` is more expensive.

### Example 2:

```
Input: grid = [
  [1, 2, 3],
  [4, 5, 6]
]
Output: 12
```

**Explanation:** The only possible paths use one down move and two right moves. Taking the top row and then the last column gives `1 + 2 + 3 + 6 = 12`; the alternative `1 + 2 + 5 + 6 = 14` is worse.

### Example 3:

```
Input: grid = [[5]]
Output: 5
```

**Explanation:** The start cell is also the destination, so the answer is its value.

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 200`
- `0 <= grid[i][j] <= 200`

The grid is guaranteed to be non-empty, so `grid[0]` always exists.

## Topics

- Array
- Dynamic Programming
- Matrix
- Memoization

## Company Tags

- Amazon
- Google
- Microsoft
- Bloomberg

## Solution Approaches

### 1. Brute-Force Recursion

**Intuition**: From each cell, try both legal moves (right and down), recursively compute the best path from each, and add the current cell's value. This explores every possible path.

**Algorithm**:
1. `dfs(r, c)`:
   - If `r >= m` or `c >= n`, the move left the grid — return `Infinity`.
   - If `(r, c)` is the bottom-right cell, return `grid[r][c]`.
   - Otherwise return `grid[r][c] + min(dfs(r, c + 1), dfs(r + 1, c))`.
2. Return `dfs(0, 0)`.

**Time Complexity**: `O(2^(m+n))` — every path has `m + n - 2` moves, and each move has two choices.
**Space Complexity**: `O(m + n)` recursion stack.

The number of paths grows exponentially, and the same cell is reached through many different paths. For a `200 x 200` grid this is completely impractical.

### 2. Memoized DFS / Top-Down DP (Implemented)

**Intuition**: Different paths can reach the same cell, so the best cost from that cell is always the same. Cache it the first time it is computed.

**Algorithm**:
1. Create `cache = new Map()` keyed by `"r:c"`.
2. `recurr(grid, r, c)`:
   - If `r >= rows` or `c >= columns`, return `Infinity` (the move is outside the grid).
   - If `(r, c)` is the destination, return `grid[r][c]`.
   - If the key exists in the cache, return the cached value.
   - Otherwise compute `right = recurr(grid, r, c + 1)` and `down = recurr(grid, r + 1, c)`.
   - Store `grid[r][c] + min(right, down)` and return it.
3. The top-level call is `recurr(grid, 0, 0)`.

The `Infinity` boundary check removes the need for separate edge-case branches: a move off the bottom or right edge simply loses the `Math.min`.

**Time Complexity**: `O(m * n)` — each cell's state is computed once.
**Space Complexity**: `O(m * n)` for the cache plus `O(m + n)` recursion depth.

### 3. Bottom-Up DP / Tabulation

**Intuition**: The best cost to reach a cell depends only on the cell above it and the cell to its left. Fill the grid in row-major order so both dependencies are already solved.

**Algorithm**:
1. `dp[r][c]` is the minimum sum from `(0, 0)` to `(r, c)`.
2. `dp[0][0] = grid[0][0]`.
3. Fill the first row: `dp[0][c] = dp[0][c - 1] + grid[0][c]`.
4. Fill the first column: `dp[r][0] = dp[r - 1][0] + grid[r][0]`.
5. For every other cell: `dp[r][c] = grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])`.
6. Return `dp[m - 1][n - 1]`.

**Time Complexity**: `O(m * n)`.
**Space Complexity**: `O(m * n)` for the table (or `O(n)` with a rolling row).

This iterative version cannot overflow the call stack and is the usual production choice.

### 4. In-Place DP

**Intuition**: The DP table can reuse the input grid itself because each cell only needs the original value once, at the moment it is processed.

**Algorithm**:
1. For each cell in row-major order:
   - If it is the start, keep it.
   - If it is in the first row, add the value to its left.
   - If it is in the first column, add the value above.
   - Otherwise add `min(above, left)`.
2. Return `grid[m - 1][n - 1]`.

**Time Complexity**: `O(m * n)`.
**Space Complexity**: `O(1)` extra space, at the cost of mutating the input.

This is the most memory-efficient variant, but mutating the caller's grid is often undesirable.

## Visual Explanation

```
grid = [1, 3, 1]
       [1, 5, 1]
       [4, 2, 1]

Optimal path:
  (0,0)=1 -> (0,1)=3 -> (0,2)=1
                              |
                              v
  (2,2)=1 <- (2,1)=2 <- (1,2)=1
                              ^
                              |
                          (1,2) reached from (0,2)

Sum: 1 + 3 + 1 + 1 + 1 = 7
```

The recursive solution asks, from every cell, "which is cheaper: go right or go down?" The cache converts the exponential path enumeration into a single pass over the `m * n` cells.

## Common Pitfalls

1. **Forgetting the destination base case**: the bottom-right cell must return its own value, not `0`.
2. **Boundary handling**: moving past the last row or column should produce `Infinity`, not `0`, otherwise invalid paths can look artificially cheap.
3. **Using the wrong cache key**: both row and column are required. A key such as `r + c` is not unique.
4. **Assuming the grid is non-empty**: the constraints guarantee it, but defensive code should still check `grid.length` before reading `grid[0].length`.
5. **Mutating the input when it is not allowed**: the in-place DP is efficient, but it destroys the original grid.
6. **Memorizing the grid in the cache key**: the cache is valid only for one grid. Reusing it across different grids would return stale answers.
