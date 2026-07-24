# Add Two Numbers - Solution

## Solution Code

```typescript
class Solution {
    printLinkedList(list) {
        const values = [];
        let head = list;
        while(head) {
            values.push(head.val);
            head = head.next;
        }
        console.log(values.join("->"));
    }

    appendNode(head, node) {
        let curr = head;
        let prev = head;
        while(curr) {
            prev = curr;
            curr = curr.next;
        }
        prev.next = node;
    }
    
    addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode {
        let ptr1 = l1;
        let ptr2 = l2;
        let finalList = null;
        let rem = 0;
        let dirty = false;

        while(ptr1 || ptr2) {
            if(!ptr1) ptr1 = { val: 0, next: null};
            if(!ptr2) ptr2 = { val: 0, next: null};

            const sum = ptr1.val + ptr2.val + rem;
            rem = sum - 10 >= 0 ? 1 : 0;

            const newNode = { val: sum % 10, next: null};
            if(!dirty) {
                finalList = newNode;
                dirty = true;
            } else {
                this.appendNode(finalList, newNode);
            }

            ptr1 = ptr1.next;
            ptr2 = ptr2.next;
        } 

        if(rem) this.appendNode(finalList, {val: 1, next: null});

        this.printLinkedList(finalList);
        return finalList;
    }
}
```

## Approach

The solution uses **Elementary Math** with digit-by-digit addition.

1. **Initialize pointers**: `ptr1` and `ptr2` traverse both input lists.
2. **Handle unequal lengths**: If one pointer reaches null, replace it with a node of value 0.
3. **Add with carry**: At each step, compute `sum = ptr1.val + ptr2.val + rem`. The new digit is `sum % 10` and the carry is `1` if `sum >= 10`, else `0`.
4. **Build result list**: The first node becomes `finalList`; subsequent nodes are appended via `appendNode`.
5. **Final carry**: After the loop, if `rem` is still 1, append an extra node.

- **Time Complexity**: O(max(m, n)) where m and n are the lengths of the two lists.
- **Space Complexity**: O(max(m, n)) for the result linked list.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Convert to Integers** | $O(\max(m, n))$ | $O(\max(m, n))$ | Simple to understand | Integer overflow for large numbers |
| **Elementary Math** | $O(\max(m, n))$ | $O(\max(m, n))$ | No overflow, works for any size | Slightly more code |

## Key Insights

```
Input: l1 = [2,4,3], l2 = [5,6,4]

Iteration 1: ptr1=2, ptr2=5, rem=0
  sum = 2 + 5 + 0 = 7
  rem = 0
  finalList = [7]

Iteration 2: ptr1=4, ptr2=6, rem=0
  sum = 4 + 6 + 0 = 10
  rem = 1
  finalList = [7, 0]

Iteration 3: ptr1=3, ptr2=4, rem=1
  sum = 3 + 4 + 1 = 8
  rem = 0
  finalList = [7, 0, 8]

Loop exits: ptr1=null, ptr2=null, rem=0
Return [7, 0, 8]
```

## Key Insights

1. **Why elementary math**: Avoids integer overflow since we process one digit at a time.
2. **Carry propagation**: The carry from one position flows to the next, exactly like manual addition.
3. **Unequal lengths**: Treating null as value 0 elegantly handles lists of different lengths without extra conditionals.
