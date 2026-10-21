# Majority Element II - LeetCode 229

## Problem Description

Given an integer array `nums` of size `n`, find all elements that appear **more than** `⌊n / 3⌋` times.

You may return the answer in any order.

The key word is *more than*: an element must occur **strictly more** than one third of the array, not at least one third. Because `⌊n / 3⌋` is an integer, this is the same as requiring `count > n / 3`.

A useful consequence: **at most two elements** can satisfy this condition. If three elements each appeared more than `n / 3` times, their counts would sum to more than `n`, which is impossible.

## Examples

### Example 1:

```
Input: nums = [3,2,3]
Output: [3]
```

**Explanation:** `n = 3`, so `⌊n / 3⌋ = 1`. The value `3` appears twice, which is more than 1. The value `2` appears once, which is not more than 1. Only `3` qualifies.

### Example 2:

```
Input: nums = [1]
Output: [1]
```

**Explanation:** `n = 1`, so `⌊n / 3⌋ = 0`. The only element appears once, which is more than 0. A single-element array always returns that element.

### Example 3:

```
Input: nums = [1,2]
Output: [1,2]
```

**Explanation:** `n = 2`, so `⌊n / 3⌋ = 0`. Each value appears once, and one occurrence is more than zero, so **both** qualify. This is the edge case that surprises people: for very small arrays, every distinct value can be part of the answer.

### Example 4:

```
Input: nums = [1,1,1,3,3,2,2,2]
Output: [1,2]
```

**Explanation:** `n = 8`, so `⌊n / 3⌋ = 2`. `1` appears three times and `2` appears three times; both are more than 2. `3` appears only twice, so it does not qualify.

## Constraints

- `1 <= nums.length <= 5 * 10^4`
- `-10^9 <= nums[i] <= 10^9`

**Follow-up:** Could you solve the problem in linear time and in `O(1)` space?

## Topics

- Array
- Hash Table
- Counting
- Sorting
- Boyer-Moore Voting Algorithm

## Company Tags

- Amazon
- Google
- Adobe
- Microsoft

## Solution Approaches

### 1. Brute Force (Count Every Element Independently)

**Intuition**: The definition is literally "count how many times each value appears". Start with the most direct translation: for each element, walk the whole array and count its occurrences.

**Algorithm**:
1. For each index `i`, scan `nums` from start to end and count how many entries equal `nums[i]`.
2. If that count is greater than `n / 3`, record `nums[i]`.
3. Use a set to avoid adding the same value multiple times (once per occurrence).
4. Return the recorded values.

**Time Complexity**: `O(n^2)` — `n` elements each trigger a full `n`-element scan.
**Space Complexity**: `O(1)` extra (the output set is not counted; with the output it is `O(1)` because at most two values qualify).

### 2. Hash Map Counting (Implemented)

**Intuition**: Instead of rescanning for every element, make one pass and maintain a running frequency for each value. As soon as a value's count crosses the `n / 3` threshold, it can never drop back below it, so it can be added to the result immediately.

**Algorithm**:
1. Compute `target = n / 3`. Because counts are integers, `count > target` is equivalent to `count > ⌊n / 3⌋`.
2. Walk the array once, incrementing `map[value]`.
3. After each increment, if the new count is `> target`, add the value to a result set.
4. Convert the set to an array and return it.

**Time Complexity**: `O(n)` — one pass, `O(1)` average map operations.
**Space Complexity**: `O(n)` — the map can hold up to `n` distinct values (the result set holds at most 2).

### 3. Sorting + Run Lengths

**Intuition**: After sorting, equal values sit next to each other. A value that appears more than `n / 3` times must therefore occupy a contiguous run longer than `n / 3`.

**Algorithm**:
1. Sort a copy of `nums` (or sort in place if mutation is allowed).
2. Walk through the sorted array, measuring the length of each run of equal values.
3. If a run length exceeds `n / 3`, add that value to the result.
4. Return the result.

**Time Complexity**: `O(n log n)` — dominated by sorting.
**Space Complexity**: `O(1)` extra if sorted in place (the sort itself may use `O(log n)` stack space); `O(n)` if a copy is made.

### 4. Boyer-Moore Voting with Two Candidates (Optimal)

