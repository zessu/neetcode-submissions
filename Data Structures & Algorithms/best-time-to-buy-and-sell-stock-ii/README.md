# Best Time to Buy and Sell Stock II - LeetCode 122

## Problem Description

You are given an integer array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.

On each day, you may decide to buy and/or sell the stock. You can only hold **at most one share** of the stock at any time. However, you can buy it and then immediately sell it on the same day (as long as you never hold more than one share).

Find and return the **maximum profit** you can achieve. If no profit is possible, return `0`.

## Examples

### Example 1:
```
Input: prices = [7,1,5,3,6,4]
Output: 7
```
**Explanation:**
- Buy on day 2 (price `1`) and sell on day 3 (price `5`): profit `5 - 1 = 4`.
- Buy on day 4 (price `3`) and sell on day 5 (price `6`): profit `6 - 3 = 3`.
- Total profit: `4 + 3 = 7`.
- Buying on day 1 (price `7`) would be a loss, so it is skipped.

### Example 2:
```
Input: prices = [1,2,3,4,5]
Output: 4
```
**Explanation:** Buy on day 1 (price `1`) and sell on day 5 (price `5`): profit `5 - 1 = 4`. You could also take `+1` on each of the four upward days; either way, the total is `4`.

### Example 3:
```
Input: prices = [7,6,4,3,1]
Output: 0
```
**Explanation:** Prices only fall, so every possible transaction loses money. Do nothing and return `0`.

## Constraints

- `1 <= prices.length <= 3 * 10^4`
- `0 <= prices[i] <= 10^4`

## Topics

- Array
- Dynamic Programming
- Greedy

## Company Tags

- Amazon
- Microsoft
- Bloomberg
- Apple

## Solution Approaches

### 1. Brute Force (Explore Every Choice)

**Intuition**: On each day, either you hold a share or you do not. If you hold, you can sell today (and then be free) or keep holding. If you are free, you can buy today or skip. Try both branches and take the maximum.

**Algorithm**:
1. Define `dfs(i, holding)` = maximum profit obtainable from day `i` onward.
2. If `i === n`, return `0`.
3. If `holding`:
   - Sell today: `prices[i] + dfs(i + 1, false)`.
   - Hold: `dfs(i + 1, true)`.
4. Otherwise:
   - Buy today: `-prices[i] + dfs(i + 1, true)`.
   - Skip: `dfs(i + 1, false)`.
5. Return the max of the two options.

**Time Complexity**: `O(2^n)` without memoization — each day branches twice.
**Space Complexity**: `O(n)` for the recursion stack.

### 2. Greedy: Sum the Positive Daily Changes (Implemented)

**Intuition**: Every profitable holding period can be decomposed into a sequence of adjacent day-to-day rises. If the price goes up from day `i - 1` to day `i`, we can capture exactly that increase by buying the previous day and selling today. Falling or flat days contribute nothing, so we simply ignore them. Because there are no transaction fees and at most one share is held at a time, collecting **every upward step** is optimal.

**Algorithm**:
1. Initialize `profit = 0`.
2. For each day `i` from `1` to `n - 1`:
   - If `prices[i] > prices[i - 1]`, add `prices[i] - prices[i - 1]` to `profit`.
3. Return `profit`.

**Time Complexity**: `O(n)` — one pass over the prices.
**Space Complexity**: `O(1)` — only a running total.

### 3. Peak-Valley Two Pointers

**Intuition**: Instead of looking at every day, jump directly from a local minimum (valley) to the next local maximum (peak), and add each peak-minus-valley difference. This is the same profit as the daily greedy method, expressed as explicit transactions.

**Algorithm**:
1. Set `i = 0` and `profit = 0`.
2. While `i < n - 1`:
   - Find a valley: while `i < n - 1` and `prices[i] >= prices[i + 1]`, increment `i`.
   - Record `buy = prices[i]`.
   - Find the next peak: while `i < n - 1` and `prices[i] <= prices[i + 1]`, increment `i`.
   - Add `prices[i] - buy` to `profit`.
3. Return `profit`.

**Time Complexity**: `O(n)` — each index is visited a constant number of times.
**Space Complexity**: `O(1)`.

### 4. Dynamic Programming (Hold / Cash States)

**Intuition**: Track the best profit achievable while **holding** a share and while **not holding** (cash). Each day, either keep the previous state or transition by buying/selling at today's price.

**Algorithm**:
1. Initialize `hold = -prices[0]` and `cash = 0`.
2. For each day `i` from `1` to `n - 1`:
   - `hold = max(hold, cash - prices[i])` — keep holding, or buy today.
   - `cash = max(cash, hold + prices[i])` — stay in cash, or sell today.
3. Return `cash`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(1)` when only the previous day's two states are kept; `O(n)` if a full `dp` table is stored.

## Visual Explanation

```
prices = [7, 1, 5, 3, 6, 4]

daily change:   -6   +4   -2   +3   -2
keep positive:         +4        +3

profit = 4 + 3 = 7

Transactions:
  buy day 2 @ 1  ->  sell day 3 @ 5   (+4)
  buy day 4 @ 3  ->  sell day 5 @ 6   (+3)

The falling edges (7->1, 5->3, 6->4) are never held through.
```

## Common Pitfalls

1. **This is not LeetCode 121.** You may complete as many transactions as you like here; limiting yourself to one buy/sell pair gives the wrong (smaller) answer.
2. **Only add positive differences.** Adding every difference (including negatives) just yields `prices[n - 1] - prices[0]` and is wrong for falling prices.
3. **Flat days add zero.** `prices[i] === prices[i - 1]` should be skipped; it is harmless either way but is not a profit.
4. **Same-day buy/sell is allowed.** There is no need to force at least one day between selling and buying.
5. **You cannot hold two shares at once.** The daily-greedy decomposition is valid precisely because selling before buying the next share is always possible; it never assumes overlapping positions.
6. **Return `0`, not a negative number.** If prices never rise, the best strategy is to make no transactions.
7. **Prices may be `0`.** Initializing profit to `0` (rather than to `-Infinity`) is correct because doing nothing is always allowed.

## Approach Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force (DFS)** | `O(2^n)` | `O(n)` | Explores the full decision tree; easy to define | Exponential; only usable for tiny inputs |
| **Greedy Daily Sum** | `O(n)` | `O(1)` | Shortest correct solution; one pass | Requires the insight that adjacent rises compose |
| **Peak-Valley** | `O(n)` | `O(1)` | Explicit buy/sell pairs; intuitive visually | More pointer bookkeeping and edge cases |
| **Dynamic Programming** | `O(n)` | `O(1)` | Generalizes to fees, cooldowns, and one-transaction limits | More state to maintain than the greedy sum |
