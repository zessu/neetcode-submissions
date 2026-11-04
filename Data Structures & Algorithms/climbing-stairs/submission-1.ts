class Solution {
    /**
     * @param {number} n
     * @return {number}
     */
    climbStairs(n: number): number {
        const cache = new Map<number, number>();

        const recurr = (val: number) => {
            if (val === 0) return 1;
            if (val < 0) return 0;
            if(cache.has(val)) return cache.get(val);

            const left = recurr(val -1);
            const right = recurr(val -2);

            cache.set(val, left + right);
            return left + right;
        }

        return recurr(n);
    }
}
