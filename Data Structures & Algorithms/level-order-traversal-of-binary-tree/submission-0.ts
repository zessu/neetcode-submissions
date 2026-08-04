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
    traverse(root: TreeNode | null, result: number[][], level: number) {
        if(root === null) return;
        if(result.length === level){
            result.push([]);
        }
        result[level].push(root.val);
        this.traverse(root.left, result, level + 1);
        this.traverse(root.right, result, level + 1);
    }

    levelOrder(root: TreeNode | null): number[][] {
        const result = [];
        this.traverse(root, result, 0);
        return result;
    }
}
