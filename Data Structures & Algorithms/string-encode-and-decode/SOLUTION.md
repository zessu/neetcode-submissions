# Encode and Decode Strings - Solution

## Solution Code

```javascript
class Solution {
    encode(strs) {
        let encData = "";
        for(const item in strs) {
            encData += `${strs[item].length},`;
        }
        const inputString = strs.join(" ");
        const outputString = `${encData}#${inputString}`;
        return outputString;
    }

    decode(str) {
        let i = 0;
        const sizes = [];
        let decoded = [];

        while(str[i] !== "#") {
            let counter = "";
            while(str[i] !== ',') {
                counter += str[i];
                i++; 
            }
            sizes.push(parseInt(counter));
            i++
        }
        i++;

        for(const size of sizes) {
            const sub = str.substr(i, size);
            decoded.push(sub);
            i += size + 1;
        }
        return decoded;
    }
}
```

## Approach

**Encoding**: `length1,length2,...,#string1 string2...`

**Decoding**:
1. Extract all lengths before `#`
2. After `#`, extract substrings of those lengths

## Complexity

- **Encode**: O(n) where n is total characters
- **Decode**: O(n)

## Walkthrough

```
Input: ["neet", "code"]

Encode:
- Lengths: "4,4,"
- Strings: "neet code"
- Result: "4,4,#neet code"

Decode:
- Read "4,4" → sizes = [4,4]
- Skip "#", read first 4 chars: "neet"
- Skip 1 space, read next 4 chars: "code"
- Output: ["neet", "code"] ✓
```

## Key Insight

The `#` delimiter separates lengths from content. Each string's length tells us how many characters to read for that string.