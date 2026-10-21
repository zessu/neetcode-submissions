# Implement Trie (Prefix Tree) - LeetCode 208

## Problem Description

A **trie** (pronounced "try"), or **prefix tree**, is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Common applications include autocomplete, spell checkers, and IP routing tables.

Implement the `Trie` class:

- `Trie()` initializes the trie object.
- `void insert(String word)` inserts the string `word` into the trie.
- `boolean search(String word)` returns `true` if the string `word` is in the trie (i.e. it was inserted before), and `false` otherwise.
- `boolean startsWith(String prefix)` returns `true` if there is a previously inserted string `word` that has the prefix `prefix`, and `false` otherwise.

The key distinction is between a **word** and a **prefix**: `"app"` may be a valid prefix of `"apple"` without itself being an inserted word. A terminal marker at the end of each inserted word records that difference.

## Examples

### Example 1:

```
Input:
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[],     ["apple"], ["apple"], ["app"], ["app"],     ["app"], ["app"]]

Output:
[null, null, true, false, true, null, true]
```

**Explanation:**

```javascript
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // return true
trie.search("app");     // return false  ("app" is only a prefix so far)
trie.startsWith("app"); // return true   (the path a-p-p exists)
trie.insert("app");
trie.search("app");     // return true   (terminal marker added)
```

### Example 2:

```
Input:
["Trie", "insert", "insert", "search", "search", "startsWith", "startsWith"]
[[],     ["apple"], ["ape"], ["app"], ["appl"], ["ap"],       ["b"]]

Output:
[null, null, null, false, false, true, false]
```

**Explanation:** `"apple"` and `"ape"` share the path `a → p`, then diverge at the third character (`p` vs `e`). Neither `"app"` nor `"appl"` was inserted, so both searches fail, but `"ap"` is a prefix of both words. `"b"` matches no root child.

### Example 3:

```
Input:
["Trie", "insert", "insert", "search", "startsWith", "startsWith"]
[[],     ["car"], ["car"], ["ca"],   ["ca"],      ["car"]]

Output:
[null, null, null, false, true, true]
```

**Explanation:** Inserting `"car"` twice must be idempotent. `"ca"` is not a word but is a prefix, so `search("ca")` is `false` while `startsWith("ca")` is `true`.

## Constraints

- `1 <= word.length, prefix.length <= 2000`
- `word` and `prefix` consist only of lowercase English letters.
- At most `3 * 10^4` calls **in total** will be made to `insert`, `search`, and `startsWith`.

## Topics

- Hash Table
- String
- Design
- Trie

## Company Tags

- Amazon
- Google
- Microsoft
- Bloomberg
- Apple

## Solution Approaches

### 1. List of Words + Linear Scan (Brute Force)

**Intuition**: Ignore the tree entirely — keep every inserted word in an array. `search` compares against every word, and `startsWith` checks whether any word begins with the prefix.

**Algorithm**:
1. `insert(word)`: push `word` into `words` (optionally skip duplicates).
2. `search(word)`: `words.includes(word)`.
3. `startsWith(prefix)`: `words.some(w => w.startsWith(prefix))`.

**Time Complexity**: `insert` `O(1)` amortized (plus duplicate check `O(n·L)` if added); `search` `O(n · L)`; `startsWith` `O(n · L)`, where `n` is the number of words and `L` the query length.
**Space Complexity**: `O(n · L)` for the stored strings.

Simple and correct, but every query touches every word — the opposite of what a trie is for.

### 2. Hash Sets of Words and Prefixes

**Intuition**: A trie is a lookup structure, so replace it with two hash sets: one containing complete words, one containing every prefix of every inserted word. `search` becomes one set lookup; `startsWith` becomes another.

**Algorithm**:
1. `insert(word)`: add `word` to `words`. For each `i` from `1` to `word.length`, add `word.slice(0, i)` to `prefixes`.
2. `search(word)`: `return words.has(word)`.
3. `startsWith(prefix)`: `return prefixes.has(prefix)`.

**Time Complexity**: `insert` `O(L)` hash insertions but `O(L^2)` character copying from repeated `slice`; `search`/`startsWith` `O(L)` to hash the query.
**Space Complexity**: `O(n · L^2)` characters in the worst case, because every prefix of every word is stored separately.

