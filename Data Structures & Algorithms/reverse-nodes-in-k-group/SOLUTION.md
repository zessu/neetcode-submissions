# Reverse Nodes in k-Group - Solution

## Solution Code

```typescript
class Solution {
    countElements(head: ListNode) {
        let count = 0;
        let curr = head;
        while (curr) {
            count++;
            curr = curr.next;
        }
        return count;
    }

    reverseSubset(head: ListNode, count: number, tail: ListNode) {
        let counter = 0;
        let curr = head;
        let prev = tail;
        while (counter <= count) {
            const next = curr?.next;
            curr.next = prev;
            prev = curr;
            curr = next;
            counter++;
        }
        return [head, prev];
    }

    printList(head: ListNode) {
        const elements = [];
        let curr = head;
        while (curr) {
            elements.push(curr.val);
            curr = curr.next;
        }
        console.log(elements.join("->"));
    }

    reverseKGroup(head: ListNode | null, k: number): ListNode {
        const totalElements = this.countElements(head);
        const subsetTotal = Math.floor(totalElements / k);
        let elementsTotal = k;
        let start = head;
        let curr = null;
        let iterations = 0;
        let retHead = null;
        let prevPtr = null;

        for (let count = 0; count < subsetTotal; count++) {
            curr = start;
            let tail = null;
            for (let count = 0; count < elementsTotal - 1; count++) {
                curr = curr.next;
                tail = curr;
            }
            tail = curr?.next;
            const [pv, nh] = this.reverseSubset(start, elementsTotal - 1, tail);
            if(prevPtr) {
                prevPtr.next = nh;
            }
            prevPtr = pv;
            if(iterations === 0) {
                retHead = nh;
                iterations++;
            }
            start = tail;
        }
        this.printList(retHead);
        return retHead;
    }
}
```

## Approach

The solution uses an **Iterative** approach with group-by-group reversal.

1. **Count total nodes**: Determine how many full groups of k exist.
2. **For each group**: Find the k-th node (tail of the group), then reverse the k nodes.
3. **Connect groups**: Link the tail of the previous reversed group to the head of the current reversed group.
4. **Track result head**: The head of the first reversed group becomes the overall result head.
5. **Remaining nodes**: Any nodes left after the last full group stay in their original order.

- **Time Complexity**: O(n) where n is the number of nodes.
- **Space Complexity**: O(1) - iterative, no extra space.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Recursive** | $O(n)$ | $O(n/k)$ | Elegant, clean code | Recursion stack overhead |
| **Iterative** | $O(n)$ | $O(1)$ | No recursion, constant space | More complex pointer manipulation |

## Key Insights

```
Input: head = [1,2,3,4,5], k = 2

Total elements: 5, Full groups: 2 (5 / 2 = 2)

Group 1: Reverse [1,2]
  Before: 1 -> 2 -> 3 -> 4 -> 5
  After:  2 -> 1 -> 3 -> 4 -> 5
  retHead = 2, prevPtr = 1

Group 2: Reverse [3,4]
  Before: 2 -> 1 -> 3 -> 4 -> 5
  After:  2 -> 1 -> 4 -> 3 -> 5
  prevPtr.next = 4, prevPtr = 3

Remaining: [5] stays as-is (not a full group)

Result: [2,1,4,3,5]
```

## Key Insights

1. **Why iterative**: Avoids recursion stack overhead and works in O(1) space.
2. **Group counting**: Pre-counting ensures we only reverse complete groups of k.
3. **Pointer management**: Carefully tracking `prevPtr` (tail of previous group) and `retHead` (result head) is crucial for connecting reversed groups.
