class Solution {
    /**
     * @param {number[]} heights
     * @return {number}
     */
    maxArea(heights) {
        const end = heights.length;
        const areas = [];

        for(let i=0; i<end; i++) {
            for(let j=i+1; j<end; j++) {
                if(i===j) return;
                const minHeight = Math.min(heights[i], heights[j]);
                const length = j-i;
                const area = minHeight * length;
                areas.push(area);
            }
        }
        areas.sort((a,b) => b-a);
        return areas[0];
    }
}