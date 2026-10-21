# Binary Tree Maximum Path Sum - LeetCode 124

## Problem Description

A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence is connected by an edge. A node can appear in the sequence **at most once**. The path does not need to pass through the root.

The **path sum** is the sum of the node values in the path.

Given the `root` of a binary tree, return the **maximum path sum** of any **non-empty** path.

Because a path cannot revisit a node, it can bend at most once: it goes up from one node to a highest node, then down into another branch. The highest node is often called the **apex** of the path.

## Examples

### Example 1:
```
Input: root = [1,2,3]
Output: 6
```
**Explanation:** The optimal path is `2 -> 1 -> 3`, with sum `2 + 1 + 3 = 6`. It bends at the root, using both children.

```
        1
       / \
      2   3
```

### Example 2:
```
Input: root = [-10,9,20,null,null,15,7]
Output: 42
```
**Explanation:** The optimal path is `15 -> 20 -> 7`, with sum `15 + 20 + 7 = 42`. It does not include the root `-10`, which would reduce the total to `34`.

```
       -10
       /  \
      9    20
          /  \
         15   7
```

### Additional Example:
```
Input: root = [-3]
Output: -3
```
**Explanation:** A path must contain at least one node, so the best (and only) path is the single node `-3`. Initializing the answer to `0` would incorrectly return `0`.

## Constraints

- The number of nodes in the tree is in the range `[1, 3 * 10^4]`.
- `-1000 <= Node.val <= 1000`

## Topics

- Dynamic Programming
- Tree
- Depth-First Search
- Binary Tree

## Company Tags

- Amazon
- Google
- Meta
- Microsoft
- Bloomberg

## Solution Approaches

### 1. Brute Force (Best Path Through Every Node)

**Intuition**: Every path has a unique highest node (its apex). If we try every node as the apex, the best path through that node is its value plus the best **downward** gain from its left child and the best downward gain from its right child. Negative gains are ignored. Take the maximum candidate over all nodes.

**Algorithm**:
1. Define `gain(node)` as the maximum sum of a downward path starting at `node` and going into at most one child:
   - Return `0` if `node` is `null`.
   - Return `node.val + max(0, gain(node.left), gain(node.right))`.
2. For every node `u`:
   - Compute `left = max(0, gain(u.left))` and `right = max(0, gain(u.right))`.
   - Candidate path through `u` is `u.val + left + right`.
   - Update the best answer.
3. Recursively apply step 2 to every node and return the best candidate.

**Time Complexity**: `O(n^2)` worst case — `gain()` walks a subtree for every node. It is `O(n log n)` for a balanced tree and `O(n^2)` for a skewed tree.
**Space Complexity**: `O(h)` for the recursion stack (`O(n)` worst case).

### 2. Post-order DFS with a Global Maximum (Implemented)

**Intuition**: The brute force recomputes the same downward gains repeatedly. Compute each node's best downward gain **once** in a post-order traversal, and while returning it, also consider the path that bends at that node using both children. A single global variable tracks the best path seen anywhere.

**Algorithm**:
1. Initialize `res = -Infinity` (not `0`, because all values may be negative).
2. Define `getMax(node)`:
   - Return `0` if `node` is `null`.
   - Recursively compute `left = getMax(node.left)` and `right = getMax(node.right)`. These values are already clamped to be non-negative.
   - The best path bending at this node is `left + right + node.val`; update `res` with it.
   - Return the best **single-branch** gain to the parent: `max(0, node.val + max(left, right))`. Clamping to `0` lets a parent ignore a loss-making branch entirely.
3. Call `getMax(root)` and return `res`.

**Time Complexity**: `O(n)` — each node is visited once.
**Space Complexity**: `O(h)` for the recursion stack.

### 3. Iterative Post-order with an Explicit Stack

**Intuition**: Avoid recursion by processing nodes bottom-up with an explicit stack and a map of computed gains. Push a node twice: once to expand its children, and once to process it after both children have been handled.

**Algorithm**:
1. If `root` is null, return `0`.
2. Push `[root, false]` onto a stack; create `gain = new Map()` and `best = -Infinity`.
3. While the stack is not empty:
   - Pop `[node, processed]`.
   - If not processed, push `[node, true]`, then push its non-null children with `false`.
   - Otherwise, read `left = max(0, gain.get(node.left) ?? 0)` and `right = max(0, gain.get(node.right) ?? 0)`.
   - Update `best = max(best, node.val + left + right)`.
   - Store `gain.set(node, node.val + max(left, right))`.
4. Return `best`.

**Time Complexity**: `O(n)` — each node is pushed twice and processed once.
**Space Complexity**: `O(n)` for the stack and the gain map.

## Visual Explanation

```
Tree: [-10,9,20,null,null,15,7]

              -10
              /  \
             9    20
                 /  \
                15   7

Downward gains (negative branches clamped to 0):
  gain(9)  = 9
  gain(15) = 15
  gain(7)  = 7
  gain(20) = 20 + max(15, 7) = 35

Best path with each apex:
  apex 9:  9
  apex 15: 15
  apex 7:  7
  apex 20: 15 + 20 + 7 = 42   <-- best
  apex -10: 9 + (-10) + 35 = 34

Answer: 42 (path 15 -> 20 -> 7)
```

The crucial distinction:

- **What we return to the parent**: a path that goes down **one** branch, because the parent can only connect to one side.
- **What we record as an answer**: a path that may use **both** branches, because the current node can be the apex where the path bends.

## Approach Comparison

| Approach | Time Complexity | Space Complexity | Notes |
| :--- | :--- | :--- | :--- |
| **Brute force** | `O(n^2)` worst | `O(h)` | Recomputes downward gains for every apex |
| **Post-order DFS** | `O(n)` | `O(h)` | Implemented; one pass, global maximum |
| **Iterative post-order** | `O(n)` | `O(n)` | Avoids recursion depth; explicit stack + map |

## Common Pitfalls

1. **Assuming the path passes through the root**: The best path can live entirely inside a subtree, as in Example 2 where `42` excludes the root `-10`.
2. **Returning both branches to the parent**: A path returned upward must use at most one child. Returning `node.val + left + right` would create a path that branches twice and is not a valid path.
3. **Forgetting to clamp negative gains**: Adding a negative subtree can only lower the sum. Use `max(0, gain)` so the parent can drop it.
4. **Initializing the answer to `0`**: For an all-negative tree, `0` is not a valid path. Use `-Infinity` and let the best single node win.
5. **Resetting the global maximum**: If `res` is a class field, initialize it once per `Solution` instance; resetting it inside the recursion would discard the best answer.
6. **Recursion depth**: Up to `3 * 10^4` nodes can form a chain. JavaScript call stacks may overflow; the iterative version is the safe fallback.
7. **Empty path**: The problem requires a **non-empty** path, so a single node is always a valid candidate.
