# Same Tree - LeetCode 100

## Problem Description

Given the roots of two binary trees `p` and `q`, return `true` if they are the same tree, and `false` otherwise.

Two binary trees are considered the same if they are **structurally identical** and every pair of corresponding nodes has the **same value**. Structure matters: a value in a left child in one tree cannot match the same value in a right child of the other.

## Examples

### Example 1:
```
Input: p = [1,2,3], q = [1,2,3]
Output: true
```
**Explanation:** Both trees have root `1` with left child `2` and right child `3`.

```
   1          1
  / \        / \
 2   3      2   3
```

### Example 2:
```
Input: p = [1,2], q = [1,null,2]
Output: false
```
**Explanation:** Both trees contain the values `1` and `2`, but the shapes differ: `2` is a **left** child in `p` and a **right** child in `q`.

```
   1          1
  /            \
 2              2
```

### Example 3:
```
Input: p = [1,2,1], q = [1,1,2]
Output: false
```
**Explanation:** The shapes match, but the children are swapped: `p` has `2` on the left and `1` on the right, while `q` has `1` on the left and `2` on the right. Same multiset of values, different trees.

## Constraints

- The number of nodes in both trees is in the range `[0, 100]`.
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

### 1. Recursive Lockstep DFS (Implemented)

**Intuition**: Compare the two trees node by node, always standing on the "same position" in both. If both positions are empty, that branch matches. If only one is empty, the shapes differ. If both exist but values differ, the trees differ. Otherwise the current pair matches, and the answer is the AND of the left pairs and the right pairs.

**Algorithm**:
1. If `p` and `q` are both `null`, return `true` — two empty subtrees match.
2. If exactly one is `null`, or `p.val !== q.val`, return `false`.
3. Return `isSameTree(p.left, q.left) && isSameTree(p.right, q.right)`.

**Time Complexity**: `O(n)` — each node pair is compared once. `n` is the number of nodes in the smaller tree (the walk stops at the first structural mismatch).
**Space Complexity**: `O(h)` — recursion stack, where `h` is the height of the trees (`O(log n)` balanced, `O(n)` skewed).

### 2. Iterative DFS with an Explicit Stack

**Intuition**: Recursion stores pending node pairs on the call stack. Do the same explicitly: push each pair that still needs checking, pop one at a time, and reject as soon as a pair mismatches. This avoids the recursion limit on deep trees.

**Algorithm**:
1. Push the pair `[p, q]` onto a stack.
2. While the stack is not empty:
   - Pop `[a, b]`.
   - If `a` and `b` are both `null`, continue.
   - If exactly one is `null`, or `a.val !== b.val`, return `false`.
   - Push `[a.left, b.left]` and `[a.right, b.right]`.
3. If the stack empties with no mismatch, return `true`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(h)` in the average case, `O(n)` when the height is `O(n)` because pending sibling pairs accumulate along the current path.

### 3. BFS with a Queue of Pairs

**Intuition**: Compare the trees level by level instead of depth by depth. Each queue entry is a pair of nodes that must match; dequeue a pair, compare, and enqueue the corresponding children. BFS finds structural mismatches near the root quickly.

**Algorithm**:
1. Initialize `queue = [[p, q]]`.
2. While the queue is not empty:
   - Dequeue `[a, b]`.
   - If both are `null`, continue.
   - If one is `null` or values differ, return `false`.
   - Enqueue `[a.left, b.left]` and `[a.right, b.right]`.
3. Return `true`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(w)` — up to the widest frontier.

## Visual Explanation

```
Example 1: p = [1,2,3], q = [1,2,3]

        (1,1)                  compare values: 1 == 1
        /     \
   (2,2)       (3,3)           compare: 2 == 2, 3 == 3
   /   \       /   \
(null,null) ...                 all four null pairs match
                                => true

Example 2: p = [1,2], q = [1,null,2]

        (1,1)                  compare: 1 == 1
        /     \
   (2,null)   (null,2)         one side null, other exists
                                => false

Example 3: p = [1,2,1], q = [1,1,2]

        (1,1)                  compare: 1 == 1
        /     \
   (2,1)       (1,2)           values differ (2 != 1)
                                => false  (structure matches, values do not)
```

```
Recursive call tree for Example 1:

isSameTree(1, 1)
  true && isSameTree(2, 2) && isSameTree(3, 3)
             |                    |
             true                 true
  => true

For Example 2:
isSameTree(1, 1)
  isSameTree(2, null)  -> exactly one null -> false
  (short-circuits, right pair is never compared)
  => false
```

## Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Recursive DFS** (implemented) | `O(n)` | `O(h)` | Minimal code, mirrors the definition, short-circuits | Call-stack depth can reach `n` |
| **Iterative DFS** | `O(n)` | `O(h)` average, `O(n)` worst | No recursion limit, early exit | Manual pair bookkeeping |
| **BFS with pairs** | `O(n)` | `O(w)` | Finds shallow structural differences quickly | Frontier can be as wide as `n/2` |

## Common Pitfalls

1. **Comparing only values**: `p = [1,2]` and `q = [1,null,2]` contain the same values but are different trees. Position must be checked.
2. **Checking values before nulls**: accessing `p.val` when `p` is `null` throws. Check the null cases first.
3. **Using `||` instead of `&&` for the children**: both subtrees must match. Returning `true` when either side matches accepts partially different trees.
4. **Forgetting `p.val !== q.val`**: `if (p && q)` alone compares shape but not values, so `[1,2,1]` vs `[1,1,2]` would wrongly pass.
5. **Treating the two trees as independent traversals**: comparing a preorder list of `p` with a preorder list of `q` can work, but only if null markers are included; otherwise different shapes can produce identical lists.
6. **Comparing only level sizes**: Example 2 has identical level sizes (`1` at level 0, one child at level 1) but the child sits on different sides. A per-level size check cannot see that difference; positions must be compared.
7. **Empty trees**: `p = []` and `q = []` should return `true`. The base case handles it; an early `if (!p || !q) return false` does not.
