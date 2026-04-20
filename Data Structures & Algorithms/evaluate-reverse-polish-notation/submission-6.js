class Solution {
  stack = [];

  isOperator(val) {
    const operators = ["+", "/", "*", "-"];
    return operators.includes(val);
  }

  isOperand(val) {
    return parseInt(val);
  }

  operate(op1, op2, operator) {
    switch (operator) {
      case "+":
        return op1 + op2;
      case "-":
        return op2 - op1;
      case "*":
        return op1 * op2;
      case "/":
        return Math.trunc(op2 / op1);
      default: throw new Error("operand not supported");
    }
  }

  evalRPN(tokens) {
    for (const item in tokens) {
      const value = tokens[item];
      if (!Number.isNaN(this.isOperand(value))) {
        this.stack.push(parseInt(value));
      } else if (this.isOperator(value)) {
        const op1 = this.stack.pop();
        const op2 = this.stack.pop();
        const res = this.operate(op1, op2, value);
        this.stack.push(res);
      } else throw new Error(`value not supported ${value}`);
    }

    return this.stack.pop();
  }
}

