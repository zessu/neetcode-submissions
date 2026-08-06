class Solution {
    goodNodes(root) {
        return this.dfs(root, root.val);
    }

    dfs(node, maxVal) {
        if (!node) {
            return 0;
        }

        let res = node.val >= maxVal ? 1 : 0;
        maxVal = Math.max(maxVal, node.val);
        res += this.dfs(node.left, maxVal);
        res += this.dfs(node.right, maxVal);
        return res;
    }
}