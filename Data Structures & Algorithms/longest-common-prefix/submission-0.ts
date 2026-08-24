class Solution {
    /**
     * @param {string[]} strs
     * @return {string}
     */
    longestCommonPrefix(strs: string[]): string {
        let ans = "";
        if(!strs.length) return ans;
        const word = strs[0];
        const wordChars = word.split('');
        for(let count=0; count<wordChars.length; count++) {
            if(!strs.every(str => str[count] === wordChars[count])) return ans;
            ans += wordChars[count];
        } 
        return ans;
    }
}
