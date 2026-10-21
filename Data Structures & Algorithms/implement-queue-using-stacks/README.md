# Implement Queue using Stacks - LeetCode 232

## Problem Description

Implement a **first in, first out (FIFO)** queue using only two stacks. The queue must support all the operations of a normal queue.

Implement the `MyQueue` class:

- `void push(int x)` pushes element `x` to the **back** of the queue.
- `int pop()` removes the element from the **front** of the queue and returns it.
- `int peek()` returns the element at the **front** of the queue.
- `boolean empty()` returns `true` if the queue is empty, `false` otherwise.

Only standard stack operations are allowed: push to the top, pop/peek from the top, `size`, and `isEmpty`. A stack is LIFO, so the core challenge is reversing the order exactly once per element to expose the oldest element at the top.

## Examples

### Example 1:

```
Input:
["MyQueue", "push", "push", "peek", "pop", "empty"]
[[],        [1],    [2],    [],     [],    []]

Output:
[null, null, null, 1, 1, false]
```

**Explanation:**

```javascript
MyQueue myQueue = new MyQueue();
myQueue.push(1); // queue is: [1]
myQueue.push(2); // queue is: [1, 2]  (leftmost is the front)
myQueue.peek();  // return 1
myQueue.pop();   // return 1, queue is: [2]
myQueue.empty(); // return false
```

### Example 2:

```
Input:
["MyQueue", "empty", "push", "pop", "empty", "push", "peek"]
[[],        [],      [7],    [],    [],      [8],    []]

Output:
[null, true, null, 7, true, null, 8]
```

**Explanation:** An empty queue reports `true`. Pushing `7` and popping it empties the queue again. A later `push(8)` must work correctly even after the earlier pop reversed the internal order.

### Example 3:

```
Input:
["MyQueue", "push", "push", "push", "pop", "push", "pop", "pop", "pop"]
[[],        [1],    [2],    [3],    [],    [4],    [],    [],    []]

Output:
[null, null, null, null, 1, null, 2, 3, 4]
```

**Explanation:** Pushing `4` after a pop must place it at the **back**, behind `2` and `3`. The output `1, 2, 3, 4` confirms FIFO order across interleaved pushes and pops.

## Constraints

- `1 <= x <= 9`
- At most `100` calls will be made to `push`, `pop`, `peek`, and `empty`.
- All the calls to `pop` and `peek` are valid.

**Follow-up:** Can you implement the queue such that each operation is **amortized `O(1)`** time complexity? In other words, performing `n` operations will take overall `O(n)` time even if one of those operations may take longer.

## Topics

- Stack
- Queue
- Design

## Company Tags

- Amazon
- Microsoft
- Bloomberg
- Google
- Apple

## Solution Approaches

### 1. Two Stacks, Reverse on Every Pop/Peek (Implemented)

**Intuition**: `push` goes on top of the input stack. To reach the oldest element, pour the input stack into a second stack — reversing the order — so the front becomes the top. Pop it, then pour everything back so the input stack is ready for future pushes.

**Algorithm**:
1. Keep `arr1` (input stack) and `arr2` (temporary stack).
2. `push(x)`: `arr1.push(x)`.
3. `pop()`: while `arr1.length > 1`, move the top of `arr1` to `arr2`. The single remaining element in `arr1` is the front; pop and save it. Move every element of `arr2` back to `arr1`. Return the saved value.
4. `peek()`: same transfer, read `arr1[0]` (the only remaining element), move everything back, and return it.
5. `empty()`: `arr1.length === 0` (the temporary stack is always drained before returning).

**Time Complexity**: `push` `O(1)`, `pop`/`peek` `O(n)`, `empty` `O(1)`.
**Space Complexity**: `O(n)` for the two stacks combined.

### 2. Two Stacks with Lazy Transfer (Amortized `O(1)`)

**Intuition**: Reversing on *every* pop is wasted work. Instead, keep an `in` stack for pushes and an `out` stack for pops. Only when `out` is empty do we pour all of `in` into `out`. Each element is moved at most twice in its lifetime, so the cost averages out.

**Algorithm**:
1. `push(x)`: `in.push(x)`.
2. `pop()`: if `out` is empty, move every element from `in` to `out`; then `out.pop()`.
3. `peek()`: same refill, then return the top of `out`.
4. `empty()`: both stacks are empty.

