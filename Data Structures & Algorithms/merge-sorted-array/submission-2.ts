class Solution {
    /**
     * @param {number[]} nums1
     * @param {number} m
     * @param {number[]} nums2
     * @param {number} n
     * @return {void} Do not return anything, modify nums1 in-place instead.
     */
    merge(nums1: number[], m: number, nums2: number[], n: number): void {
        for(let count = 0; count<nums2.length; count++) {
            nums1[nums1.length - (count + 1)] = nums2[count];
        }
        nums1.sort((a,b) => a - b);
    }
}
