# Number of Islands - Solution

## Solution Code

```typescript
class Solution {
    numIslands(grid: string[][]): number {
        const rows = grid.length;
        const cols = grid[0].length;
        let islandCount = 0;
        const searched = new Set();

        const search = (row: number, column: number) => {
            const setKey = `${row}:${column}`;

            if(row < 0 || row >= rows || column < 0 || column >= cols || parseInt(grid[row][column]) === 0 || searched.has(setKey)) {
                searched.add(setKey);
                return;
            }

            searched.add(setKey);

            search(row, column + 1);
            search(row, column - 1);
            search(row + 1, column);
            search(row - 1, column);
        }

        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++){
                if(grid[i][j] === "1" && !searched.has(`${i}:${j}`)) {
                    search(i,j);
                    islandCount++;
                }
            }
        }

        return islandCount;
    }
}
```

## Approach

This is a **DFS flood fill with an explicit visited set**. The grid is never modified, so the same input can be reused after the call.

1. **Capture dimensions** — `rows = grid.length`, `cols = grid[0].length`. The constraints guarantee a non-empty grid, so `grid[0]` is safe.
2. **Visited set** — `searched` stores string keys of the form `"row:col"`. A `Set` gives average `O(1)` membership checks. Strings are used instead of nested arrays because JavaScript sets compare object references, not coordinates.
3. **`search(row, column)` — recursive flood fill**:
   - Build the key `"row:col"`.
   - **Base case**: return if the cell is out of bounds, is water (`parseInt(grid[row][column]) === 0`), or has already been searched.
   - **Mark** the current land cell in `searched`.
   - Recurse on the four orthogonal neighbors: right, left, down, up.
4. **Outer scan** — visit every cell in row-major order. If a cell is land (`"1"`) and has not been searched, it is the first cell of a new island that the scan has reached. Flood fill the whole island, then increment `islandCount`.
5. **Return `islandCount`**.

Why this counts correctly: the flood fill is exhaustive over 4-connected land, so it marks exactly one connected component. The outer loop only launches when it sees a land cell that no previous launch consumed, so each component is counted exactly once.

### A note on the latest submission

`submission-1.ts` differs slightly from `submission-0.ts`: in the guard clause it executes `searched.add(setKey)` before returning, including for out-of-bounds and water cells. This is harmless for correctness — those keys are simply extra entries — but it is unnecessary work. The number of distinct extra keys is bounded by the cells adjacent to visited land plus the grid perimeter, so the asymptotic bounds are unchanged.

- **Time Complexity**: `O(m · n)`. The outer scan touches each cell once. Flood fill marks each land cell once and performs four neighbor checks per land cell; water cells may be tested from multiple neighbors, but the total is proportional to the number of grid edges, `O(m · n)`.
- **Space Complexity**: `O(m · n)`. The `searched` set can contain every land cell, and the recursive DFS stack can be `O(m · n)` deep for a long snake-shaped island.

## Walkthrough

### Example 1: single island

```
1 1 1 1 0
1 1 0 1 0
1 1 0 0 0
0 0 0 0 0
```

The outer scan reaches `(0,0)`, which is unvisited land. `search(0,0)` marks the entire connected region:

```
(0,0) -> (0,1) -> (0,2) -> (0,3)
                   |
(1,0) -> (1,1)     +-> (1,3)
  |
(2,0) -> (2,1)
```

Every `1` in the grid is reachable from `(0,0)` through orthogonal moves, including the `(0,3)`–`(1,3)` pair. When the DFS returns, all land cells are in `searched`. The rest of the outer scan finds only searched land or water, so `islandCount` stays `1`.

### Example 2: three islands

```
row 0:  1 1 0 0 0
row 1:  1 1 0 0 0
row 2:  0 0 1 0 0
row 3:  0 0 0 1 1
```