**Time Complexity**: `push` `O(1)`, `pop`/`peek` **amortized** `O(1)` (worst-case `O(n)` for a single call that triggers a refill), `empty` `O(1)`.
**Space Complexity**: `O(n)`.

This is the optimal answer to the follow-up.

### 3. One Stack + Recursion

**Intuition**: The call stack can act as the second stack. To remove the bottom element, recurse until the stack has one element left, remove it, then push the held elements back on the way out of the recursion.

**Algorithm**:
1. `push(x)`: `stack.push(x)`.
2. `pop()`: recursively pop elements into the call stack until one remains; remove and return that bottom element, then re-push the held elements during unwinding.
3. `peek()`: same, but return the bottom element without removing it.
4. `empty()`: `stack.length === 0`.

**Time Complexity**: `push` `O(1)`, `pop`/`peek` `O(n)`.
**Space Complexity**: `O(n)` for the recursion stack (in addition to the `O(n)` data stack).

Elegant, but recursion depth equals the queue size — a risk for large inputs and forbidden in some interview settings.

### 4. Two Stacks with Expensive Push (Front on Top)

**Intuition**: Flip the cost to `push` instead of `pop`. Keep the queue permanently reversed in one stack, with the front on top. A new element must go to the **bottom**, so rebuild the stack around it.

**Algorithm**:
1. `push(x)`: move all elements to the auxiliary stack, push `x`, then move everything back. `x` ends up at the bottom, which is the back of the queue.
2. `pop()`: `stack.pop()` — the top is the front, `O(1)`.
3. `peek()`: `stack[stack.length - 1]`, `O(1)`.
4. `empty()`: `stack.length === 0`.

**Time Complexity**: `push` `O(n)`, `pop`/`peek`/`empty` `O(1)`.
**Space Complexity**: `O(n)`.

Useful when pops vastly outnumber pushes.

## Visual Explanation

```
push(1), push(2):
  arr1 (bottom -> top): [1, 2]     arr2: []
  the front (1) is at the bottom of arr1

pop():
  1. move all but one element to arr2:
       arr1 = [1]        arr2 = [2]
  2. the single remaining element is the front; save and remove it:
       res = 1           arr1 = []
  3. pour arr2 back so later pushes append behind the remaining elements:
       arr1 = [2]        arr2 = []
  4. return 1            queue is now [2]
```

The reversal matters because the **front of the queue lives at the bottom** of the input stack. Pouring into the second stack puts that bottom element on top, where stack operations can reach it.

## Comparison of Approaches

| Approach | `push` | `pop` | `peek` | `empty` | Space | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Reverse on every pop (implemented)** | `O(1)` | `O(n)` | `O(n)` | `O(1)` | `O(n)` | Simple; moves elements twice per pop |
| **Lazy two-stack (amortized)** | `O(1)` | `O(1)` amortized / `O(n)` worst | `O(1)` amortized | `O(1)` | `O(n)` | Optimal; each element moves at most twice |
| **One stack + recursion** | `O(1)` | `O(n)` | `O(n)` | `O(1)` | `O(n)` | Uses the call stack; depth risk |
| **Expensive push** | `O(n)` | `O(1)` | `O(1)` | `O(1)` | `O(n)` | Good when reads dominate writes |

## Common Pitfalls

1. **Reversing twice by mistake**: pouring `arr1` into `arr2` and then pouring back before popping restores the original order and pops the newest element. Pop from `arr2` while it is reversed.
2. **Confusing front with top**: the front of the queue is the **bottom** of the push stack, not the top.
3. **Forgetting to restore `arr1`**: this implementation moves elements back after each pop so that later `push` calls append behind the remaining elements. If you leave elements in `arr2`, make sure subsequent pushes still land behind them.
4. **`peek` and `pop` disagreeing**: both must look at the same front element. A common bug is `peek` reading `arr1[arr1.length - 1]` after the transfer (the back) instead of the remaining front.
5. **Checking only one stack for `empty`**: in the lazy design, elements can be split across `in` and `out`; test both. In this implementation `arr2` is always drained, so `arr1` alone is enough — but that invariant must be maintained.
6. **Off-by-one in the transfer loop**: `while (arr1.length > 1)` leaves exactly the front behind. Using `> 0` empties the stack and makes `pop()` return `undefined`.
7. **Using `shift()`**: that is a queue/deque operation, not a stack operation, and defeats the purpose of the exercise.
