class Solution {
    /**
     * @param {TreeNode} root
     * @param {TreeNode} subRoot
     * @return {boolean}
     */
    isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
        let isSubTree = false;

        const compareTrees = (root: TreeNode | null, subRoot: TreeNode | null) => {
            if(!root && !subRoot) return true;
            if(root && subRoot && root.val === subRoot.val) {
                return compareTrees(root.left, subRoot.left) && compareTrees(root.right, subRoot.right)
            }
            return false;
        }

        const traverseTree = (root: TreeNode | null) => {
            if(root === null) return;
            if(root.val === subRoot.val) {
                const res = compareTrees(root, subRoot);
                if(res) isSubTree = true;
            };
            traverseTree(root.left);
            traverseTree(root.right);
            return;
        }

        traverseTree(root);

        return isSubTree;
    }
}
