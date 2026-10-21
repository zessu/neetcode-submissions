# Number of Islands - LeetCode 200

## Problem Description

Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the **number of islands**.

An **island** is surrounded by water and is formed by connecting adjacent lands **horizontally or vertically**. You may assume all four edges of the grid are all surrounded by water.

Equivalently: count the connected components of land cells, where connectivity is 4-directional (up, down, left, right). Diagonal contact does **not** join two islands.

## Examples

### Example 1:
```
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
```
**Explanation:** All land cells are connected through horizontal/vertical steps, forming a single island. The `"0"` at row 1, column 2 is water; the surrounding land stays connected around it.

```
1 1 1 1 0
1 1 0 1 0
1 1 0 0 0
0 0 0 0 0
```

### Example 2:
```
Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
```
**Explanation:** There are three separate islands: the `2 × 2` block at the top-left, the single cell at row 2 column 2, and the horizontal pair at the bottom-right.

```
1 1 0 0 0        A A . . .
1 1 0 0 0   ->   A A . . .
0 0 1 0 0        . . B . .
0 0 0 1 1        . . . C C
```

### Example 3:
```
Input: grid = [["1","0","1"]]
Output: 2
```
**Explanation:** The two land cells are separated by water, so they are two islands.

## Constraints

- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 300`
- `grid[i][j]` is `'0'` or `'1'`.

## Topics

- Array
- Depth-First Search
- Breadth-First Search
- Union-Find
- Matrix

## Company Tags

- Amazon
- Google
- Meta
- Microsoft

## Solution Approaches

### 1. DFS Flood Fill with a Visited Set (Implemented)

**Intuition**: Scan every cell. Each time an unvisited land cell is found, it must belong to an island that has not been counted yet. Launch a DFS from it that marks every reachable land cell (flood fill), then increment the island count. Because the DFS consumes the whole island, the outer scan will not launch again from any cell in it.

**Algorithm**:
1. Read `rows` and `cols` from the grid.
2. Maintain a `searched` set of `"row:col"` strings for visited cells.
3. Define `search(row, column)`:
   - Return if the cell is out of bounds, is water (`parseInt(grid[row][column]) === 0`), or is already in `searched`.
   - Add the cell to `searched`.
   - Recurse in the four orthogonal directions.
4. Loop over every cell. When `grid[i][j] === "1"` and `(i, j)` is not in `searched`, call `search(i, j)` and increment `islandCount`.
5. Return `islandCount`.

**Time Complexity**: `O(m · n)` — each cell is checked by the outer scan once, and each land cell is visited by flood fill at most once (water cells can be re-checked from several neighbors, but each check is `O(1)` and the total number of neighbor checks is `O(m · n)`).
**Space Complexity**: `O(m · n)` — the `searched` set can hold every land cell, and the recursion stack can be `O(m · n)` deep for a snake-shaped island.

### 2. BFS Flood Fill

**Intuition**: The same component discovery, but explore with a queue instead of recursion. BFS avoids deep call stacks, which matters on a `300 × 300` all-land grid.

**Algorithm**:
1. Scan every cell.
2. When an unvisited land cell is found, increment the count and push its coordinates into a queue.
3. Mark it visited (ideally when enqueued, to avoid duplicates).
4. While the queue is not empty, dequeue a cell and enqueue each in-bounds, unvisited land neighbor.
5. Continue scanning after the queue empties.

**Time Complexity**: `O(m · n)`.
**Space Complexity**: `O(m · n)` worst case for the queue and visited set; the queue often holds only the frontier, which is `O(min(m, n))` for compact regions, but can be `O(m · n)`.

### 3. In-Place DFS (Mark Land as Water)

**Intuition**: Instead of a separate visited set, sink each visited land cell by writing `'0'`. The grid itself becomes the visited structure, saving the set.

**Algorithm**:
1. Scan every cell.
2. On an unvisited `'1'`, increment the count and call `sink(i, j)`.
3. `sink` returns on out-of-bounds or `'0'`; otherwise it sets the cell to `'0'` and recurses in four directions.

**Time Complexity**: `O(m · n)`.
**Space Complexity**: `O(m · n)` for the recursion stack only (no visited set). The input grid is modified, which is usually acceptable in an interview but not if the caller needs the grid afterward.

### 4. Union-Find (Disjoint Set Union)

**Intuition**: Give every land cell its own set. For each land cell, union it with its land neighbors to the right and below (checking only two directions avoids duplicate unions). The number of remaining sets is the number of islands.

**Algorithm**:
1. Assign each land cell an index `i * n + j`; initialize `parent` and `size` for land cells only.
2. Start `count` at the number of land cells.
3. For every land cell, if its right neighbor is land, `union` them; if its bottom neighbor is land, `union` them. Each successful union decrements `count`.
4. Return `count`.

**Time Complexity**: `O(m · n · α(m · n))` with path compression and union by size, where `α` is the near-constant inverse Ackermann function.
**Space Complexity**: `O(m · n)` for the parent/size arrays.

## Visual Explanation

```
Example 2:

  grid                      island labels            flood fill from (0,0)
  ┌─────────────┐           ┌─────────────┐          ┌─────────────┐
  │ 1 1 0 0 0   │           │ A A . . .   │          │ * * . . .   │
  │ 1 1 0 0 0   │   --->    │ A A . . .   │   --->   │ * * . . .   │
  │ 0 0 1 0 0   │           │ . . B . .   │          │ . . . . .   │
  │ 0 0 0 1 1   │           │ . . . C C   │          │ . . . . .   │
  └─────────────┘           └─────────────┘          └─────────────┘
                            3 components              DFS consumes A

