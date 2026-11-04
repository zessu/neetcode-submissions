class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    subsetXORSum(nums: number[]): number {

        const recurr = (i: number, total: number) => {
            if(i === nums.length) return total;

            return recurr(i+1, total) + recurr(i+1, total ^ nums[i]);
        }


        return recurr(0, 0);
    }
}
