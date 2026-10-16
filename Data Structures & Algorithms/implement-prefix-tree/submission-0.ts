class PrefixTree {
    root = {};

    constructor() {}

    /**
     * @param {string} word
     * @return {void}
     */
    insert(word: string): void {
        let localRoot = this.root;
        for(const char of word.split('')) {
            if(!localRoot[char]) {
                localRoot[char] = {};
            }
            localRoot = localRoot[char];
        }
        localRoot["isWord"] = true;
    }

    /**
     * @param {string} word
     * @return {boolean}
     */
    search(word: string): boolean {
        let localRoot = this.root;
        for(const char of word.split('')) {
            localRoot = localRoot[char];
            if(!localRoot) return false;
        }
        return localRoot["isWord"] || false;
    }

    /**
     * @param {string} prefix
     * @return {boolean}
     */
    startsWith(prefix: string): boolean {
        let localRoot = this.root;
        for(const char of prefix.split('')) {
            localRoot = localRoot[char];
            if(!localRoot) return false;
        }
        return true;
    }
}
