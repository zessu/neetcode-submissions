# Reorder Linked List - Solution

## Solution Code

```typescript
class Solution {
    reorderList(head: ListNode | null): void {
        let slow = head;
        let fast = head;

        while(fast !== null && fast.next !== null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        let prev = null;
        let curr = slow.next;
        slow.next = null;

        while(curr) {
            let temp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = temp;
        }

        let ptr1 = head;
        let ptr2 = prev;

        while(ptr2) {
            const first = ptr1.next;
            const second = ptr2.next;

            ptr1.next = ptr2;
            ptr2.next = first;
            ptr1 = first;
            ptr2 = second;
        }
    }
}
```

## Approach

The solution uses a **three-step in-place** approach.

1. **Find middle**: Use slow/fast pointers. `slow` ends at the middle node.
2. **Reverse second half**: Starting from `slow.next`, reverse the second half. Set `slow.next = null` to split the list.
3. **Merge**: Alternate nodes from the first half (`ptr1`) and reversed second half (`ptr2`).

- **Time Complexity**: O(n) — three linear passes.
- **Space Complexity**: O(1) — all operations are in-place.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Find Mid + Reverse + Merge** | $O(n)$ | $O(1)$ | Optimal space, in-place | Multiple passes, more code |
| **Stack-Based** | $O(n)$ | $O(n)$ | Simple logic | Extra space for stack |
| **Array-Based** | $O(n)$ | $O(n)$ | Easy to implement | Extra space for array |

## Key Insights

```
Input: 1 -> 2 -> 3 -> 4 -> 5

Step 1 - Find middle (slow/fast):
  slow: 1 -> 2 -> 3
  fast: 1 -> 3 -> 5
  Middle = 3

Step 2 - Split and reverse second half:
  Split at 3: first half = 1->2->3, second half = 4->5
  Reverse: 5 -> 4

Step 3 - Merge:
  ptr1=1, ptr2=5
    1 -> 5 -> 2    (ptr1=2, ptr2=4)
    2 -> 4 -> 3    (ptr1=3, ptr2=null)
  ptr2 is null -> done

Result: 1 -> 5 -> 2 -> 4 -> 3
```

## Key Insights

1. **Why slow/fast works**: When `fast` reaches the end, `slow` is at the middle.
2. **Splitting the list**: Setting `slow.next = null` prevents cycles after reversal.
3. **Merge stops at ptr2**: The second half is always <= first half in length, so we stop when `ptr2` is exhausted.
