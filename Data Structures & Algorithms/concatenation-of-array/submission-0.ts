class Solution {
    /**
     * @param {number[]} nums
     * @return {number[]}
     */
    getConcatenation(nums: number[]): number[] {
        const res: number[] = Array.from({length: nums.length * 2}).fill(0) as number[];
        return res.map((_, idx) => {
            const index = idx % nums.length;
            return nums[index];
        });
    }
}