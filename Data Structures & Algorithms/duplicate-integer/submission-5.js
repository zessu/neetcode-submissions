class Solution {
    elements = new Map();

    /**
     * @param {number[]} nums
     * @return {boolean}
     */
    hasDuplicate(nums) {
        for(let i=0; i<nums.length; i++) {
            if(this.elements.has(nums[i])) return true;
            this.elements.set(nums[i], 1);
        }
        return false;
    }
}
