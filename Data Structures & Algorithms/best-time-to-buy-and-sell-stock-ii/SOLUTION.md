# Best Time to Buy and Sell Stock II - Solution

## Solution Code

```typescript
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
```

## Approach

The solution uses a **greedy** strategy: capture every positive day-to-day price change.

1. **Decompose a holding period.** If you buy at price `a` and later sell at price `c`, the profit `c - a` equals the sum of the adjacent changes along the way. For prices `a, b, c`, this is `(b - a) + (c - b) = c - a`.
2. **Ignore unprofitable days.** Any day where `prices[i] <= prices[i - 1]` adds nothing. Skipping it is equivalent to not holding the stock across that day.
3. **Add every rise.** For each `i` from `1` to `n - 1`, if today's price is higher than yesterday's, add the difference to `sum`.
4. **Return the accumulated profit.** The result is the maximum total profit because each upward segment is captured exactly once and no downward segment is ever counted.

- **Time Complexity**: `O(n)`, where `n = prices.length` — a single linear scan.
- **Space Complexity**: `O(1)` — only the running profit is stored.

## Walkthrough

### Example 1: `prices = [7,1,5,3,6,4]`

| Day `i` | Price | Previous | Change | Positive? | `sum` after |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 | 7 | `-6` | No | 0 |
| 2 | 5 | 1 | `+4` | Yes | 4 |
| 3 | 3 | 5 | `-2` | No | 4 |
| 4 | 6 | 3 | `+3` | Yes | 7 |
| 5 | 4 | 6 | `-2` | No | 7 |

The positive changes correspond to these transactions:
- Buy at `1` (day 2), sell at `5` (day 3): `+4`.
- Buy at `3` (day 4), sell at `6` (day 5): `+3`.

Total: `7`.

### Example 2: `prices = [1,2,3,4,5]`

Every adjacent change is `+1`, so the loop adds `1 + 1 + 1 + 1 = 4`. This is equivalent to buying at `1` and selling at `5` (`5 - 1 = 4`), or to four separate one-day trades.

### Example 3: `prices = [7,6,4,3,1]`

Every adjacent change is negative, so no addition is made and the function returns `0`. The best action is to make no transactions.

### Edge case: `prices = [5]`

The loop starts at index `1`, which is not less than `prices.length`, so it never runs. The function returns `0`, which is correct: there is no day on which to sell.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is / is not preferred |
| :--- | :--- | :--- | :--- |
| **Greedy Daily Sum (implemented)** | `O(n)` | `O(1)` | Optimal and minimal: one pass, one variable, no transaction reconstruction needed. This is the preferred solution when there are no fees or cooldowns. |
| **Peak-Valley** | `O(n)` | `O(1)` | Produces the same answer and explicitly identifies buy/sell pairs. It is better when you must *report* the transactions, but it has more pointer edge cases. |
| **Dynamic Programming** | `O(n)` | `O(1)` | More general: it extends naturally to transaction fees, cooldowns, or a limit on the number of transactions. It is overkill for this version. |
| **Brute Force (DFS)** | `O(2^n)` | `O(n)` | Useful only as a conceptual baseline. It explores every buy/sell/skip combination and is far too slow for `n = 3 * 10^4`. |

**Why the implemented approach is preferred**: with unlimited transactions and no fees, the optimal strategy is to be holding the stock exactly during every upward segment and in cash during every downward segment. The daily greedy sum captures precisely those segments without tracking a position, a buy price, or transaction boundaries. It is also the least error-prone implementation.

**When an alternative wins**:
- **Peak-Valley** is preferable if the output must include the actual transactions, not just the profit.
- **Dynamic programming** is the right tool as soon as the rules change: a fixed fee per transaction, a mandatory cooldown day, or a cap on the number of trades. The daily greedy sum silently assumes none of those constraints.
- The **brute force** is only useful to validate the greedy insight on small arrays.

## Key Insights

1. **Profit telescopes.** `(p2 - p1) + (p3 - p2) = p3 - p1`, so a multi-day hold is exactly the sum of its daily changes.
2. **Only rises matter.** A fall between two rises does not reduce the total because you can sell before the fall and buy back afterward.
3. **No position tracking is needed.** The greedy loop never asks "am I holding?" — it merely counts upward edges. The ability to sell and rebuy on adjacent days makes this valid.
4. **Same-day trading is harmless.** A zero-length hold adds zero profit, so allowing it does not change the optimum.
5. **The answer is never negative.** `sum` starts at `0`, and only positive differences are added; doing nothing is always an option.
6. **This greedy is not universal.** It works because transactions are unlimited and free. For LeetCode 121 (one transaction), you need a running minimum price instead.
