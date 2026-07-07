class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    findDuplicate(nums: number[]): number {
        const existing = new Set();

        for(const num in nums) {
            if(existing.has(nums[num])) return nums[num];
            existing.add(nums[num]);
        }
    }
}
