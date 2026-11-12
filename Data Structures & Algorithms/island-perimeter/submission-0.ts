class Solution {
    /**
     * @param {number[][]} grid
     * @return {number}
     */
    islandPerimeter(grid: number[][]): number {
        // for each grid cell
        // check all sides 
        // if side is either out of bounds 
        // or side is water count as perimeter
        // add to total count
        // return count

        const rows = grid.length;
        const cols = grid[0].length;
        let perimeter = 0;

        const isOutOfBounds = (r: number, c: number) => r < 0 || c < 0 || r > rows - 1 || c > cols -1;

        const returnPerimeter = (row: number, col: number): number => {
            if(isOutOfBounds(row, col)) return 1;
            if(grid[row][col] === 1) return 0;
            return 1;
        }

        for(let r=0; r < rows; r++) {
            for(let c =0; c < cols; c++) {
                if(grid[r][c]) {
                    perimeter += returnPerimeter(r,c-1);
                    perimeter += returnPerimeter(r,c+1);
                    perimeter += returnPerimeter(r-1,c);
                    perimeter += returnPerimeter(r+1,c);
                }
            }
            console.log(`perimeter is ${perimeter}`);
        }

        return perimeter;
    }
}
