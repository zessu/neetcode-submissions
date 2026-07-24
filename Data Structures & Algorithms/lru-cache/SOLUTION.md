# LRU Cache - Solution

## Solution Code

```typescript
class LRUCache {
    private capacity: number;
    private store: Map<number, number>;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.store = new Map<number, number>();
    }

    get(key: number): number {
        if (!this.store.has(key)) return -1;
        
        const value = this.store.get(key)!;
        this.store.delete(key);
        this.store.set(key, value);
        
        return value;
    }

    put(key: number, value: number): void {
        const keyExists = this.store.has(key);
        const cacheIsFull = this.store.size === this.capacity;
        
        if (keyExists) {
            this.store.delete(key);
            this.store.set(key, value);
            return;
        }
        
        if (cacheIsFull) {
            const leastRecentlyUsedKey = this.store.keys().next().value;
            this.store.delete(leastRecentlyUsedKey);
            this.store.set(key, value);
            return;
        }

        this.store.set(key, value);
    }
}
```

## Approach

The solution uses a **Hash Map (JavaScript Map)** leveraging its insertion order preservation.

1. **get**: If key exists, delete and re-insert to mark as recently used. Return the value. If not found, return -1.
2. **put**: If key exists, delete and re-insert with new value. If cache is full, evict the first key (LRU) before inserting. Otherwise, simply insert.

- **Time Complexity**: O(1) for both get and put.
- **Space Complexity**: O(capacity) for the map.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Hash Map + Array** | $O(1)$ get, $O(n)$ put | $O(capacity)$ | Simple | put is O(n) due to array shift |
| **Hash Map (Map)** | $O(1)$ both | $O(capacity)$ | O(1) for both ops | Relies on Map insertion order |
| **Doubly Linked List + Map** | $O(1)$ both | $O(capacity)$ | Language-agnostic | More complex implementation |

## Key Insights

```
Capacity: 2

Operation: put(1, 1)
  Map: {1 => 1}

Operation: put(2, 2)
  Map: {1 => 1, 2 => 2}

Operation: get(1)
  Found! Delete and re-insert: {2 => 2, 1 => 1}
  Return: 1

Operation: put(3, 3)
  Cache full, evict LRU key (first key = 2)
  Map: {1 => 1, 3 => 3}

Operation: get(2)
  Not found! Return: -1

Operation: put(4, 4)
  Cache full, evict LRU key (first key = 1)
  Map: {3 => 3, 4 => 4}

Operation: get(1) -> -1, get(3) -> 3, get(4) -> 4
```

## Key Insights

1. **Why Map**: JavaScript's Map preserves insertion order, making the first key always the least recently used.
2. **Delete + re-insert**: This pattern moves a key to the "most recently used" position.
3. **Eviction before insert**: When at capacity, evict the LRU key first, then insert the new key.
