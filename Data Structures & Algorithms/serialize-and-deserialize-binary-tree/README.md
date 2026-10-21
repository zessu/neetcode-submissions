# Serialize and Deserialize Binary Tree - LeetCode 297

## Problem Description

Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection, and reconstructed later in the same or another computer environment.

Design an algorithm to **serialize** a binary tree into a string and **deserialize** that string back into the original tree. There is no restriction on how the encoding works — only that `deserialize(serialize(root))` reproduces a tree identical in **shape and values** to `root`.

The encoding must capture missing children (nulls). Without them, different tree shapes can produce the same sequence of values and reconstruction becomes impossible.

## Examples

### Example 1:
```
Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]
```
**Explanation:** The tree below must survive a round trip. The result is shown in LeetCode's level-order array format.

```
        1
       / \
      2   3
         / \
        4   5
```

### Example 2:
```
Input: root = []
Output: []
```
**Explanation:** An empty tree serializes to some marker and must deserialize back to `null` (an empty tree), not a node.

### Example 3:
```
Input: root = [1]
Output: [1]
```
**Explanation:** A single node round-trips to a single node with no children.

## Constraints

- The number of nodes in the tree is in the range `[0, 10^4]`.
- `-1000 <= Node.val <= 1000`

## Topics

- String
- Tree
- Depth-First Search
- Breadth-First Search
- Design
- Binary Tree

## Company Tags

- Amazon
- Google
- Meta
- Microsoft
- Bloomberg

## Solution Approaches

### 1. Preorder DFS with Null Markers (Implemented)

**Intuition**: A preorder traversal records a node before its children, so the first token is always the root. If every missing child is written as an explicit marker, the token stream uniquely determines the shape. Deserialization replays the same preorder: read one token, build the node, then recursively build its left subtree and then its right subtree.

**Algorithm — `serialize`**:
1. Walk the tree in preorder.
2. For a `null` node, append a null marker (`null_` in the submission).
3. Otherwise append the node's value followed by a delimiter, then recurse left, then right.
4. Return the concatenated string.

**Algorithm — `deserialize`**:
1. Split the string on the delimiter into a token array.
2. Read tokens in order with a shared cursor.
3. A null token produces `null`; any other token creates a node.
4. Recursively build the left child, then the right child, consuming tokens in preorder.
5. Return the root.

**Time Complexity**: `O(n)` for both directions — each node and each null marker is processed once (there are `2n + 1` tokens). In the concrete implementation, `Array.prototype.shift()` makes decoding `O(n²)`; see SOLUTION.md for details.
**Space Complexity**: `O(n)` for the string/token array (the encoded form has `2n + 1` tokens), plus `O(h)` recursion stack.

### 2. BFS Level-Order with Null Markers

**Intuition**: Serialize nodes level by level, including markers for missing children, exactly like LeetCode's own array format. During deserialization, read values in the same order and attach children to parents as they leave a queue.

**Algorithm — `serialize`**:
1. If `root` is `null`, return a single null marker.
2. Put `root` in a queue and repeatedly dequeue:
   - If the node is `null`, emit the marker.
   - Otherwise emit its value and enqueue its left and right children (even when `null`).
3. Join the tokens.

**Algorithm — `deserialize`**:
1. Split into tokens; if the first is the null marker, return `null`.
2. Create the root from the first token and enqueue it.
3. Walk the remaining tokens two at a time: for the dequeued parent, build the left child from the next token and the right child from the one after, enqueuing any non-null children.
4. Return the root.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(n)` for the token array and queue (queue width `O(w)`).

### 3. Nested Parentheses Encoding

**Intuition**: Use the string itself as the structure: `value(left)(right)`, with `()` for an empty child. For example, `1(2)(3(4)(5))`. Parsing is a single left-to-right scan because matching parentheses delimit each subtree — no token array or shared cursor is required beyond the current index.

**Algorithm — `serialize`**:
1. If the node is `null`, return `()`.
2. Return `val + "(" + serialize(left) + ")(" + serialize(right) + ")"`.

**Algorithm — `deserialize`**:
1. Read an integer at the cursor (skipping the opening parenthesis).
2. If the next character is `)`, this is an empty subtree: consume it and return `null`.
3. Otherwise create the node, recursively parse the left group, then the right group, consuming the final `)`.

**Time Complexity**: `O(n)` — each character is read once.
**Space Complexity**: `O(n)` for the string plus `O(h)` recursion.

## Visual Explanation

```
Tree:
        1
       / \
      2   3
         / \
        4   5

