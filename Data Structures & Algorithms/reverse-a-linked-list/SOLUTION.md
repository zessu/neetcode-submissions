# Reverse a Linked List - Solution

## Solution Code

```typescript
class Solution {
    reverseList(head: ListNode | null): ListNode {
        let prev = null;
        let curr = head;

        while(curr) {
            let next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        return prev;
    }
}
```

## Approach

The solution uses an **iterative three-pointer** technique.

1. **Initialize**: `prev = null`, `curr = head`.
2. **Save next**: Store `curr.next` before overwriting it.
3. **Reverse link**: Set `curr.next = prev`.
4. **Advance**: Move `prev` to `curr` and `curr` to `next`.
5. **Repeat**: Until `curr` is null.
6. **Return prev**: The last non-null node is the new head.

- **Time Complexity**: O(n) — single pass through the list.
- **Space Complexity**: O(1) — only three pointers used.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Iterative** | $O(n)$ | $O(1)$ | Optimal space, simple | Slightly more code than recursive |
| **Recursive** | $O(n)$ | $O(n)$ | Elegant one-liner | Stack overflow for large lists |

## Key Insights

```
Input: 1 -> 2 -> 3 -> 4 -> 5 -> null

Iteration 1: prev=null, curr=1
  next = 2, 1.next = null, prev = 1, curr = 2
  List: null <- 1    2 -> 3 -> 4 -> 5 -> null

Iteration 2: prev=1, curr=2
  next = 3, 2.next = 1, prev = 2, curr = 3
  List: null <- 1 <- 2    3 -> 4 -> 5 -> null

Iteration 3: prev=2, curr=3
  next = 4, 3.next = 2, prev = 3, curr = 4
  List: null <- 1 <- 2 <- 3    4 -> 5 -> null

Iteration 4: prev=3, curr=4
  next = 5, 4.next = 3, prev = 4, curr = 5
  List: null <- 1 <- 2 <- 3 <- 4    5 -> null

Iteration 5: prev=4, curr=5
  next = null, 5.next = 4, prev = 5, curr = null
  List: null <- 1 <- 2 <- 3 <- 4 <- 5

curr is null -> return prev = 5
Result: 5 -> 4 -> 3 -> 2 -> 1 -> null
```

## Key Insights

1. **Why it works**: Each iteration reverses exactly one link. By the time `curr` reaches null, all links are reversed.
2. **prev is the new head**: When the loop ends, `prev` points to the last node we processed, which is the original tail — now the head.
3. **Recursive alternative**: `reverseList(head.next)` returns the new head, then we set `head.next.next = head` and `head.next = null`.
