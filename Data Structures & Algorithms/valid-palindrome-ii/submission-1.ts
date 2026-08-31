class Solution {
    /**
     * @param {string} s
     * @return {boolean}
     */
    validPalindrome(s: string): boolean {
        if(s === s.split('').reverse().join('')) return true;
        let left = 0;
        let right = s.length - 1;
        while(left < right) {
            if(!(s[left] === s[right])) {
                const leftstr = s.slice(0, left) + s.slice(left + 1);
                const rightstr = s.slice(0, right) + s.slice(right + 1);
                if(leftstr === leftstr.split('').reverse().join('') || rightstr === rightstr.split('').reverse().join('')) return true;
            }
            left++;
            right--;
        }
        return false;
    }
}