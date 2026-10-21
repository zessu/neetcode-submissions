# Serialize and Deserialize Binary Tree - Solution

## Solution Code

```typescript
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     constructor(val = 0, left = null, right = null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */

class Codec {
    /**
     * Encodes a tree to a single string.
     *
     * @param {TreeNode} root
     * @return {string}
     */
    serialize(root: TreeNode | null): string {
        let serialized: string = "";

        const traverse = (root) => {
            if (!root) {
                serialized += `null_`;
                return;
            };
            serialized += `${root.val}_`;
            traverse(root.left);
            traverse(root.right);
        }

        traverse(root);

        return serialized;
    }

    /**
     * Decodes your encoded data to tree.
     *
     * @param {string} data
     * @return {TreeNode}
     */
    deserialize(data: string): TreeNode {
        const arr = data.split("_");
        const el = arr.shift();
        if(!parseInt(el)) return new TreeNode(null);

        const root: TreeNode = new TreeNode(parseInt(el));

        const traverse = (arr: string[]) => {
            const next = parseInt(arr.shift());
            if (!next) return null; 
            const newRoot: TreeNode = new TreeNode(next);
            newRoot.left = traverse(arr);
            newRoot.right = traverse(arr);
            return newRoot;
        };

        root.left = traverse(arr);
        root.right = traverse(arr);

        return root;
    }
}
```

## Approach

The submission implements **preorder DFS with explicit null markers and an underscore delimiter**.

### Serialize

1. Start with an empty string `serialized`.
2. `traverse(node)`:
   - If `node` is falsy (`null`), append `null_` and return. The marker reserves a slot for the missing child so the decoder knows the subtree is empty.
   - Otherwise append `${node.val}_`.
   - Recurse into `node.left`, then `node.right`.
3. Return the completed string.

The result for Example 1 is `1_2_null_null_3_4_null_null_5_null_null_`. Every node contributes one value token and every missing child contributes one `null` token, so there are exactly `2n + 1` tokens for `n` nodes.

### Deserialize

1. `data.split("_")` produces the token array. Because the string ends with `_`, the final element is an empty string; for a well-formed stream it is never consumed, since the token count is exact. (`parseInt("")` would be `NaN` and therefore falsy if it ever were.)
2. Shift the first token. The guard `if (!parseInt(el))` is intended to catch the empty/null case.
3. Build the root from the first value.
4. `traverse(arr)` performs the mirror image of serialization:
   - Shift the next token and parse it.
   - If the parsed value is falsy (including `NaN`), return `null` — this consumes a `null` marker and terminates that branch.
   - Otherwise create a node, recursively build its left subtree, then its right subtree, and return the node.
5. Attach the two subtrees to the root and return it.

Because both directions use the same preorder (root, left, right), the token order consumed during decoding matches the order produced during encoding exactly.

- **Time Complexity**: `O(n)` for `serialize` (one visit per node and per null child) and conceptually `O(n)` for `deserialize` (each of the `2n + 1` tokens is consumed once).
- **Space Complexity**: `O(n)` for the encoded string and token array, plus `O(h)` recursion stack for both directions. The token array dominates at `O(n)`.

> **Implementation note on the true cost**: `deserialize` consumes tokens with `arr.shift()`. In JavaScript, `Array.prototype.shift` re-indexes the array and costs `O(k)` for a length-`k` array, so the submitted decoder is `O(n²)` in the worst case even though the algorithm is conceptually linear. Reading through a numeric index (`let i = 0; const token = arr[i++]`) restores `O(n)`. Similarly, `serialized += ...` relies on engine-level string optimization; a `parts.push(...)` + `join("")` approach has a guaranteed linear bound.

## Walkthrough

### Example 1: `root = [1,2,3,null,null,4,5]`

```
        1
       / \
      2   3
         / \
        4   5
```

**Serialization**

```
traverse(1): append "1_"      -> "1_"
  traverse(2): append "2_"    -> "1_2_"
    traverse(null): "null_"   -> "1_2_null_"
    traverse(null): "null_"   -> "1_2_null_null_"
  traverse(3): append "3_"    -> "1_2_null_null_3_"
    traverse(4): append "4_"  -> "1_2_null_null_3_4_"
      traverse(null): "null_" -> "...4_null_"
      traverse(null): "null_" -> "...4_null_null_"
    traverse(5): append "5_"  -> "...3_4_null_null_5_"
      traverse(null): "null_" -> "...5_null_"
      traverse(null): "null_" -> "...5_null_null_"

result: "1_2_null_null_3_4_null_null_5_null_null_"
```

**Deserialization**

```
data.split("_") = ["1","2","null","null","3","4","null","null","5","null","null",""]

el = "1", parseInt("1") = 1 (truthy)
root = TreeNode(1)

traverse(arr):
  next = parseInt("2") = 2 (truthy)
  node = TreeNode(2)
    left:  next = parseInt("null") = NaN -> null
    right: next = parseInt("null") = NaN -> null
  return TreeNode(2)
root.left = TreeNode(2)

root.right = traverse(arr):
  next = parseInt("3") = 3 (truthy)
  node = TreeNode(3)
    left:  next = parseInt("4") = 4
           node = TreeNode(4)
             left:  parseInt("null") = NaN -> null
             right: parseInt("null") = NaN -> null
           -> TreeNode(4)
    right: next = parseInt("5") = 5
           node = TreeNode(5)
             left:  parseInt("null") = NaN -> null
             right: parseInt("null") = NaN -> null
           -> TreeNode(5)
  -> TreeNode(3) with children 4 and 5

return TreeNode(1) with left 2 and right 3(4, 5)
```

