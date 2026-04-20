# Valid Sudoku - Solution

## Solution Code

```javascript
class Solution {
  validValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

  scanAllRows(board) {
    for (const item in board) {
      const rowVals = new Map();
      for (let i = 0; i < 9; i++) {
        const current = board[item][i];
        if (!this.validValues.includes(current)) return false;
        if (rowVals.has(current) && current !== ".") return false;
        rowVals.set(current, 1);
      }
    }
    return true;
  }

  scanAllColumns(board) {
    for (const item in board) {
      const colVals = new Map();
      for (let i = 0; i < 9; i++) {
        const current = board[i][item];
        if (!this.validValues.includes(current)) return false;
        if (colVals.has(current) && current !== ".") return false;
        colVals.set(current, 1);
      }
    }
    return true;
  }

  scanAllGrids(board) {
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        const gridVals = new Map();
        for (let r = i; r < i + 3; r++) {
          for (let c = j; c < j + 3; c++) {
            const current = board[r][c];
            if (gridVals.has(current) && current !== ".") return false;
            gridVals.set(current, 1);
          }
        }
      }
    }
    return true;
  }

  isValidSudoku(board) {
    return this.scanAllRows(board) && 
           this.scanAllColumns(board) && 
           this.scanAllGrids(board);
  }
}
```

## Approach

Validate three independent conditions:

1. **Rows**: Each row contains no duplicate 1-9
2. **Columns**: Each column contains no duplicate 1-9  
3. **3x3 Grids**: Each sub-box contains no duplicate 1-9

## Complexity

- **Time**: O(81) = O(1) - fixed 9x9 board
- **Space**: O(1) - fixed hash maps

## Walkthrough

```
Check row 0: "5 3 . 7 . . . ." - all unique ✓
Check row 1: ". 9 8 . . . . 6 ." - all unique ✓
...
Check column 0: "5 . . . . . . . ." - all unique ✓
...
Check 3x3 grid (top-left): elements 0-2 rows x 0-2 cols - all unique ✓
...

All conditions pass → true
```