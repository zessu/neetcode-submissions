class Solution {
    /**
     * @param {string[]} strs
     * @returns {string}
     */
    encode(strs) {
        let encData = "";

        for(const item in strs) {
            encData += `${strs[item].length},`
        }

        const inputString = strs.join(" ");

        const outputString = `${encData}#${inputString}`;

        return outputString;

    }

    /**
     * @param {string} str
     * @returns {string[]}
     */
    decode(str) {
        let i = 0;
        const sizes = [];
        let decoded = [];

        while(str[i] !== "#") {
            let counter = "";
            while(str[i] !== ',') {
                counter += str[i];
                i++; 
            }
            sizes.push(parseInt(counter));
            i++
        }
        i++;

        for(const size of sizes) {
            const sub = str.substring(i, i+size);
            decoded.push(sub);
            i += size+1;
        }

        return decoded;
    }
}
