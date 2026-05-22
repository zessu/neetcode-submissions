# Time Based Key-Value Store - Solution

## Solution Code

```javascript
class TimeMap {
    keyStore;
    constructor() {
        this.keyStore = new Map();
    }

    /**
     * @param {string} key
     * @param {string} value
     * @param {number} timestamp
     * @return {void}
     */
    set(key, value, timestamp) {
        const existing = this.keyStore.get(key);
        const keys = existing ? [...existing.keys, timestamp] : [timestamp];
        const values = existing ? [...existing.values, value] : [value];
        this.keyStore.set(key, {keys, values});
    }

    /**
     * @param {string} key
     * @param {number} timestamp
     * @return {string}
     */
    get(key, timestamp) {
        const existing = this.keyStore.get(key);
        if(!existing) return "";
        const idx = existing.keys.findIndex((item) => item === timestamp);
        if(idx >= 0) return existing.values[idx];
        
        // Linear scan backwards from timestamp
        for(let i = timestamp - 1; i >= 0; i--) {
            const idx = existing.keys.findIndex((item) => item === i);
            if(idx >= 0) return existing.values[idx];
        }

        return "";
    }
}
```

## Approach

The implementation uses a `Map` to store keys. Each key maps to an object containing two arrays: `keys` (timestamps) and `values`.

1. **Set**:
   - Retrieves the existing data for the key.
   - Appends the new timestamp and value.
   - Updates the map.
2. **Get**:
   - Retrieves the data for the key.
   - First checks for an exact timestamp match using `findIndex`.
   - If no exact match is found, it performs a linear search backwards from `timestamp - 1` down to 0, checking for each timestamp in the `keys` array.

## Complexity Analysis

- **Time Complexity**:
  - `set`: O(N) in this implementation (due to array spreading `[...existing.keys, timestamp]`).
  - `get`: O(T * N) in this implementation (due to linear scan).
- **Optimal Time Complexity**:
  - `set`: O(1) (using `push`).
  - `get`: O(log N) (using binary search).
- **Space Complexity**: O(M + N)

## Comparison

| Approach | set() Complexity | get() Complexity | Space |
| :--- | :--- | :--- | :--- |
| **Linear Scan** | O(1)* | O(n) | O(n) |
| **Binary Search** | O(1)* | O(log n) | O(n) |

\* Assuming efficient array appending.

The **Binary Search** approach is the optimal choice for this problem because timestamps are added in strictly increasing order, making the values naturally sorted and searchable in logarithmic time.

## Walkthrough

```
set("foo", "bar", 1)
keyStore: {"foo": {keys: [1], values: ["bar"]}}

get("foo", 1)
- Exact match found at index 0. Returns "bar".

get("foo", 3)
- No exact match for 3.
- Check 2: No match.
- Check 1: Match found at index 0. Returns "bar".
```

## Key Insights

1. **Storage**: Storing timestamps and values in separate arrays linked by index.
2. **Retrieval**: The current implementation uses a linear scan for non-exact matches, which works but is less efficient than binary search.
3. **Data Integrity**: Uses `Map` for fast key lookup.
