class Solution {
    res = -Infinity;

    getMax(root: TreeNode | null) {
        if(!root) return 0;
        let left = this.getMax(root.left);
        let right = this.getMax(root.right);
        let max = Math.max(left, right);
        const sum = left + right + root.val;
        this.res = Math.max(this.res, sum);
        return Math.max(0, root.val + max);
    }

    maxPathSum(root: TreeNode| null): number {
        this.getMax(root);
        return this.res;
    }
}
