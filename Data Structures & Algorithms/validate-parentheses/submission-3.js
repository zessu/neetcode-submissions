class Solution {

    /**
     * @param {string} s
     * @return {boolean}
     */
    isValid(s) {
        const openingPairs = ["(", "{", "["];
        const closingPairs = [")", "}", "]"];

        const matchingPairs = {
            "}": "{",
            ")": "(",
            "]": "["
        };

        const stack = [];

        const splitString = s.split('');
        console.log(splitString);
        const strLength = s.length;
        if (strLength % 2) return false;

        for (let count = 0; count < strLength; count++) {
            const bracket = splitString[count];
            if (openingPairs.indexOf(bracket) !== -1) {
                stack.push(bracket);
            } else if (closingPairs.indexOf(bracket) !== -1) {
                const comp = stack.pop();
                if (matchingPairs[bracket] === comp) continue;
                return false;
            }
            else return false;
        }
        return stack.length === 0;
    }
}