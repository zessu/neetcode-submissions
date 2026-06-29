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
  reverseList(head: ListNode) {
    // reverse linkedlist
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
    // remove element
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
