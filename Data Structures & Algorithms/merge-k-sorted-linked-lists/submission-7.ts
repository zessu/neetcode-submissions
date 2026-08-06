/**
 * Definition for singly-linked list.
 * class ListNode {
 *     constructor(val = 0, next = null) {
 *         this.val = val;
 *         this.next = next;
 *     }
 * }
 */

class Solution {

    mergeKLists(lists: ListNode[]): ListNode {
        const newNode = new ListNode();
        let curr = newNode;
        while(true) {
            const values: number[] = lists.map(list => list?.val ?? Infinity );
            const minValue = Math.min(...values);
            console.log(minValue);
            if(minValue === Infinity) break;
            const minIndex = values.indexOf(minValue);
            curr.next = lists[minIndex];
            lists[minIndex] = lists[minIndex].next;
            curr = curr.next;
        }

        return newNode.next;
    }
}