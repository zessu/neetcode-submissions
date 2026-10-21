# Range Sum Query 2D - Immutable - Solution

## Solution Code

```typescript
class NumMatrix {
    matrix: number[][] = [];
    /**
     * @param {number[][]} matrix
     */
    constructor(matrix: number[][]) {
        this.matrix = matrix;
    }

    /**
     * @param {number} row1
     * @param {number} col1
     * @param {number} row2
     * @param {number} col2
     * @return {number}
     */
    sumRegion(row1: number, col1: number, row2: number, col2: number): number {
        let sum = 0;

        for(let i = row1; i <= row2; i++) {
            for(let j = col1; j <= col2; j++) {
                sum += this.matrix[i][j];
            }
        }

        return sum;
    }
}
```

## Approach

This submission uses **direct summation of the query rectangle**. It performs no preprocessing at all:

1. **Constructor** — the matrix reference is stored in `this.matrix`. The field is declared as `number[][]` and initialized to `[]`, then overwritten by the constructor argument. No copy is made, so construction is `O(1)`.
2. **`sumRegion`** — two nested loops enumerate every cell in the inclusive rectangle:
   - the outer loop covers rows `row1` through `row2`;
   - the inner loop covers columns `col1` through `col2`;
   - each cell is added to a local `sum`.
3. **Return `sum`** — no prefix table, no caching, no state changes between queries.

The implementation is a faithful reading of the problem definition, and it is correct for every valid rectangle, including single cells, full-matrix queries, and negative values. It is **not** the asymptotically intended solution: LeetCode asks for `sumRegion` in `O(1)` time, while this version scans the rectangle on every call (see the comparison below).

- **Time Complexity**: `O(1)` for the constructor; `O((row2 - row1 + 1) · (col2 - col1 + 1))` per query, i.e. `O(m · n)` worst case.
- **Space Complexity**: `O(1)` auxiliary space. The object holds one reference to the input matrix; no prefix table is allocated.

## Walkthrough

Matrix:

```
        0  1  2  3  4
      ┌───────────────┐
row 0 │ 3  0  1  4  2 │
row 1 │ 5  6  3  2  1 │
row 2 │ 1  2  0  1  5 │
row 3 │ 4  1  0  1  7 │
row 4 │ 1  0  3  0  5 │
      └───────────────┘
```

### Query 1: `sumRegion(2, 1, 4, 3)` → `8`

The rectangle covers rows `2..4` and columns `1..3`:

```
row 2:  matrix[2][1] + matrix[2][2] + matrix[2][3] = 2 + 0 + 1 = 3
row 3:  matrix[3][1] + matrix[3][2] + matrix[3][3] = 1 + 0 + 1 = 2
row 4:  matrix[4][1] + matrix[4][2] + matrix[4][3] = 0 + 3 + 0 = 3
                                                        total = 8
```

The loops visit `3 rows × 3 columns = 9` cells.

### Query 2: `sumRegion(1, 1, 2, 2)` → `11`

```
row 1:  matrix[1][1] + matrix[1][2] = 6 + 3 = 9
row 2:  matrix[2][1] + matrix[2][2] = 2 + 0 = 2
                                      total = 11
```

`2 × 2 = 4` cells visited.

### Query 3: `sumRegion(1, 2, 2, 4)` → `12`

```
row 1:  matrix[1][2] + matrix[1][3] + matrix[1][4] = 3 + 2 + 1 = 6
row 2:  matrix[2][2] + matrix[2][3] + matrix[2][4] = 0 + 1 + 5 = 6
                                                        total = 12
```

`2 × 3 = 6` cells visited.

Across the three queries the implementation performs `9 + 4 + 6 = 19` additions. The full-matrix query `sumRegion(0, 0, 4, 4)` would visit all 25 cells and return `58`.

## Comparison with the Alternatives

| Approach | Build | Per Query | Space | Trade-off |
| :--- | :--- | :--- | :--- | :--- |
| **Direct summation** (implemented) | `O(1)` | `O(m · n)` | `O(1)` extra | Best when there is essentially one query; otherwise repeats work |
| **Row prefix sums** | `O(m · n)` | `O(m)` | `O(m · n)` | Good when queries span few rows but many columns |
| **Column prefix sums** | `O(m · n)` | `O(n)` | `O(m · n)` | Good when queries span few columns but many rows |
| **2D prefix sums** | `O(m · n)` | `O(1)` | `O(m · n)` | The intended solution; best for many arbitrary queries |

**Why the implemented approach is not the right choice here:** the problem allows up to `10^4` `sumRegion` calls on a matrix up to `200 × 200`. An adversarial input can make every query cover the whole matrix, giving `10^4 · 200 · 200 = 4 × 10^8` additions. The 2D prefix table answers each query with four array lookups and three arithmetic operations, at the cost of one `O(m · n)` preprocessing pass.

For comparison, the optimal implementation looks like this:

```typescript
class NumMatrix {
    private prefix: number[][];

    constructor(matrix: number[][]) {
        const m = matrix.length;
        const n = matrix[0].length;
        this.prefix = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                this.prefix[i + 1][j + 1] =
                    matrix[i][j] +
                    this.prefix[i][j + 1] +
                    this.prefix[i + 1][j] -
                    this.prefix[i][j];
            }
        }
    }

    sumRegion(row1: number, col1: number, row2: number, col2: number): number {
        return this.prefix[row2 + 1][col2 + 1]
             - this.prefix[row1][col2 + 1]
             - this.prefix[row2 + 1][col1]
             + this.prefix[row1][col1];
    }
}
```

With the example matrix, the prefix table is:

```
0   0   0   0   0   0
0   3   3   4   8  10
0   8  14  18  24  27
0   9  17  21  28  36
0  13  22  26  34  49
0  14  23  30  38  58
```

So `sumRegion(2, 1, 4, 3) = 38 - 24 - 14 + 8 = 8`, matching the walkthrough above.

**When the implemented approach wins:** if the number of queries were tiny (say one or two) and the matrix were large, building a full prefix table could cost more than scanning the requested rectangles. Direct summation is also preferable when memory is tight, since it uses no extra `O(m · n)` structure. **When the alternatives win:** row or column prefix sums are a middle ground when rectangles are consistently thin in one direction. The 2D prefix sum wins for the general case and is the only approach that satisfies the stated `O(1)` query bound.

## Key Insights

1. **The query rectangle is inclusive on both ends** — the loops must use `<= row2` and `<= col2`.
2. **Construction can be free** — because the matrix is immutable, storing a reference is enough for direct summation.
3. **The naive cost scales with rectangle area** — a full-matrix query is `O(m · n)`, and repeating it many times dominates the runtime.
4. **Prefix sums turn area into corners** — with a padded 2D table, any rectangle is `bottomRight - above - left + topLeft`.
5. **Padding removes boundary cases** — a `(m + 1) × (n + 1)` table with a zero first row and column makes `row1 = 0` and `col1 = 0` work without branches.
6. **Negative values are fine** — the inclusion–exclusion identity is algebraic and does not depend on sums increasing.
