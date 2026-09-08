class Solution {
    /**
     * @param {number[]} nums
     * @return {number[]}
     */
    sortArray(nums: number[]): number[] {
        return this.mergeSort(nums);
    }

    mergeSort(nums: number[]) {
        if(nums.length < 2) return nums;
        const mid = Math.floor(nums.length / 2);
        const leftArr = nums.slice(0, mid);
        const rightArr = nums.slice(mid);
        return this.merge(this.mergeSort(leftArr), this.mergeSort(rightArr));
    }

    merge(leftArr: number[], rightArr: number[]) {
        const temp = [];
        while(leftArr.length && rightArr.length) {
            if(leftArr[0] < rightArr[0]) {
                temp.push(leftArr.shift());
            } else {
                temp.push(rightArr.shift());
            }
        }

        return [...temp, ...leftArr, ...rightArr];
    }
}
