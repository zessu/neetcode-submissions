# Merge Two Sorted Linked Lists - Solution

## Solution Code

```javascript
class Solution {
    mergeTwoLists(list1, list2) {
        if (!list1) {
            return list2;
        }
        if (!list2) {
            return list1;
        }
        if (list1.val <= list2.val) {
            list1.next = this.mergeTwoLists(list1.next, list2);
            return list1;
        } else {
            list2.next = this.mergeTwoLists(list1, list2.next);
            return list2;
        }
    }
}
```

## Approach

The solution uses **Recursion** to merge two sorted lists.

1. **Base cases**: If either list is null, return the other.
2. **Compare heads**: Pick the smaller head node.
3. **Recurse**: Set the chosen node's `next` to the recursive merge of the remaining lists.
4. **Return**: The chosen node is now the head of the merged portion.

- **Time Complexity**: O(n + m) — each node is visited once.
- **Space Complexity**: O(n + m) — recursion stack depth.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Recursive** | $O(n + m)$ | $O(n + m)$ | Clean, elegant code | Stack overflow risk for large lists |
| **Iterative (Dummy Node)** | $O(n + m)$ | $O(1)$ | No extra space, safe for large inputs | Slightly more verbose |

## Key Insights

```
list1: 1 -> 2 -> 4
list2: 1 -> 3 -> 4

Call 1: merge(1->2->4, 1->3->4)
  1 <= 1 -> list1.next = merge(2->4, 1->3->4), return 1

Call 2: merge(2->4, 1->3->4)
  2 > 1 -> list2.next = merge(2->4, 3->4), return 1

Call 3: merge(2->4, 3->4)
  2 <= 3 -> list1.next = merge(4, 3->4), return 2

Call 4: merge(4, 3->4)
  4 > 3 -> list2.next = merge(4, 4), return 3

Call 5: merge(4, 4)
  4 <= 4 -> list1.next = merge(null, 4), return 4

Call 6: merge(null, 4)
  list1 is null -> return 4

Result: 1 -> 1 -> 2 -> 3 -> 4 -> 4
```

## Key Insights

1. **Why recursion works**: Each call resolves one node's placement, building the merged list from the end backwards as the stack unwinds.
2. **In-place merging**: No new nodes are created — existing `next` pointers are rewired.
3. **Iterative is preferred in production**: Avoids stack overflow and uses O(1) space.
