# Range Sum Query 2D - Immutable - LeetCode 304

## Problem Description

Given a 2D matrix `matrix`, handle multiple queries of the following type:

- Calculate the **sum** of the elements of `matrix` inside the rectangle defined by its **upper-left corner** `(row1, col1)` and **lower-right corner** `(row2, col2)`.

Implement the `NumMatrix` class:

- `NumMatrix(int[][] matrix)` initializes the object with the integer matrix `matrix`.
- `int sumRegion(int row1, int col1, int row2, int col2)` returns the sum of the elements of `matrix` inside the rectangle defined by its upper-left corner `(row1, col1)` and lower-right corner `(row2, col2)`.

The matrix is **immutable**: it does not change between queries. LeetCode asks for an algorithm where `sumRegion` runs in **`O(1)` time**.

> **Note on the submission in this directory:** `submission-0.ts` implements the straightforward per-query summation (Approach 1). It is correct but does **not** meet the `O(1)`-per-query requirement. The 2D prefix-sum solution (Approach 4) is the intended optimal solution, and `SOLUTION.md` compares the two in detail.

## Examples

### Example 1:
```
Input:
["NumMatrix", "sumRegion", "sumRegion", "sumRegion"]
[[[[3, 0, 1, 4, 2],
   [5, 6, 3, 2, 1],
   [1, 2, 0, 1, 5],
   [4, 1, 0, 1, 7],
   [1, 0, 3, 0, 5]]],
 [2, 1, 4, 3],
 [1, 1, 2, 2],
 [1, 2, 2, 4]]

Output: [null, 8, 11, 12]
```
**Explanation:**
- `sumRegion(2, 1, 4, 3)` returns `8` — rows 2–4, columns 1–3:
  `(2+0+1) + (1+0+1) + (0+3+0) = 3 + 2 + 3 = 8`.
- `sumRegion(1, 1, 2, 2)` returns `11` — rows 1–2, columns 1–2:
  `(6+3) + (2+0) = 9 + 2 = 11`.
- `sumRegion(1, 2, 2, 4)` returns `12` — rows 1–2, columns 2–4:
  `(3+2+1) + (0+1+5) = 6 + 6 = 12`.

### Example 2:
```
Input:
["NumMatrix", "sumRegion"]
[[[[-1]]], [0, 0, 0, 0]]
Output: [null, -1]
```
**Explanation:** A `1 × 1` matrix has exactly one possible rectangle. Negative values are allowed, so sums can be negative.

### Example 3:
```
Input: matrix = [[1,2],[3,4]], query = sumRegion(0, 0, 1, 1)
Output: 10
```
**Explanation:** The full matrix sums to `1 + 2 + 3 + 4 = 10`. Queries may cover the entire matrix.

## Constraints

- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 200`
- `-10^4 <= matrix[i][j] <= 10^4`
- `0 <= row1 <= row2 < m`
- `0 <= col1 <= col2 < n`
- At most `10^4` calls will be made to `sumRegion`.

## Topics

- Array
- Design
- Matrix
- Prefix Sum

## Company Tags

- Meta
- Amazon
- Google
- Microsoft

## Solution Approaches

### 1. Direct Summation per Query (Implemented)

**Intuition**: The rectangle is exactly the set of cells with `row1 <= i <= row2` and `col1 <= j <= col2`. Walk those cells and add them up.

**Algorithm**:
1. Store a reference to the matrix in the constructor.
2. For each query, initialize `sum = 0`.
3. Loop `i` from `row1` to `row2` and `j` from `col1` to `col2`, adding `matrix[i][j]`.
4. Return `sum`.

**Time Complexity**: `O((row2 - row1 + 1) · (col2 - col1 + 1))` per query, which is `O(m · n)` in the worst case.
**Space Complexity**: `O(1)` extra space (the constructor stores a reference, not a copy).

### 2. Row-Wise Prefix Sums

**Intuition**: Precompute a prefix sum for every row. Then the sum of any contiguous segment within one row is a single subtraction. A query adds one segment per row.

**Algorithm**:
1. Build `prefix[i][j + 1] = prefix[i][j] + matrix[i][j]` for every row.
2. For a query, loop over rows `i` from `row1` to `row2` and add `prefix[i][col2 + 1] - prefix[i][col1]`.
3. Return the accumulated sum.

**Time Complexity**: `O(m · n)` to build, `O(row2 - row1 + 1)` = `O(m)` per query.
**Space Complexity**: `O(m · n)` for the row prefix table.

### 3. Column-Wise Prefix Sums

**Intuition**: Symmetric to Approach 2, but precompute down each column. Each query sums one vertical segment per column.

**Algorithm**:
1. Build `prefix[i + 1][j] = prefix[i][j] + matrix[i][j]` for every column.
2. For a query, loop over columns `j` from `col1` to `col2` and add `prefix[row2 + 1][j] - prefix[row1][j]`.
3. Return the accumulated sum.

**Time Complexity**: `O(m · n)` to build, `O(col2 - col1 + 1)` = `O(n)` per query.
**Space Complexity**: `O(m · n)`.

### 4. 2D Prefix Sum with Inclusion–Exclusion (Optimal)

**Intuition**: Precompute `P[i][j]`, the sum of the rectangle from `(0, 0)` to `(i - 1, j - 1)` — a padded `(m + 1) × (n + 1)` table whose first row and column are zero. Any rectangle sum then falls out of four prefix lookups:

```
sum(row1, col1, row2, col2)
  = P[row2 + 1][col2 + 1]
  - P[row1][col2 + 1]
  - P[row2 + 1][col1]
  + P[row1][col1]
