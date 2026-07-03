class Solution {

  printLinkedList(head: Node | null) {
    const vals = [];
    let curr = head;
    while (curr) {
      vals.push(curr.val);
      vals.push(curr.random?.val ?? "**");
      curr = curr.next;
    }

    console.log(vals.join("->"));
  }

  copyRandomList(head: Node | null): Node | null {
    if (!head) return null;
    // attach links to clones
    let curr = head;

    this.printLinkedList(head);

    while (curr) {
      const clone: Node = { val: curr.val, next: null, random: null };
      const currNext = curr.next;
      curr.next = clone;
      clone.next = currNext;
      curr = clone.next;
    }

    this.printLinkedList(head);

    // > Node {
    //   val: 5,
    //   next: null,
    //   random: Node {
    //     val: 7,
    //     next: Node { val: 4, next: [Circular 
    // *1], random: [Node] },
    //     random: [Circular *1]
    //   }

    // attach random links to clones
    curr = head;
    while (curr) {
      const clone = curr.next;
      clone.random = curr?.random?.next ?? null;
      curr = clone.next;
    }

    this.printLinkedList(head);

    // detach next links
    curr = head;
    const cloneHead = curr.next;

    while (curr) {
      const clone = curr.next;
      const temp1 = clone?.next;
      curr.next = temp1;
      clone.next = temp1 ? temp1.next : null;
      curr = temp1;
    }

    this.printLinkedList(cloneHead);

    // return head
    return cloneHead;
  }
}
