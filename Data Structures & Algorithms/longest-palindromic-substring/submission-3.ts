class Solution {
    originalString = "";
    answer = "";
    
    longestPalindrome(s) {
        this.originalString = s;
        // code here
        for(let i =0; i< s.length; i++) {
            this.workout(i, i);
            this.workout(i, i + 1);
        }
        
        return this.answer;
    }
    
    workout(left, right) {
        while(left >= 0 && right < this.originalString.length && this.originalString[left] === this.originalString[right]) {
            const substring = this.originalString.substring(left, right + 1);
            if(substring.length > this.answer.length) {
                this.answer = substring;
            }
            left--;
            right++;
        }
    }
}