# Valid Anagram - Solution

## Solution Code (Sorting)

```javascript
class Solution {
    /**
     * @param {string} s
     * @param {string} t
     * @return {boolean}
     */
    isAnagram(s, t) {
        if(s.length !== t.length) return false;
        if(s.split('').sort().join('') !== t.split('').sort().join('')) return false;
        return true;
    }
}
```

## Solution Code (Character Count - Optimal)

```javascript
class Solution {
    isAnagram(s, t) {
        if (s.length !== t.length) return false;
        
        const count = new Array(26).fill(0);
        
        for (const c of s) {
            count[c.charCodeAt(0) - 97]++;
        }
        for (const c of t) {
            count[c.charCodeAt(0) - 97]--;
        }
        
        // Check if any count is non-zero
        return count.every(c => c === 0);
    }
}
```

## Approach

Two main approaches:

### 1. Sorting
- Sort both strings
- Compare if equal

### 2. Character Count (Optimal)
- Use array of size 26 to count frequencies
- Increment for string `s`, decrement for string `t`
- All zeros = valid anagram

## Complexity Analysis

**Sorting Approach**:
- Time: `O(n log n)`
- Space: `O(n)`

**Character Count**:
- Time: `O(n)`
- Space: `O(1)` - fixed 26-element array

## Walkthrough

```
s = "anagram", t = "nagaram"

Count array (index based on a-z):
- Loop s: a=3, n=1, g=1, m=1, r=1
- Loop t: a-3, n-1, g-1, m-1, r-1

Final counts: [0,0,0,...] → valid anagram ✓
```