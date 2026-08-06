class Solution {
    /**
     * @param {number[]} nums
     * @param {number} target
     * @return {number}
     */
    search(nums, target) {
        let left = 0;
        let right = nums.length - 1;

        while(left<=right) {
            let mid = Math.floor((left+right)/2);

            if(nums[mid] === target) return mid;

            if(nums[mid] < nums[right]) {
                // sorted to the right
                if(target > nums[mid] && target <= nums[right]) {
                    // search to the right
                    left = mid + 1;
                } else {
                    // search to the left
                    right = mid - 1;
                }
            } else {
                // sorted to the left
                if(target >= nums[left] && target < nums[mid]) {
                    // search to the left
                    right = mid - 1;
                } else {
                    // search to the right
                    left = mid + 1;
                }
            }
        }

        return -1;
    }
}

const sol = new Solution();
const nums=[4,5,6,7,0,1,2]
const target=0
console.log(sol.search(nums, target));