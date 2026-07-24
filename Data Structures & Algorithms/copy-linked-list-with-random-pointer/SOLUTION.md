# Copy List with Random Pointer - Solution

## Solution Code

```typescript
class Solution {
  printLinkedList(head: Node | null) {
    const vals = [];
    let curr = head;
    while (curr) {
      vals.push(curr.val);
      vals.push(curr.random?.val ?? "**");
      curr = curr.next;
    }
    console.log(vals.join("->"));
  }

  copyRandomList(head: Node | null): Node | null {
    if (!head) return null;
    // attach links to clones
    let curr = head;

    while (curr) {
      const clone: Node = { val: curr.val, next: null, random: null };
      const currNext = curr.next;
      curr.next = clone;
      clone.next = currNext;
      curr = clone.next;
    }

    // attach random links to clones
    curr = head;
    while (curr) {
      const clone = curr.next;
      clone.random = curr?.random?.next ?? null;
      curr = clone.next;
    }

    // detach next links
    curr = head;
    const cloneHead = curr.next;

    while (curr) {
      const clone = curr.next;
      const temp1 = clone?.next;
      curr.next = temp1;
      clone.next = temp1 ? temp1.next : null;
      curr = temp1;
    }

    // return head
    return cloneHead;
  }
}
```

## Approach

The solution uses **Interweaving Nodes** to achieve O(1) extra space.

1. **First pass - Interleave**: For each original node, create a clone and insert it right after the original. The list becomes: `orig1 -> clone1 -> orig2 -> clone2 -> ...`.
2. **Second pass - Set random**: For each clone, set `clone.random = original.random.next`. Since `original.random.next` is the clone of the random target, this correctly links random pointers.
3. **Third pass - Separate**: Restore the original list by reconnecting `original.next = original.next.next`, and extract the clone list by connecting `clone.next = clone.next.next`.
4. **Return**: The head of the cloned list.

- **Time Complexity**: O(n) - three passes through the list.
- **Space Complexity**: O(1) - no hash map needed.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Hash Map** | $O(n)$ | $O(n)$ | Simple, two passes | Extra O(n) space for map |
| **Interweaving Nodes** | $O(n)$ | $O(1)$ | No extra space | Modifies original list temporarily |

## Key Insights

```
Input: [7,null] -> [7,1] -> [13,0] -> [10,1] -> [5,null]

Pass 1 - Interleave:
  [7] -> [7'] -> [7] -> [7'] -> [13] -> [13'] -> [10] -> [10'] -> [5] -> [5']

Pass 2 - Set random:
  7'.random = 7.random?.next = null
  7'.random = 7.random?.next = 7'
  13'.random = 13.random?.next = 7'
  10'.random = 10.random?.next = 7'
  5'.random = 5.random?.next = null

Pass 3 - Separate:
  Original: [7] -> [7] -> [13] -> [10] -> [5]
  Clone:    [7'] -> [7'] -> [13'] -> [10'] -> [5']

Return cloneHead
```

## Key Insights

1. **Why interweaving**: Eliminates the need for a hash map by using the list structure itself as the mapping.
2. **Random pointer trick**: `original.random.next` directly gives us the clone of the random target node.
3. **Restoration**: The original list is fully restored after separation, making this a non-destructive operation.
