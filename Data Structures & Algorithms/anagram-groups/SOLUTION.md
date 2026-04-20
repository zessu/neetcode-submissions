# Group Anagrams - Solution

## Solution Code

```javascript
class Solution {
    res = new Map();
    /**
     * @param {string[]} strs
     * @return {string[][]}
     */
    groupAnagrams(strs) {
        for(const value in strs) {
            const val = strs[value].split('').sort().join('');
            if(!this.res.get(val)) {
                this.res.set(val, [strs[value]])
            } else {
                this.res.get(val).push(strs[value]);
            }
        }

        console.log(this.res);
        const ret = [];
        for(const value of this.res.values()) {
            ret.push(value);
        }
        return ret;
    }
}
```

## Approach

The solution uses **Sorting** to create a canonical key for each anagram:

1. **Key Generation**: Sort the characters of each string to form a key. All anagrams will produce the same sorted string.
2. **Grouping**: Use a HashMap to group strings with the same sorted key.
3. **Return**: Extract all values from the HashMap as the result.

## Complexity Analysis

- **Time Complexity**: `O(m * n log n)` where m is the number of strings and n is the average length of strings
- **Space Complexity**: `O(m * n)` for storing all strings in the hash map

## Walkthrough

```
Input: ["eat","tea","tan","ate","nat","bat"]

Step 1: Create sorted keys
- "eat" → sort → "aet"
- "tea" → sort → "aet"
- "tan" → sort → "ant"
- "ate" → sort → "aet"
- "nat" → sort → "ant"
- "bat" → sort → "abt"

Step 2: Group by key in HashMap
- "aet": ["eat", "tea", "ate"]
- "ant": ["tan", "nat"]
- "abt": ["bat"]

Step 3: Return values
Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
```

## Alternative: Character Count Approach

A more efficient approach uses character counting instead of sorting:

```javascript
class Solution {
    groupAnagrams(strs) {
        const map = new Map();
        for (const s of strs) {
            const count = new Array(26).fill(0);
            for (const c of s) {
                count[c.charCodeAt(0) - 97]++;
            }
            const key = count.join('#');
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push(s);
        }
        return Array.from(map.values());
    }
}
```

This approach has:
- **Time Complexity**: `O(m * n)` - no sorting needed
- **Space Complexity**: `O(m * n)`