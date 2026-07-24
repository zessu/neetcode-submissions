class Solution {
    maxLength = 0;
    diameterOfBinaryTree(root: TreeNode | null): number {
        const findDiameter = (root: TreeNode | null) => {
            if(root === null) return 0;
            const left = findDiameter(root.left);
            const right = findDiameter(root.right);
            this.maxLength = Math.max(this.maxLength, left + right);
            return Math.max(left, right) + 1;
        }

        findDiameter(root);
        return this.maxLength;
    }
}
