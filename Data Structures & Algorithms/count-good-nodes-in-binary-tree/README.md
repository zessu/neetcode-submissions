# Count Good Nodes in Binary Tree - LeetCode 1448

## Problem Description

Given a binary tree `root`, a node `X` in the tree is named **good** if in the path from the root to `X` there are **no nodes with a value greater than** `X`.

Return the number of good nodes in the binary tree.

Equivalently, a node is good when its value is greater than or equal to the **maximum value seen on the path from the root up to and including that node**. The root is always good, because there are no other nodes on its path.

## Examples

### Example 1:
```
Input: root = [3,1,4,3,null,1,5]
Output: 4
```
**Explanation:** The good nodes are marked below.

```
            3          good (root; path max = 3)
          /   \
         1     4      left 1: 3 > 1, not good
        /     / \     right 4: 4 >= 3, good
       3     1   5     leaf 3: path [3,1,3], max 3 -> good
                        node 1: path [3,4,1], max 4 -> not good
                        leaf 5: path [3,4,5], max 5 -> good
```

The four good nodes are the root `3`, the leaf `3`, node `4`, and node `5`.

### Example 2:
```
Input: root = [3,3,null,4,2]
Output: 3
```
**Explanation:** The tree is:

```
        3        good (root)
       /
      3          good (3 >= 3)
     / \
    4   2        node 4: good (4 >= 3)
                 node 2: path [3,3,2], 3 > 2 -> not good
```

The good nodes are the root `3`, its left child `3`, and node `4`.

### Example 3:
```
Input: root = [1]
Output: 1
```
**Explanation:** The root is always good.

### Additional Example:
```
Input: root = [2,null,4,2,5]
Output: 3
```
**Explanation:** The tree is `2 → 4` on the right, with children `2` and `5` under `4`. The root `2` is good, `4` is good, `5` is good, and the left child `2` (path `[2,4,2]`) is **not** good because `4 > 2`. Total: `3`.

## Constraints

- The number of nodes in the tree is in the range `[1, 10^5]`.
- `-10^4 <= Node.val <= 10^4`

## Topics

- Tree
- Depth-First Search
- Breadth-First Search
- Binary Tree

## Company Tags

- Amazon
- Google
- Microsoft
- Meta

## Solution Approaches

### 1. Brute Force — Recompute the Maximum for Every Path

**Intuition**: For each node, explicitly collect the values on the path from the root to that node and take their maximum. If the node's value equals that maximum, it is good.

**Algorithm**:
1. DFS from the root while maintaining a `path` array of ancestor values.
2. On entering a node, push its value.
3. Compute `Math.max(...path)` and compare it with the node's value; count it if equal.
4. Recurse into both children, then pop the value (backtracking).
5. Return the count.

**Time Complexity**: `O(n · h)` — the path can be up to `h` long and is scanned at every node.
**Space Complexity**: `O(h)` for the recursion stack and path array.

### 2. Recursive DFS Carrying the Maximum (Implemented)

**Intuition**: The only information a subtree needs from its ancestors is the **maximum value on the path so far**. Pass that maximum downward. A node is good if `node.val >= maxSoFar`; then update the maximum with `Math.max(maxSoFar, node.val)` and pass it to both children.

**Algorithm**:
1. Call `dfs(root, root.val)` — the root's own value is the initial maximum, so the root is counted.
2. In `dfs(node, maxVal)`:
   - If `node` is null, return `0`.
   - `res = node.val >= maxVal ? 1 : 0`.
   - Update `maxVal = Math.max(maxVal, node.val)`.
   - Return `res + dfs(node.left, maxVal) + dfs(node.right, maxVal)`.
3. The returned value is the total count.

**Time Complexity**: `O(n)` — every node is visited once.
**Space Complexity**: `O(h)` — recursion stack (`O(log n)` balanced, `O(n)` worst case).

### 3. Breadth-First Search with `(node, maxSoFar)` Pairs

**Intuition**: The same state can travel through a queue instead of the call stack. Each queue entry carries a node and the maximum on the path that reached it.

**Algorithm**:
1. If `root` is null, return `0`.
2. Enqueue `[root, root.val]` and set `count = 0`.
3. While the queue is not empty:
   - Dequeue `[node, maxSoFar]`.
   - If `node.val >= maxSoFar`, increment `count`.
   - Compute `nextMax = Math.max(maxSoFar, node.val)`.
   - Enqueue `[node.left, nextMax]` and `[node.right, nextMax]` when those children exist.
4. Return `count`.

**Time Complexity**: `O(n)` — each node is enqueued and dequeued once.
**Space Complexity**: `O(w)` for the queue, where `w` is the maximum width of the tree (`O(n)` worst case). No recursion, so no call-stack risk.

## Visual Explanation

```
root = [3,1,4,3,null,1,5]

               3          max on path = 3   -> 3 >= 3  GOOD
             /   \
  max = 3  1       4  max = 3              -> 1 < 3   no
          /       /   \                    -> 4 >= 3  GOOD
 max = 3 3       1     5  max = 4          -> 3 >= 3  GOOD
                 ^     ^                   -> 1 < 4   no
                 |     |                   -> 5 >= 4  GOOD
        path max 4     path max 4

count = 1 (root) + 1 (leaf 3) + 1 (node 4) + 1 (node 5) = 4
```

The maximum only ever **increases** as the DFS descends. That monotonicity is why a single number is enough state to carry down the tree.

## Approach Comparison

| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| **Brute Force (path scan)** | `O(n · h)` | `O(h)` | Direct definition, but rescans the path at every node |
| **Recursive DFS + max** (implemented) | `O(n)` | `O(h)` | Optimal time; one value of state per call |
| **BFS + `(node, max)` queue** | `O(n)` | `O(w)` | No recursion; queue may hold a full level |

## Common Pitfalls

1. **Strictly greater vs greater-or-equal**: a node equal to the path maximum **is** good (`>=`). Using `>` undercounts.
2. **Update order**: compare with `maxVal` *before* updating it, otherwise every node trivially equals the new maximum and everything is counted as good.
3. **Pass the updated maximum to both children**: computing `Math.max` separately in each branch is fine, but passing the parent's stale value misses larger ancestors.
4. **The root is always good**: seeding with `root.val` handles this automatically. Seeding with `-Infinity` also works.
5. **Empty input**: constraints guarantee at least one node, so `root.val` is safe in the submission. A reusable helper should still guard `null`.
6. **Deep trees**: up to `10^5` nodes can form a chain. Recursive DFS may exceed the JavaScript call-stack limit; the BFS version avoids that.
7. **Negative values**: `-10^4` is a valid value, so do not initialize the maximum to `0`; use the root's value or `-Infinity`.
