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
    /**
     * @param {TreeNode} root
     * @param {number} targetSum
     * @return {boolean}
     */
    hasPathSum(root: TreeNode | null, targetSum: number): boolean {


        const recurr = (root: TreeNode, targetSum: number, counter: number) => {
            if(root === null) return false;

            const newCount = counter + root.val;

            if(!root.left && !root.right && newCount === targetSum) return true;


            return recurr(root.left, targetSum, newCount) || recurr(root.right, targetSum, newCount);
        }

        return recurr(root, targetSum, 0);

    }
}
