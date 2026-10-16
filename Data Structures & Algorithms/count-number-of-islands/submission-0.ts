class Solution {
    numIslands(grid: string[][]): number {
        const rows = grid.length;
        const cols = grid[0].length;
        let islandCount = 0;
        const searched = new Set();

        const search = (row: number, column: number) => {
            const setKey = `${row}:${column}`;

            if(row < 0 || row >= rows || column < 0 || column >= cols || parseInt(grid[row][column]) === 0 || searched.has(setKey)) {
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
