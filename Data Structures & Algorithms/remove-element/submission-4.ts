class Solution {
    removeElement(nums: number[], val: number): number {
        for(let count=0; count<nums.length; count++) {
            if(nums[count] === val) {
                nums.splice(count, 1, Infinity);
            }
        }
        nums = nums.sort();
        return nums.reduce((acc, curr) => acc += curr === Infinity ? 0: 1, 0);
    }
}