| Outer cell | Action | `islandCount` | Cells marked |
| :--- | :--- | :--- | :--- |
| `(0,0)` | land, unvisited → `search(0,0)` | `1` | `(0,0)`, `(0,1)`, `(1,1)`, `(1,0)` |
| `(0,1)` | already searched | `1` | — |
| `(1,0)`, `(1,1)` | already searched | `1` | — |
| `(2,2)` | land, unvisited → `search(2,2)` | `2` | `(2,2)` |
| `(3,3)` | land, unvisited → `search(3,3)` | `3` | `(3,3)`, `(3,4)` |
| `(3,4)` | already searched | `3` | — |

Exact DFS trace for the first island (neighbor order: right, left, down, up):

```
search(0,0)  mark 0:0
  right  search(0,1)  mark 0:1
           right  search(0,2)  water -> return
           left   search(0,0)  already searched -> return
           down   search(1,1)  mark 1:1
                    right  search(1,2)  water -> return
                    left   search(1,0)  mark 1:0
                             right  search(1,1) searched -> return
                             left   search(1,-1) out of bounds -> return
                             down   search(2,0) water -> return
                             up     search(0,0) searched -> return
                    down   search(2,1)  water -> return
                    up     search(0,1)  searched -> return
           down   search(1,1)  searched -> return
           up     search(-1,1) out of bounds -> return
  left   search(0,-1) out of bounds -> return
  down   search(1,0) already searched -> return
  up     search(-1,0) out of bounds -> return
```

The second island is a single cell at `(2,2)`; all four neighbors are water or out of bounds. The third island is the horizontal pair `(3,3)`–`(3,4)`. The final answer is **3**.

## Comparison with the Alternatives

| Approach | Time Complexity | Space Complexity | When it wins |
| :--- | :--- | :--- | :--- |
| **DFS + visited set** (implemented) | `O(m · n)` | `O(m · n)` | Clear, compact, and keeps the grid immutable. A good default when recursion depth is not a concern. |
| **BFS flood fill** | `O(m · n)` | `O(m · n)` | Large all-land grids or any input where recursive depth could reach the stack limit. Use an explicit queue and mark cells when enqueued. |
| **In-place DFS** | `O(m · n)` | `O(m · n)` stack | Memory-sensitive settings where mutating the grid is allowed. Removes the `Set` entirely. |
| **Union-Find** | `O(m · n · α(m · n))` | `O(m · n)` | When land is added dynamically, or when connectivity queries interleave with counting. Overkill for one static grid. |

**Why the implemented approach is chosen:** flood fill is the most direct model of "an island is everything reachable from a land cell." A visited set makes the approach non-destructive, and the outer scan plus flood fill visits each cell a constant number of times. The average `O(1)` `Set` lookup keeps the implementation simple without changing the asymptotic cost.

**When the alternatives win:** the recursive implementation's weakness is stack depth. A `300 × 300` grid of all `1`s produces a DFS path of roughly `90,000` cells (the neighbor order snakes across rows), which can exceed the JavaScript call stack. BFS with a queue, or DFS with an explicit stack, handles that input without risking a `RangeError`. If the grid may be mutated, in-place sinking removes the visited set and lowers memory; if the problem becomes dynamic (land cells are added over time), Union-Find is the right structure because it supports incremental merges.

## Key Insights

1. **Count components, not cells** — increment only when a flood fill is launched from an unvisited land cell.
2. **Four directions only** — diagonals do not connect islands.
3. **Mark before recursing** — marking at entry prevents cycles and stops the same cell from being processed repeatedly.
4. **The visited check has three parts** — bounds, water, and already-searched. All three must be checked before indexing or recursing.
5. **`parseInt` on grid values** — the grid stores strings `"0"` and `"1"`; `parseInt("0") === 0` is the water test. Comparing `grid[i][j] === 0` would never be true.
6. **Recursion depth is the hidden risk** — the algorithm is optimal in time, but the recursive form can overflow on a maximum-size all-land grid. BFS is the safer variant at the same asymptotic complexity.
7. **Extra keys in the latest submission are harmless** — adding out-of-bounds/water keys to `searched` wastes a little memory but does not affect the count or the asymptotic bounds.
