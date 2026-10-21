# Implement Stack using Queues - LeetCode 225

## Problem Description

Implement a **last in, first out (LIFO)** stack using only queues. The implemented stack must support all the functions of a normal stack.

Implement the `MyStack` class:

- `void push(int x)` pushes element `x` onto the **top** of the stack.
- `int pop()` removes the element on the top of the stack and returns it.
- `int top()` returns the element on the top of the stack.
- `boolean empty()` returns `true` if the stack is empty, `false` otherwise.

Only standard queue operations are allowed: push to the **back**, pop/peek from the **front**, `size`, and `isEmpty`. A queue is FIFO, so after `n` pushes the newest element is at the back — exactly where a stack does *not* want it. Either pushes or pops must rotate the queue to fix that.

## Examples

### Example 1:

```
Input:
["MyStack", "push", "push", "top", "pop", "empty"]
[[],        [1],    [2],    [],    [],    []]

Output:
[null, null, null, 2, 2, false]
```

**Explanation:**

```javascript
MyStack myStack = new MyStack();
myStack.push(1);
myStack.push(2);
myStack.top();   // return 2
myStack.pop();   // return 2
myStack.empty(); // return false
```

### Example 2:

```
Input:
["MyStack", "empty", "push", "top", "pop", "empty", "push", "top"]
[[],        [],      [5],    [],    [],    [],      [6],    []]

Output:
[null, true, null, 5, 5, true, null, 6]
```

**Explanation:** An empty stack reports `true`. A single push/pop pair returns to empty, and a later push still becomes the top — the structure must not retain stale ordering across empty periods.

### Example 3:

```
Input:
["MyStack", "push", "push", "push", "pop", "push", "pop", "pop", "top"]
[[],        [1],    [2],    [3],    [],    [4],    [],    [],    []]

Output:
[null, null, null, null, 3, null, 4, 2, 1]
```

**Explanation:** Pushing `4` immediately after popping `3` makes `4` the new top, ahead of `2` and `1`. This checks that a push after a pop respects LIFO order rather than appending behind older elements.

## Constraints

- `1 <= x <= 9`
- At most `100` calls will be made to `push`, `pop`, `top`, and `empty`.
- All the calls to `pop` and `top` are valid.

**Follow-up:** Can you implement the stack using only **one** queue?

## Topics

- Stack
- Queue
- Design

## Company Tags

- Amazon
- Microsoft
- Google
- Bloomberg
- Apple

## Solution Approaches

### 1. Single Array as a Deque, Top at Index 0 (Implemented)

**Intuition**: Keep the top of the stack at the **front** of one array. `push` inserts at the front (`unshift`), and `pop` removes from the front (`shift`). Both ends of the array behave like a deque, which is enough to emulate a stack with a single container.

**Algorithm**:
1. Store elements in `elements: number[]`.
2. `push(x)`: `elements.unshift(x)` — insert at index `0`, so `x` becomes the new top.
3. `pop()`: `elements.shift()` — remove and return index `0`, the top.
4. `top()`: `elements[0]`.
5. `empty()`: `elements.length === 0`.

**Time Complexity**: `push` `O(n)` and `pop` `O(n)` because inserting/removing at index `0` re-indexes the remaining elements; `top` and `empty` are `O(1)`.
**Space Complexity**: `O(n)`.

This is the shortest implementation, but it uses a deque operation (`unshift`) rather than a queue operation (enqueue at the back), so it does not satisfy a strict "queues only" requirement.

### 2. Two Queues, Expensive Push

**Intuition**: Keep the top of the stack at the **front** of the main queue. To push a new element, put it in a second queue first, move all existing elements behind it, then swap the queues. The new element is now at the front.

**Algorithm**:
1. Keep `q1` (main) and `q2` (auxiliary).
2. `push(x)`: enqueue `x` into `q2`; dequeue every element of `q1` and enqueue it into `q2`; swap `q1` and `q2`.
3. `pop()`: dequeue from the front of `q1`.
4. `top()`: peek the front of `q1`.
5. `empty()`: `q1` is empty (after a swap, `q2` is always the empty one).

