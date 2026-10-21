class Solution {
    /**
     * @param {number[]} coins
     * @param {number} amount
     * @return {number}
     */
    coinChange(coins: number[], amount: number): number {
        const cache = new Map<number, number>();

        const splitChange = (amt: number): number => {
            if (amt < 0) return Infinity;
            if (amt === 0) return 0;
            if (cache.has(amt)) return cache.get(amt)!;

            let res = Infinity;
            for (const num of coins) {
                const sub = splitChange(amt - num);
                if (sub !== Infinity) res = Math.min(res, 1 + sub);
            }

            cache.set(amt, res);
            return res;
        };

        const ans = splitChange(amount);
        return ans === Infinity ? -1 : ans;
    }
}