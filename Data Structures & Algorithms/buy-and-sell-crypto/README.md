# Best Time to Buy and Sell Stock - LeetCode 121

## Problem Description

You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.

You want to maximize your profit by choosing a **single day** to buy a stock and a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If no profit is possible, return `0`.

## Examples

### Example 1:
```
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.
```

### Example 2:
```
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: No profitable transaction is possible, so the max profit is 0.
```

### Example 3:
```
Input: prices = [2,4,1]
Output: 2
Explanation: Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4 - 2 = 2.
```

## Constraints

- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^4`

## Topics

- Array
- Two Pointers
- Sliding Window
- Dynamic Programming
- Greedy

## Company Tags

- Amazon
- Facebook
- Microsoft
- Bloomberg
- Apple
- Google
- Uber

## Solution Approaches

### 1. Brute Force

**Intuition**: Check every possible pair of `(buy_day, sell_day)` where `buy_day < sell_day`, compute the profit, and track the maximum.

**Algorithm**:
1. Initialize `maxProfit = 0`.
2. For each `i` from `0` to `n - 2`:
   - For each `j` from `i + 1` to `n - 1`:
     - Compute `profit = prices[j] - prices[i]`.
     - Update `maxProfit = Math.max(maxProfit, profit)`.
3. Return `maxProfit`.

**Time Complexity**: `O(n²)` — every pair is considered.
**Space Complexity**: `O(1)`.

### 2. Sliding Window / Two Pointers (Optimal)

**Intuition**: We only ever need to know the **cheapest price seen so far** as the candidate buy price. At each step, profit is `current_price - min_so_far`. Track the running maximum. This is the classic "lowest valley / highest peak" sliding window.

**Algorithm**:
1. Set `leftPtr = 0`, `rightPtr = 1`, `maxProfit = 0`.
2. While `rightPtr < prices.length`:
   - If `prices[rightPtr] > prices[leftPtr]`: update `maxProfit = max(maxProfit, prices[rightPtr] - prices[leftPtr])`. Advance `rightPtr`.
   - Else: a new valley was found, so set `leftPtr = rightPtr` (cheaper buy candidate), then advance `rightPtr`.
3. Return `maxProfit`.

**Time Complexity**: `O(n)` — single pass.
**Space Complexity**: `O(1)`.

### 3. Kadane's Algorithm (Max Subarray)

**Intuition**: Convert prices into an array of daily differences `d[i] = prices[i] - prices[i-1]`. The maximum profit equals the maximum subarray sum of those differences (Kadane).

**Algorithm**:
1. Build `d[i] = prices[i] - prices[i-1]` for `i = 1..n-1`.
2. Run Kadane: track `currentMax = max(d[i], currentMax + d[i])` and `globalMax`.
3. Return `max(0, globalMax)` (clamp negatives to zero).

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(1)` if differences are computed on the fly.

## Visual Explanation

```
prices = [7, 1, 5, 3, 6, 4]

Two-pointer pass:
l=0 r=1: 1 < 7 → l=1
l=1 r=2: 5 > 1 → profit=4, maxProfit=4
l=1 r=3: 3 < 5 → (move on) maxProfit=4
l=1 r=4: 6 > 1 → profit=5, maxProfit=5
l=1 r=5: 4 < 6 → (move on) maxProfit=5

Output: 5 ✓
```

```
Valley-peak view:

     5 -
       |  /
       |/
 1 -   |    4
 | \   |   /
 |  \  |  /
 |   \ | /
 7    \|/      6
        3

Buy at the lowest valley (1) before the highest peak (6) → profit 5
```

## Common Pitfalls

1. **Selling before buying**: Ensure the `sell` index is always strictly greater than the `buy` index. The two-pointer version enforces this by only advancing `rightPtr`.
2. **Empty / single-element arrays**: Return `0` immediately — no transaction is possible.
3. **No-profit case**: Don't return a negative number; the maximum profit for a strictly down-trending series is `0`.
4. **Off-by-one on `leftPtr` update**: When you find a new low, set `leftPtr = rightPtr` (not `rightPtr + 1`); `rightPtr` is incremented in the next iteration.
5. **Overflow (in typed languages)**: `prices[i] - prices[j]` is safe here (`0..10^4`), but be cautious when adapting to other stock variants.
