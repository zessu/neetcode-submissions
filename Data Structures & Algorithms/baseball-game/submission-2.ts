class Solution {
    /**
     * @param {string[]} operations
     * @return {number}
     */
    calPoints(operations: string[]): number {
        const record = [];

        const checkOp = (op: string) => {
            console.log(record);
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
