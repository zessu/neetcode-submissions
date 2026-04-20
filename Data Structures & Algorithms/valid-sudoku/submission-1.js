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

  scanGrid(boards, start, end) {
    const gridVals = new Map();
    for (let i = start; i < start + 3; i++) {
      for (let j = end; j < end + 3; j++) {
        const current = boards[i][j];
        if (gridVals.has(current) && current !== ".") return false;
        gridVals.set(current, 1);
      }
    }
    return true;
  }

  scanAllGrids(boards) {
    let isValid = true;
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        isValid = this.scanGrid(boards, i, j);
        if (!isValid) return false;
      }
    }
    return isValid;
  }

  /**
   * @param {character[][]} board
   * @return {boolean}
   */
  isValidSudoku(board) {
    const rowsValid = this.scanAllRows(board);
    const colsValid = this.scanAllColumns(board);
    const gridsValid = this.scanAllGrids(board);

    return rowsValid && colsValid && gridsValid;
  }
}