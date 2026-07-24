# Merge k Sorted Lists - Solution

## Solution Code

```typescript
class Solution {

    mergeKLists(lists: ListNode[]): ListNode {
        const newNode = new ListNode();
        let curr = newNode;
        while(true) {
            const values: number[] = lists.map(list => list?.val ?? Infinity );
            const minValue = Math.min(...values);
            if(minValue === Infinity) break;
            const minIndex = values.indexOf(minValue);
            curr.next = lists[minIndex];
            lists[minIndex] = lists[minIndex].next;
            curr = curr.next;
        }

        return newNode.next;
    }
}
```

## Approach

The solution uses **Iterative Min Selection** to merge the lists.

1. **Dummy head**: Create a dummy node to simplify list construction.
2. **Find minimum**: At each iteration, map all list heads to their values (using Infinity for null), then find the minimum.
3. **Append and advance**: Append the node with the minimum value to the result and advance that list.
4. **Termination**: When all lists are exhausted (minValue is Infinity), break and return.

- **Time Complexity**: O(k * N) where k is the number of lists and N is the total number of nodes.
- **Space Complexity**: O(1) beyond the result list.

## Comparison

| Approach | Time Complexity | Space Complexity | Pros | Cons |
| :--- | :--- | :--- | :--- | :--- |
| **Collect & Sort** | $O(N \log N)$ | $O(N)$ | Simple | Doesn't leverage sorted input |
| **Iterative Min Selection** | $O(k \cdot N)$ | $O(1)$ | No extra space, simple | O(k) per step to find min |
| **Min-Heap** | $O(N \log k)$ | $O(k)$ | Optimal time complexity | Requires heap data structure |

## Key Insights

```
Input: lists = [[1,4,5], [1,3,4], [2,6]]

Iteration 1: values = [1, 1, 2], min = 1, index = 0
  Result: 1, lists = [[4,5], [1,3,4], [2,6]]

Iteration 2: values = [4, 1, 2], min = 1, index = 1
  Result: 1->1, lists = [[4,5], [3,4], [2,6]]

Iteration 3: values = [4, 3, 2], min = 2, index = 2
  Result: 1->1->2, lists = [[4,5], [3,4], [6]]

Iteration 4: values = [4, 3, 6], min = 3, index = 1
  Result: 1->1->2->3, lists = [[4,5], [4], [6]]

Iteration 5: values = [4, 4, 6], min = 4, index = 0
  Result: 1->1->2->3->4, lists = [[5], [4], [6]]

Iteration 6: values = [5, 4, 6], min = 4, index = 1
  Result: 1->1->2->3->4->4, lists = [[5], [], [6]]

Iteration 7: values = [5, Inf, 6], min = 5, index = 0
  Result: 1->1->2->3->4->4->5, lists = [[], [], [6]]

Iteration 8: values = [Inf, Inf, 6], min = 6, index = 2
  Result: 1->1->2->3->4->4->5->6, lists = [[], [], []]

min = Infinity, break. Return result.
```

## Key Insights

1. **Why min selection**: Simple approach that works by always picking the smallest available head.
2. **Infinity sentinel**: Using Infinity for null lists ensures they're never picked as the minimum.
3. **Tradeoff**: O(k) per step to scan all heads; a min-heap reduces this to O(log k).
