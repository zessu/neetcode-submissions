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
   * @return {void}
   */
  reorderList(head: ListNode | null): void {
    let slow = head;
    let fast = head;

    while (fast !== null && fast.next !== null) {
      slow = slow.next;
      fast = fast.next.next;
    }

    let prev = null;
    let curr = slow.next;
    slow.next = null;

    while (curr) {
      let temp = curr.next;
      curr.next = prev;
      prev = curr;
      curr = temp;
    }

    let ptr1 = head;
    let ptr2 = prev;

    while (ptr2) {
      const first = ptr1.next;
      const second = ptr2.next;

      ptr1.next = ptr2;
      ptr2.next = first;
      ptr1 = first;
      ptr2 = second;
    }
  }
}
