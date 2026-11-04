class Solution {
    /**
     * @param {number} n
     * @return {number}
     */
    tribonacci(n: number): number {
        const cache = new Map<number, number>();

        const trib = (n: number) => {
            if(n === 0) return 0;
            if(n === 1) return 1;
            if(n === 2) return 1;

            if(cache.has(n)) return cache.get(n);

            const l = trib(n-1);
            const m = trib(n-2);
            const r = trib(n-3);

            cache.set(n, l+m+r)
            return l + m + r;
        }

            return trib(n);

    }
}
