class MyHashSet {
    values:number[] = [];
    constructor() {}

    /**
     * @param {number} key
     * @return {void}
     */
    add(key: number): void {
        if(!this.values.includes(key)) this.values.push(key);
    }

    /**
     * @param {number} key
     * @return {void}
     */
    remove(key: number): void {
        if(!this.values.includes(key)) return;
        this.values = this.values.filter(item => item != key);

    }

    /**
     * @param {number} key
     * @return {boolean}
     */
    contains(key: number): boolean {
        console.log(this.values);
        return this.values.includes(key);
    }
}

/**
 * Your MyHashSet object will be instantiated and called as such:
 * var obj = new MyHashSet()
 * obj.add(key)
 * obj.remove(key)
 * var param_3 = obj.contains(key)
 */
