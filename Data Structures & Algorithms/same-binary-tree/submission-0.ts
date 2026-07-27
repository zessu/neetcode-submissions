class Solution {
    isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
        if(!p && !q) return true;
        if(p && q && p.val === q.val) {
            return (
                this.isSameTree(p.left, q.left) && this.isSameTree(p.right, q.right)
                )
        } else {
            return false;
        }
    }
}