```

The two subtractions remove the strip above and the strip to the left; their overlap was removed twice, so the top-left prefix is added back once. This is the **inclusion–exclusion principle**.

**Algorithm**:
1. Allocate `P` with `m + 1` rows and `n + 1` columns, initialized to `0`.
2. For each cell `(i, j)`:
   `P[i + 1][j + 1] = matrix[i][j] + P[i][j + 1] + P[i + 1][j] - P[i][j]`.
3. Answer each query with the four-term formula above.

**Time Complexity**: `O(m · n)` to build, `O(1)` per query.
**Space Complexity**: `O(m · n)` for the prefix table.

## Visual Explanation

```
matrix (5 x 5)                       query (2, 1, 4, 3): rows 2-4, cols 1-3
        0  1  2  3  4
      ┌───────────────┐
row 0 │ 3  0  1  4  2 │
row 1 │ 5  6  3  2  1 │
row 2 │ 1 [2  0  1] 5 │   <-- highlighted rectangle
row 3 │ 4 [1  0  1] 7 │       sum = (2+0+1) + (1+0+1) + (0+3+0)
row 4 │ 1 [0  3  0] 5 │           = 3 + 2 + 3 = 8
      └───────────────┘

2D prefix table P (padded, size 6 x 6):

        0   1   2   3   4   5
      ┌───────────────────────┐
row 0 │ 0   0   0   0   0   0 │
row 1 │ 0   3   3   4   8  10 │
row 2 │ 0   8  14  18  24  27 │
row 3 │ 0   9  17  21  28  36 │
row 4 │ 0  13  22  26  34  49 │
row 5 │ 0  14  23  30  38  58 │
      └───────────────────────┘

sum(2,1,4,3) = P[5][4] - P[2][4] - P[5][1] + P[2][1]
             =    38   -    24   -    14   +    8
             =    8

Geometrically:

   P[2][4]                    P[5][4]
   ┌──────────┐               ┌──────────────────┐
   │  above   │               │                  │
   ├──────────┼───────────────┤                  │
   │  left    │   RECTANGLE   │                  │
   │ P[5][1]  │    (answer)   │                  │
   └──────────┴───────────────┘                  │
                              └──────────────────┘

P[5][4] contains "above" + "left" + rectangle + overlap.
Subtract "above" and "left"; the overlap (P[2][1]) is subtracted twice,
so add P[2][1] back once.
```

## Comparison of Approaches

| Approach | Build Time | Query Time | Space | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Direct summation** (implemented) | `O(1)` | `O(m · n)` | `O(1)` extra | Trivial; no preprocessing | Fails the `O(1)` requirement; up to `4 × 10^8` cell reads at the limits |
| **Row prefix sums** | `O(m · n)` | `O(m)` | `O(m · n)` | Simple extension of 1D prefix sums | Query still depends on the number of rows |
| **Column prefix sums** | `O(m · n)` | `O(n)` | `O(m · n)` | Symmetric alternative; good when rectangles are short and wide | Query still depends on the number of columns |
| **2D prefix sums** | `O(m · n)` | `O(1)` | `O(m · n)` | Meets the requirement; four lookups per query | Inclusion–exclusion and padding are easy to get wrong |

## Common Pitfalls

1. **Off-by-one with padding**: In the padded table, `row2` and `col2` become `row2 + 1` and `col2 + 1`. Mixing padded and unpadded indices produces answers that are consistently wrong.
2. **Wrong inclusion–exclusion signs**: The pattern is `bottomRight - above - left + topLeft`. Forgetting the final `+ P[row1][col1]` double-subtracts the overlap and undercounts.
3. **Prefix table orientation**: `P[i][j]` must mean "sum of the first `i` rows and first `j` columns". Documenting it as "through index `i`" while using `+1` offsets creates confusion.
4. **Using `m × n` instead of `(m + 1) × (n + 1)`**: The padded version removes boundary conditionals. Without padding, `row1 = 0` or `col1 = 0` needs special cases.
5. **Assuming values are non-negative**: Prefix sums work for negative values too. The running sums are not monotonic, but the subtraction formula is unaffected.
6. **Mutating the stored matrix**: The implemented constructor keeps a reference to the caller's array. If the caller later mutates it, query results change. The problem calls the matrix immutable, so this is acceptable on LeetCode but worth knowing.
7. **Integer overflow in other languages**: JavaScript numbers handle the maximum total (`200 · 200 · 10^4 = 4 × 10^8`) exactly, but 32-bit implementations must be careful.
8. **Skipping the `O(1)` requirement**: A correct but linear-per-query solution can pass small tests and still time out at `10^4` queries on a `200 × 200` matrix.

## Related Problems

- [Search a 2D Matrix](../search-2d-matrix/README.md) — row/column indexing and binary search on a matrix.
- [Spiral Matrix](../spiral-matrix/README.md) — traversing matrix rectangles with boundary indices.
