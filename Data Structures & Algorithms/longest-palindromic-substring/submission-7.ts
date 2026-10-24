class Solution {
    originalString:string = "";
    longestLength = 0;
    coordinates: number[] = [0,0];
    
    longestPalindrome(s) {
        this.originalString = s;
        for(let i =0; i< s.length; i++) {
            this.workout(i, i);
            this.workout(i, i + 1);
        }
        const [a,b] = this.coordinates;
        return this.originalString.substring(a,b + 1);
    }
    
    workout(left, right) {
        while(left >= 0 && right < this.originalString.length && this.originalString[left] === this.originalString[right]) {
            const length = (right + 1) - left;
            if(length > this.longestLength) {
                this.longestLength = length;
                this.coordinates = [left, right];
            }
            left--;
            right++;
        }
    }
}