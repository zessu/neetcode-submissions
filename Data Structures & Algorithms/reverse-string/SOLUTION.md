# Reverse String - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {character[]} s
     * @return {void} Do not return anything, modify s in-place instead.
     */
    reverseString(s: string[]): void {
        let ptr1 = 0;
        let ptr2 = s.length - 1;
        while(ptr1 < ptr2) {
            [s[ptr1], s[ptr2]] = [s[ptr2], s[ptr1]];
            ptr1++;
            ptr2--;
        }
    }
}
```

## Approach

The solution uses **two pointers moving inward from both ends of the array**.

1. **Initialize the pointers**: `ptr1` starts at the first index (`0`) and `ptr2` at the last index (`s.length - 1`).
2. **Swap the outer pair**: `[s[ptr1], s[ptr2]] = [s[ptr2], s[ptr1]]` exchanges the characters using a destructuring assignment. The right-hand side is evaluated first, so the original two values are read before either slot is overwritten.
3. **Move inward**: `ptr1++` and `ptr2--` bring the pointers one step closer to the center.
4. **Repeat** while `ptr1 < ptr2`. Each iteration finalizes two positions. When the pointers meet (odd length) or cross (even length), every character has been placed in its mirrored position.
5. **Return nothing**: the array is mutated in place, matching the required `void` return type.

- **Time Complexity**: `O(n)` — there are `floor(n / 2)` iterations, each doing constant work.
- **Space Complexity**: `O(1)` — two index variables. Destructuring needs only a constant-size temporary pair, regardless of `n`.

### Submission Evolution

Two submissions exist and both implement the same two-pointer algorithm:

| Submission | Swap technique | Notes |
| :--- | :--- | :--- |
| `submission-0.ts` | Explicit `temp` variable | The traditional three-assignment swap |
| `submission-1.ts` (latest) | Destructuring assignment | Same complexity, fewer lines, easier to read |

The latest submission is documented above.

## Walkthrough

### Example 1: `s = ["h","e","l","l","o"]`

| Iteration | `ptr1` | `ptr2` | Before swap | Action | Array after |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 0 | 4 | `h ... o` | swap `h` and `o` | `["o","e","l","l","h"]` |
| 2 | 1 | 3 | `e ... h` | swap `e` and `h` | `["o","l","l","e","h"]` |
| — | 2 | 2 | — | `ptr1 < ptr2` is false, stop | `["o","l","l","e","h"]` |

The middle character `"l"` never moves, which is correct for an odd-length array.

### Example 2: `s = ["H","a","n","n","a","h"]`

| Iteration | `ptr1` | `ptr2` | Pair swapped | Array after |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 0 | 5 | `H` / `h` | `["h","a","n","n","a","H"]` |
| 2 | 1 | 4 | `a` / `a` | `["h","a","n","n","a","H"]` |
| 3 | 2 | 3 | `n` / `n` | `["h","a","n","n","a","H"]` |
| — | 3 | 2 | pointers crossed, stop | `["h","a","n","n","a","H"]` |

The answer is `["h","a","n","n","a","H"]`. Note that swapping equal characters is a no-op, so the array can look unchanged after a particular iteration.

### Example 3: `s = ["a","b"]`

`ptr1 = 0`, `ptr2 = 1`, `0 < 1` so swap → `["b","a"]`. Then `ptr1 = 1`, `ptr2 = 0`, and the loop exits. One swap reverses the whole array.

## Comparison with the Alternatives

| Approach | Time | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- |
| **Two Pointers (implemented)** | `O(n)` | `O(1)` | Optimal on both axes and satisfies the in-place requirement. Each swap finalizes two positions. |
| Extra Array | `O(n)` | `O(n)` | Equally fast but allocates a second array. This directly violates the problem's `O(1)` extra-memory constraint, even though the output is correct. |
| Recursive Two Pointers | `O(n)` | `O(n)` call stack | Reads nicely and uses the same swap idea, but recursion depth is `n / 2`. At the maximum `n = 10^5`, that can throw `RangeError: Maximum call stack size exceeded`. |
| Stack | `O(n)` | `O(n)` | Correct, but pushes and pops every character just to reverse order. Strictly more work and more memory than swapping in place. |

**Why the implemented approach is preferred:** it is the only approach here that is simultaneously linear-time and constant-space. It performs the minimum possible number of writes — `n / 2` swaps, or `n` assignments if written with a temporary variable — and never allocates memory proportional to the input.

**When an alternative could win:** the extra-array version is reasonable in a language or API where the input is immutable, or when the caller must keep the original array. The recursive version is a good teaching tool for divide-and-conquer thinking but is not appropriate for large inputs in JavaScript.

## Key Insights

1. **Two pointers exploit symmetry**: position `i` must hold what was originally at `n - 1 - i`. Swapping the pair fixes both positions at once.
2. **The loop condition encodes parity**: `ptr1 < ptr2` handles odd lengths automatically (the center is already correct) and stops even lengths exactly when the pointers cross.
3. **Destructuring is atomic with respect to the reads**: the right-hand side `[s[ptr2], s[ptr1]]` is fully evaluated before assignment, so no explicit `temp` is needed. This is the only difference from `submission-0.ts`.
4. **Mutate, do not replace**: reassigning `s = [...s].reverse()` would only rebind the local parameter. The caller's array would be unchanged, and the judge would fail the test.
5. **Constant extra memory means no helper array**: even a `slice().reverse()` that is copied back would be `O(n)` space, so it does not meet the follow-up requirement.
