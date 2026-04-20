class Solution {
    sortAndRemoveDuplicates(nums) {
        const sorted = nums.sort((a,b) => a - b);
        const items = new Set(sorted);
        return Array.from(items);
    }

    countSequence(nums) {
        // 0,1,2,3,6,7,8,9,10
        const sequences = [];
        let longestSequence = 0;
        for(let count=0; count<nums.length;count++) {
            const curr = nums[count];
            if(count === 0) {
                longestSequence++;
                continue;
            }
            const prev = nums[count-1];
            if((curr - 1) === prev) {
                longestSequence++;
            } else {
                sequences.push(longestSequence);
                longestSequence = 1;
            }
        }

       sequences.push(longestSequence);

        const res = this.sortAndRemoveDuplicates(sequences);
        return res.length ? res[res.length-1] : 0;
    }

    /**
     * @param {number[]} nums
     * @return {number}
     */
    longestConsecutive(nums) {
        const sortedAndDeDuped = this.sortAndRemoveDuplicates(nums);
        const length = this.countSequence(sortedAndDeDuped);
        return length;
    }
}
