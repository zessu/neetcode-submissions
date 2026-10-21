# Subtree of Another Tree - LeetCode 572

## Problem Description

Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a **subtree** of `root` with the same structure and node values as `subRoot`, and `false` otherwise.

A **subtree** of a binary tree `tree` is a tree that consists of a node in `tree` and **all** of that node's descendants. The tree `tree` could also be considered as a subtree of itself.

In other words, we need to find some node in `root` such that the tree rooted at that node is *identical* to `subRoot` — same values, same shape, including missing children.

## Examples

### Example 1:
```
Input: root = [3,4,5,1,2], subRoot = [4,1,2]
Output: true
```
**Explanation:** The subtree rooted at the node with value `4` has exactly the same structure and values as `subRoot`:

```
        3
       / \
      4   5
     / \
    1   2

subRoot:
      4
     / \
    1   2
```

### Example 2:
```
Input: root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]
Output: false
```
**Explanation:** The node with value `4` still exists, but its right child `2` has an extra left child `0` in `root`. A subtree must include **all** descendants of its root, so the shape no longer matches:

```
        3
       / \
      4   5
     / \
    1   2
       /
      0
```

### Example 3:
```
Input: root = [1,1], subRoot = [1]
Output: true
```
**Explanation:** A single-node tree `[1]` matches the leaf child of `root`. Duplicate values mean several candidates may need to be checked before one succeeds.

## Constraints

- The number of nodes in the `root` tree is in the range `[1, 2000]`.
- The number of nodes in the `subRoot` tree is in the range `[1, 1000]`.
- `-10^4 <= root.val <= 10^4`
- `-10^4 <= subRoot.val <= 10^4`

## Topics

- Tree
- Depth-First Search
- Binary Tree
- String Matching
- Hash Function

## Company Tags

- Amazon
- Microsoft
- Meta

## Solution Approaches

### 1. DFS at Every Node (Implemented)

**Intuition**: A subtree of `root` is determined entirely by its root node. So every node in `root` is a *candidate*. We walk the whole tree and, whenever a candidate's value equals `subRoot.val`, run a full structural comparison of the two trees. If any comparison succeeds, the answer is `true`.

**Algorithm**:
1. Define `compareTrees(a, b)`:
   - If both are `null`, return `true`.
   - If both exist and `a.val === b.val`, recurse on `(a.left, b.left)` and `(a.right, b.right)`; both must be `true`.
   - Otherwise return `false`.
2. Define `traverseTree(node)`:
   - If `node` is `null`, return.
   - If `node.val === subRoot.val`, call `compareTrees(node, subRoot)` and record a success in a flag.
   - Recurse into `node.left` and `node.right`.
3. Return the flag.

**Time Complexity**: `O(n · m)` worst case, where `n` is the number of nodes in `root` and `m` is the number of nodes in `subRoot`. A comparison costs `O(m)` and may run at up to `n` candidates.
**Space Complexity**: `O(h_root + h_sub)` for the two recursion stacks, which is `O(n + m)` in the worst case (skewed trees).

### 2. BFS at Every Node

**Intuition**: The candidate search does not need to be depth-first. Any traversal that visits every node works; only the structural comparison matters. A queue processes candidates level by level.

**Algorithm**:
1. Put `root` in a queue.
2. While the queue is not empty, dequeue a node.
3. If `node.val === subRoot.val` and `compareTrees(node, subRoot)` is `true`, return `true`.
4. Enqueue `node.left` and `node.right` when they exist.
5. If the queue empties, return `false`.

**Time Complexity**: `O(n · m)` worst case.
**Space Complexity**: `O(w + h_sub)`, where `w` is the maximum width of `root`. The queue holds up to one level, so `w` can be `O(n)` for a complete tree.

### 3. Serialize + Substring Search (KMP)

**Intuition**: A tree can be encoded as a unique string. With a preorder traversal that emits a marker for every `null` child and a separator between values, **tree equality becomes string equality**. `subRoot` is a subtree of `root` exactly when its serialization is a substring of `root`'s serialization.

**Algorithm**:
1. Serialize with preorder DFS, writing `#` for `null` and a delimiter such as `,` after each token:
   - `root` → `"3,4,1,#,#,2,#,#,5,#,#,"`
   - `subRoot` → `"4,1,#,#,2,#,#,"`
