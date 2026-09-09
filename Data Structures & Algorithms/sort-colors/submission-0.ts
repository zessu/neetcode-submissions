class Solution {
    /**
     * @param {number[]} nums
     * @return {void} Do not return anything, modify nums in-place instead.
     */
    sortColors(nums: number[]): void {
        const counts: number[] = Array.from({length:3}).fill(0) as number[];
        for(let count=0; count<nums.length; count++) {
            counts[nums[count]]++;
        }

        let index = 0;
        for(let count=0; count<3; count++) {
            let iter = counts[count];
            while(iter > 0) {
                nums[index] = count;
                iter--;
                index++;
            }
        }
    }
}
