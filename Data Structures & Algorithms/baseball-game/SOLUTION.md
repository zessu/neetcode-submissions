# Baseball Game - Solution

## Solution Code

```typescript
class Solution {
    /**
     * @param {string[]} operations
     * @return {number}
     */
    calPoints(operations: string[]): number {
        const record = [];

        const checkOp = (op: string) => {
            if(!isNaN(parseInt(op))) return record.push(parseInt(op));
            switch(op) {
                case "+":
                    record.push(parseInt(record[record.length - 1]) + parseInt(record[record.length - 2]));
                    break;
                case "D":
                    record.push(parseInt(record[record.length - 1])*2);
                    break;
                case "C":
                    record.pop();
                    break;
                default:
                    throw new Error("Invalid operand");

            }
        }

        for (const op of operations) {
            checkOp(op);
        }

        return record.reduce((acc, curr) => acc + curr , 0);
    }
}
```

## Approach

The solution uses a **stack** (implemented with a JavaScript array) to maintain the record of valid scores.

1. **Recognize the stack**: Every operation reads or removes the most recent score(s). A number pushes a score, `"C"` pops the last score, and `"+"`/`"D"` read from the top without removing anything.
2. **Parse the operation**:
   - `parseInt(op)` is a number for integer strings (including negative values) and `NaN` for `"+"`, `"C"`, and `"D"`.
   - If it is a number, push it and return from the helper.
3. **Apply the three special operations**:
   - `"+"` pushes the sum of `record[record.length - 1]` and `record[record.length - 2]`.
   - `"D"` pushes twice `record[record.length - 1]`.
   - `"C"` removes the last element with `pop()`.
4. **Sum the survivors**: After all operations, `reduce` adds every remaining score. Summing at the end automatically reflects every invalidation performed by `"C"`.

- **Time Complexity**: `O(n)`, where `n = operations.length`. Each operation does `O(1)` stack work, and the final reduction is `O(n)`.
- **Space Complexity**: `O(n)` for the record, which can grow to at most `n` scores.

> The `parseInt(...)` calls around values already stored in `record` are redundant — the array holds numbers, and `parseInt` coerces them to strings internally. They do not change the result, but they make the intent of numeric conversion explicit.

## Walkthrough

### Example 1: `operations = ["5","2","C","D","+"]`

| Step | Operation | Action | Record (bottom → top) | Sum |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `"5"` | `parseInt("5") = 5`, push | `[5]` | 5 |
| 2 | `"2"` | `parseInt("2") = 2`, push | `[5, 2]` | 7 |
| 3 | `"C"` | pop the top | `[5]` | 5 |
| 4 | `"D"` | push `5 * 2 = 10` | `[5, 10]` | 15 |
| 5 | `"+"` | push `10 + 5 = 15` | `[5, 10, 15]` | 30 |

`reduce` returns `5 + 10 + 15 = 30`.

### Example 2: `operations = ["5","-2","4","C","D","9","+","+"]`

| Step | Operation | Action | Record (bottom → top) |
| :--- | :--- | :--- | :--- |
| 1 | `"5"` | push `5` | `[5]` |
| 2 | `"-2"` | `parseInt("-2") = -2`, push | `[5, -2]` |
| 3 | `"4"` | push `4` | `[5, -2, 4]` |
| 4 | `"C"` | pop `4` | `[5, -2]` |
| 5 | `"D"` | push `-2 * 2 = -4` | `[5, -2, -4]` |
| 6 | `"9"` | push `9` | `[5, -2, -4, 9]` |
| 7 | `"+"` | push `9 + (-4) = 5` | `[5, -2, -4, 9, 5]` |
| 8 | `"+"` | push `5 + 9 = 14` | `[5, -2, -4, 9, 5, 14]` |

Final sum: `5 - 2 - 4 + 9 + 5 + 14 = 27`.

The negative score is handled correctly because `parseInt("-2")` returns `-2`, and `isNaN(-2)` is `false`, so it takes the numeric branch rather than falling into the `switch`.

## Comparison with the Alternatives

| Approach | Time | Space | Why it is / is not preferred |
| :--- | :--- | :--- | :--- |
| **Stack Simulation (implemented)** | `O(n)` | `O(n)` | Best fit: the rules are defined in terms of the most recent scores, so every operation is `O(1)`. This is the standard solution. |
| **Array + Top Pointer** | `O(n)` | `O(n)` | Equally fast and avoids dynamic resizing, but requires manual capacity and index management. It wins in languages where stack allocation is expensive or when the operation count is known up front. In JavaScript, the built-in array is already an efficient stack. |
| **Brute-Force Replay** | `O(n^2)` | `O(n)` | Conceptually simple but re-does `1 + 2 + ... + n` work. It only makes sense as a correctness oracle or teaching device; it is never the right choice for `n = 1000`. |

**Why the implemented approach is preferred**: the problem is a simulation whose entire state is "the list of scores still in effect". A stack stores exactly that state, and every operation touches only the top. The implemented solution also delays the sum until the end, which keeps `"C"` trivial (`pop`) instead of requiring a running-total correction.

**When an alternative wins**:
- If the input were streamed and the maximum size were known, a **preallocated array with a top pointer** would avoid reallocation and could be marginally faster.
- If the task explicitly asked for a persistent record or an undo history, a **linked-list stack** (or a stack of nodes) would allow sharing states, at the cost of pointer overhead.
- The brute-force replay is only useful for verifying the stack logic on small inputs.

## Key Insights

1. **`"C"` is `pop`.** This single observation identifies the data structure: the score being invalidated is always the most recently added valid score.
2. **`"+"` and `"D"` are reads, not pops.** They peek at the top one or two elements and then push a derived value.
3. **A later `"C"` can remove a score that `"+"` used.** The derived score remains, because the rules only remove the last score itself; they do not rewrite earlier calculations. Summing at the end follows the rules exactly.
4. **Negative scores are valid input.** Operator detection must not assume an integer starts with a digit; `parseInt` (or `Number`) handles the sign.
5. **The guarantees remove defensive checks.** Since `"+"` always has two scores and `"C"`/`"D"` always have one, the implementation can index the top directly. Robust production code would still guard against underflow if the input contract were not guaranteed.
