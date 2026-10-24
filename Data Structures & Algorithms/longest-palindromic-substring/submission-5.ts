class Solution {
    originalString = "";
    longestLength = 0;
    answer = [0,0];
    
    longestPalindrome(s) {
        this.originalString = s;
        // code here
        for(let i =0; i< s.length; i++) {
            this.workout(i, i);
            this.workout(i, i + 1); // for even palindromes
        }
        const [a,b] = this.answer;
        console.log(this.answer);
        return this.originalString.substring(a,b + 1);
    }
    
    workout(left, right, isOdd: boolean = false) {
        while(left >= 0 && right < this.originalString.length && this.originalString[left] === this.originalString[right]) {
            const length = (right + 1) - left;
            if(length > this.longestLength) {
                this.longestLength = length;
                this.answer = [isOdd ? left - 1: left, right];
            }
            left--;
            right++;
        }
    }
}