Outer scan order (row-major):
  (0,0) land, unvisited -> count = 1, flood fill the 2x2 block A
  (0,1), (1,0), (1,1) already searched -> skip
  (2,2) land, unvisited -> count = 2, flood fill B
  (3,3) land, unvisited -> count = 3, flood fill C (and (3,4))
  Answer: 3

Diagonal is NOT a connection:
  1 0
  0 1     -> 2 islands, not 1
```

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **DFS + visited set** (implemented) | `O(m · n)` | `O(m · n)` | Simple; keeps the grid unchanged | Deep recursion on large all-land grids; string keys cost memory |
| **BFS flood fill** | `O(m · n)` | `O(m · n)` | No recursion-depth risk; explores level by level | Queue and visited set use extra memory |
| **In-place DFS** | `O(m · n)` | `O(m · n)` stack only | No visited set; very compact code | Mutates the input; still recursive |
| **Union-Find** | `O(m · n · α(m · n))` | `O(m · n)` | Natural for dynamic connectivity; handles streaming additions | More code; slower constants than a single flood fill |

## Common Pitfalls

1. **Diagonal adjacency**: Only up, down, left, and right connect cells. Checking all eight neighbors merges distinct islands incorrectly.
2. **Bounds checks before indexing**: In JavaScript, `grid[row][column]` on an out-of-range row throws. Always check `row < 0 || row >= rows || column < 0 || column >= cols` first.
3. **Forgetting to mark cells**: Without a visited set or in-place marking, the DFS cycles between land cells forever.
4. **Counting more than once**: Increment the island count only when launching a flood fill, not for every land cell visited inside it.
5. **Recursion depth**: A `300 × 300` all-land grid can create a recursion depth near `90,000`. The implemented recursive DFS can exceed the JavaScript call stack on such a case; BFS or an explicit stack is safer.
6. **`"1"` vs `1`**: The grid contains strings. `parseInt(grid[i][j])` works, but mixing string and number comparisons (for example `grid[i][j] === 1`) silently fails.
7. **Mutating the grid**: In-place sinking is efficient but destroys the input. If the caller needs the grid afterward, use a visited set instead.
8. **Empty grid**: The constraints guarantee at least one row and one column, but defensive code should handle `grid.length === 0` before reading `grid[0].length`.

## Related Problems

- [Largest Component](../largest-component/README.md) — counting connected components in an adjacency-list graph, the same traversal idea.
- [Shortest Path](../shortest-path/README.md) — graph traversal with BFS on an unweighted graph.
