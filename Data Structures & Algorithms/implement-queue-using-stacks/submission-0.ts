class MyQueue {
    arr1: number[] = [];
    arr2: number[] = [];
    constructor() {
    }

    /**
     * @param {number} x
     * @return {void}
     */
    push(x: number): void {
        this.arr1.push(x);
    }

    /**
     * @return {number}
     */
    pop(): number {
        while(this.arr1.length > 1) {
            this.arr2.push(this.arr1.pop());
        }
        const res = this.arr1.pop();
        while(this.arr2.length) {
            this.arr1.push(this.arr2.pop());
        }
        return res;
    }

    /**
     * @return {number}
     */
    peek(): number {
        while(this.arr1.length > 1) {
            this.arr2.push(this.arr1.pop());
        }
        const res = this.arr1[0];
        while(this.arr2.length > 0) {
            this.arr1.push(this.arr2.pop());
        }
        return res;
    }

    /**
     * @return {boolean}
     */
    empty(): boolean {
        return !this.arr1.length;
    }
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */
