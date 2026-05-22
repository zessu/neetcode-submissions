class Solution {
    /**
     * @param {number[]} nums1
     * @param {number[]} nums2
     * @return {number}
     */
    findMedianSortedArrays(nums1, nums2) {
        const length1 = nums1.length;
        const length2 = nums2.length;
        const combinedLength = length1 + length2;
        const medianLength = Math.floor(combinedLength / 2);
        const sameLength = length1 === length2;
        const hasEvenLength = combinedLength % 2 === 0;
        const eitherIsEmpty = nums1.length === 0 || nums2.length === 0;
        let smallerArray = [];
        let largerArray = [];

        if(!sameLength) {
            smallerArray = length1 < length2 ? nums1: nums2;
            largerArray = smallerArray === nums1 ? nums2 : nums1;
        } else {
            smallerArray = nums1[0] < nums2[0] ? nums1: nums2;
            largerArray = smallerArray === nums1 ? nums2 : nums1;
        }

        console.log(smallerArray);

        // logic doesnt work only for 3 length arrays 
        if (combinedLength === 3) {
        return Math.min(largerArray[largerArray.length - 1], smallerArray[smallerArray.length - 1]);
        }

        if(eitherIsEmpty) {
            const length = largerArray.length;
            const isEven = length % 2 === 0;
            const mid = Math.floor(length/2);
            return isEven ? (largerArray[mid] + largerArray[mid - 1])/2: largerArray[mid];
        }

        let leftPointer = 0;
        let rightPointer = smallerArray.length - 1;
        let loop = true;
        let leftPartition = [];
        let rightPartition = [];
        let med = 0;
        let remainingItemsLength = 0;

        while(loop) {
            med = Math.floor((leftPointer + rightPointer) / 2);
            leftPartition = smallerArray.slice(0, med + 1);
            remainingItemsLength = (medianLength - leftPartition.length) + 1;
            rightPartition = largerArray.slice(0, remainingItemsLength);

            console.log(`left : ${leftPartition} right ${rightPartition} remaining ${remainingItemsLength}`);

            console.log(`comparing ${leftPartition[leftPartition.length - 1]} and ${largerArray[remainingItemsLength]}`);
            console.log(`and ${rightPartition[rightPartition.length - 1]} and ${smallerArray[med + 1]}`)

            if(
                (leftPartition[leftPartition.length - 1] < largerArray[remainingItemsLength]) &&
                (rightPartition[rightPartition.length - 1] < smallerArray[med + 1])
                ) {
                    // found it
                    loop = false;
            } else {
                leftPointer = med + 1;
            }

            if(med === smallerArray.length - 1) {
                // item in the smaller array sorted already
                loop = false;
            }
        }

        if(hasEvenLength) {
            let num1 = 0
            let num2 = 0;
            if(rightPartition.length === 1) {
                num1 = leftPartition[med];
                num2 = rightPartition[rightPartition.length - 1];
                return (num1 + num2) / 2;
            } else {
                num1 = Math.max(leftPartition[med], rightPartition[rightPartition.length - 2]);
                num2 = rightPartition[rightPartition.length - 1]
            }

        return (num1 + num2) / 2;

        }
        
        return Math.max(leftPartition[leftPartition.length -1], rightPartition[rightPartition.length-1]);

    }
}

const sol = new Solution();
const arr1 = [1,2,3,9];
const arr2 = [5,6,7,8];
const ans = sol.findMedianSortedArrays(arr1, arr2);
console.log(ans);