
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
            if(sum === 10) rem = 1;

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
