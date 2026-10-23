class Solution {
    minPathSum(grid: number[][]): number {

        const rows = grid.length;
        const columns = grid[0].length;
        const cache = new Map();

        const recurr = (grid: number[][], r: number, c: number): number => {
            if(r >=rows || c >= columns) return Infinity;
            if(r === rows - 1 && c === columns - 1) return grid[r][c];
            if(cache.has(`${r}:${c}`)) return cache.get(`${r}:${c}`);

            const right = recurr(grid,r, c + 1);
            const down = recurr(grid,r+1, c);
            const min = Math.min(right, down);

            cache.set(`${r}:${c}`, min + grid[r][c])

            return grid[r][c] + min;
        }

        return recurr(grid, 0, 0);
    }
}
