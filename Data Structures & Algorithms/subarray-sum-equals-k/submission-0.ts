class Solution {
    /**
     * @param {number[]} nums
     * @param {number} k
     * @return {number}
     */
    subarraySum(nums: number[], k: number): number {
        let sum= 0;
        let result = 0;
        const hashMap = new Map<number, number>();
        hashMap.set(0, 1);

        for(const num of nums) {
            sum += num;
            const diff = sum - k;
            const occurence = hashMap.get(diff) || 0;
            result += occurence;
            hashMap.set(sum, (hashMap.get(sum) || 0) + 1);
        }
        return result;
    }
}