The reconstructed tree matches the input shape exactly.

### Example 2: `root = []`

```
serialize(null) = "null_"

deserialize("null_"):
  split -> ["null", ""]
  el = "null"
  parseInt("null") = NaN -> falsy
  return new TreeNode(null)      // a node, not null
```

This is a known limitation of the submitted code: an empty tree should decode to `null`. See the section below.

### Example 3: `root = [1]`

```
serialize -> "1_null_null_"
deserialize:
  root = TreeNode(1)
  traverse consumes "null" for left  -> null
  traverse consumes "null" for right -> null
return TreeNode(1) with no children
```

Correct.

## Known Limitations of the Submitted Implementation

The code above is copied verbatim from the submission. Two bugs follow from using the **truthiness of `parseInt`** as the null test:

1. **Node value `0` is treated as `null`.** `parseInt("0") === 0`, which is falsy, so both the root guard and `if (!next) return null` treat a real zero-valued node as a missing child. For example, `[0]` serializes to `"0_null_null_"` but deserializes to a tree whose root value is `null`. `0` is explicitly allowed by the constraints (`-1000 <= Node.val <= 1000`).
2. **An empty tree does not decode to `null`.** `data = "null_"` makes `el = "null"`, `parseInt("null")` is `NaN`, and the guard returns `new TreeNode(null)` instead of `null`.

A minimal correction is to test the raw token, not the parsed number:

```typescript
// Guard for the first token
if (el === "null") return null;

// Inside traverse
const token = arr.shift();
if (token === "null" || token === undefined) return null;
const node = new TreeNode(parseInt(token));
```

These changes are not in the submission; they are shown only to document the correct condition. The same token-based check also removes the need for the trailing empty string as a sentinel.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is or is not chosen here |
| :--- | :--- | :--- | :--- |
| **Preorder DFS + null markers (implemented)** | `O(n)`* | `O(n)` encoded + `O(h)` stack | Encodes and decodes with the same traversal, so the two functions are mirror images. The null markers make the representation unambiguous. Chosen for directness. |
| **BFS level order + null markers** | `O(n)` | `O(n)` tokens + `O(w)` queue | Matches LeetCode's display format, so debugging is easy, and deserialization is iterative. Emits more markers than preorder because leaves still enqueue null children, and needs a queue. |
| **Nested parentheses `1(2)(3(4)(5))`** | `O(n)` | `O(n)` encoded + `O(h)` stack | Self-delimiting: the parentheses carry the structure, so there is no token array and no delimiter collisions. Slightly more parsing code, and the string is less compact for large negative values. |

\* Algorithmically `O(n)`. The submitted code's `Array.prototype.shift()` is `O(k)` per call, so its concrete decode is `O(n²)`; an index cursor fixes it.

**Why the preorder version is preferred in this submission**: preorder plus null markers is the smallest self-contained scheme. The first token is always the root, every subtree occupies a contiguous token range, and the decoder needs nothing but a cursor. Serialization is a direct recursion, and deserialization is the same recursion in reverse.

**When an alternative wins**:

- **You want to inspect the output by hand**: BFS with markers looks exactly like LeetCode's `[1,2,3,null,null,4,5]` notation, which makes mismatches easy to spot.
- **Deep or skewed trees** (`10^4` nodes): both recursive versions can hit the engine's stack limit. The BFS version is fully iterative.
- **Compactness matters**: the parentheses scheme stores one separator pair per node rather than a token + delimiter, and needs no trailing sentinel. It is also unambiguous without escaping as long as values are plain integers.
- **Values are guaranteed unique** (not true here): a preorder + inorder pair of traversals can reconstruct the tree without null markers. It is a trap for this problem because duplicates are allowed.

## Key Insights

1. **Null markers are the encoding's skeleton.** Values alone cannot distinguish `[1,2]` from `[1,null,2]`; the markers record absent children.
2. **Preorder is self-describing**: root, then the entire left subtree, then the entire right subtree. The decoder consumes exactly the tokens each subtree needs, so no lengths or indices are required.
3. **The traversal orders must match.** `serialize` uses root-left-right; `deserialize` must consume in root-left-right too. A mismatch silently produces a wrong tree rather than an error.
4. **Compare tokens to the null marker, not parsed values.** This is the root cause of the `0` bug; any sentinel check based on numeric truthiness will confuse a valid `0` with "missing".
5. **The cursor is the only state.** Both recursive decoders share one token array that is consumed from the front; passing it down (rather than copying) is what makes the decode `O(n)`.
6. **Reset state between calls.** If the cursor were stored on the codec instance instead of created per call, a second `deserialize` would start mid-stream. The submission avoids this by keeping the array local.
