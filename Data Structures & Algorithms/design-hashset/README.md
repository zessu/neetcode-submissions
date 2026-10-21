# Design HashSet - LeetCode 705

## Problem Description

Design a HashSet **without using any built-in hash table libraries**.

Implement the `MyHashSet` class:

- `void add(int key)` inserts the value `key` into the HashSet. If the key is already present, the set is unchanged.
- `bool contains(int key)` returns `true` if `key` exists in the HashSet, otherwise `false`.
- `void remove(int key)` removes `key` from the HashSet. If the key does not exist, do nothing.

A set stores only keys (no values), so each operation is a membership decision. Keys are integers in the range `[0, 10^6]`.

## Examples

### Example 1:

```
Input:
["MyHashSet", "add", "add", "contains", "contains", "add", "contains", "remove", "contains"]
[[],           [1],   [2],   [1],        [3],        [2],   [2],        [2],      [2]]

Output:
[null, null, null, true, false, null, true, null, false]
```

**Explanation:**

```javascript
MyHashSet myHashSet = new MyHashSet();
myHashSet.add(1);      // set = [1]
myHashSet.add(2);      // set = [1, 2]
myHashSet.contains(1); // return true
myHashSet.contains(3); // return false (not found)
myHashSet.add(2);      // set = [1, 2]  (duplicate add is a no-op)
myHashSet.contains(2); // return true
myHashSet.remove(2);   // set = [1]
myHashSet.contains(2); // return false (already removed)
```

### Example 2:

```
Input:
["MyHashSet", "contains", "add", "remove", "contains", "add", "contains"]
[[],           [0],        [0],   [0],      [0],        [1000000], [1000000]]

Output:
[null, false, null, null, false, null, true]
```

**Explanation:** Removing a key that was never added must be a silent no-op, and the boundary keys `0` and `10^6` are both valid. `0` is falsy in JavaScript, so a truthiness check would incorrectly report it as missing.

## Constraints

- `0 <= key <= 10^6`
- At most `10^4` calls will be made to `add`, `remove`, and `contains`.

**Follow-up:** Could you solve this problem without using any built-in hash table libraries?

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

### 1. Array with Linear Scan (Implemented)

**Intuition**: A set is just a collection of distinct keys, so keep them in a plain array. Membership is an `includes` scan, insertion checks for a duplicate first, and removal filters the key out.

**Algorithm**:
1. `add(key)`: if `values.includes(key)` return; otherwise `values.push(key)`.
2. `remove(key)`: if the key is absent return; otherwise rebuild the array without it (`filter`).
3. `contains(key)`: return `values.includes(key)`.

**Time Complexity**: `O(n)` for `add`, `remove`, and `contains`, where `n` is the number of stored keys.
**Space Complexity**: `O(n)` for the array.

This is the simplest implementation and is fast enough for the `10^4` call limit, but every operation is a linear scan and `remove` also allocates a new array.

### 2. Direct-Addressing Boolean Array / Bitset

**Intuition**: With keys bounded by `10^6`, the key can index a boolean table directly. `table[key] = true` means "present"; no hashing or collision handling is required.

**Algorithm**:
1. Allocate `present = new Uint8Array(10^6 + 1)` (zero-filled).
2. `add(key)`: `present[key] = 1`.
3. `remove(key)`: `present[key] = 0`.
4. `contains(key)`: `return present[key] === 1`.

**Time Complexity**: `O(1)` for every operation.
**Space Complexity**: `O(U)` where `U = 10^6 + 1` bytes (~1 MB with a typed array).

The bitset variant uses one **bit** per key (about 125 KB) at the cost of shift/mask arithmetic. Both variants are ideal when the key universe is small, dense, and known in advance.

### 3. Separate Chaining (Buckets + Linked Lists)

**Intuition**: Hash each key into one of `B` buckets and store the keys of each bucket in a linked list. This is how a general-purpose hash set works when the key range is not bounded.

**Algorithm**:
1. Choose `B` buckets (e.g. `B = 1000`) and `h(key) = key % B`.
2. `add(key)`: walk bucket `h(key)`; if the key is not in the chain, prepend a node.
3. `contains(key)`: walk that chain and compare each key.
4. `remove(key)`: unlink the matching node, if any.

**Time Complexity**: `O(1 + n/B)` average, `O(n)` worst case (all keys collide).
**Space Complexity**: `O(B + n)`.

### 4. Built-in `Set`

**Intuition**: JavaScript's `Set` is a hash set with average `O(1)` `add`/`has`/`delete`. It is the pragmatic production answer, but it sidesteps the point of the exercise.

**Algorithm**:
1. Keep `const set = new Set<number>()`.
2. `add` &rarr; `set.add(key)`, `remove` &rarr; `set.delete(key)`, `contains` &rarr; `set.has(key)`.

**Time Complexity**: `O(1)` average per operation.
**Space Complexity**: `O(n)`.

## Visual Explanation

```
Implemented array + linear scan, set = [1, 2]

contains(3):   [1] -> [2] -> end          -> false
                !=3   !=3

add(2):        includes(2) is true        -> no-op (set stays [1, 2])

remove(2):     filter out every 2         -> [1]
```

Direct addressing turns the scan into a single indexed read:

```
key:        0     1     2     3     4
present:  [ 0 ] [ 1 ] [ 1 ] [ 0 ] [ 0 ]
                   ^     ^
                add(1) add(2)

contains(2) -> present[2] === 1 -> true
remove(2)   -> present[2] = 0
```

Separate chaining with `B = 5`, `h(key) = key % 5`:

```
bucket 0: empty
bucket 1: [1] -> [6] -> [11] -> null
bucket 2: [2] -> [7] -> null
bucket 3: empty
bucket 4: [4] -> null
```

## Comparison of Approaches

| Approach | `add` | `contains` | `remove` | Space | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Array + linear scan (implemented)** | `O(n)` | `O(n)` | `O(n)` (plus allocation) | `O(n)` | Simplest; fine for `10^4` calls |
| **Direct-address `Uint8Array`** | `O(1)` | `O(1)` | `O(1)` | `O(10^6)` bytes | Fastest; only for bounded integer keys |
| **Bitset** | `O(1)` | `O(1)` | `O(1)` | `O(10^6)` bits | 8x less memory than a byte array |
| **Separate chaining** | `O(1)` avg / `O(n)` worst | `O(1)` avg / `O(n)` worst | `O(1)` avg / `O(n)` worst | `O(n + B)` | General-purpose, unbounded keys |
| **Built-in `Set`** | `O(1)` avg | `O(1)` avg | `O(1)` avg | `O(n)` | Not allowed by the follow-up |

## Common Pitfalls

1. **Duplicate inserts**: `add` must be idempotent; use a membership check before pushing.
2. **Removing an absent key**: must be a no-op. `filter` handles this naturally, but an index-based `splice` needs a guard (`index !== -1`).
3. **`indexOf`/`includes` return values**: `indexOf` returns `-1` when absent — `if (index)` is wrong for index `0`.
4. **Truthiness on key `0`**: `if (key)` skips a valid key. Always compare explicitly.
5. **Stale indices in a hand-written hash set**: after `remove`, make sure the chain/bucket no longer references the node.
6. **Reusing a mutated array reference**: `filter` returns a new array; assigning it back (`this.values = ...`) is required. Mutating while iterating can also skip elements.
7. **Sentinel collisions**: a boolean table cannot use `false` to mean both "absent" and "stored false" — irrelevant here because a set stores no values, but important when adapting the trick to a map.