This is a legitimate trade-off — faster queries than a trie in practice, at the cost of duplicated strings and no shared structure.

### 3. Object-Based Trie (Implemented)

**Intuition**: Represent each trie node as a plain object whose keys are the next characters. Walking a word means following one object property per character. A special `isWord` key marks the end of an inserted word.

**Algorithm**:
1. The root is an empty object: `root = {}`.
2. `insert(word)`: start at the root; for each character, create `node[char] = {}` if missing, then descend. Finally set `node["isWord"] = true`.
3. `search(word)`: follow the characters; if any child is missing, return `false`. At the end, return `Boolean(node["isWord"])`.
4. `startsWith(prefix)`: follow the characters exactly like `search`, but return `true` as soon as the whole prefix has been consumed — no terminal marker required.

**Time Complexity**: `O(L)` per operation, where `L` is the length of the word/prefix.
**Space Complexity**: `O(T)` where `T` is the total number of characters across all inserted words (one node per distinct prefix).

### 4. Trie with Fixed 26-Slot Children Arrays

**Intuition**: Since the alphabet is exactly 26 lowercase letters, each node can hold a fixed array of 26 child pointers indexed by `charCodeAt(0) - 97`, instead of a dynamic object.

**Algorithm**:
1. Each node is `{ children: Array(26).fill(null), isWord: false }`.
2. `insert`: index children by `charCodeAt(i) - 97`, creating nodes on demand, then set `isWord = true`.
3. `search` / `startsWith`: same traversal, using array indexing instead of property lookup.

**Time Complexity**: `O(L)` per operation with a smaller constant factor (array indexing beats hash lookup).
**Space Complexity**: `O(26 · T)` pointer slots worst case, well above the object version when most slots stay empty.

## Visual Explanation

```
Words inserted: "app", "apple", "ape"

                 root
                  |
                  a
                  |
                  p
                  |
                  p  (isWord: "app")
                 / \
                l   e  (isWord: "ape")
                |
                e  (isWord: "apple")

search("app")      -> path a-p-p exists, isWord set  -> true
search("appl")     -> path a-p-p-l exists, no isWord -> false
startsWith("appl") -> path a-p-p-l exists            -> true
startsWith("b")    -> root has no child "b"          -> false
```

Each node only stores its outgoing edges, so all words sharing a prefix share the same nodes. That sharing is what makes both time and space proportional to the input characters rather than to the number of words.

## Comparison of Approaches

| Approach | `insert` | `search` | `startsWith` | Space | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Word list + scan** | `O(1)`* | `O(n · L)` | `O(n · L)` | `O(n · L)` | Trivial; queries dominate |
| **Hash sets of words + prefixes** | `O(L^2)` chars | `O(L)` | `O(L)` | `O(n · L^2)` | Fast queries, duplicated strings |
| **Object trie (implemented)** | `O(L)` | `O(L)` | `O(L)` | `O(T)` | Shared prefixes; compact code |
| **26-array trie** | `O(L)` | `O(L)` | `O(L)` | `O(26 · T)` | Faster constant; memory hungry |

\* `O(1)` if duplicates are allowed; `O(n · L)` if an existence check is added first.

## Common Pitfalls

1. **Confusing words with prefixes**: `search` must check the terminal marker; `startsWith` must not. Returning `true` whenever the path exists makes `search("app")` wrong after inserting only `"apple"`.
2. **Forgetting the terminal marker**: setting nothing at the end of `insert` means no word is ever found.
3. **Checking the marker at the wrong node**: mark the node *after* consuming the final character, not the root and not the parent.
4. **Partial path traversal**: if `node[char]` is undefined mid-word, return `false` immediately instead of continuing.
5. **Shared nodes across words**: nodes are shared, so `insert` must never overwrite an existing child object — only create it when absent, then descend into it.
6. **Empty string / empty prefix**: with this implementation `startsWith("")` is `true` (the root is the empty prefix) and `search("")` is `false` unless `""` was inserted. Constraints guarantee length &ge; 1, but know the behaviour.
7. **Repeated inserts**: inserting the same word twice is harmless *because* `isWord` is a boolean flag; appending words to a list without a check would not be idempotent.
8. **Marker key collisions**: `"isWord"` is safe here because real edges are single characters. A boolean field (`end: boolean`) is clearer and cannot collide at all.
