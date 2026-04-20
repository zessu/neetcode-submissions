# Valid Palindrome - Solution

## Solution Code (Two Pointers)

```javascript
class Solution {

  allowedChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
       'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  /**
   * @param {string} s
   * @return {boolean}
   */
  isPalindrome(s) {
    // Filter to keep only alphanumeric characters
    const sanitized = s.split('').filter(c => this.allowedChars.includes(c));
    // Convert to lowercase
    const upright = sanitized.join('').toLocaleLowerCase();
    // Reverse the array
    const reversed = sanitized.reverse().join('').toLocaleLowerCase();
    // Compare
    return upright === reversed;
  }
}
```

## Solution Code (Optimized Two Pointers)

```javascript
class Solution {
  isPalindrome(s) {
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
      // Skip non-alphanumeric from left
      while (left < right && !this.isAlphanumeric(s[left])) {
        left++;
      }
      // Skip non-alphanumeric from right
      while (left < right && !this.isAlphanumeric(s[right])) {
        right--;
      }
      // Compare (case-insensitive)
      if (s[left].toLowerCase() !== s[right].toLowerCase()) {
        return false;
      }
      left++;
      right--;
    }
    return true;
  }

  isAlphanumeric(c) {
    const code = c.charCodeAt(0);
    return (code >= 48 && code <= 57) ||  // 0-9
           (code >= 65 && code <= 90) ||  // A-Z
           (code >= 97 && code <= 122); // a-z
  }
}
```

## Approach

### Two Approaches:

1. **Filter and Compare**: 
   - Filter to keep only alphanumeric chars
   - Convert to lowercase
   - Compare with reversed string

2. **Two Pointers (Optimal)**:
   - Left pointer at start, right at end
   - Skip non-alphanumeric chars
   - Compare without creating new strings

## Complexity Analysis

**Approach 1**: 
- Time: `O(n)`
- Space: `O(n)`

**Approach 2**:
- Time: `O(n)`
- Space: `O(1)`

## Walkthrough

```
s = "A man, a plan, a canal: Panama"

Filter: "A man a plan a canal Panama"
To lowercase: "a man a plan a canal panama"
Reverse: "amanaplanacanalpanam a nam a"

Compare: "amanaplanacanalpanama" === "amanaplanacanalpanam a nam a"

Wait - that doesn't look right. Let me fix:

Original: "A man, a plan, a canal: Panama"
Filter to alphanumeric: ["A","m","a","n","a","p","l","a","n","a","c","a","n","a","l","P","a","n","a","m","a"]
Join: "AmanaplanacanalPanama"  
Lowercase: "amanaplanacanalpanama"
Reverse: "amanaplanacanalpanama"

They're equal! ✓
```

The key fix: filter FIRST, then compare the clean version.