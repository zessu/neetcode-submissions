class LRUCache {
    capacity: number;
    store: Map<number, number>;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.store = new Map();
    }

    get(key: number): number {
        if (!this.store.has(key)) return -1;
        
        const value = this.store.get(key)!;
        this.store.delete(key);
        this.store.set(key, value);
        
        return value;
    }

    put(key: number, value: number): void {
        if (this.store.has(key)) {
            this.store.delete(key);
        }
        
        if (this.store.size >= this.capacity) {
            const firstKey = this.store.keys().next().value;
            this.store.delete(firstKey);
        }
        
        this.store.set(key, value);
    }
}