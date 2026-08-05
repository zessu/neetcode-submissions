class Solution {

    traverse(root: TreeNode | null, result: number[][], level: number){
        if(root === null) return;
        if(result.length === level) {
            result.push([]);
        }
        result[level].push(root.val);

        this.traverse(root.left, result, level + 1);
        this.traverse(root.right, result, level + 1);
    }

    rightSideView(root: TreeNode | null): number[] {
        const result = [];
        this.traverse(root, result, 0);
        const mapped = result.map(arr => {
            return arr[arr.length - 1]
        });
        return mapped;
    }
}