**Time Complexity**: `push` `O(n)`, `pop`/`top`/`empty` `O(1)`.
**Space Complexity**: `O(n)`.

### 3. Two Queues, Expensive Pop

**Intuition**: Push is a plain enqueue, so the newest element sits at the back. To pop, move the first `n - 1` elements to the auxiliary queue; the single element left at the front is the top. Return it, then swap the queues.

**Algorithm**:
1. `push(x)`: enqueue into `q1`.
2. `pop()`: while `q1.size > 1`, dequeue from `q1` and enqueue into `q2`. Dequeue the last remaining element (the top) and return it. Swap `q1` and `q2`.
3. `top()`: same movement, peek the last element, then move it to `q2` as well and swap — or dequeue/pop and re-enqueue it.
4. `empty()`: `q1` is empty.

**Time Complexity**: `push` `O(1)`, `pop`/`top` `O(n)`.
**Space Complexity**: `O(n)`.

### 4. One Queue with Rotation (Follow-up)

**Intuition**: Use a single queue. Enqueue the new element at the back, then rotate the queue by dequeuing and re-enqueuing the `n - 1` older elements. The new element ends up at the **front**, which is the top of the stack.

**Algorithm**:
1. `push(x)`: `q.push(x)`; repeat `q.size - 1` times: `q.push(q.shift())`.
2. `pop()`: `q.shift()`.
3. `top()`: `q[0]` / `q.peek()`.
4. `empty()`: `q.length === 0`.

**Time Complexity**: `push` `O(n)`, `pop`/`top`/`empty` `O(1)`.
**Space Complexity**: `O(n)`.

This is the requested follow-up and the cleanest queue-only solution.

## Visual Explanation

```
Implemented: top at index 0

push(1):  [1]
push(2):  [2, 1]        unshift -> new element at the front
top():    return 2      elements[0]
pop():    return 2      shift -> [1]

Two queues, expensive push:

  q1 = [1, 2]     (front -> back)
  push(3):
     q2 = [3]
     move q1 -> q2:  q2 = [3, 1, 2]
     swap:           q1 = [3, 1, 2], q2 = []
  pop() -> 3          (front is the top)

One queue rotation:

  q = [1, 2]
  push(3): enqueue -> [1, 2, 3]
           rotate 2 older elements -> [3, 1, 2]
  pop() -> 3
```

## Comparison of Approaches

| Approach | `push` | `pop` | `top` | `empty` | Space | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Array as deque (implemented)** | `O(n)` | `O(n)` | `O(1)` | `O(1)` | `O(n)` | Tiny code; not queue-only, both ends re-index |
| **Two queues, expensive push** | `O(n)` | `O(1)` | `O(1)` | `O(1)` | `O(n)` | Textbook queue-only answer |
| **Two queues, expensive pop** | `O(1)` | `O(n)` | `O(n)` | `O(1)` | `O(n)` | Good when pushes dominate |
| **One queue + rotation** | `O(n)` | `O(1)` | `O(1)` | `O(1)` | `O(n)` | Meets the follow-up; simplest queue-only |

## Common Pitfalls

1. **Using `push`/`pop` on the array**: that is a stack, not a stack *built from queues*. The exercise is about the emulation.
2. **Forgetting to swap after moving**: in the two-queue designs, the auxiliary queue becomes the main one; without the swap, the next operation reads the wrong queue.
3. **Rotation count off by one**: after enqueuing, rotate exactly `size - 1` times. Rotating `size` times restores the original order; rotating too few leaves the new element at the back.
4. **`top()` mutating the stack**: `top` must not remove the element. Peek the front, or pop and re-enqueue.
5. **`empty()` checking one queue in the eager-move variants**: both queues can hold elements mid-operation; check the queue that owns the data (and maintain the invariant).
6. **`shift`/`unshift` cost**: both are `O(n)` in general because the remaining elements are re-indexed. Do not assume they are `O(1)` just because they look like `pop`/`push`.
7. **Popping an empty structure**: `shift()` returns `undefined`; constraints guarantee valid calls, but production code needs a guard.
