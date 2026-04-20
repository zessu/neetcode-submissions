class Solution {

    itemsMap = new Map();
    /**
     * @param {number[]} nums
     * @param {number} k
     * @return {number[]}
     */
    topKFrequent(nums, k) {
        for(const item in nums) {
            const valueInMap = this.itemsMap.get(nums[item]);
            if(!valueInMap) {
                this.itemsMap.set(nums[item], 0);
            }
            this.itemsMap.set(nums[item], valueInMap ? valueInMap + 1: 1);
        }

        const mapToArray = Array.from(this.itemsMap);
        const sorted = mapToArray.sort((a,b) => b[1] - a[1]);
        const sliced = sorted.slice(0,k);
        return sliced.map(item => item[0]);
    }
}
