# Count Good Nodes in Binary Tree - Solution

## Solution Code

```javascript
class Solution {
    goodNodes(root) {
        return this.dfs(root, root.val);
    }

    dfs(node, maxVal) {
        if (!node) {
            return 0;
        }

        let res = node.val >= maxVal ? 1 : 0;
        maxVal = Math.max(maxVal, node.val);
        res += this.dfs(node.left, maxVal);
        res += this.dfs(node.right, maxVal);
        return res;
    }
}
```

## Approach

The solution uses **recursive depth-first search with the path maximum carried as an argument**.

1. **Seed the maximum with the root's value**: `this.dfs(root, root.val)`. This makes the root count as good, since `root.val >= root.val` is always true.
2. **Base case**: a `null` node contributes `0` good nodes.
3. **Test the current node**: `node.val >= maxVal ? 1 : 0`. The comparison is `>=`, so a value equal to the largest ancestor is good.
4. **Update the maximum**: `maxVal = Math.max(maxVal, node.val)`. This happens *after* the test, so the node is judged against its ancestors, not against itself.
5. **Recurse**: add the counts from the left and right subtrees, both receiving the updated maximum.
6. **Return the sum**: each call returns the number of good nodes in its subtree, so the root call returns the total.

The key observation is that a subtree only needs one value from the outside world: the largest value on the path above it. Everything else is local.

- **Time Complexity**: `O(n)` — every node is visited exactly once and does `O(1)` work.
- **Space Complexity**: `O(h)` — the recursion stack, where `h` is the tree height. This is `O(log n)` for a balanced tree and `O(n)` for a chain.

## Walkthrough

### Example 1: `root = [3, 1, 4, 3, null, 1, 5]`

```
            3
          /   \
         1     4
        /     / \
       3     1   5
```

| Call | `maxVal` on entry | Test | Return value |
| :--- | :--- | :--- | :--- |
| `dfs(3)` | `3` | `3 >= 3` → 1 | `1 + left + right` |
| `dfs(1)` (left) | `3` | `1 >= 3` → 0 | `0 + dfs(3) + 0` |
| `dfs(3)` (left-left) | `3` | `3 >= 3` → 1 | `1` |
| `dfs(4)` (right) | `3` | `4 >= 3` → 1 | `1 + dfs(1) + dfs(5)` |
| `dfs(1)` (under 4) | `4` | `1 >= 4` → 0 | `0` |
| `dfs(5)` | `4` | `5 >= 4` → 1 | `1` |

Unwinding:

- Leaf `3` returns `1`; node `1` returns `1`.
- Node `4` returns `1 + 0 + 1 = 2`.
- Root returns `1 + 1 + 2 = 4`.

**Output:** `4`.

### Example 2: `root = [3, 3, null, 4, 2]`

```
        3
       /
      3
     / \
    4   2
```

| Node | Path | Path maximum | Good? |
| :--- | :--- | :--- | :--- |
| `3` (root) | `[3]` | `3` | Yes |
| `3` (left) | `[3, 3]` | `3` | Yes (equal counts) |
| `4` | `[3, 3, 4]` | `4` | Yes |
| `2` | `[3, 3, 2]` | `3` | No (`3 > 2`) |

**Output:** `3`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it might be chosen |
| :--- | :--- | :--- | :--- |
| **Recursive DFS + max** (implemented) | `O(n)` | `O(h)` | Single pass with minimal state; the path maximum is exactly the only ancestor information needed. Short and fast. |
| **Brute Force (path scan)** | `O(n · h)` | `O(h)` | Closest to the literal definition: build the path and take its maximum. Useful for understanding, but it rescans ancestors at every node and degrades to `O(n^2)` on a chain. |
| **BFS + `(node, max)` queue** | `O(n)` | `O(w)` | Avoids recursion entirely, which matters when a `10^5`-node chain would overflow the call stack. Memory grows with the widest level instead of the height. |

**Why the recursive approach is preferred here**: the solution is a single top-down pass with one extra parameter. It reads almost like the definition — "the node is good if it is at least the maximum so far, then recurse" — and it uses less memory than BFS on the typical balanced tree (`O(log n)` versus up to `O(n)`).

**When an alternative wins**:

- **Deep/skewed trees**: a chain of up to `10^5` nodes gives recursion depth `10^5`, which can blow the JavaScript stack. BFS spreads storage across a queue on the heap and is the safer production choice.
- **Teaching the definition**: the brute-force path scan is the most literal implementation and makes the "no greater ancestor" rule obvious. It is only acceptable for small trees.
- **Breadth-oriented processing**: if the algorithm already works level by level, adding the max to each queue entry avoids a second pass or a stack.

## Key Insights

1. **Only the path maximum matters**: the set of ancestor values can be summarized by its maximum. If the max is `<= node.val`, no ancestor is greater.
2. **Monotonic state**: the carried maximum never decreases, so no backtracking or undo is needed (unlike a path array).
3. **`>=` is intentional**: equal values are good. This is the difference between example 2 returning `3` and returning `2`.
4. **Test before update**: if `maxVal` were updated first, every node would compare equal to itself and the answer would always be `n`.
5. **Root initialization**: passing `root.val` instead of `-Infinity` works because the root has no ancestors; both choices count the root.
