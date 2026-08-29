class Solution {
    /**
     * @param {character[]} s
     * @return {void} Do not return anything, modify s in-place instead.
     */
    reverseString(s: string[]): void {
        let ptr1 = 0;
        let ptr2 = s.length - 1;
        while(ptr1 < ptr2) {
            const temp = s[ptr1];
            s[ptr1] = s[ptr2];
            s[ptr2] = temp;
            ptr1++;
            ptr2--;
        }
    }
}
