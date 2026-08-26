class Solution {
    /**
     * @param {number[]} nums
     * @return {number}
     */
    majorityElement(nums: number[]): number {
        const mid = Math.floor(nums.length/2);
        const map = new Map<number, number>();
        for(const num of nums) {
            const occurences = map.get(num) ?? 0;
            map.set(num, occurences + 1);
            if(occurences >= mid) return num;
        }
    }
}
