class Solution {
    /**
     * @param {number[]} nums
     * @param {number} val
     * @return {number}
     */
    removeElement(nums: number[], val: number): number {
        let ans = 0;

        for(let count=0; count<nums.length; count++) {
            if(nums[count] === val) {
                nums.splice(count, 1, Infinity);
            }
        }

        nums.map(num => num === Infinity ? ans += 0: ans += 1);
        nums = nums.sort();

        return ans;
    }
}
