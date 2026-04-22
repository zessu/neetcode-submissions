class Solution {

    minEatingSpeed(piles, h) {
        const sorted = [...piles].sort((a,b) => b-a);
        let start = 0;
        let end = sorted[0];
        const res= [];
        
        while(start <= end) {
            const mid = Math.floor((start + end) / 2);
            const sum = [];

            for(let i=0; i<piles.length; i++) {
                const numerator = Math.floor(piles[i] / mid);
                const remainder = piles[i] % mid ? 1: 0;
                sum.push(numerator + remainder);
            }

            const total = sum.reduce((acc, count) => acc += count, 0);

            if(total < h) {
                end  = mid - 1;
                res.push(mid);
            }

            if(total > h) {
                start = mid + 1;
            }

            if(total === h) {
                end = mid - 1;
                res.push(mid);
            }
        }

        res.sort((a,b) => a - b);
        return res[0];
    }
}
