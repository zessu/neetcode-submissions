class Solution {
    /**
     * @param {string} word1
     * @param {string} word2
     * @return {string}
     */
    mergeAlternately(word1: string, word2: string): string {
        let result = "";
        while(word1.length || word2.length) {
            if(!word1.length) {
                result += word2;
                break;
            }
            if(!word2.length) {
                result += word1;
                break;
            }
            result += word1.slice(0,1);
            result += word2.slice(0,1);

            word1 = word1.slice(1);
            word2 = word2.slice(1);
        }
        return result;
    }
}
