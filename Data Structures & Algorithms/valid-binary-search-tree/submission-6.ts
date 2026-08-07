class Solution {

    isValid(root: TreeNode | null, min: number, max:number): boolean {
        if(root === null) return true;
        if(root.val > min && root.val < max){
            return this.isValid(root.left, min, root.val) && this.isValid(root.right, root.val, max);
        } else return false;
    }

    isValidBST(root: TreeNode | null): boolean {
        return this.isValid(root, -Infinity, Infinity);
    }
}