**Intuition**: The classic majority-vote algorithm generalizes from "more than half" to "more than a third". Since at most two values can exceed `n / 3`, we track **two** candidates with two counters. When a new value matches neither candidate and both counters are positive, it cancels one occurrence of each candidate — the "votes" of three different values annihilate each other. Values that survive as candidates are the only possible answers, but they are not guaranteed, so a verification pass is required.

**Algorithm**:
1. Initialize `candidate1`, `candidate2`, `count1 = 0`, `count2 = 0`.
2. For each `x` in `nums`:
   - If `x === candidate1`, increment `count1`.
   - Else if `x === candidate2`, increment `count2`.
   - Else if `count1 === 0`, set `candidate1 = x`, `count1 = 1`.
   - Else if `count2 === 0`, set `candidate2 = x`, `count2 = 1`.
   - Else decrement both counters.
3. Verify: count the real occurrences of `candidate1` and `candidate2`; keep only those with `count > n / 3`.

**Time Complexity**: `O(n)` — two passes.
**Space Complexity**: `O(1)` — four variables.

## Comparison of Approaches

| Approach | Time | Space | In one pass? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Brute Force | `O(n^2)` | `O(1)` | No | Simple but times out at `n = 5 * 10^4` |
| **Hash Map (implemented)** | `O(n)` | `O(n)` | Yes | Simple and fast; uses memory proportional to distinct values |
| Sorting + runs | `O(n log n)` | `O(1)`* | No | Elegant, but sorting does more work than necessary |
| Boyer-Moore (optimal) | `O(n)` | `O(1)` | No (needs verification pass) | Meets the `O(1)`-space follow-up; trickier to reason about |

\* extra space only; an in-place sort may use `O(log n)` recursion/stack space.

## Visual Explanation

```
nums = [1, 1, 1, 3, 3, 2, 2, 2]      n = 8,  n/3 = 2.67  ->  need count >= 3

value:   1  1  1  3  3  2  2  2
count:   1  2  3  1  2  1  2  3
                  ^           ^
            1 passes 3   2 passes 3       3 only reaches 2 -> excluded

Answer: [1, 2]
```

Boyer-Moore phase (two candidates, cancellation):

```
x   c1  n1  c2  n2   action
1   1   1   -   0    c1 empty -> take 1
1   1   2   -   0    1 == c1  -> n1++
1   1   3   -   0    1 == c1  -> n1++
3   1   3   3   1    c2 empty -> take 3
3   1   3   3   2    3 == c2  -> n2++
2   1   2   3   1    new value, both full -> cancel one each
2   1   1   3   0    new value, both full -> cancel one each
2   1   1   2   1    c2 empty -> take 2

Candidates: 1 and 2. Verify against the array: 1 -> 3 (> 2.67), 2 -> 3 (> 2.67).
Answer: [1, 2]
```

## Common Pitfalls

1. **`>` versus `>=`**: The condition is *strictly* more than `n / 3`. An element appearing exactly `⌊n / 3⌋` times must be excluded. In the implemented code the threshold is the float `n / 3`, and integer counts are compared with `>`.
2. **Using `⌊n / 3⌋ + 1` inconsistently**: `count > n / 3` and `count > Math.floor(n / 3)` are equivalent for integer counts, but mixing `>=` with a floor can silently include exact one-third counts.
3. **Small-array edge cases**: For `n = 1` or `n = 2`, `⌊n / 3⌋ = 0`, so *every* distinct value qualifies. `[1,2]` must return `[1,2]`, not an empty array.
4. **Forgetting the verification pass in Boyer-Moore**: The surviving candidates are only *candidates*. With `[1,2,3,4]` the algorithm can leave arbitrary survivors that do not exceed `n / 3`; always recount before returning.
5. **Adding duplicates**: A value crosses the threshold exactly once, but a naive brute-force loop would add it once per occurrence. Use a set (as the implementation does) or check before pushing.
6. **Assuming at most one answer**: Unlike LeetCode 169, there can be two valid answers. Do not stop after finding the first one.
7. **Mutating the input unnecessarily**: The hash-map solution never reorders `nums`, which matters if the caller still needs the original ordering. The sorting approach would destroy it unless you copy first.
