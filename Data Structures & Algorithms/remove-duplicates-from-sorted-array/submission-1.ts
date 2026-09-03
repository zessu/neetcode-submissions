class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    removeDuplicates(nums: number[]): number {
        const myset = [...new Set(nums)].sort((a,b) => a - b);
        for(let count=0; count < myset.length; count++) {
            nums[count] = myset[count];
        }

        return myset.length;
    }
}
