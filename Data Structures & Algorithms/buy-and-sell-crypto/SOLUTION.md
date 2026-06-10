# Best Time to Buy and Sell Stock - Solution

## Solution Code

```javascript
class Solution {
    /**
     * @param {number[]} prices
     * @return {number}
     */
    maxProfit(prices) {
        let leftPtr = 0;
        let rightPtr = 1;
        let maxProfit = 0;

        while (rightPtr < prices.length) {
            if (prices[rightPtr] > prices[leftPtr]) {
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
```

## Approach

The solution uses a **two-pointer / sliding window** technique to track the best buy/sell pair in a single pass.

1. **Two pointers**: `leftPtr` points to the candidate buy day, `rightPtr` walks forward as the candidate sell day.
2. **Profit or pivot**: If the current right price is higher than the current left, we have a candidate profit — update `maxProfit`. Otherwise, the right price is a new valley, so we move the buy pointer to it.
3. **Single pass**: Both pointers only move forward; total work is linear in `n`.

- **Time Complexity**: `O(n)` — each element is visited once.
- **Space Complexity**: `O(1)` — only three variables.

## Walkthrough

```
Input: prices = [7, 1, 5, 3, 6, 4]

Initial: left=0, right=1, maxProfit=0

Step 1: prices[1]=1 < prices[0]=7
        → left = 1
        right=2

Step 2: prices[2]=5 > prices[1]=1, profit=4
        → maxProfit = 4
        right=3

Step 3: prices[3]=3 < prices[1]=1? No (3 > 1)
        profit would be 2 → maxProfit stays 4
        right=4

Step 4: prices[4]=6 > prices[1]=1, profit=5
        → maxProfit = 5
        right=5

Step 5: prices[5]=4 < prices[1]=1? No (4 > 1)
        profit would be 3 → maxProfit stays 5
        right=6 → loop ends

Output: 5 ✓
```

## Alternative: Brute Force

For completeness, the brute force approach is straightforward but quadratic:

```javascript
class Solution {
    maxProfit(prices) {
        let maxProfit = 0;
        for (let i = 0; i < prices.length; i++) {
            for (let j = i + 1; j < prices.length; j++) {
                maxProfit = Math.max(maxProfit, prices[j] - prices[i]);
            }
        }
        return maxProfit;
    }
}
```

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force** | $O(n^2)$ | $O(1)$ | Trivial to write and verify | TLE for $n \ge 10^4$ |
| **Two Pointers** | $O(n)$ | $O(1)$ | Single pass, easy to reason about | Slightly trickier `leftPtr` update |
| **Kadane's (Max Subarray)** | $O(n)$ | $O(1)$ | Elegant if you're already thinking in DP | Indirect mapping — less obvious from problem statement |

**Key Insight**: At each day, the only thing that matters is the minimum price seen so far. The two-pointer formulation captures this directly: when the right price is lower than the current left, the left pointer must move there because any future sell will be paired with that newer low. This invariant is what makes the algorithm correct in a single pass.
