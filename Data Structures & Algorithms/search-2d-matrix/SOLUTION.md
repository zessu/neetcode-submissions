# Search a 2D Matrix - Solution

## Solution Code

```javascript
class Solution {
    binarySearch(matrix, target, length) {
        let start = 0;
        let end = length - 1;

        while (start <= end) {
            let mid = Math.floor((start + end) / 2);

            if (matrix[mid] === target) {
                return true;
            }

            if (target < matrix[mid]) {
                end = mid - 1;
            }

            if (target > matrix[mid]) {
                start = mid + 1;
            }
        }

        return false;
    }

    searchMatrix(matrix, target) {
        const individualLength = matrix[0].length;
        for (let count = 0; count < matrix.length; count++) {
            if (target > matrix[count][individualLength - 1]) continue;
            const found = this.binarySearch(matrix[count], target, individualLength);
            return found;
        }
        return false;
    }
}
```

## Solution Code (One-Pass Binary Search)

```javascript
class Solution {
    searchMatrix(matrix, target) {
        const ROWS = matrix.length;
        const COLS = matrix[0].length;
        
        let left = 0;
        let right = ROWS * COLS - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const row = Math.floor(mid / COLS);
            const col = mid % COLS;
            const midVal = matrix[row][col];
            
            if (midVal === target) return true;
            if (midVal < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return false;
    }
}
```

## Approach

**Two approaches:**

1. **Two-pass**: First find the row, then binary search in the row.

2. **One-pass**: Treat matrix as sorted 1D array using:
   - `row = mid / COLS`
   - `col = mid % COLS`

## Complexity

- **Two-pass**: O(log m + log n) = O(log(m*n))
- **One-pass**: O(log(m*n))
- **Space**: O(1)

## Walkthrough

```
matrix = [[1,2,4,8],[10,11,12,13],[14,20,30,40]], target = 10

Two-pass approach:
- Row 0: last element = 8 < 10 → skip
- Row 1: last element = 13 >= 10 → binary search row 1
- Binary search [10,11,12,13]: find 10 ✓

One-pass:
- Flattened index space: 0-11
- Binary search finds 10 at flattened index 4 → row=1, col=0 → found!
```