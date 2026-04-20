class Solution {
    /**
     * @param {number[]} height
     * @return {number}
     */
    trap(height) {
        let sum = 0;

        for(let count=0; count<height.length; count++) {
            let maxLeft = height[count];
            let maxRight = height[count];        

            for(let i=0; i<count; i++) {
                maxLeft = Math.max(maxLeft, height[i]);
            }

            for(let j=height.length-1; j>count; j--) {
                maxRight = Math.max(maxRight, height[j]);
            }

            sum += (Math.min(maxLeft, maxRight) - height[count]) || 0;
        }

        return sum;
    }

}
