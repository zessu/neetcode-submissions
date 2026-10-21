# Design HashMap - Solution

## Solution Code

```typescript
class MyHashMap {
    values: Record<string, number> = {};
    constructor() {}

    put(key: number, value: number): void {
        this.values[key] = value;
    }

    get(key: number): number {
          return key in this.values ? this.values[key] : -1;
    }

    remove(key: number): void {
         if (key in this.values) {
            delete this.values[key];
        }
    }
}

/**
 * Your MyHashMap object will be instantiated and called as such:
 * var obj = new MyHashMap()
 * obj.put(key,value)
 * var param_2 = obj.get(key)
 * obj.remove(key)
 */
```

> `submission-4.ts` and `submission-5.ts` contain the same implementation; `submission-4.ts` additionally carries the JSDoc stubs that LeetCode generates. The code above is from `submission-5.ts`, the latest submission.

## Approach

The solution implements the map as a **plain JavaScript object** used as a string-keyed dictionary. The engine supplies the actual hash table.

1. **Storage**: `values: Record<string, number> = {}` is the single backing store. Despite the `string` key type, TypeScript allows numeric indexing, and JavaScript coerces the number to its decimal string (e.g. `2` becomes `"2"`).
2. **`put(key, value)`**: `this.values[key] = value`. A property assignment either creates a new entry (insert) or replaces the existing entry (update), which matches the required semantics with no branching.
3. **`get(key)`**: `key in this.values` tests whether the property exists — using `in` rather than a truthiness check, so a stored value of `0` is returned correctly. If present, return the value; otherwise return the `-1` sentinel.
4. **`remove(key)`**: guard with the same membership test, then `delete this.values[key]`. Deleting a non-existent key is a no-op, but the guard keeps the behaviour explicit.

- **Time Complexity**: `O(1)` average per operation. A JS object is a hash table; a lookup is a hash, a probe, and (for collisions) a short chain walk. The theoretical worst case is `O(n)` if every key hashes to the same bucket, but the engine's hashing makes that unreachable in practice for integer keys.
- **Space Complexity**: `O(n)` for the `n` stored key-value pairs (plus the engine's internal table overhead).

## Walkthrough

Using Example 1:

```
["MyHashMap","put","put","get","get","put","get","remove","get"]
[[],        [1,1], [2,2], [1], [3], [2,1], [2], [2],     [2]]
```

| Operation | `values` after the call | Return |
| :--- | :--- | :--- |
| `new MyHashMap()` | `{}` | `null` |
| `put(1, 1)` | `{ "1": 1 }` | `null` |
| `put(2, 2)` | `{ "1": 1, "2": 2 }` | `null` |
| `get(1)` | `{ "1": 1, "2": 2 }` | `1` |
| `get(3)` | `{ "1": 1, "2": 2 }` | `-1` (`"3" in values` is false) |
| `put(2, 1)` | `{ "1": 1, "2": 1 }` | `null` (update, not duplicate) |
| `get(2)` | `{ "1": 1, "2": 1 }` | `1` |
| `remove(2)` | `{ "1": 1 }` | `null` |
| `get(2)` | `{ "1": 1 }` | `-1` |

The output array is `[null, null, null, 1, -1, null, 1, null, -1]`, matching the expected result.

A second check confirms the falsy-value edge case:

```
put(0, 0)  -> values = { "0": 0 }
get(0)     -> "0" in values is true, returns 0   (not -1)
put(0, 5)  -> values = { "0": 5 }
remove(0)  -> values = {}
get(0)     -> -1
```

## Comparison with the Alternatives

| Approach | Time per op | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **JS object (implemented)** | `O(1)` avg | `O(n)` | Four short methods, dynamic sizing, and no manual hash function. Best effort/result ratio for this problem. |
| **Direct addressing array** | `O(1)` guaranteed | `O(10^6)` | Slightly faster constant factor and no string coercion, but allocates a fixed 10^6-slot table even for one key, and only works because keys are bounded integers. Use it when the key universe is small and known. |
| **Separate chaining** | `O(1)` avg, `O(n)` worst | `O(n + B)` | The honest "implement a hash map" answer and a good interview exercise, but ~3x the code and strictly more work than delegating to the engine. Use it when the task forbids built-ins *and* expects an explicit hash function/buckets. |
| **Parallel arrays** | `O(n)` | `O(n)` | Trivially correct but scans every key; fine for a handful of entries, unusable at `10^4` calls with many keys. |

**Why the object approach is preferred here**: LeetCode judges behaviour, not internals, and a plain object gives average `O(1)` operations, automatic growth, and deletion in a few lines. It also avoids the `-1` sentinel ambiguity in the direct-address table only if you are careful with membership tests — which this code is.

**When an alternative wins**: if `put`/`get`/`remove` had to be *worst-case* `O(1)`, neither chaining nor a plain object is sufficient; you would need open addressing with a bounded load factor or a perfect hash. If keys were arbitrary 64-bit values, direct addressing is impossible and chaining/open addressing becomes the real answer. In an interview that says "no built-in hash tables", the chaining implementation is what the interviewer wants to see.
