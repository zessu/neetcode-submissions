class Solution {
    isBalanced(root: TreeNode | null): boolean {
        let balanced = true;
        const traverse = (root: TreeNode | null) => {
            if(root === null) return 0;
            const left = traverse(root.left);
            const right = traverse(root.right);
            const res = left - right;
            if(Math.abs(res) > 1) balanced = false;
            return Math.max(left, right) + 1;
        }
        traverse(root);
        return balanced;
    }
}
