# Design HashMap - LeetCode 706

## Problem Description

Design a HashMap **without using any built-in hash table libraries**.

Implement the `MyHashMap` class:

- `MyHashMap()` initializes the object with an empty map.
- `void put(int key, int value)` inserts a `(key, value)` pair into the HashMap. If the key already exists in the map, **update** the corresponding value.
- `int get(int key)` returns the value to which the specified key is mapped, or `-1` if this map contains no mapping for the key.
- `void remove(int key)` removes the key and its corresponding value if the map contains the mapping for the key.

Keys and values are non-negative integers, and `-1` is used as the "not found" sentinel — which works precisely because no stored value can be negative.

## Examples

### Example 1:

```
Input:
["MyHashMap", "put", "put", "get", "get", "put", "get", "remove", "get"]
[[],           [1, 1], [2, 2], [1],  [3],  [2, 1], [2],  [2],     [2]]

Output:
[null, null, null, 1, -1, null, 1, null, -1]
```

**Explanation:**

```javascript
MyHashMap myHashMap = new MyHashMap();
myHashMap.put(1, 1); // map is {1=1}
myHashMap.put(2, 2); // map is {1=1, 2=2}
myHashMap.get(1);    // return 1
myHashMap.get(3);    // return -1 (not found)
myHashMap.put(2, 1); // key 2 already exists -> update: map is {1=1, 2=1}
myHashMap.get(2);    // return 1
myHashMap.remove(2); // map is {1=1}
myHashMap.get(2);    // return -1 (not found)
```

### Example 2:

```
Input:
["MyHashMap", "put", "get", "put", "get", "remove", "get"]
[[],           [0, 0], [0],  [0, 5], [0],  [0],     [0]]

Output:
[null, null, 0, null, 5, null, -1]
```

**Explanation:** Key `0` is a valid key (it is falsy in JavaScript), so membership must be tested with an explicit check rather than a truthiness test. The second `put` overwrites the value `0` with `5`, and `remove` deletes the mapping so the final `get` returns `-1`.

## Constraints

- `0 <= key, value <= 10^6`
- At most `10^4` calls will be made to `put`, `get`, and `remove`.

**Follow-up:** Could you design the HashMap without using any built-in hash table libraries?

## Topics

- Hash Table
- Design
- Array
- Linked List
- Hash Function

## Company Tags

- Amazon
- Google
- Microsoft
- Bloomberg
- Apple

## Solution Approaches

### 1. Parallel Arrays / Linear Scan (Brute Force)

**Intuition**: Keep the keys in one array and the values in a second array at matching indices. Every operation scans for the key, so no hashing is involved at all.

**Algorithm**:
1. `put(key, value)`: scan `keys` for `key`. If found, overwrite `values[i]`; otherwise push the key and value.
2. `get(key)`: scan `keys`; return the matching `values[i]`, or `-1`.
3. `remove(key)`: scan `keys`; if found, `splice` the key out of `keys` and the value out of `values`.

**Time Complexity**: `O(n)` per operation, where `n` is the number of stored keys.
**Space Complexity**: `O(n)` for the two arrays.

This is easy to reason about but degrades quadratically across the `10^4` allowed calls.

### 2. Direct Addressing Array (Key as Index)

**Intuition**: Keys are integers in a small, known range `[0, 10^6]`, so the key itself can be the array index. No hash function and no collisions are needed.

**Algorithm**:
1. Allocate an array of length `10^6 + 1`, filled with `-1`.
2. `put(key, value)`: `table[key] = value`.
3. `get(key)`: `return table[key]`.
4. `remove(key)`: `table[key] = -1`.

**Time Complexity**: `O(1)` for every operation.
**Space Complexity**: `O(U)` where `U = 10^6 + 1`, independent of how many keys are stored.

This is the fastest approach in practice for this problem's bound, at the cost of a fixed ~8 MB (or 4 MB with an `Int32Array`) allocation.

### 3. Separate Chaining (Buckets + Linked Lists)

