class Solution {
    /**
     * @param nums - A sorted array of numbers
     * @param target - The value to search for
     * @returns The index of the target, or -1 if not found
     */
    search(nums, target) {
        let start = 0;
        let end = nums.length - 1; // Use inclusive end index

        while (start <= end) {
            // Calculate mid inside the loop based on current bounds
            let mid = Math.floor((start + end) / 2);

            if (nums[mid] === target) {
                return mid;
            }

            if (nums[mid] < target) {
                // Target is in the right half, skip the current mid
                start = mid + 1;
            } else {
                // Target is in the left half, skip the current mid
                end = mid - 1;
            }
        }

        // If the loop finishes without returning, the target isn't there
        return -1;
    }
}