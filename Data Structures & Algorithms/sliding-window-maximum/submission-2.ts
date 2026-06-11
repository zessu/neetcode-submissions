class Solution {
    largest = -Infinity;
    nums: number[] = [];
    result: number[] = [];
    k = 0;
    maxSlidingWindow(nums: number[], k: number): number[] {
        this.nums = nums;
        this.k = k;

        let start = 0;
        let end = k - 1;

        while(end < nums.length) {
            this.largest = -Infinity;
            let partition = nums.slice(start, end + 1);
            this.findLargest(partition);
            start++;
            end ++;
        }

        return this.result;
    }

    findLargest(slice: number[]) {
        for(let i=0; i<this.k; i++) {
            this.largest = Math.max(slice[i], this.largest);
        }
        this.result.push(this.largest);
    }
}