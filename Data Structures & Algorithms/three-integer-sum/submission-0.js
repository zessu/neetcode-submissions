class Solution {
    threeSum(nums) {
        const keys = new Map();
        const ans = [];

        if(nums.length<3) return;

        for(let i=0; i <= nums.length - 3; i++) {
            for(let j = i+1; j <= nums.length - 2; j++) {
                for(let k = j+1; k <= nums.length -1; k++) {
                    if((nums[i] + nums[j] + nums[k]) === 0) {
                        const newArr = [nums[i], nums[j], nums[k]].sort();
                        const key = `${newArr[0]}${newArr[1]}${newArr[2]}`;
                        if(!keys.has(key)) {
                            ans.push(newArr);
                            keys.set(key, true);
                        }
                    }
                }
            }
        }

        return ans;
    }
}
