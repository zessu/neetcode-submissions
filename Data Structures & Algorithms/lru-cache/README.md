# LRU Cache - LeetCode 146

## Problem Description

Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the `LRUCache` class:

- `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.
- `int get(int key)` Return the value of the key if the key exists, otherwise return -1.
- `void put(int key, int value)` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

The functions `get` and `put` must each run in `O(1)` average time complexity.

## Examples

### Example 1:
```
Input:
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
Output:
[null, null, null, 1, null, -1, null, -1, 3, 4]

Explanation:
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4
```

## Constraints

- `1 <= capacity <= 3000`
- `0 <= key <= 10^4`
- `0 <= value <= 10^5`
- At most `2 * 10^5` calls will be made to `get` and `put`.

## Topics

- Hash Table
- Linked List
- Design
- Doubly-Linked List

## Company Tags

- Amazon
- Google
- Microsoft
- Facebook

## Solution Approaches

### 1. Hash Map + Array

**Intuition**: Use a hash map for O(1) lookups and an array to track access order. When evicting, remove the first element (least recently used).

**Algorithm**:
1. Use a hash map for key-value storage.
2. Use an array to track access order (move accessed key to end).
3. On eviction, remove the first element from the array and the map.

**Time Complexity**: `O(1)` for get, `O(n)` for put (array shift).
**Space Complexity**: `O(capacity)` for the map and array.

### 2. Hash Map Only (Using Map's Insertion Order)

**Intuition**: JavaScript's `Map` preserves insertion order. Deleting and re-inserting a key moves it to the end, making the first key the least recently used.

**Algorithm**:
1. Use a `Map` for key-value storage.
2. On `get`: if key exists, delete and re-insert to mark as recently used.
3. On `put`: if key exists, delete and re-insert with new value. If cache is full, delete the first key (least recently used) before inserting.

**Time Complexity**: `O(1)` for both get and put.
**Space Complexity**: `O(capacity)` for the map.

## Visual Explanation

```
Capacity: 2

put(1, 1) -> Map: {1 => 1}
put(2, 2) -> Map: {1 => 1, 2 => 2}
get(1)    -> Return 1, Map: {2 => 2, 1 => 1} (1 moved to end)
put(3, 3) -> Evict LRU key 2, Map: {1 => 1, 3 => 3}
get(2)    -> Return -1 (evicted)
put(4, 4) -> Evict LRU key 1, Map: {3 => 3, 4 => 4}
```

## Common Pitfalls

1. **Map iteration order**: JavaScript Maps preserve insertion order, but not all languages do.
2. **Eviction logic**: Must evict before inserting when at capacity, not after.
3. **Update vs insert**: When updating an existing key, delete first to maintain correct order.
