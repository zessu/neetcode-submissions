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