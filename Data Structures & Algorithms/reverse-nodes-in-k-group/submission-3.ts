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
