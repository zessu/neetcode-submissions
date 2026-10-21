# Binary Tree Right Side View - LeetCode 199

## Problem Description

Given the `root` of a binary tree, imagine yourself standing on the **right side** of it. Return the values of the nodes you can see, ordered from **top to bottom**.

A node is visible from the right if it is the **rightmost node at its depth** among all nodes that exist at that depth. This is not the same as following right-child pointers: when a level has no node on the far right, a node in a left subtree can become visible.

## Examples

### Example 1:
```
Input: root = [1,2,3,null,5,null,4]
Output: [1,3,4]
```
**Explanation:** The tree has three levels.

```
        1
       / \
      2   3
       \    \
        5    4
```

- Depth 0: only `1` → visible.
- Depth 1: `2` and `3`; the rightmost is `3`.
- Depth 2: `5` (left child of `2`) and `4` (right child of `3`); the rightmost is `4`.

### Example 2:
```
Input: root = [1,2,3,4,null,null,null,5]
Output: [1,3,4,5]
```
**Explanation:** The visible nodes are not all right children.

```
        1
       / \
      2   3
     /
    4
   /
  5
```

- Depth 0: `1`.
- Depth 1: `2`, `3` → `3`.
- Depth 2: only `4` (left child of `2`) → `4`, even though it is a left child.
- Depth 3: only `5` (left child of `4`) → `5`.

### Example 3:
```
Input: root = [1,null,3]
Output: [1,3]
```
**Explanation:** `1` is the only node at depth 0, and `3` is the only node at depth 1.

### Additional Example:
```
Input: root = []
Output: []
```
**Explanation:** There is nothing to see from either side.

## Constraints

- The number of nodes in the tree is in the range `[0, 100]`.
- `-100 <= Node.val <= 100`

## Topics

- Tree
- Depth-First Search
- Breadth-First Search
- Binary Tree

## Company Tags

- Amazon
- Meta
- Google
- Microsoft

## Solution Approaches

### 1. Brute Force — Scan Once per Depth

**Intuition**: Compute the height of the tree, then for every depth `d` traverse the whole tree to find the rightmost node at that depth. The last node encountered at depth `d` in a left-to-right scan is the visible one.

**Algorithm**:
1. Compute the tree height `h` (a null tree has height 0).
2. For each depth `d` from `0` to `h - 1`:
   - Traverse the tree left-to-right, tracking the current depth.
   - Whenever a node at depth `d` is found, remember its value (overwrite it, so the last one wins).
3. Append the remembered value for each depth.

**Time Complexity**: `O(n · h)` — up to `h` full traversals.
**Space Complexity**: `O(h)` for the recursion stack (plus the `O(h)` output).

### 2. Breadth-First Search (Level Order)

**Intuition**: BFS visits nodes level by level, left to right. The last node dequeued on each level is exactly the rightmost node of that level.

**Algorithm**:
1. If `root` is null, return `[]`.
2. Put `root` in a queue.
3. While the queue is not empty:
   - Record `levelSize = queue.length`.
   - Process exactly `levelSize` nodes, appending each child to the queue.
   - The last node processed on this level is the visible node; push its value to the result.
4. Return the result.

**Time Complexity**: `O(n)` — each node enters and leaves the queue once.
**Space Complexity**: `O(w)` — the queue holds at most the maximum width `w` of the tree (`O(n)` worst case).

### 3. DFS, Right-First, Record First Visit per Depth

**Intuition**: Explore the right child before the left child. The first node reached at any depth is then guaranteed to be the rightmost node at that depth. Record it once and never overwrite.

**Algorithm**:
1. DFS with parameters `(node, depth)`.
2. If `node` is null, return.
3. If `depth === result.length`, this is the first node seen at this depth → push `node.val`.
4. Recurse on `node.right` with `depth + 1`.
5. Recurse on `node.left` with `depth + 1`.

**Time Complexity**: `O(n)` — every node is visited once.
**Space Complexity**: `O(h)` — recursion stack only; the output is `O(h)` as well.

### 4. DFS, Left-to-Right, Collect Every Level (Implemented)

**Intuition**: Traverse the tree left-to-right and group node values by depth in a 2D array. Within each level the values are appended in left-to-right order, so the **last** value of each group is the rightmost node. A final `map` extracts those last values.

**Algorithm**:
1. Call `traverse(root, result, 0)`.
2. In `traverse(node, result, level)`:
   - Return if `node` is null.
   - If `result.length === level`, append a new empty array for this level.
   - Push `node.val` onto `result[level]`.
   - Recurse left, then right, with `level + 1`.
3. After the traversal, map each level array to `arr[arr.length - 1]`.
4. Return the mapped array.

**Time Complexity**: `O(n)` — one visit per node plus one `O(1)` step per level.
**Space Complexity**: `O(n)` — every node value is stored in the 2D array (plus `O(h)` recursion). This is the main trade-off versus approach 3.

## Visual Explanation

```
root = [1,2,3,null,5,null,4]

            1          depth 0: [1]        -> rightmost 1
          /   \
         2     3      depth 1: [2, 3]     -> rightmost 3
          \     \
           5     4    depth 2: [5, 4]     -> rightmost 4

right side view = [1, 3, 4]
```

Left-to-right DFS fills the level buckets in this order:

```
visit 1  -> level 0: [1]
visit 2  -> level 1: [2]
visit 5  -> level 2: [5]
visit 3  -> level 1: [2, 3]   <- 3 appended last
visit 4  -> level 2: [5, 4]   <- 4 appended last

take the last of each bucket -> [1, 3, 4]
```

## Approach Comparison

| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| **Brute Force (per-depth scan)** | `O(n · h)` | `O(h)` | Simple idea, but revisits the tree for every level |
| **BFS Level Order** | `O(n)` | `O(w)` | Natural fit; queue size is the widest level |
| **DFS Right-First** | `O(n)` | `O(h)` | Optimal memory in practice; relies on right-before-left order |
| **DFS Left-to-Right, collect all** (implemented) | `O(n)` | `O(n)` | Simple and symmetric, but stores every node value |

## Common Pitfalls

1. **Right side view ≠ right-child chain**: in example 2, nodes `4` and `5` are visible even though they are left children. Always pick the rightmost *existing* node per depth.
2. **Overwriting vs first-visit**: in a left-to-right DFS, append each node and take the last value of the level. In a right-first DFS, take the **first** node seen at each depth and never overwrite.
3. **Depth indexing**: the root is depth `0` if the result index equals the depth; starting at `1` causes an off-by-one and an empty first slot.
4. **BFS level boundaries**: capture `queue.length` before the inner loop. Using the live length mixes levels.
5. **Empty tree**: return `[]`; do not dereference `root.val` before the null check.
6. **Extra memory in the implemented version**: every node value is retained even though only one value per level is needed. The result of `traverse` is `O(n)`, not `O(h)`.
