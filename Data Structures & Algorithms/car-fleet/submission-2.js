class Solution {

    /**
     * @param {number} target
     * @param {number[]} position
     * @param {number[]} speed
     * @return {number}
     */
    carFleet(target, position, speed) {
        if(position.length !== speed.length) throw new Error("position and speed arrays have to match");
        const sorted = position.map((item, idx) => {
            return [item, (target-item)/speed[idx]]
        }).sort((a,b) => b[0] - a[0]);

        const result = [];
        sorted.map((item) => {
            if(!result.length || result[result.length-1] < item[1]) {
                result.push(item[1]);
            }
        });

        return result.length;
    }
}