# Binary Tree Maximum Path Sum - Solution

## Solution Code

The only submission is `submission-10.ts`.

```typescript
class Solution {
    res = -Infinity;

    getMax(root: TreeNode | null) {
        if(!root) return 0;
        let left = this.getMax(root.left);
        let right = this.getMax(root.right);
        let max = Math.max(left, right);
        const sum = left + right + root.val;
        this.res = Math.max(this.res, sum);
        return Math.max(0, root.val + max);
    }

    maxPathSum(root: TreeNode| null): number {
        this.getMax(root);
        return this.res;
    }
}
```

## Approach

The solution uses **post-order DFS with a global maximum**. It computes one value per node — the best downward gain — while separately considering the best path that bends at that node.

1. **Global answer**: `res` starts at `-Infinity`. This is essential: `0` would incorrectly win when every node is negative.
2. **Base case**: `getMax(null)` returns `0`, meaning an absent branch contributes nothing.
3. **Children first**: `left` and `right` are the maximum downward gains from the two subtrees, already clamped to be non-negative by the recursive return.
4. **Path bending at this node**: `sum = left + right + root.val` combines both branches. This is a complete path with the current node as its highest point, so it is a candidate for the global answer.
5. **Update the answer**: `res = Math.max(res, sum)`.
6. **Return one branch**: `Math.max(0, root.val + max(left, right))` is the best gain the parent can inherit. The parent can connect to only one side of this node, so the two branches must not be added together here. The outer `max(0, ...)` allows the parent to discard a losing branch.
7. **Answer**: after the traversal, `res` holds the best path found anywhere in the tree.

- **Time Complexity**: `O(n)` — each node is visited exactly once.
- **Space Complexity**: `O(h)` for the recursion stack, where `h` is the tree height (`O(n)` worst case for a chain, `O(log n)` for a balanced tree).

The two formulas are the heart of the problem:

```
candidate at node = node.val + left + right      // bend here, record it
return to parent  = max(0, node.val + max(left, right))  // continue upward on one side
```

## Walkthrough

### Example 1: `root = [1,2,3]`

```
        1
       / \
      2   3
```

```
getMax(2): left = 0, right = 0
           sum = 0 + 0 + 2 = 2, res = 2
           return max(0, 2 + 0) = 2

getMax(3): left = 0, right = 0
           sum = 3, res = 3
           return 3

getMax(1): left = 2, right = 3
           sum = 2 + 1 + 3 = 6, res = 6
           return max(0, 1 + 3) = 4
```

The best path is `2 -> 1 -> 3` with sum `6`. Note that the value returned to a hypothetical parent would be `4` (the `1 -> 3` branch), not `6`, because a parent cannot use both of `1`'s branches.

### Example 2: `root = [-10,9,20,null,null,15,7]`

```
              -10
              /  \
             9    20
                 /  \
                15   7
```

```
getMax(9):  left = 0,  right = 0   -> sum = 9,   res = 9,   return 9

getMax(15): left = 0,  right = 0   -> sum = 15,  res = 15,  return 15
getMax(7):  left = 0,  right = 0   -> sum = 7,   res = 15,  return 7

getMax(20): left = 15, right = 7
            sum = 15 + 20 + 7 = 42, res = 42
            return max(0, 20 + 15) = 35

getMax(-10): left = 9, right = 35
             sum = 9 + (-10) + 35 = 34, res stays 42
             return max(0, -10 + 35) = 25
```

The global answer is `42`, from the path `15 -> 20 -> 7`. The path through the root would be `9 + (-10) + 35 = 34`, which is worse because of the negative root.

### Additional Example: `root = [-3]`

```
getMax(-3): left = 0, right = 0
            sum = -3, res = -3
            return max(0, -3 + 0) = 0
```

The method returns `-3`. Initializing `res` to `0` would have produced the wrong answer `0`, which is not a valid non-empty path.

## Comparison with the Alternatives

| Approach | Time | Space | Trade-off |
| :--- | :--- | :--- | :--- |
| **Brute force** | `O(n^2)` worst | `O(h)` | Directly enumerates every apex, but recomputes downward gains over and over. On a chain of `3 * 10^4` nodes this is far too slow. |
| **Post-order DFS (implemented)** | `O(n)` | `O(h)` | Each gain is computed once and reused by the parent. The global maximum records paths that bend anywhere. |
| **Iterative post-order** | `O(n)` | `O(n)` | Same time complexity and no recursion limit, but needs a stack and a gain map. |

**Why the implemented approach is preferred:** it is the minimal single-pass solution. The recursive return value carries exactly the information the parent needs (the best one-sided gain), while the global `res` handles complete paths that cannot be extended upward. This separation is both efficient and easy to reason about.

**When an alternative wins:**

- **Brute force** is useful only for understanding the definition or for very small trees. It makes the "try every apex" idea concrete, but its repeated `gain()` calls are unnecessary.
- **Iterative post-order** is the safer choice for very deep, skewed trees. The constraint allows up to `30,000` nodes in a chain, which can exceed the JavaScript call stack. It trades `O(n)` auxiliary memory for that safety.
- A **two-value recursion** that returns both the downward gain and the best complete path is another valid `O(n)` alternative. It avoids mutable state, at the cost of a slightly more complex return type.

## Key Insights

1. **Every path has one apex.** At the apex, the path may use both children; everywhere else it uses at most one. This is why the code records `left + right + val` but returns only `val + max(left, right)`.
2. **Clamping negatives is a choice, not an obligation.** Returning `max(0, ...)` tells the parent "this branch is not worth taking." It works because an empty branch is allowed to contribute zero to a path that includes an ancestor.
3. **`-Infinity` matters.** It guarantees that the best single node is considered even when all values are negative.
4. **The global maximum is necessary.** The best path may not pass through the root, so it cannot be reconstructed from the root's return value alone.
5. **Instance state caveat**: `res` is a class field. LeetCode normally creates a fresh `Solution` per test case, but reusing one instance across calls would carry the previous answer into the next call. A reusable version should reset `res` in `maxPathSum` before calling `getMax`.
