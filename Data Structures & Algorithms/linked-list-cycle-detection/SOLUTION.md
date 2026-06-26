# Linked List Cycle Detection - Solution

## Solution Code

```typescript
class Solution {
    hasCycle(head: ListNode | null): boolean {
        let curr = head;
        const seen = new Set();
        while(curr) {
            if(seen.has(curr)) return true;
            seen.add(curr);
            curr = curr.next;
        }

        return false;
    }
}
```

## Approach

The solution uses a **HashSet** to detect cycles.

1. **Initialize**: Create an empty HashSet and start at the head.
2. **Traverse**: For each node, check if it's already in the set.
3. **Cycle detected**: If the node exists in the set, we've visited it before — return `true`.
4. **Add and continue**: Otherwise, add the node to the set and move to the next.
5. **No cycle**: If we reach `null`, the list has no cycle — return `false`.

- **Time Complexity**: O(n) — visit each node at most once.
- **Space Complexity**: O(n) — store up to n nodes in the set.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **HashSet** | $O(n)$ | $O(n)$ | Simple and intuitive | Uses extra space |
| **Floyd's (Two Pointers)** | $O(n)$ | $O(1)$ | No extra space, elegant | Less intuitive to reason about |

## Key Insights

```
Input: head = [3, 2, 0, -4], pos = 1 (cycle to node at index 1)

Iteration 1: curr = 3, seen = {}
  3 not in set -> seen = {3}, curr = 2

Iteration 2: curr = 2, seen = {3}
  2 not in set -> seen = {3, 2}, curr = 0

Iteration 3: curr = 0, seen = {3, 2}
  0 not in set -> seen = {3, 2, 0}, curr = -4

Iteration 4: curr = -4, seen = {3, 2, 0}
  -4 not in set -> seen = {3, 2, 0, -4}, curr = 2

Iteration 5: curr = 2, seen = {3, 2, 0, -4}
  2 IS in set -> return true ✓
```

## Key Insights

1. **Why HashSet works**: A cycle means we'll revisit a node. The set tracks every node we've seen — if we encounter one again, it's a cycle.
2. **Reference comparison**: The set stores node references (memory addresses), not values. Two nodes with the same value are different objects.
3. **Floyd's is preferred in interviews**: O(1) space is optimal, but the HashSet approach is easier to reason about and explain.
