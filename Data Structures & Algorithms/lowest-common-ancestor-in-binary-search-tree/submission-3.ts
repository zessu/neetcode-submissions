class Solution {
    lowestCommonAncestor(
        root: TreeNode | null,
        p: TreeNode | null,
        q: TreeNode | null,
    ) {
        if (!p || !q || !root) {
            return null;
        }

        if (p.val < root.val && q.val < root.val) {
            return this.lowestCommonAncestor(root.left, p, q);
        }

        if (p.val > root.val && q.val > root.val) {
            return this.lowestCommonAncestor(root.right, p, q);
        }

        return root;
    }
}