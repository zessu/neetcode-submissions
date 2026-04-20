class Solution {

    /**
     * @param {number[]} temperatures
     * @return {number[]}
     */
    dailyTemperatures(temperatures) {
        const out = [];
        for(let i=0; i< temperatures.length; i++) {
            for(let j=i; j<temperatures.length; j++) {
                if(temperatures[j] > temperatures[i]) {
                    const days = j-i;
                    out.push(days);
                    break;
                }
                if(j === (temperatures.length - 1)) {
                    out.push(0);
                }
            }
        }

        return out;
    }
}