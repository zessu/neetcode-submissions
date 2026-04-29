class TimeMap {
    keyStore;
    constructor() {
        this.keyStore = new Map();
    }

    /**
     * @param {string} key
     * @param {string} value
     * @param {number} timestamp
     * @return {void}
     */
    set(key, value, timestamp) {
        const existing = this.keyStore.get(key);
        const keys = existing ? [...existing.keys, timestamp] : [timestamp];
        const values = existing ? [...existing.values, value] : [value];;
        this.keyStore.set(key, {keys, values});
    }

    /**
     * @param {string} key
     * @param {number} timestamp
     * @return {string}
     */
    get(key, timestamp) {
        const existing = this.keyStore.get(key);
        if(!existing) return "";
        const idx =  existing.keys.findIndex((item) => item === timestamp);
        if(idx >= 0) return existing.values[idx];
        // else we need to loop from val to 0 attempting to find value 
        for(let i = timestamp - 1; i >= 0; i--) {
            const idx =  existing.keys.findIndex((item) => item === i);
            if(idx>=0) return existing.values[idx];
        }

        return "";
    }
}