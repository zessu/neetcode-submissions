class Solution {
    minCoins(coins, sum) {
        // dp[amount] = fewest coins needed to make exactly `amount`
        const dp = new Array(sum + 1).fill(Infinity);
        dp[0] = 0;

        for (let amount = 1; amount <= sum; amount++) {
            for (const coin of coins) {
                if (coin <= amount && dp[amount - coin] + 1 < dp[amount]) {
                    dp[amount] = dp[amount - coin] + 1;
                }
            }
        }

        return dp[sum] === Infinity ? -1 : dp[sum];
    }
}
