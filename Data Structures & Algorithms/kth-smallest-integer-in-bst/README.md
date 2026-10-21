# Kth Smallest Element in a BST - LeetCode 230

## Problem Description

Given the `root` of a **binary search tree** and an integer `k`, return the `k`-th smallest value (**1-indexed**) of all the values of the nodes in the tree.

The defining property of a BST is that for every node, all values in its left subtree are smaller and all values in its right subtree are larger. A direct consequence is that an **inorder traversal** (left → node → right) visits the values in **strictly increasing order**. The `k`-th value produced by that traversal is the answer.

This problem also appears as **Kth Smallest Integer in BST** on NeetCode.

## Examples

### Example 1:
```
Input: root = [3,1,4,null,2], k = 1
Output: 1
```
**Explanation:** The inorder traversal is `1, 2, 3, 4`. The 1st smallest value is `1`.

### Example 2:
```
Input: root = [5,3,6,2,4,null,null,1], k = 3
Output: 3
```
**Explanation:** The inorder traversal is `1, 2, 3, 4, 5, 6`. The 3rd smallest value is `3`.

### Additional Example:
```
Input: root = [2,1,3], k = 2
Output: 2
```
**Explanation:** Inorder is `1, 2, 3`; the 2nd value is the root `2`.

### Additional Example:
```
Input: root = [1], k = 1
Output: 1
```
**Explanation:** A single node is both the smallest and the `k`-th smallest.

## Constraints

- The number of nodes in the tree is `n`.
- `1 <= k <= n <= 10^4`
- `0 <= Node.val <= 10^4`

**Follow-up:** If the BST is modified often (i.e., we can do insert and delete operations) and you need to find the `k`-th smallest frequently, how would you optimize?

## Topics

- Tree
- Depth-First Search
- Binary Search Tree
- Binary Tree

## Company Tags

- Amazon
- Google
- Microsoft
- Meta
- Bloomberg

## Solution Approaches

### 1. Brute Force — Collect and Sort

**Intuition**: Ignore the BST property entirely. Traverse the tree in any order, collect all values, sort them, and index `k - 1`.

**Algorithm**:
1. Traverse the tree (preorder, BFS, anything) and push every value into an array.
2. Sort the array in ascending order.
3. Return `values[k - 1]`.

**Time Complexity**: `O(n log n)` — dominated by sorting.
**Space Complexity**: `O(n)` for the collected values.

### 2. Recursive Inorder, Collect Everything (Implemented)

**Intuition**: Use the BST property: an inorder traversal yields the values already sorted. Collect the whole inorder sequence and return the element at index `k - 1`. No sorting is needed.

**Algorithm**:
1. Call `traverse(root, results)` with an empty array.
2. In `traverse(node, results)`:
   - Return if `node` is null.
   - Recurse on `node.left`.
   - Push `node.val`.
   - Recurse on `node.right`.
3. Return `results[k - 1]`.

**Time Complexity**: `O(n)` — the whole tree is visited even if `k` is small.
**Space Complexity**: `O(n)` for the results array plus `O(h)` recursion stack.

### 3. Iterative Inorder with Early Exit

**Intuition**: Simulate the inorder traversal with an explicit stack and count nodes as they are popped. The moment the count reaches `k`, return that value — there is no need to visit the rest of the tree.

**Algorithm**:
1. `stack = []`, `curr = root`, `count = 0`.
2. While `curr !== null || stack.length > 0`:
   - Descend left: while `curr`, push it and move to `curr.left`.
   - Pop the top node, increment `count`.
   - If `count === k`, return `node.val`.
   - Set `curr = node.right` to process its right subtree.
3. The loop always returns for a valid `k`.

**Time Complexity**: `O(h + k)` — descend at most `h` nodes, then pop `k` values.
**Space Complexity**: `O(h)` for the stack.

### 4. Morris Inorder (O(1) Space)

**Intuition**: Morris traversal threads the rightmost node of each left subtree back to its ancestor, so inorder can be produced without a stack. Count the emitted values and remember the `k`-th. Each thread is removed after use, restoring the tree.

**Algorithm**:
1. `curr = root`, `count = 0`.
2. While `curr !== null`:
   - If `curr.left === null`: emit `curr` (increment `count`; if `count === k`, record `curr.val` as the answer), then `curr = curr.right`.
   - Otherwise find `pred`, the rightmost node of `curr.left`.
     - If `pred.right === null`: set `pred.right = curr` (thread), then `curr = curr.left`.
     - Else: remove the thread (`pred.right = null`), emit `curr`, then `curr = curr.right`.
3. The walk finishes with every thread removed and the tree intact. If the tree may be discarded after the call, the loop can return immediately once `count === k`, but that leaves the remaining threads in place.

**Time Complexity**: `O(n)` worst case (`O(h + k)` emitted values, plus thread setup).
**Space Complexity**: `O(1)` auxiliary.

## Visual Explanation

```
root = [5,3,6,2,4,null,null,1], k = 3

              5
            /   \
           3     6
          / \
         2   4
        /
       1

Inorder (left -> node -> right):

  1  ->  2  ->  3  ->  4  ->  5  ->  6
  ^      ^      ^
 1st    2nd    3rd  = answer

BST inorder is sorted, so "k-th smallest" is simply the k-th emitted value.
```

## Approach Comparison

| Approach | Time | Space | Notes |
| :--- | :--- | :--- | :--- |
| **Collect and Sort** | `O(n log n)` | `O(n)` | Ignores the BST property; only useful as a baseline |
| **Recursive Inorder, collect all** (implemented) | `O(n)` | `O(n)` | Simple, sorted for free, but visits the entire tree |
| **Iterative Inorder, early exit** | `O(h + k)` | `O(h)` | Best when `k` is small; no recursion |
| **Morris Inorder** | `O(n)` | `O(1)` | Constant extra memory; temporarily modifies pointers |

## Common Pitfalls

1. **Forgetting the BST property**: sorting is unnecessary. Any correct BST inorder is already ascending; a sort-based solution does `O(n log n)` work for nothing.
2. **1-indexed vs 0-indexed**: the `k`-th smallest is at array index `k - 1`. For the iterative count, compare `count === k` **after** incrementing.
3. **Early exit placement**: in the iterative version, return immediately when the count reaches `k`; waiting until the stack empties wastes the traversal's advantage.
4. **Left-descend loop**: push the node *before* moving left, so the node is available when popped after its left subtree.
5. **Morris cleanup**: forgetting `pred.right = null` leaves a cycle and an infinite loop.
6. **Recursion depth**: a skewed BST of `10^4` nodes gives `10^4` stack frames. The iterative or Morris versions are safer.
7. **Duplicates**: this problem's BST is strictly ordered; if equal values are allowed, define whether the k-th is by position (inorder) rather than by distinct value.
8. **Debug output**: the first submission of this solution contained a `console.log(results)`; the final version removes it. Printing during a judged run is wasted I/O.

## Follow-up: Frequent Modifications

If the tree is inserted into and deleted from often, and `k`-th smallest queries are frequent, store an extra **subtree size** on every node. Then:

- `k`-th smallest: at each node, let `L` be the size of the left subtree. If `k <= L`, go left; if `k === L + 1`, return the node; otherwise set `k -= L + 1` and go right. This is `O(h)`.
- Insert/delete: update the sizes along the `O(h)` search path.

This is an **order-statistic tree**; it makes both operations `O(h)` (expected `O(log n)` when balanced) instead of `O(n)`.