2. Prepend a separator to both strings so a match cannot start in the middle of a number (e.g. `12` inside `512`).
3. Search for the `subRoot` string inside the `root` string using KMP in `O(n + m)` time.

**Time Complexity**: `O(n + m)` with KMP construction/search. (A naive `indexOf`/`includes` is `O(n · m)` in the worst case.)
**Space Complexity**: `O(n + m)` for the two serialized strings and the KMP prefix table.

### 4. Subtree Hashing (Merkle-Style)

**Intuition**: Assign every subtree a hash computed bottom-up from its root value and its children's hashes. Identical trees get identical hashes. Compute the hash of every subtree of `root`, compute the hash of `subRoot` once, and look for a match.

**Algorithm**:
1. Define `hash(null) = 0`.
2. For a node: `hash = combine(node.val, hash(node.left), hash(node.right))`, using a strong mixing function (not simple addition, which collides constantly).
3. Post-order traverse `root`, storing each node's hash in a set.
4. Return `true` if `hash(subRoot)` is in the set.

**Time Complexity**: `O(n + m)` expected — each node is hashed once.
**Space Complexity**: `O(n + m)` for the hash map/set. Hash collisions are possible, so a production implementation would verify a hash match with a real structural comparison or use double hashing.

## Visual Explanation

```
Example 1: root = [3,4,5,1,2], subRoot = [4,1,2]

root:
              3
             / \
            4   5
           / \
          1   2

Candidates checked in DFS order:
  node 3  -> value 3 != 4                      skip
  node 4  -> value matches -> compare 4,1,2    MATCH  -> true
  node 1, 2, 5 -> visited afterwards by the implemented code;
                  the flag stays true

Example 2 adds 0 as the left child of 2:

root:                    subRoot:
        3                    4
       / \                  / \
      4   5                1   2
     / \
    1   2
       /
      0

  compare at node 4:
    4 == 4, 1 == 1, then 2 == 2 but
    compareTrees(2 with left child 0, 2 with no left child)
      -> one side is null, the other is not -> false

  no other node has value 4 -> false
```

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **DFS at every node** (implemented) | `O(n · m)` | `O(h_root + h_sub)` | Direct translation of the definition; minimal code; no extra data structures | Repeated comparisons when many nodes share `subRoot.val` |
| **BFS at every node** | `O(n · m)` | `O(w + h_sub)` | Iterative; no deep traversal recursion | Same repeated work; queue can hold `O(n)` nodes |
| **Serialize + KMP** | `O(n + m)` | `O(n + m)` | Optimal asymptotically; equality becomes substring search | Serialization delimiters are easy to get wrong; extra memory |
| **Subtree hashing** | `O(n + m)` expected | `O(n + m)` | Very fast in practice; hashes reusable across candidates | Collision risk; needs a strong hash or verification |

## Common Pitfalls

1. **Subtree vs. substructure**: A subtree must contain *all* descendants of its root. If you only check that values appear in the same relative positions, you may accept a tree with extra children. `compareTrees` must check `null` on both sides.
2. **Checking only values, not shape**: `root = [1,2,3]`, `subRoot = [2,3]` is `false`: the values `2` and `3` both exist, but no subtree rooted at `2` has a right child `3` (node `2` is a leaf in `root`). A value-only check would accept it. Null positions matter.
3. **Forgetting `subRoot` can be `null` in general tree code**: LeetCode guarantees at least one node in `subRoot`, but the implemented code dereferences `subRoot.val` in `traverseTree`. A defensive version should return `true` for an empty `subRoot` (the empty tree is conventionally a subtree of everything).
4. **Assuming one failed comparison means `false`**: With duplicate values, several nodes may share `subRoot.val`. A failed comparison at one candidate must not stop the search.
5. **No early exit is still correct, just slower**: The implemented version keeps traversing after finding a match. This does not change the answer, but returning immediately would save work.
6. **Deep recursion**: Trees can have up to 2000 nodes. A skewed tree produces recursion depth 2000, which is usually fine in Node.js but is worth noting for larger inputs.

## Related Problems

- [Binary Tree Diameter](../binary-tree-diameter/README.md) — another DFS-over-tree problem that combines information from both children.
- [Invert a Binary Tree](../invert-a-binary-tree/README.md) — practice with the same `TreeNode` structure and recursive tree rewriting.
