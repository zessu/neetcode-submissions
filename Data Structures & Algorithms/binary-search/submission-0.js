class Solution {
    /**
     * @param {number[]} nums
     * @param {number} target
     * @return {number}
     */
    search(nums, target) {
        let start = 0;
        let end = nums.length;
        let mid = Math.floor(nums.length/2);
        let res = -1;
        let count = 0;

        while(start!==end && count <10) {
            console.log(`start:${start} end:${end} mid:${mid}`);
            if(nums[mid] === target) {
                res = mid;
                return res;
            }
            if(nums[mid] < target) {
                start = mid;
                mid = Math.floor((start + end) / 2);
            } 
            
            if (nums[mid] > target) {
                end = mid;
                mid = Math.floor((start + end) / 2);
            }
            count++
        }

        return res;
    }
}