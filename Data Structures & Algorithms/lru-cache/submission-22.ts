class LRUCache {
    private capacity: number;
    private store: Map<number, number>;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.store = new Map<number, number>();
    }

    get(key: number): number {
        if (!this.store.has(key)) {
            return -1;
        }
        
        const value = this.store.get(key)!;
        this.store.delete(key);
        this.store.set(key, value);
        
        return value;
    }

    put(key: number, value: number): void {
        const keyExists = this.store.has(key);
        const cacheIsFull = this.store.size === this.capacity;
        
        if (keyExists) {
            this.store.delete(key);
            this.store.set(key, value);
            return;
        }
        
        if (cacheIsFull) {
            const leastRecentlyUsedKey = this.store.keys().next().value;
            this.store.delete(leastRecentlyUsedKey);
            this.store.set(key, value);
            return;
        }

        this.store.set(key, value);
    }
}