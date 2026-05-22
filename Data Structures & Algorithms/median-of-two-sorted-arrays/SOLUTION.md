# Median of Two Sorted Arrays - Solution

## Solution Code

```javascript
class Solution {
    findMedianSortedArrays(nums1, nums2) {
        const length1 = nums1.length;
        const length2 = nums2.length;
        const combinedLength = length1 + length2;
        const medianLength = Math.floor(combinedLength / 2);
        const hasEvenLength = combinedLength % 2 === 0;
        const eitherIsEmpty = nums1.length === 0 || nums2.length === 0;
        let smallerArray = [];
        let largerArray = [];

        if (length1 <= length2) {
            smallerArray = nums1;
            largerArray = nums2;
        } else {
            smallerArray = nums2;
            largerArray = nums1;
        }

        if (combinedLength === 3) {
            return Math.min(largerArray[largerArray.length - 1], smallerArray[smallerArray.length - 1]);
        }

        if (eitherIsEmpty) {
            const length = largerArray.length;
            const isEven = length % 2 === 0;
            const mid = Math.floor(length / 2);
            return isEven ? (largerArray[mid] + largerArray[mid - 1]) / 2 : largerArray[mid];
        }

        let leftPointer = 0;
        let rightPointer = smallerArray.length - 1;
        let loop = true;
        let leftPartition = [];
        let rightPartition = [];
        let med = 0;
        let remainingItemsLength = 0;

        while (loop) {
            med = Math.floor((leftPointer + rightPointer) / 2);
            leftPartition = smallerArray.slice(0, med + 1);
            remainingItemsLength = (medianLength - leftPartition.length) + 1;
            rightPartition = largerArray.slice(0, remainingItemsLength);

            if (
                (leftPartition[leftPartition.length - 1] < largerArray[remainingItemsLength]) &&
                (rightPartition[rightPartition.length - 1] < smallerArray[med + 1])
            ) {
                loop = false;
            } else {
                leftPointer = med + 1;
            }

            if (med === smallerArray.length - 1) {
                loop = false;
            }
        }

        if (hasEvenLength) {
            let num1 = 0;
            let num2 = 0;
            if (rightPartition.length === 1) {
                num1 = leftPartition[med];
                num2 = rightPartition[rightPartition.length - 1];
                return (num1 + num2) / 2;
            } else {
                num1 = Math.max(leftPartition[med], rightPartition[rightPartition.length - 2]);
                num2 = rightPartition[rightPartition.length - 1];
            }
            return (num1 + num2) / 2;
        }

        return Math.max(leftPartition[leftPartition.length - 1], rightPartition[rightPartition.length - 1]);
    }
}
```

## Approach

The solution attempts to find the median by partitioning the two sorted arrays.

1. **Identify Smaller/Larger Arrays**: To optimize binary search, it always operates on the smaller array.
2. **Handle Base Cases**: Specifically handles empty arrays and combined length of 3.
3. **Binary Search for Partition**: Uses `leftPointer` and `rightPointer` to find a point `med` in the `smallerArray`.
4. **Partition Verification**: Compares elements at the partition boundaries to ensure elements on the left are less than elements on the right.
5. **Median Calculation**:
   - If odd: Returns the maximum of the elements at the partition boundaries.
   - If even: Returns the average of the two middle elements.

## Complexity Analysis

- **Time Complexity**: O(log(min(m, n))) due to binary search on the smaller array.
- **Space Complexity**: O(m + n) in this specific implementation because of `slice` operations.

## Walkthrough

```
nums1 = [1, 2], nums2 = [3, 4]
combinedLength = 4 (Even)
medianLength = 2

Binary Search on nums1:
med = 0
leftPartition = [1]
remainingItemsLength = 2
rightPartition = [3, 4]

Verification:
1 < 4 (True)
4 < 2 (False) -> Adjust pointers

(Note: The implementation in submission-9.js has specific logic that may vary from standard partition binary search)
```

## Key Insights

1. **Partitioning**: The core idea is to divide both arrays into two halves such that the left half and right half have roughly the same number of elements and all elements in the left half are less than or equal to elements in the right half.
2. **Efficiency**: Binary search on the smaller array ensures we reach the result in logarithmic time relative to the smaller array's size.