**Intuition**: Compress the key into a small bucket index with a hash function, then store all keys that land in the same bucket in a linked list. This is the classic way a real hash map is built.

**Algorithm**:
1. Choose `B` buckets (e.g. `B = 1000`) and a hash function such as `h(key) = key % B`.
2. `put(key, value)`: walk the chain at `buckets[h(key)]`; if the key exists, update its value, otherwise prepend/append a new node.
3. `get(key)`: walk that bucket's chain and return the matching value, or `-1`.
4. `remove(key)`: unlink the matching node from the chain.

**Time Complexity**: `O(1 + n/B)` average, `O(n)` worst case (all keys collide).
**Space Complexity**: `O(B + n)` for the bucket array and nodes.

### 4. JavaScript Object as the Map (Implemented)

**Intuition**: A JavaScript object is itself a hash table implemented by the engine. Numeric keys used in property access are converted to strings, then hashed internally, so we can delegate the hard part (hashing, resizing, collision resolution) to the runtime while still writing the map from scratch.

**Algorithm**:
1. Store pairs in `this.values`, a `Record<string, number>` (a plain object).
2. `put(key, value)`: assign `this.values[key] = value`; assignment creates the property or overwrites the existing value.
3. `get(key)`: return `this.values[key]` if `key in this.values`, otherwise `-1`.
4. `remove(key)`: `delete this.values[key]` when the key is present.

**Time Complexity**: `O(1)` average, `O(n)` worst case for all operations (engine-level collisions).
**Space Complexity**: `O(n)` for the stored pairs.

## Visual Explanation

```
Separate chaining with B = 5, h(key) = key % 5

buckets
  0 -> empty
  1 -> [1|10] -> [6|60] -> [11|110]        (three keys collide)
  2 -> [2|20] -> [7|70]
  3 -> empty
  4 -> [4|40]

get(6):
  h(6) = 6 % 5 = 1        -> walk bucket 1
  compare key 1  -> miss
  compare key 6  -> hit   -> return 60
```

Direct addressing instead maps the key straight to an index, with no chain to walk:

```
key:    0     1     2     3     4
table: [0]   [1]   [1]   [-1]  [-1]
                 ^ put(2, 1) wrote here
```

## Comparison of Approaches

| Approach | `put` | `get` | `remove` | Space | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Parallel arrays (brute force)** | `O(n)` | `O(n)` | `O(n)` | `O(n)` | Simplest; too slow for many calls |
| **Direct addressing** | `O(1)` | `O(1)` | `O(1)` | `O(10^6)` | Fastest; fixed memory, only for small integer keys |
| **Separate chaining** | `O(1)` avg / `O(n)` worst | `O(1)` avg / `O(n)` worst | `O(1)` avg / `O(n)` worst | `O(n + B)` | Real hash-map design; handles unbounded keys |
| **JS object (implemented)** | `O(1)` avg / `O(n)` worst | `O(1)` avg / `O(n)` worst | `O(1)` avg / `O(n)` worst | `O(n)` | Tiny code; relies on the engine's hash table |

## Common Pitfalls

1. **Using `-1` as both a value and a sentinel**: safe here because values are non-negative, but a general-purpose map needs a separate "present" flag.
2. **Truthiness checks**: `if (this.values[key])` is wrong when the stored value is `0`. Use an explicit membership test.
3. **`in` checks the prototype chain**: `'toString' in {}` is `true`. Integer keys never hit inherited names, but library-grade code should use `Object.hasOwn(this.values, key)` or `Object.create(null)`.
4. **Forgetting to overwrite**: `put` on an existing key must update, not append a duplicate.
5. **Removing an absent key**: must be a no-op, not an error.
6. **Deleting vs. assigning `undefined`**: if `get` tests membership, setting `table[key] = undefined` leaves the key "present". Use `delete`.
7. **Numeric keys are strings in a JS object**: `obj[1]` and `obj['1']` are the same property. That is harmless for LeetCode's numeric keys, but surprising in mixed-type usage.
