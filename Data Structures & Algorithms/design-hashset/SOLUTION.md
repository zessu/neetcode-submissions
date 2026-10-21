# Design HashSet - Solution

## Solution Code

```typescript
class MyHashSet {
    values:number[] = [];
    constructor() {}

    /**
     * @param {number} key
     * @return {void}
     */
    add(key: number): void {
        if(!this.values.includes(key)) this.values.push(key);
    }

    /**
     * @param {number} key
     * @return {void}
     */
    remove(key: number): void {
        if(!this.values.includes(key)) return;
        this.values = this.values.filter(item => item != key);

    }

    /**
     * @param {number} key
     * @return {boolean}
     */
    contains(key: number): boolean {
        console.log(this.values);
        return this.values.includes(key);
    }
}

/**
 * Your MyHashSet object will be instantiated and called as such:
 * var obj = new MyHashSet()
 * obj.add(key)
 * obj.remove(key)
 * var param_3 = obj.contains(key)
 */
```

> This is `submission-0.ts` verbatim, including the leftover `console.log` in `contains`. It does not affect correctness, but it prints on every query and should be removed in production. The submission passes because LeetCode compares return values, not stdout.

## Approach

The implementation is an **array-backed set with linear membership checks**. No hash function is involved; the array *is* the set.

1. **Storage**: `values: number[] = []` holds each distinct key exactly once. Order is irrelevant to set semantics.
2. **`add(key)`**: `includes` scans the array. If the key is absent, `push` appends it; if it is already present, nothing happens, so duplicates cannot accumulate.
3. **`remove(key)`**: first `includes` guards the absent case (return immediately). Otherwise `filter` produces a new array containing every element except `key`, and that new array is assigned back to `this.values`. Filtering removes *all* copies, which is stronger than needed but harmless because duplicates never exist.
4. **`contains(key)`**: `includes` performs a `===` comparison against every element until a match is found, returning a boolean.

- **Time Complexity**: `O(n)` for `add`, `remove`, and `contains`, where `n` is the number of stored keys. `includes` and `filter` both scan the whole array; `push` is amortized `O(1)`. Across `m` operations the worst case is `O(m · n)`.
- **Space Complexity**: `O(n)` for the stored keys. `remove` temporarily allocates an `O(n)` replacement array before the old one is garbage-collected.

## Walkthrough

Using Example 1:

```
["MyHashSet","add","add","contains","contains","add","contains","remove","contains"]
[[],           [1],   [2],   [1],        [3],        [2],   [2],        [2],      [2]]
```

| Operation | `values` before | Work done | `values` after | Return |
| :--- | :--- | :--- | :--- | :--- |
| `new MyHashSet()` | — | allocate `[]` | `[]` | `null` |
| `add(1)` | `[]` | `includes(1)` false &rarr; push | `[1]` | `null` |
| `add(2)` | `[1]` | `includes(2)` false &rarr; push | `[1, 2]` | `null` |
| `contains(1)` | `[1, 2]` | first element matches | `[1, 2]` | `true` |
| `contains(3)` | `[1, 2]` | scan both, no match | `[1, 2]` | `false` |
| `add(2)` | `[1, 2]` | `includes(2)` true &rarr; no-op | `[1, 2]` | `null` |
| `contains(2)` | `[1, 2]` | second element matches | `[1, 2]` | `true` |
| `remove(2)` | `[1, 2]` | present &rarr; filter out `2` | `[1]` | `null` |
| `contains(2)` | `[1]` | scan one element, no match | `[1]` | `false` |

The returned array is `[null, null, null, true, false, null, true, null, false]`, matching the expected output.

A boundary check with key `0`:

```
add(0)        -> includes(0) false -> values = [0]
contains(0)   -> true              (0 is falsy, but includes compares with ===)
remove(0)     -> values = []
remove(0)     -> includes(0) false -> early return, no error
```

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Array + linear scan (implemented)** | `O(n)` per op | `O(n)` | Minimal code and no hashing bugs. With at most `10^4` calls it comfortably passes, but each query scans every stored key, and `remove` reallocates. |
| **Direct-address `Uint8Array`** | `O(1)` per op | `O(10^6)` bytes | Strictly better asymptotically for this problem's key range; one indexed read/write per operation. Costs a fixed 1 MB even for an empty set, and only works because keys are bounded integers. |
| **Bitset** | `O(1)` per op | `O(10^6)` bits | Same speed as the byte array with 8x less memory; slightly less readable due to `wordIndex`/mask arithmetic. The best choice if memory matters. |
| **Separate chaining** | `O(1)` avg, `O(n)` worst | `O(n + B)` | The textbook answer and the only general solution when keys are unbounded (strings, 64-bit values). Much more code than the array version, with no benefit under this problem's constraints. |
| **Built-in `Set`** | `O(1)` avg | `O(n)` | What you would use in real code, but it is exactly what the follow-up forbids. |

**Why the array approach is preferred for this submission**: it is the shortest correct implementation, has no hash function to tune, and the constraints (`10^4` calls, at most `10^4` distinct keys) keep the `O(n)` scan within the time limit. The `includes` primitive is implemented natively and is fast in practice.

**When an alternative wins**: for a hot path with many lookups, the direct-address `Uint8Array`/bitset is the right call — guaranteed `O(1)` and no growth. If keys were arbitrary integers or strings, chaining (or the built-in `Set`) is required. The linear-scan version is the one to replace first when `n` grows past a few thousand.
