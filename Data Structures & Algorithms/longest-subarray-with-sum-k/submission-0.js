/**
 * @param {number[]} arr
 * @param {number} k
 * @returns {number}
 */
class Solution {
    longestSubarray(arr, k) {
        // code here
        // keep adding prefix sums all the way to the end
        // for any (sum - k), if the diff is in the map
        // it means theres a gap size k btn some item and this one
        // calculate difference and update max length
        // store index in the map as we dont need it to count here
        let prefixSum = 0;
        let maxLength = 0;
        const diffMap = new Map();
        diffMap.set(0, -1);

        for(const [idx, item] of arr.entries()) {
            prefixSum += item;
            const diff = prefixSum - k;
            if(diffMap.has(diff)) {
                maxLength = Math.max(maxLength, idx - diffMap.get(diff));
            }

            !diffMap.has(prefixSum) && diffMap.set(prefixSum, idx);
        }

        return maxLength;
    }
}
