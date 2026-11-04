class Solution {
    /**
     * @param {number[]} cost
     * @return {number}
     */
    minCostClimbingStairs(cost: number[]): number {
        const cache = new Map<number, number>();

        const recurr = (idx: number)=> {
            if(idx >= cost.length) return 0;
            if(cache.has(idx)) return cache.get(idx);

            const left = cost[idx] + recurr(idx + 1);
            const right = cost[idx] + recurr(idx + 2);

            cache.set(idx, Math.min(left, right));
            return Math.min(left, right);
        }

        return Math.min(recurr(0), recurr(1));
    }
}
