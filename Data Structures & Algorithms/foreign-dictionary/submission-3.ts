class Solution {
    adj: Map<string, Set<string>> = new Map();

    /**
     * @param {string[]} words
     * @returns {string}
     */
    foreignDictionary(words: string[]): string {
        for (const word of words) {
            for (const c of word) {
                //this.adj.getOrInsert(c, new Set()); <- newer method you can use
                if(!this.adj.has(c)) this.adj.set(c, new Set());
            }
        }

        for (let i = 0; i < words.length - 1; i++) {
            if (!this.compareStrings(words[i], words[i + 1])) return "";
        }

        return this.topologicalSort();
    }

    compareStrings(str1: string, str2: string): boolean {
        const l = Math.min(str1.length, str2.length);
        for (let i = 0; i < l; i++) {
            if (str1[i] !== str2[i]) {
                this.adj.get(str1[i])!.add(str2[i]);
                return true;
            }
        }
        // No difference found: str1 must not be longer than str2
        return str1.length <= str2.length;
    }

    topologicalSort(): string {
        console.log(this.adj);
        const visited = new Set<string>();
        let path = new Set<string>(); // use this to keep track of cycles
        const result: string[] = [];

        // Returns true if a cycle is detected
        const dfs = (node: string): boolean => {
            path.add(node);

            // make sure we delete stuff on the older path
            // make sure we check if something is visited so we do not repeat
            // return the right boolean return types

            for (const next of this.adj.get(node)!) {
                if (path.has(next)) return true; // back edge: cycle
                // if (visited.has(next)) return false;
                if(!visited.has(next) && dfs(next)) return true;
            }

            path.delete(node);
            visited.add(node);
            result.push(node);

            return false;
        };

        for (const c of this.adj.keys()) {
            path = new Set<string>();
            if(!visited.has(c) && dfs(c)) return  "";
        }

        return result.reverse().join("");
    }
}