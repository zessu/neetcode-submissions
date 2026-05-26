class Solution {
    /**
     * @param {string} s
     * @return {number}
     */
    lengthOfLongestSubstring(s) {
        const charSet = new Set();
        let leftPtr = 0;
        let res = 0;

        for(let rightPtr = 0; rightPtr < s.length; rightPtr++) {
            while(charSet.has(s[rightPtr])) {
                charSet.delete(s[leftPtr]);
                leftPtr++;
            }
            charSet.add(s[rightPtr]);
            res = Math.max(res,  rightPtr - leftPtr + 1)
        }

        return res;
    }
}