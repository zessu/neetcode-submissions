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
    /**
     * @param {ListNode} head
     * @return {boolean}
     */
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
