class Solution {
    /**
     * @param {number[]} prices
     * @return {number}
     */
    maxProfit(prices) {
        let leftPtr = 0
        let rightPtr = 1;
        let maxProfit = 0;

        while(rightPtr < prices.length) {
            if(prices[rightPtr] > prices[leftPtr]) {
                const profit = prices[rightPtr] - prices[leftPtr];
                maxProfit = Math.max(maxProfit, profit);
            } else {
                leftPtr = rightPtr;
            }
            rightPtr++;
        }

        return maxProfit;
        
    }
}