class MinStack {
    items = [];
    sorted  = [];

    constructor() { }

    /**
     * @param {number} val
     * @return {void}
     */
    push(val) {
        this.items.push(val);
        this.sorted.push(val);
        this.sorted.sort((a,b) => a - b);
    }

    /**
     * @return {void}
     */
    pop() {
        const popped = this.items.pop();
        const index = this.sorted.findIndex(item => item === popped);
        this.sorted.splice(index, 1);
        this.sorted.sort((a,b) => a - b);
    }

    /**
     * @return {number}
     */
    top() {
        const index = this.items.length - 1 || 0;
        return this.items[index]
    }

    /**
     * @return {number}
     */
    getMin() {
        return this.sorted[0];
    }
}
