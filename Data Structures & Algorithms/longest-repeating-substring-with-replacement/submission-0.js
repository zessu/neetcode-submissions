class Solution {
    /**
     * @param {string} s
     * @param {number} k
     * @return {number}
     */
    characterReplacement(s, k) {
         let l = 0;
  let r = 1;
  let highestCount = 0;
  let longestString = '';

  while (r < s.length) {
    const substr = s.substring(l, r + 1);
    const charMap = new Map();
    substr.split('').map(char => {
      charMap.get(char) ? charMap.set(char, charMap.get(char) + 1) : charMap.set(char, 1);
    });

    charMap.forEach((val) => {
      highestCount = Math.max(val, highestCount);
    });

    if ((substr.length - highestCount) <= k) {
      charMap.forEach((val, key) => {
        if (val === highestCount) {
          longestString = Array.from({ length: highestCount }).fill(key).join('');
        }
      });
      r++;
    } else {
      l++;
    }
  }

  let str = '';
  if (longestString.length + k > s.length) {
    str = Array.from({ length: s.length }).fill(longestString[0]).join('');
  } else {
    str = Array.from({ length: highestCount + k }).fill(longestString[0]).join('');
  }

  console.log(`longest string is ${str}`);
  return str.length;
    }
}
