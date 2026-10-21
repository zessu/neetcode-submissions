# Binary Tree Level Order Traversal - LeetCode 102

## Problem Description

Given the `root` of a binary tree, return the **level order traversal** of its nodes' values — that is, from left to right, level by level.

The result is a list of lists: the first inner list holds the root, the next holds all nodes at depth 1 (left to right), and so on. An empty tree produces an empty list.

## Examples

### Example 1:
```
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
```
**Explanation:** Level 0 contains `3`. Level 1 contains `9` and `20`. Level 2 contains `15` and `7`. Each level becomes its own inner array, ordered left to right.

```
        3
       / \
      9  20
         /  \
        15   7
```

### Example 2:
```
Input: root = [1]
Output: [[1]]
```
**Explanation:** A single-node tree has exactly one level.

### Example 3:
```
Input: root = []
Output: []
```
**Explanation:** There are no nodes, so there are no levels. Note that the answer is `[]`, **not** `[[]]`.

## Constraints

- The number of nodes in the tree is in the range `[0, 2000]`.
- `-1000 <= Node.val <= 1000`

## Topics

- Tree
- Breadth-First Search
- Depth-First Search
- Binary Tree

## Company Tags

- Amazon
- Microsoft
- Meta
- Bloomberg

## Solution Approaches

### 1. BFS with a Level-Size Loop (Optimal Iterative)

**Intuition**: A queue visits nodes in exactly level order: when a node is dequeued, its children are appended at the back. The only trick is knowing where one level ends. Snapshotting `queue.length` *before* processing a level tells us exactly how many nodes belong to the current level; everything appended during those iterations belongs to the next level.

**Algorithm**:
1. If `root` is `null`, return `[]`.
2. Initialize `queue = [root]` and `result = []`.
3. While `queue` is not empty:
   - Set `levelSize = queue.length` and `level = []`.
   - Repeat `levelSize` times: dequeue a node, push `node.val` into `level`, and enqueue its non-null left and right children.
   - Push `level` into `result`.
4. Return `result`.

**Time Complexity**: `O(n)` — every node is enqueued and dequeued once.
**Space Complexity**: `O(w)` — the queue holds at most the widest level, `w ≤ n`. The output itself is `O(n)`.

### 2. Recursive DFS with a Level Index (Implemented)

**Intuition**: Traversal order and grouping order are separate concerns. A preorder DFS reaches every node exactly once and knows its depth from the recursion. If we pass the depth down and grow `result` on demand, we can append each value directly into `result[depth]` — no queue required. Left-before-right recursion guarantees left-to-right ordering within a level.

**Algorithm**:
1. Create an empty `result`.
2. Call `traverse(root, result, 0)`.
3. In `traverse(node, result, level)`:
   - If `node` is `null`, return.
   - If `result.length === level`, append a new empty array (first visit to this depth).
   - Push `node.val` into `result[level]`.
   - Recurse into `node.left` with `level + 1`, then `node.right` with `level + 1`.

**Time Complexity**: `O(n)` — each node causes one call and one push.
**Space Complexity**: `O(h)` auxiliary recursion stack (`h` = height), plus `O(n)` for the returned structure. This is `O(n)` in the worst case for a skewed tree.

### 3. BFS with `(node, depth)` Pairs

**Intuition**: Instead of measuring level boundaries, store the depth alongside each node in the queue. When a node is dequeued, use its depth to decide which inner array it belongs to. This makes the "which level am I on?" question explicit and works even if the queue contains nodes from several levels.

**Algorithm**:
1. If `root` is `null`, return `[]`.
2. Initialize `queue = [[root, 0]]` and `result = []`.
3. While `queue` is not empty:
   - Dequeue `[node, depth]`.
   - If `result.length === depth`, append a new empty array.
   - Push `node.val` into `result[depth]`.
   - Enqueue `[node.left, depth + 1]` and `[node.right, depth + 1]` for non-null children.
4. Return `result`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(w)` for the queue, but each entry is a pair, so the constant factor is larger than plain BFS. The output is `O(n)`.

## Visual Explanation

```
Tree:  [3, 9, 20, null, null, 15, 7]

DFS preorder (implemented):        BFS queue evolution:
  3  (level 0)                     queue=[3]          -> level 0: [3]
  |                                queue=[9,20]       -> level 1: [9,20]
  +-- 9  (level 1)                 queue=[15,7]       -> level 2: [15,7]
  +-- 20 (level 1)
      +-- 15 (level 2)             result grows on demand:
      +-- 7  (level 2)             result[0] = [3]
                                   result[1] = [9,20]
DFS visits 3, 9, 20, 15, 7 but     result[2] = [15,7]
writes each value into the array
indexed by its depth.
```

```
Step-by-step DFS on Example 1:

traverse(3, [], 0)   result.length(0) === level(0) -> push []
                     result[0] = [3]
  traverse(9, ..., 1)  push [] -> result[1] = [9]
    traverse(null, ..., 2) return
    traverse(null, ..., 2) return
  traverse(20, ..., 1) result[1] = [9, 20]
    traverse(15, ..., 2) push [] -> result[2] = [15]
    traverse(7, ..., 2)  result[2] = [15, 7]

Return [[3], [9, 20], [15, 7]]
```

## Comparison of Approaches

| Approach | Time | Space (auxiliary) | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **BFS + level-size loop** | `O(n)` | `O(w)` | True level order, no depth bookkeeping, iterative | Needs a queue; must snapshot `length` |
| **Recursive DFS + level index** | `O(n)` | `O(h)` | Very short, no queue, natural for tree recursion | Recursion depth can reach `n`; relies on output array to store levels |
| **BFS + `(node, depth)` pairs** | `O(n)` | `O(w)` | Explicit depth, tolerant of multi-level queues | Extra tuple allocation and depth checks |

## Common Pitfalls

1. **Returning `[[]]` for an empty tree**: the guard must return `[]` before any level array is created. A "push an empty level, then fill it" pattern is a common source of this bug.
2. **Forgetting to snapshot the level size**: writing `for (let i = 0; i < queue.length; i++)` re-reads the growing length and mixes levels together. Capture `const levelSize = queue.length` first.
3. **Enqueuing `null` children**: pushing `null` and filtering later works but wastes space and can produce empty levels. Skip nulls when enqueuing.
4. **Using `result.push([node.val])` instead of `result[level].push(...)`** in the DFS version — that creates a new level per node rather than per depth.
5. **Trusting `if (result[level])`**: an empty array is truthy, but a missing entry is `undefined`. The reliable check is `result.length === level` (levels are always created in order).
6. **Confusing `null` values with node values**: in the LeetCode array format, `null` marks a missing child. When building a test tree, `0` is a valid node value and must not be treated as `null`.
7. **Recursion depth**: the recursive version uses `O(h)` stack; a degenerate tree with 2000 nodes is fine here, but on larger constraints an iterative BFS avoids stack limits.
