# Path Sum - LeetCode 112

## Problem Description

Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a **root-to-leaf path** such that adding up all the values along the path equals `targetSum`.

A **leaf** is a node with no children. A path must start at the root and end at a leaf — stopping at an internal node does not count, even if the running sum already matches.

## Examples

### Example 1:
```
Input: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
Output: true
```
**Explanation:** The path `5 → 4 → 11 → 2` sums to `5 + 4 + 11 + 2 = 22`.

```
            5
           / \
          4   8
         /   / \
        11  13  4
       /  \      \
      7    2      1
```

### Example 2:
```
Input: root = [1,2,3], targetSum = 5
Output: false
```
**Explanation:** The only root-to-leaf paths are `1 → 2` (sum `3`) and `1 → 3` (sum `4`). Neither equals `5`.

### Example 3:
```
Input: root = [], targetSum = 0
Output: false
```
**Explanation:** An empty tree has no root-to-leaf path at all, so the answer is `false` even though the target is `0`. This is the most commonly missed edge case.

## Constraints

- The number of nodes in the tree is in the range `[0, 5000]`.
- `-1000 <= Node.val <= 1000`
- `-1000 <= targetSum <= 1000`

## Topics

- Tree
- Depth-First Search
- Breadth-First Search
- Binary Tree

## Company Tags

- Amazon
- Microsoft
- Meta
- Bloomberg

## Solution Approaches

### 1. Recursive DFS with a Running Sum (Implemented)

**Intuition**: Every root-to-leaf path is a sequence of decisions "go left" or "go right". A DFS carries the sum of the nodes on the current path down the recursion. When a leaf is reached, that running sum is the complete path sum, so one comparison decides the answer for that path. If either subtree reports success, the whole tree does.

**Algorithm**:
1. Define a helper `recurr(node, targetSum, counter)` where `counter` is the sum of all values on the path *above* `node`.
2. If `node` is `null`, return `false`.
3. Compute `newCount = counter + node.val`.
4. If `node` is a leaf (`!node.left && !node.right`) and `newCount === targetSum`, return `true`.
5. Otherwise return `recurr(node.left, ...) || recurr(node.right, ...)`, short-circuiting on the first success.
6. Call the helper with `counter = 0`.

**Time Complexity**: `O(n)` — each node is visited once; the `||` short-circuits once a path is found.
**Space Complexity**: `O(h)` — recursion stack, where `h` is the height (`O(log n)` balanced, `O(n)` skewed).

### 2. Iterative DFS with an Explicit Stack

**Intuition**: Recursion is just a stack. Store each pending node together with the remaining target for that path; the top of the stack is the path currently being explored. This avoids call-stack limits on deep trees.

**Algorithm**:
1. If `root` is `null`, return `false`.
2. Push `[root, targetSum - root.val]` onto a stack.
3. While the stack is not empty:
   - Pop `[node, remaining]`.
   - If `node` is a leaf, return `true` iff `remaining === 0`.
   - If `node.right` exists, push `[node.right, remaining - node.right.val]`.
   - If `node.left` exists, push `[node.left, remaining - node.left.val]`.
4. Return `false` if the stack empties.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(h)` in the average case, `O(n)` when the height is `O(n)`.

### 3. BFS with a Queue of `(node, remaining)` Pairs

**Intuition**: Breadth-first search explores paths level by level while carrying each path's remaining sum. Whenever a leaf is dequeued with `remaining === 0`, a valid path exists. This is a natural fit if you prefer level-order thinking, though it stores a whole frontier instead of a single path.

**Algorithm**:
1. If `root` is `null`, return `false`.
2. Initialize `queue = [[root, targetSum - root.val]]`.
3. While the queue is not empty:
   - Dequeue `[node, remaining]`.
   - If `node` is a leaf, return `true` iff `remaining === 0`.
   - Enqueue non-null children with `remaining - child.val`.
4. Return `false`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(w)` — the queue holds up to the widest level `w`. The output is not stored, so there is no `O(n)` result array.

## Visual Explanation

```
root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22

Running sum down the left spine:
  5            sum = 5
  └─ 4         sum = 9
     └─ 11     sum = 20
        ├─ 7   sum = 27   leaf, 27 != 22  -> false
        └─ 2   sum = 22   leaf, 22 == 22  -> TRUE

Right subtree:
  5 -> 8          sum = 13
       ├─ 13      sum = 26   leaf -> false
       └─ 4       sum = 17
           └─ 1   sum = 18   leaf -> false

The answer is found on the second path explored: 5 + 4 + 11 + 2 = 22
```

```
Call trace (short-circuit order):

recurr(5, 22, 0)
  newCount = 5
  recurr(4, 22, 5)
    newCount = 9
    recurr(11, 22, 9)
      newCount = 20
      recurr(7, 22, 20)   -> leaf, 27 != 22 -> false
      recurr(2, 22, 20)   -> leaf, 22 == 22 -> TRUE
  || short-circuits: the right subtree of 5 is never visited
```

## Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Recursive DFS + running sum** (implemented) | `O(n)` | `O(h)` | Short, only stores the current path, short-circuits | Stack depth can reach `n` |
| **Iterative DFS + stack** | `O(n)` | `O(h)` | No recursion limit, same path-local state | Manual stack bookkeeping |
| **BFS + queue** | `O(n)` | `O(w)` | Finds shallow answers quickly, level-order intuition | Holds an entire frontier; usually more memory than DFS |

## Common Pitfalls

1. **Checking the sum at internal nodes**: `5 + 4 + 11 = 20` is not a path end. The comparison must happen only when `!node.left && !node.right`.
2. **Returning `true` for `null` when `targetSum` is `0`**: an empty tree must return `false`. Never treat a null child as a completed path.
3. **Treating a one-child node as a leaf**: a node with only a left child is not a leaf; there is no valid path that stops there.
4. **Pruning on `sum > targetSum`**: values can be negative (`-1000 <= Node.val`), so a path can go above the target and come back down. Only leaf equality is a valid test.
5. **Mutating `targetSum` across sibling calls**: if you subtract into a shared variable instead of passing a new value/parameter, the two branches contaminate each other. Pass the updated sum as an argument.
6. **Using the node value as a "found" flag**: `0` is a legal node value; use explicit booleans, not truthiness of sums.
7. **Assuming a non-empty tree**: `root = []` with `targetSum = 0` is `false`, not `true`.
