class Solution {
    expectedMap: Map<string, number> = new Map();
    evaluationMap: Map<string, number> = new Map();
    found = false;

    minWindow(s:string, t:string) {
        this.expectedMap = this.createExpectedMapping(t);
        let left = 0;
        let right = t.length - 1;
        let shortestSubstring = s;

        while(right < s.length && left <= s.length - t.length) {
            this.evaluationMap = this.createEmptyMapping(t);
            const substr = s.substring(left, right + 1);
            substr.split('').map(char => {
                if(this.expectedMap.get(char)) {
                    this.evaluationMap.set(char, (this.evaluationMap.get(char) || 0) + 1);
                }
            });
            const mapsEqual = this.compareMaps();
            if(!mapsEqual) {
                right = right += 1;
            } else {
                const substr = s.substring(left, right + 1);
                shortestSubstring = shortestSubstring.length < substr.length ? shortestSubstring: substr;
                left = left += 1;
                this.found = true;
            }
        }

        return this.found ? shortestSubstring: "";
    }

    createExpectedMapping(t:string): Map<string, number> {
        return t.split('').reduce((acc:Map<string, number>, char: string) => acc.set(char, (acc.get(char) || 0) + 1), new Map())
    }

    createEmptyMapping(t:string): Map<string, number> {
        return t.split('').reduce((acc:Map<string, number>, char: string) => acc.set(char, 0), new Map())
    }

    compareMaps(): boolean {
        if(this.expectedMap.size !== this.evaluationMap.size) return false;
        for(const [key, val] of this.evaluationMap) {
            if(!(this.expectedMap.get(key)! <= val)) return false;
        }
        return true;
    }
}