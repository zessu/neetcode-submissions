class MyHashMap {
    values: Record<string, number> = {};
    constructor() {}

    /**
     * @param {number} key
     * @param {number} value
     * @return {void}
     */
    put(key: number, value: number): void {
        this.values[key] = value;
    }

    /**
     * @param {number} key
     * @return {number}
     */
    get(key: number): number {
          return key in this.values ? this.values[key] : -1;
    }

    /**
     * @param {number} key
     * @return {void}
     */
    remove(key: number): void {
         if (key in this.values) {
            delete this.values[key];
        }
    }
}

/**
 * Your MyHashMap object will be instantiated and called as such:
 * var obj = new MyHashMap()
 * obj.put(key,value)
 * var param_2 = obj.get(key)
 * obj.remove(key)
 */
