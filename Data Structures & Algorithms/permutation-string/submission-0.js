class Solution {
    /**
     * @param {string} s1
     * @param {string} s2
     * @return {boolean}
     */
    checkInclusion(s1, s2) {
      const l1 = s1.length;
      const l2  = s2.length;
      const arr1 = Array.from({length:26}).fill(0);
      
      if(l1 > l2) return false;

      for(let count=0; count<l1; count++) {
        const char = s1[count];
        const idx = char.charCodeAt(0) - 97;
        arr1[idx] = arr1[idx] ? (arr1[idx] + 1): 1;
      }

      let start = 0;
      let end = start + l1;

      while(end <= l2) {
        const arr2 = Array.from({length:26}).fill(0);
        for(let count=0; count<l1; count++) {
          const char = s2[start + count];
          const idx = char.charCodeAt(0) - 97;
          arr2[idx] = arr2[idx] ? (arr2[idx] + 1): 1;
        }

        const isEqual = arr1.length === arr2.length && arr1.every((item, idx) => item === arr2[idx]);

        console.log(`is equal ${isEqual}`);

        if(isEqual) return true;

        start++;
        end = start + l1;
      }

      return false;
    }
}