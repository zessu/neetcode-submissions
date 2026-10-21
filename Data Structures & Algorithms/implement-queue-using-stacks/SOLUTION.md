# Implement Queue using Stacks - Solution

## Solution Code

```typescript
class MyQueue {
    arr1: number[] = [];
    arr2: number[] = [];
    constructor() {
    }

    /**
     * @param {number} x
     * @return {void}
     */
    push(x: number): void {
        this.arr1.push(x);
    }

    /**
     * @return {number}
     */
    pop(): number {
        while(this.arr1.length > 1) {
            this.arr2.push(this.arr1.pop());
        }
        const res = this.arr1.pop();
        while(this.arr2.length) {
            this.arr1.push(this.arr2.pop());
        }
        return res;
    }

    /**
     * @return {number}
     */
    peek(): number {
        while(this.arr1.length > 1) {
            this.arr2.push(this.arr1.pop());
        }
        const res = this.arr1[0];
        while(this.arr2.length > 0) {
            this.arr1.push(this.arr2.pop());
        }
        return res;
    }

    /**
     * @return {boolean}
     */
    empty(): boolean {
        return !this.arr1.length;
    }
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */
```

## Approach

The implementation uses **two arrays as stacks**, with `arr1` as the primary input stack and `arr2` as a temporary reversal buffer.

1. **`push(x)`**: append to the top of `arr1` with `push`. This is `O(1)` and puts the newest element where a stack expects it.
2. **`pop()`**: the front of the queue is the **oldest** element, which sits at the *bottom* of `arr1`. Move every element except the bottom one onto `arr2`:
   - `while (arr1.length > 1) arr2.push(arr1.pop())` — this pops from the top of `arr1` and pushes onto `arr2`, reversing the order.
   - Now `arr1` contains exactly one element: the front. `arr1.pop()` removes and saves it.
   - Pour `arr2` back onto `arr1`, restoring the remaining queue in its original order.
   - Return the saved front.
3. **`peek()`**: identical transfer, but instead of popping the lone element it reads `arr1[0]` (the array has length 1, so the only element is the front). Then it pours `arr2` back so the structure is unchanged for future operations.
4. **`empty()`**: `arr1` holds all live elements because both `pop` and `peek` drain `arr2` before returning, so `arr1.length === 0` is sufficient.

- **Time Complexity**: `push` `O(1)`; `pop` and `peek` `O(n)` because the transfer loop visits every element twice (once into `arr2`, once back); `empty` `O(1)`.
- **Space Complexity**: `O(n)` for the `n` queued elements spread across the two arrays. No element is duplicated.

## Walkthrough

Using Example 1:

```
["MyQueue","push","push","peek","pop","empty"]
[[],        [1],   [2],   [],    [],   []]
```

| Operation | `arr1` (bottom &rarr; top) | `arr2` | Work | Return |
| :--- | :--- | :--- | :--- | :--- |
| `new MyQueue()` | `[]` | `[]` | allocate two arrays | `null` |
| `push(1)` | `[1]` | `[]` | append | `null` |
| `push(2)` | `[1, 2]` | `[]` | append | `null` |
| `peek()` | `[1, 2]` | `[]` | move `2` to `arr2`; `arr1 = [1]`; read `arr1[0] = 1`; move `2` back | `1` |
| `pop()` | `[1, 2]` | `[]` | move `2` to `arr2`; `arr1 = [1]`; pop `1`; move `2` back | `1` |
| `empty()` | `[2]` | `[]` | `arr1.length` is 1, so `!1` is `false` | `false` |

Detailed `pop()` trace:

```
start:  arr1 = [1, 2]         (1 = front/bottom, 2 = back/top)
        arr2 = []

loop:   arr1.length = 2 > 1
        arr2.push(arr1.pop())  -> arr2 = [2], arr1 = [1]

exit:   arr1.length = 1

res = arr1.pop()               -> res = 1, arr1 = []

loop:   arr2.length = 1
        arr1.push(arr2.pop())  -> arr1 = [2], arr2 = []

return 1                       -> queue is [2]
```

Example 3 checks that interleaving works:

```
push(1) -> arr1 = [1]
push(2) -> arr1 = [1, 2]
push(3) -> arr1 = [1, 2, 3]
pop()   -> returns 1, arr1 = [2, 3]
push(4) -> arr1 = [2, 3, 4]     (4 goes to the back, as required)
pop()   -> returns 2, arr1 = [3, 4]
pop()   -> returns 3, arr1 = [4]
pop()   -> returns 4, arr1 = []
```

The outputs are `1, 2, 3, 4`, confirming FIFO behaviour.

## Comparison with the Alternatives

| Approach | `push` | `pop` / `peek` | Space | Why it wins / loses |
| :--- | :--- | :--- | :--- | :--- |
| **Reverse on every pop (implemented)** | `O(1)` | `O(n)` | `O(n)` | Easy to verify and correct, and the "move back" step keeps `arr1` in a single canonical state. But each pop/peek performs `2(n-1)` moves, so `n` operations cost `O(n^2)` — it does **not** meet the follow-up. |
| **Lazy two-stack (`in`/`out`)** | `O(1)` | `O(1)` amortized | `O(n)` | The optimal solution: pour into `out` only when it is empty, so each element moves at most twice over its lifetime. Slightly trickier `empty()` (must check both stacks), but strictly better for repeated pops. |
| **One stack + recursion** | `O(1)` | `O(n)` | `O(n)` | Same asymptotics as the implemented version with less explicit bookkeeping, but it consumes call-stack depth proportional to the queue size and is harder to debug. |
| **Expensive push (front on top)** | `O(n)` | `O(1)` | `O(n)` | Inverts the cost, which is better when reads dominate writes. For a mixed workload the lazy approach still wins overall. |

**Why the implemented approach is acceptable here**: with at most `100` calls, the worst case is roughly `100 × 100 = 10^4` moves — trivial. It is also the most direct expression of the idea "reverse the stack to reach the bottom", and it restores `arr1` after every operation, so each method's precondition is simple.

**When an alternative wins**: the moment the operation count grows (or the follow-up matters), the **lazy two-stack** design is the correct answer — `n` operations cost `O(n)` total instead of `O(n^2)`. If pops overwhelmingly outnumber pushes, the expensive-push variant gives `O(1)` reads. The recursion variant is a nice interview trick but is dominated by the iterative versions in both safety and clarity.
