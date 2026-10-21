# Implement Stack using Queues - Solution

## Solution Code

```typescript
class MyStack {
    elements:number[] = [];
    constructor() {}

    /**
     * @param {number} x
     * @return {void}
     */
    push(x: number): void {
        this.elements.unshift(x);
    }

    /**
     * @return {number}
     */
    pop(): number {
        return this.elements.shift();
    }

    /**
     * @return {number}
     */
    top(): number {
        return this.elements[0];
    }

    /**
     * @return {boolean}
     */
    empty(): boolean {
        return this.elements.length ? false: true;
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = new MyStack()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */
```

## Approach

The submission keeps every element in **one array used as a double-ended queue**, with the **top of the stack always at index `0`**.

1. **`push(x)`**: `this.elements.unshift(x)` inserts `x` at the front. Because index `0` is the top, the newest element immediately becomes the top.
2. **`pop()`**: `this.elements.shift()` removes and returns the element at index `0` — the top. The remaining elements shift down by one index but keep their relative order, so the next element becomes the new top.
3. **`top()`**: `this.elements[0]` reads the front without removing it.
4. **`empty()`**: `this.elements.length ? false : true` returns `true` only when the array has no elements. (Semantically identical to `this.elements.length === 0`.)

This mirrors the **one-queue rotation** approach without doing the rotation explicitly: instead of enqueuing at the back and rotating the queue, it inserts directly at the front. The observable behaviour is the same LIFO order.

- **Time Complexity**: `push` `O(n)` — `unshift` re-indexes every existing element. `pop` `O(n)` — `shift` moves every remaining element down one slot. `top` and `empty` are `O(1)`. (Engines optimize small arrays, but the array operations are linear in general; the `100`-call limit keeps this trivial.)
- **Space Complexity**: `O(n)` for the `n` stored elements. The array may allocate spare capacity as it grows.

Being precise about the model: a strict "queue-only" solution may enqueue at the **back** and dequeue at the **front**. `unshift` inserts at the front, which is a deque operation, so this implementation demonstrates the right *ordering* idea but is not literally built from queue operations.

## Walkthrough

Using Example 1:

```
["MyStack","push","push","top","pop","empty"]
[[],        [1],   [2],   [],   [],  []]
```

| Operation | `elements` (index 0 = top) | Work | Return |
| :--- | :--- | :--- | :--- |
| `new MyStack()` | `[]` | allocate | `null` |
| `push(1)` | `[1]` | `unshift(1)` | `null` |
| `push(2)` | `[2, 1]` | `unshift(2)` | `null` |
| `top()` | `[2, 1]` | read index `0` | `2` |
| `pop()` | `[1]` | `shift()` removes index `0` | `2` |
| `empty()` | `[1]` | length is `1` &rarr; `false` | `false` |

Output: `[null, null, null, 2, 2, false]`.

Example 3 interleaves pushes and pops:

```
push(1) -> [1]
push(2) -> [2, 1]
push(3) -> [3, 2, 1]
pop()   -> returns 3, elements = [2, 1]
push(4) -> [4, 2, 1]        (new top is 4)
pop()   -> returns 4, elements = [2, 1]
pop()   -> returns 2, elements = [1]
top()   -> returns 1
```

Output: `[null, null, null, null, 3, null, 4, 2, 1]`, confirming that a push after a pop goes on top rather than behind the older elements.

Compare with the explicit one-queue rotation for the same sequence:

```
q = [1]                 push(1)
q = [1, 2]              push(2)
q = [2, 1]              rotate 1 time
q = [3, 2, 1]           push(3) then rotate 2 times
pop() -> 3              q = [2, 1]
```

Both end up with `[2, 1]` — the same LIFO state, reached differently.

## Comparison with the Alternatives

| Approach | `push` | `pop` | `top` | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Array as deque (implemented)** | `O(n)` | `O(n)` | `O(1)` | `O(n)` | Minimal code and no queue shuffling, but both `unshift` and `shift` re-index the array, and it is not literally queue-only. |
| **Two queues, expensive push** | `O(n)` | `O(1)` | `O(1)` | `O(n)` | The textbook queue-only answer: move every existing element behind the new one. `n` pushes cost `O(n^2)` total, but reads are `O(1)`. |
| **Two queues, expensive pop** | `O(1)` | `O(n)` | `O(n)` | `O(n)` | Better when pushes dominate pops; every read drains `n - 1` elements into the auxiliary queue. |
| **One queue + rotation** | `O(n)` | `O(1)` | `O(1)` | `O(n)` | Meets the follow-up with half the storage bookkeeping. This is what the implemented approach is imitating. |

**Why the implemented approach is preferred for this submission**: it is the shortest correct code, and the constraints (at most `100` calls) make the linear `unshift`/`shift` costs irrelevant. Keeping the top at index `0` also makes `top()` and the LIFO invariant obvious.

**When an alternative wins**: if the judge enforces queue-only operations, the **one-queue rotation** is the right answer — same complexities, but every operation is a genuine enqueue/dequeue. If the workload is read-heavy, the **expensive-pop** two-queue design gives `O(1)` pushes. If writes are rare and reads frequent, **expensive-push** is equivalent in practice. Note that none of these beat a plain array used as a stack (`push`/`pop` at the end, both `O(1)`) — the exercise is about the emulation, not about beating the native structure.
