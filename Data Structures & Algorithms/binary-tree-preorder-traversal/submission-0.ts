/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     constructor(val = 0, left = null, right = null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    res: number[] = [];
    traverse(root: TreeNode | null) {
        if(!root) return;
        this.res.push(root.val);
        this.traverse(root.left);
        this.traverse(root.right);
    }
    /**
     * @param {TreeNode} root
     * @return {number[]}
     */
    preorderTraversal(root: TreeNode | null): number[] {
        this.traverse(root);
        return this.res;
    }
}