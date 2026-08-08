class Solution {
    traverse(root: TreeNode | null, results: number[]) {
        if(root === null) return;
        this.traverse(root.left, results);
        results.push(root.val);
        this.traverse(root.right, results);
    }
    kthSmallest(root: TreeNode | null, k: number): number {
        const results = [];
        this.traverse(root, results);
        console.log(results);
        return results[k-1];
    }
}
