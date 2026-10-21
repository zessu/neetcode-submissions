# Implement Trie (Prefix Tree) - Solution

## Solution Code

```typescript
class PrefixTree {
    root = {};

    constructor() {}

    /**
     * @param {string} word
     * @return {void}
     */
    insert(word: string): void {
        let localRoot = this.root;
        for(const char of word.split('')) {
            if(!localRoot[char]) {
                localRoot[char] = {};
            }
            localRoot = localRoot[char];
        }
        localRoot["isWord"] = true;
    }

    /**
     * @param {string} word
     * @return {boolean}
     */
    search(word: string): boolean {
        let localRoot = this.root;
        for(const char of word.split('')) {
            localRoot = localRoot[char];
            if(!localRoot) return false;
        }
        return localRoot["isWord"] || false;
    }

    /**
     * @param {string} prefix
     * @return {boolean}
     */
    startsWith(prefix: string): boolean {
        let localRoot = this.root;
        for(const char of prefix.split('')) {
            localRoot = localRoot[char];
            if(!localRoot) return false;
        }
        return true;
    }
}
```

> The LeetCode class is named `Trie`; this repository's submission names it `PrefixTree` with identical behaviour (`submission-0.ts`).

## Approach

The solution is an **object-based trie**. Each trie node is a plain JavaScript object whose properties are the characters of its outgoing edges, plus one special `isWord` flag marking a complete inserted word.

1. **Root**: `root = {}` is the node before any character. It is never a word itself.
2. **`insert(word)`**: start `localRoot` at the root. For each character:
   - If `localRoot[char]` is missing, create an empty object for it.
   - Descend: `localRoot = localRoot[char]`.
   
   After the loop, `localRoot` is the node representing the last character; set `localRoot["isWord"] = true`. Existing nodes are reused, so words with common prefixes share the whole prefix path.
3. **`search(word)`**: walk the same way, but *without creating* nodes. After descending into `localRoot[char]`, if the child does not exist, return `false`. At the end, return `localRoot["isWord"] || false` — the `|| false` converts `undefined` to a boolean. The path existing is not enough; the node must be a terminal.
4. **`startsWith(prefix)`**: identical traversal, but return `true` after the loop without checking `isWord`. Reaching the end of the prefix proves some inserted word passes through that node.

- **Time Complexity**: `O(L)` per operation, where `L` is the length of `word` or `prefix`. Each character costs one property lookup (hash-table lookup in the engine) and at most one insertion.
- **Space Complexity**: `O(T)` for the trie, where `T` is the total number of characters inserted. Each distinct prefix contributes one node; shared prefixes are stored once. The `isWord` flags add `O(number of words)`.

A stricter TypeScript build would annotate the node type (e.g. `type TrieNode = { [char: string]: TrieNode | boolean }`) because `root = {}` is inferred as `{}` and indexed dynamically. LeetCode's transpilation accepts the dynamic indexing, and the runtime shape is exactly the intended one.

## Walkthrough

Starting from an empty trie, apply Example 1:

```
["Trie","insert","search","search","startsWith","insert","search"]
[[],    ["apple"],["apple"],["app"], ["app"],   ["app"],  ["app"]]
```

**1. `insert("apple")`** — creates one node per character:

```
root -> a -> p -> p -> l -> e(isWord)
```

Each `if (!localRoot[char])` is true, so five nodes are created. The final node gets `isWord = true`.

**2. `search("apple")`** — descends `a`, `p`, `p`, `l`, `e`; every child exists; `isWord` is `true` &rarr; **`true`**.

**3. `search("app")`** — descends `a`, `p`, `p`. All children exist, so the loop finishes at the third `p` node:

```
localRoot = { l: {...} }      // no isWord property
return localRoot["isWord"] || false  ->  undefined || false  ->  false
```

**4. `startsWith("app")`** — same descent, but the loop's successful completion returns **`true`**. The prefix path exists even though `"app"` is not a word.

**5. `insert("app")`** — descends the existing `a → p → p` path; no new nodes are created; sets `isWord = true` on the third `p` node:

```
root -> a -> p -> p(isWord) -> l -> e(isWord)
```

**6. `search("app")`** — descends three characters, finds `isWord = true` &rarr; **`true`**.

Operations summary:

| Call | Traversal result | Terminal marker? | Return |
| :--- | :--- | :--- | :--- |
| `insert("apple")` | path created | `e.isWord = true` | `null` |
| `search("apple")` | full path | yes | `true` |
| `search("app")` | path ends at `p` | no | `false` |
| `startsWith("app")` | full path | not required | `true` |
| `insert("app")` | path reused | `p.isWord = true` | `null` |
| `search("app")` | full path | yes | `true` |

Example 2 exercises branching. After inserting `"apple"` and `"ape"`:

```
root -> a -> p -> p(isWord "app"? no) -> l -> e(isWord)
                \-> e(isWord "ape")
```

`search("appl")` fails because after `a-p-p-l` the node has no `isWord`; `startsWith("ap")` succeeds because it stops at the shared `p` node.

## Comparison with the Alternatives

| Approach | Time per op | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Object trie (implemented)** | `O(L)` | `O(T)` | Exactly the intended data structure: shared prefixes, no duplicated strings, and a direct `O(L)` walk. Dynamic objects make it compact when nodes have few children, which is typical for English words. |
| **Word list + linear scan** | `O(n · L)` | `O(n · L)` | Only wins when there are one or two words, or when insertions are far more frequent than queries. It cannot exploit shared prefixes, so a prefix query must inspect every word. |
| **Hash sets of words + prefixes** | `O(L)` query, `O(L^2)` insert | `O(n · L^2)` chars | Has the same asymptotic query time with a lower constant (one hash lookup instead of `L` of them), but duplicates every prefix as a separate string and pays `O(L^2)` copying on insert. Wins for read-heavy workloads with short strings and no memory pressure. |
| **26-slot array trie** | `O(L)` | `O(26 · T)` | Faster per character (array index rather than property hash) and easy to type. Loses badly on memory when most of the 26 slots are `null`, which is the common case for a sparse trie. Wins if the alphabet is dense or the trie is huge and lookup speed is critical. |

**Why the object trie is preferred here**: it is the shortest implementation that demonstrates the actual structure, runs each operation in `O(L)`, and shares prefixes naturally. The `isWord` flag cleanly separates "path exists" from "word ends here".

**When an alternative wins**: a word list is fine for tiny dictionaries; hash sets are attractive when queries must be as cheap as possible and memory is plentiful (e.g. a static autocomplete index warmed once); a 26-array trie is the better choice in lower-level languages or when predictable memory layout matters more than sparsity. For a production trie with deletion, you would add child counts (to prune dead branches) — none of these approaches supports deletion as written.
