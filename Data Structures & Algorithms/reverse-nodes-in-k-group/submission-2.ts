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
        console.log(`head at ${head?.val} tail at ${tail?.val}`);
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
        console.log("printing list");
        this.printList(prev);
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
        // 1. count the number of elements
        const totalElements = this.countElements(head);
        console.log(`totalElements ${totalElements}`);
        // 2. figure out the number of times we need to loop by diving by k
        const subsetTotal = Math.floor(totalElements / k);
        console.log(`subsetTotal ${subsetTotal}`);
        // 3. figure out start and tail
        let elementsTotal = k;
        console.log(`elementsTotal ${elementsTotal}`)
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
            // 4. reverse sub set
            tail = curr?.next;
            const [pv, nh] = this.reverseSubset(start, elementsTotal - 1, tail);
            console.log(`${nh.val} ::: ${pv.val}`);
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

        // 5. return value

        console.log("ending function");

        this.printList(retHead);
        return retHead;
    }
}
