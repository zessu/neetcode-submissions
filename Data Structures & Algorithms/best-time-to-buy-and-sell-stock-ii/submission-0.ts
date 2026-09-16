class Solution {
    /**
     * @param {number[]} prices
     * @return {number}
     */
    maxProfit(prices: number[]): number {
        let sum = 0;
        for(let count = 1; count < prices.length; count++) {
            if(prices[count] > prices[count-1]) {
                sum += prices[count] - prices[count - 1];
            }
        }
        return sum;
    }
}
 