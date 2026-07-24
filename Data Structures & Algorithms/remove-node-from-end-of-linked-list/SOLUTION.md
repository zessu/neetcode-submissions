# Remove Nth Node From End of List - Solution

## Solution Code

```typescript
class Solution {
  reverseList(head: ListNode) {
    let prev = null;
    let curr = head;
    while (curr) {
      const temp = curr.next;
      curr.next = prev;
      prev = curr;
      curr = temp;
    }
    head = prev;
    return head;
  }

  removeElement(head: ListNode, n: number) {
    let count = 1;
    let curr = head;
    let prev = null;
    if (!curr.next) {
      head = null;
      return;
    }

    while (count != n && curr) {
      count += 1;
      prev = curr;
      curr = curr.next;
    }

    const temp = curr.next;
    curr.next = null;

    if(count !== 1) {
        prev.next = temp;
    } else {
        head = temp;
    }

    return head;
  }

  removeNthFromEnd(head: ListNode | null, n: number): ListNode {
    head = this.reverseList(head);
    head = this.removeElement(head, n);
    head = this.reverseList(head);
    return head;
  }
}
```

## Approach

The solution uses **Reverse, Remove, Reverse** to convert the problem into removing the n-th node from the start.

1. **Reverse**: Reverse the entire linked list.
2. **Remove**: Remove the n-th node from the start (which corresponds to the n-th node from the end in the original list).
3. **Reverse again**: Reverse back to restore the original order (minus the removed node).

- **Time Complexity**: O(sz) - three passes through the list.
- **Space Complexity**: O(1) - in-place operations.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Two Pass** | $O(sz)$ | $O(1)$ | Simple, intuitive | Requires two passes |
| **Reverse, Remove, Reverse** | $O(sz)$ | $O(1)$ | Converts to simpler problem | Three passes, modifies list |
| **One Pass (Two Pointers)** | $O(sz)$ | $O(1)$ | Single pass, optimal | Trickier to implement |

## Key Insights

```
Input: head = [1,2,3,4,5], n = 2

Step 1 - Reverse:
  [1,2,3,4,5] -> [5,4,3,2,1]

Step 2 - Remove 2nd from start (value 4):
  [5,4,3,2,1] -> [5,3,2,1]

Step 3 - Reverse back:
  [5,3,2,1] -> [1,2,3,5]

Result: [1,2,3,5]
```

## Key Insights

1. **Why reverse approach**: Converts "n-th from end" into "n-th from start", which is simpler to handle.
2. **Three passes**: Reverse (1 pass), Remove (1 pass), Reverse (1 pass) = 3 total passes.
3. **Edge case**: When removing the only node, the head becomes null.
