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

## Comparison

| Approach | Time Complexity | Space Complexity | Description |
| :--- | :--- | :--- | :--- |
| Brute Force | O(n²) | O(n) | Search and remove each character. Very slow. |
| Sorting | O(n log n) | O(n) | Simple to implement using built-in sort functions. |
| Frequency Counter | O(n) | O(1) | Optimal approach using a fixed-size frequency array. |

**Trade-offs**:
- **Brute Force**: Inefficient for large inputs and complex to implement correctly without bugs.
- **Sorting**: Very clean code and easy to understand. However, it is slower than the frequency counter and usually requires extra space for the sorted versions of the strings.
- **Frequency Counter**: The most efficient in terms of both time and space. It takes advantage of the limited character set (English lowercase letters) to achieve constant space complexity.

## Key Insights

1. **Space-Time Trade-off**: Sorting is easier to write but O(n log n), while the frequency array is O(n) but requires a bit more logic.
2. **Fixed Space**: When the character set is limited (e.g., 26 lowercase letters), an array-based frequency counter is O(1) space.
3. **Early Exit**: If the lengths of the two strings are different, they cannot be anagrams. Checking this first saves time.

## Walkthrough

```
s = "anagram", t = "nagaram"

Count array (index based on a-z):
- Loop s: a=3, n=1, g=1, m=1, r=1
- Loop t: a-3, n-1, g-1, m-1, r-1

Final counts: [0,0,0,...] → valid anagram ✓
```