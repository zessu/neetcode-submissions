class Solution {
    elements = new Map();
    /**
     * @param {number[]} nums
     * @param {number} target
     * @return {number[]}
     */
    twoSum(nums, target) {
        for(let i=0;i<nums.length;i++) {
            const rem = target - nums[i];
            if(this.elements.has(rem)) {
                return [this.elements.get(rem), i];
            }
            this.elements.set(nums[i], i);
        }
    }
}
