class Solution {
    minCoins(coins, sum) {
        // code here
        const cache = new Map();

        const breakDown = (num) => {
            if(num === 0) return 0;
            if(num < 0) return Infinity;
            if(cache.has(num)) return cache.get(num);

            let smallest = Infinity;
            for(const coin of coins) {
                const ret = breakDown(num-coin);
                if(ret != Infinity) {
                    smallest = Math.min(smallest, ret + 1);
                }
            }
            cache.set(num, smallest);
            return smallest;
        }


        const ans = breakDown(sum);
        return ans === Infinity ? -1 : ans;

    }
}
