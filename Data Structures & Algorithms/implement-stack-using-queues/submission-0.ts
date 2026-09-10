class MyStack {
    elements:number[] = [];
    constructor() {}

    /**
     * @param {number} x
     * @return {void}
     */
    push(x: number): void {
        this.elements.unshift(x);
    }

    /**
     * @return {number}
     */
    pop(): number {
        return this.elements.shift();
    }

    /**
     * @return {number}
     */
    top(): number {
        return this.elements[0];
    }

    /**
     * @return {boolean}
     */
    empty(): boolean {
        return this.elements.length ? false: true;
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = new MyStack()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */
