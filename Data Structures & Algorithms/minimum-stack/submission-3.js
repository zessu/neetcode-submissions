class MinStack {
    items = [];
    minimums  = [];

    constructor() { }

    /**
     * @param {number} val
     * @return {void}
     */
    push(val) {
        this.items.push(val);
        const currentMinimum = this.minimums.length === 0 ? val: this.getMin();
        this.minimums.push(Math.min(val, currentMinimum));
    }

    /**
     * @return {void}
     */
    pop() {
        this.items.pop();
        this.minimums.pop();
    }

    /**
     * @return {number}
     */
    top() {
        return this.items[this.items.length - 1];
    }

    /**
     * @return {number}
     */
    getMin() {
        return this.minimums[this.minimums.length - 1];
    }
}
