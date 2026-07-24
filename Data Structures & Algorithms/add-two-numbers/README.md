# Add Two Numbers - LeetCode 2

## Problem Description

You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

## Examples

### Example 1:
```
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

### Example 2:
```
Input: l1 = [0], l2 = [0]
Output: [0]
```

### Example 3:
```
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

## Constraints

- The number of nodes in each linked list is in the range `[1, 100]`.
- `0 <= Node.val <= 9`
- It is guaranteed that the list represents a number without leading zeros.

## Topics

- Linked List
- Math
- Recursion

## Company Tags

- Amazon
- Microsoft
- Bloomberg

## Solution Approaches

### 1. Convert to Integers (Naive)

**Intuition**: Traverse both linked lists, convert them to integers, add them, then convert the result back to a linked list.

**Algorithm**:
1. Traverse l1 and build the integer by accumulating digits in reverse order.
2. Traverse l2 and build the integer similarly.
3. Add the two integers.
4. Convert the sum back to a linked list (digits in reverse order).

**Time Complexity**: `O(max(m, n))` where m and n are the lengths of the two lists.
**Space Complexity**: `O(max(m, n))` for the result list.

**Drawback**: Can overflow for very large numbers (beyond 64-bit integer range).

### 2. Elementary Math (Optimal)

**Intuition**: Add digits one at a time, just like elementary school addition, carrying over the remainder to the next position.

**Algorithm**:
1. Initialize a dummy head and a carry variable.
2. Iterate through both lists simultaneously.
3. At each step, add the current digits plus carry.
4. Create a new node with `sum % 10` and update carry to `Math.floor(sum / 10)`.
5. If one list is shorter, treat missing digits as 0.
6. After the loop, if carry > 0, append a new node.

**Time Complexity**: `O(max(m, n))`
**Space Complexity**: `O(max(m, n))` for the result list.

## Visual Explanation

```
l1: 2 -> 4 -> 3   (represents 342)
l2: 5 -> 6 -> 4   (represents 465)

Step 1: 2 + 5 = 7, carry = 0
Step 2: 4 + 6 = 10, carry = 1, digit = 0
Step 3: 3 + 4 + 1 = 8, carry = 0

Result: 7 -> 0 -> 8   (represents 807)
```

## Common Pitfalls

1. **Unequal list lengths**: One list may be shorter; treat missing nodes as 0.
2. **Final carry**: After processing all nodes, a remaining carry must be appended as a new node.
3. **Leading zeros**: The input guarantees no leading zeros, but the result may have an extra digit from carry.
