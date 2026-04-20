# Valid Sudoku - LeetCode 36

## Problem Description

Determine if a 9x9 Sudoku board is valid. Only filled cells need to be validated.

## Rules

1. Each row must contain 1-9 without repetition
2. Each column must contain 1-9 without repetition
3. Each 3x3 sub-box must contain 1-9 without repetition

## Examples

```
Input: board = 
[["5","3",".",".","7",".",".",".","."]
,[".","9","8",".",".",".",".","6","."]
,[".",".","2","1","5","4",".","7","."]
,[".","6",".",".","1","3",".","9","4"]
,[".","8",".","9","7",".",".",".","."]
,[".",".",".",".",".",".",".",".","."]
,[".",".","7","6","1","5",".","2","3"]
,[".",".","1",".",".",".","5","."]
,[".",".",".","9","8","6","."]]
Output: true
```

## Topics

- Array
- Hash Table
- Matrix

## Solution: Three Pass Validation

Check rows, columns, and 3x3 boxes independently.