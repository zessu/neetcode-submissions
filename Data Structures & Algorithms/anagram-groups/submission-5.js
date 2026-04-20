class Solution {
    res = new Map();
    /**
     * @param {string[]} strs
     * @return {string[][]}
     */
    groupAnagrams(strs) {
        for(const value in strs) {
            const val = strs[value].split('').sort().join('');
            if(!this.res.get(val)) {
                this.res.set(val, [strs[value]])
            } else {
                this.res.get(val).push(strs[value]);
            }
        }

        const ret = [];
        for(const value of this.res.values()) {
            ret.push(value);
        }
        return ret;
    }
}