Preorder with null markers (submission's format):

  1, 2, null, null, 3, 4, null, null, 5, null, null

  tokens:  1   2   N   N   3   4   N   N   5   N   N
  meaning: root
            └─ left of 1 = 2
                └─ left of 2 = null
                └─ right of 2 = null
            └─ right of 1 = 3
                └─ left of 3 = 4
                    └─ left of 4 = null
                    └─ right of 4 = null
                └─ right of 3 = 5
                    └─ left of 5 = null
                    └─ right of 5 = null

Serialized string: "1_2_null_null_3_4_null_null_5_null_null_"
```

```
Deserialization cursor walk:

tokens: [1] [2] [null] [null] [3] [4] [null] [null] [5] [null] [null] [""]
         ^
         read 1  -> new node 1
           read 2  -> new node 2 (left of 1)
             read null -> left of 2 = null
             read null -> right of 2 = null
           read 3  -> new node 3 (right of 1)
             read 4  -> new node 4 (left of 3)
               read null, null -> 4 is a leaf
             read 5  -> new node 5 (right of 3)
               read null, null -> 5 is a leaf

Every token is consumed exactly once, in preorder.
```

```
BFS encoding of the same tree:

level order with markers:
  1 | 2 3 | null null 4 5 | null null null null

Deserialization pairs children two at a time:
  parent 1 -> left 2,  right 3
  parent 2 -> left null, right null
  parent 3 -> left 4,  right 5
  parent 4 -> left null, right null
  parent 5 -> left null, right null
```

## Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Preorder DFS + null markers** (implemented) | `O(n)`* | `O(n)` string + `O(h)` stack | Simple, unique encoding, recursive decode mirrors encode | Delimiter required; recursion depth; `shift()` makes the concrete decode `O(n²)` |
| **BFS level order + null markers** | `O(n)` | `O(n)` tokens + `O(w)` queue | Matches LeetCode's own format, easy to debug | More markers than necessary; queue memory |
| **Nested parentheses** | `O(n)` | `O(n)` string + `O(h)` stack | Self-delimiting, no token array, human-readable | Nested string building; values must not contain parentheses/digits ambiguities |

\* Algorithmically `O(n)`; the submitted `deserialize` uses `Array.prototype.shift()`, which is itself `O(n)` per call, so the concrete bound is `O(n²)`.

## Common Pitfalls

1. **Omitting null markers**: `[1,2]` and `[1,null,2]` would both serialize to `1,2` (or `1_2_`), making the encoding ambiguous.
2. **Using an empty string as the null marker with a naive split**: `1,,2` produces empty tokens that are easy to confuse with the trailing token after a final delimiter. Prefer an explicit marker such as `null` or `#`.
3. **Treating value `0` as null**: `parseInt("0")` is falsy in JavaScript. A guard like `if (!parseInt(token)) return null` silently converts real nodes with value `0` into missing children. Compare against the null marker, not the parsed number's truthiness.
4. **Deserializing an empty tree into a node**: the encoded form of `[]` must decode to `null`; returning `new TreeNode(null)` is a malformed tree.
5. **Sharing the cursor incorrectly**: serialization/deserialization state must reset between calls. A cursor stored on the class instance and not reinitialized leaks state across test cases.
6. **Splitting without handling negative numbers / delimiters**: use a delimiter that cannot appear inside a value (`,` `_` `|` or whitespace), and let `parseInt` handle the leading `-`.
7. **Assuming unique values / preorder+inorder reconstruction**: that classic trick fails when duplicate values exist, and this problem puts no uniqueness constraint on values. Null markers are the safer invariant.
8. **Recursion depth**: a degenerate tree with `10^4` nodes can exhaust the stack in some environments; the BFS variant is the iterative fallback.

> **Note on the submitted implementation**: it uses `parseInt(token)` truthiness for null detection, so nodes whose value is `0` are decoded as `null`, and an empty tree decodes to a node with `val = null`. The approach below documents the code as submitted and calls out these limitations explicitly.
