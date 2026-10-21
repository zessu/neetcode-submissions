# Lowest Common Ancestor of a Binary Search Tree - LeetCode 235

## Problem Description

Given a **binary search tree (BST)**, find the **lowest common ancestor (LCA)** node of two given nodes `p` and `q` in the BST.

The lowest common ancestor is defined as the lowest node in the tree that has **both** `p` and `q` as descendants, where a node is allowed to be a descendant of itself.

Because the input is a BST, values in a node's left subtree are strictly smaller and values in its right subtree are strictly larger. That ordering means we never have to search both subtrees.

## Examples

### Example 1:
```
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
```
**Explanation:** `2` lies in the left subtree of `6` and `8` lies in the right subtree. Their paths diverge at `6`, so `6` is the lowest node that contains both.

```
          6
        /   \
       2     8
      / \   / \
     0   4 7   9
        / \
       3   5
```

### Example 2:
```
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
Output: 2
```
**Explanation:** Both nodes are on the left side of `6`, so the answer is inside the left subtree. At node `2`, `p` equals the current node and `q = 4` is in its right subtree. Since a node counts as its own descendant, `2` is the LCA.

### Example 3:
```
Input: root = [2,1], p = 2, q = 1
Output: 2
```
**Explanation:** `p` is the root itself. The root is an ancestor of every node, and a node is a descendant of itself, so the answer is `2`.

## Constraints

- The number of nodes in the tree is in the range `[2, 10^5]`.
- `-10^9 <= Node.val <= 10^9`
- All `Node.val` are unique.
- `p != q`
- `p` and `q` will both exist in the BST.

## Topics

- Tree
- Depth-First Search
- Binary Search Tree
- Binary Tree

## Company Tags

- Amazon
- Meta
- Microsoft
- Bloomberg

## Solution Approaches

### 1. BST-Guided Recursive Descent (Implemented)

**Intuition**: Start at the root. If both `p` and `q` are smaller than the current node, both must live in the left subtree, so the LCA is there. If both are larger, the LCA is in the right subtree. The first node where this is no longer true is the split point — one target is on each side, or the current node *is* one of the targets. At that moment the current node is the lowest common ancestor, because any deeper node can only reach one of the two targets.

**Algorithm**:
1. If `root`, `p`, or `q` is `null`, return `null` (defensive guard).
2. If `p.val < root.val && q.val < root.val`, recurse into `root.left`.
3. If `p.val > root.val && q.val > root.val`, recurse into `root.right`.
4. Otherwise (the values straddle `root.val`, or one equals it), return `root`.

**Time Complexity**: `O(h)` — at most one node per level is visited, `h` is the tree height.
**Space Complexity**: `O(h)` — recursion stack. `O(log n)` for a balanced BST, `O(n)` for a degenerate one.

### 2. BST-Guided Iterative Walk

**Intuition**: The recursion above is tail recursion: it walks a single root-to-node path and never needs to come back. Replacing the call stack with a `current` pointer gives the same logic with constant auxiliary space.

**Algorithm**:
1. Set `current = root`.
2. While `current` is not `null`:
   - If both values are less than `current.val`, move `current = current.left`.
   - Else if both values are greater, move `current = current.right`.
   - Else return `current`.
3. Return `null` (only reachable for invalid input).

**Time Complexity**: `O(h)`.
**Space Complexity**: `O(1)` — only a pointer.

### 3. General Binary Tree LCA (Post-Order DFS)

**Intuition**: Ignore the BST ordering and solve the problem for any binary tree. Recursively look for `p` and `q` in both subtrees. A node is the LCA if one target is found in its left subtree and the other in its right subtree, or if the node itself is one of the targets and the other target is found below it. This is the standard LeetCode 236 solution and is a useful correctness check for the BST-specific logic.

**Algorithm**:
1. If `root` is `null`, or `root` is `p`, or `root` is `q`, return `root`.
2. Recurse into the left subtree and the right subtree.
3. If both recursive calls return a non-null node, the targets were found on opposite sides — return `root`.
4. Otherwise return whichever side returned non-null (propagate the finding upward).

**Time Complexity**: `O(n)` — in the worst case every node is visited.
**Space Complexity**: `O(h)` — recursion stack.

## Visual Explanation

```
root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8

Start at 6:
  p = 2 < 6   and   q = 8 > 6
  -> the targets are on OPPOSITE sides
  -> 6 is the split point  =>  LCA = 6

Paths from the root:
  6 -> 2          (contains p)
  6 -> 8          (contains q)
  the last shared node is 6

For p = 2, q = 4:
  6: both 2 and 4 < 6   -> go left
  2: p == 2, q = 4 > 2  -> split at 2  =>  LCA = 2

For p = 7, q = 9:
  6: both > 6           -> go right
  8: 7 < 8, 9 > 8       -> split at 8  =>  LCA = 8
```

```
Iterative walk for p = 2, q = 8:

current = 6   -> 2 < 6 and 8 > 6  -> return 6
             (one comparison, done)

Iterative walk for p = 3, q = 5:

current = 6   both < 6   -> current = 2
current = 2   both > 2   -> current = 4
current = 4   3 < 4, 5 > 4 -> return 4
```

## Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **BST recursive descent** (implemented) | `O(h)` | `O(h)` | Tiny, directly expresses the split rule | Recursion stack; risk on degenerate trees |
| **BST iterative walk** | `O(h)` | `O(1)` | Same logic, constant space, no stack risk | Slightly more verbose; easy to forget the null guard |
| **General LCA (post-order)** | `O(n)` | `O(h)` | Works for any binary tree, no BST assumption | Visits far more nodes than necessary here |

## Common Pitfalls

1. **Searching both subtrees out of habit**: that turns an `O(h)` problem into `O(n)`. The BST ordering tells you exactly which side to explore.
2. **Using `<=` / `>=` incorrectly**: the "both smaller" and "both larger" checks must be strict (`<` and `>`). Equality means the current node is one of the targets, which makes it the LCA. Writing `p.val <= root.val && q.val <= root.val` can walk past the answer.
3. **Assuming `p` and `q` are ordered**: never assume `p.val < q.val`. Either compare both against the current node, or normalize with `min`/`max`.
4. **Forgetting that a node is its own descendant**: Example 2 and Example 3 rely on this. Returning `root` when one target equals the current value is correct.
5. **Comparing node objects instead of values**: `p === root` works only if you were given the exact node references; comparing `.val` is the clearer signal here. (The general LCA approach *does* compare references.)
6. **Returning the value instead of the node**: LeetCode expects the `TreeNode`, not `root.val`.
7. **Assuming a balanced tree**: `O(h)` is `O(n)` in the worst case for a skewed BST. The iterative version avoids the stack overflow that can result.
