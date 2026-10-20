class Solution {
    /**
    * @param number[] arr
    * @returns number[][]
    */
    triplets(arr) {
        // code here
        const result = [];
        const sorted = arr.sort((a,b) => a-b);
        const resultMap = new Map();
        
        for(let count =0; count < arr.length - 2; count ++) {
            let left = count + 1;
            let right = arr.length - 1;
            
            while(left < right) {
                const sum = arr[count] + arr[left] + arr[right];
                const key = `${arr[count]},${arr[left]},${arr[right]}`;
                if(sum === 0 && !resultMap.get(key)) {
                    result.push([arr[count], arr[left], arr[right]]);
                    resultMap.set(key, true);
                    left++;
                    right--;
                } else if (sum > 0) {
                    right--;
                } else {
                    left++;
                }
            }
        }
        
        return result;
    }
}
