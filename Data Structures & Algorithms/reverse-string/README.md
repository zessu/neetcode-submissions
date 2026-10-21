# Reverse String - LeetCode 344

## Problem Description

Write a function that reverses a string. The input string is given as an array of characters `s`.

You must do this by **modifying the input array in-place** with `O(1)` extra memory and must not allocate another array for the reversed result.

## Examples

### Example 1:
```
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
```
**Explanation:** The first and last characters are swapped, then the second and second-to-last, and so on. The middle character stays where it is.

### Example 2:
```
Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]
```
**Explanation:** `"Hannah"` is reversed to `"hannaH"`. The outer pairs (`H`/`h`, `a`/`a`) are swapped, and the two middle characters (`n`, `n`) swap with each other.

### Example 3:
```
Input: s = ["a","b"]
Output: ["b","a"]
```
**Explanation:** A two-element array needs exactly one swap.

### Example 4:
```
Input: s = ["x"]
Output: ["x"]
```
**Explanation:** A single character is already its own reverse.

## Constraints

- `1 <= s.length <= 10^5`
- `s[i]` is a printable ASCII character.

## Topics

- Two Pointers
- String

## Company Tags

- Amazon
- Microsoft
- Adobe
- Apple
- Google

## Solution Approaches

### 1. Extra Array (Not In-Place)

**Intuition**: Read the characters from the end of `s` to the beginning and write them into a new array, then copy that array back into `s`.

**Algorithm**:
1. Create `reversed` with the same length as `s`.
2. For `i` from `0` to `n - 1`, set `reversed[i] = s[n - 1 - i]`.
3. Copy every element of `reversed` back into `s`.

**Time Complexity**: `O(n)` — one pass to build the copy and one pass to copy it back.
**Space Complexity**: `O(n)` — the extra array. This **violates** the `O(1)` memory requirement, so it is included only for comparison.

### 2. Two Pointers In-Place (Implemented)

**Intuition**: The first character belongs in the last position and the last character belongs in the first position. Swap them, then move both pointers inward until they meet. Each swap puts two characters in their final place, so no extra storage is needed.

**Algorithm**:
1. Set `left = 0` and `right = s.length - 1`.
2. While `left < right`:
   - Swap `s[left]` and `s[right]`.
   - Increment `left` and decrement `right`.
3. Stop when the pointers meet or cross; the array is now reversed.

**Time Complexity**: `O(n)` — each character is visited at most once, and there are `floor(n / 2)` swaps.
**Space Complexity**: `O(1)` — only two index variables (and one temporary value during the swap).

### 3. Recursive Two Pointers

**Intuition**: Swap the outer pair, then recursively reverse the inner substring. The recursion stops when the two indices meet or cross.

**Algorithm**:
1. Define `reverse(left, right)`.
2. If `left >= right`, return.
3. Swap `s[left]` and `s[right]`.
4. Recurse with `reverse(left + 1, right - 1)`.

**Time Complexity**: `O(n)` — `floor(n / 2)` swaps.
**Space Complexity**: `O(n)` — the call stack has depth `floor(n / 2)`, which can overflow for `n = 10^5`.

### 4. Stack-Based Reversal

**Intuition**: Push every character onto a stack, then pop them back into `s`. A stack reverses order because the last character pushed is the first one popped.

**Algorithm**:
1. Push every character of `s` onto a stack.
2. For `i` from `0` to `n - 1`, set `s[i] = stack.pop()`.

**Time Complexity**: `O(n)`.
**Space Complexity**: `O(n)` — the stack holds every character.

## Visual Explanation

```
s = ["h", "e", "l", "l", "o"]
     l                  r

swap(s[l], s[r]):
s = ["o", "e", "l", "l", "h"]
          l        r

swap(s[l], s[r]):
s = ["o", "l", "l", "e", "h"]
               lr

l == r -> stop. Reversed in place.
```

For an even-length input, the pointers cross instead of meeting:

```
s = ["H", "a", "n", "n", "a", "h"]
     l                       r      swap -> ["h","a","n","n","a","H"]
          l             r           swap -> ["h","a","n","n","a","H"]
               l       r            swap -> ["h","a","n","n","a","H"]
                    r l             right < left -> stop
```

## Approach Comparison

| Approach | Time | Space | In-Place? | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Extra Array | `O(n)` | `O(n)` | No | Simple, but violates the memory requirement |
| **Two Pointers (implemented)** | `O(n)` | `O(1)` | **Yes** | Optimal; `floor(n / 2)` swaps |
| Recursive Two Pointers | `O(n)` | `O(n)` stack | Yes (array) | Elegant, but risks stack overflow at `n = 10^5` |
| Stack | `O(n)` | `O(n)` | Yes (array) | Extra storage for no benefit |

## Common Pitfalls

1. **Using `left <= right`**: When `left == right` the middle element would be swapped with itself. It is harmless but unnecessary; use `left < right` as the loop condition.
2. **Returning a new array**: The problem requires mutating `s` in place. Returning a reversed copy does not satisfy the judge.
3. **Off-by-one in the mirror index**: The partner of index `i` is `n - 1 - i`, not `n - i`.
4. **Forgetting to move both pointers**: Incrementing only `left` (or only `right`) makes the loop run forever or reverse incorrectly.
5. **Confusing characters with UTF-16 code units**: The input is already an array of single ASCII characters, so indexing is safe here. If the input were a JavaScript string containing emoji or other surrogate pairs, naive indexing would split them.
6. **Allocating a temporary array per swap**: A single `temp` variable (or destructuring assignment) is enough; do not create a new array of length `n`.
