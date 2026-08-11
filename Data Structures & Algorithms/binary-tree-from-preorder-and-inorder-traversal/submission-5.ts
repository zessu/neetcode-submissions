class Solution {
    buildTree(preorder: number[], inorder: number[]): TreeNode {
        const inorderIndex = new Map<number, number>();
        for (const [idx, item] of inorder.entries()) {
            inorderIndex.set(item, idx);
        }

        let preIdx = 0;

        const build = (inLeft: number, inRight: number): TreeNode | null => {
            if (inLeft > inRight) return null;

            const rootVal = preorder[preIdx++];
            const root = new TreeNode(rootVal);
            const mid = inorderIndex.get(rootVal)!;

            root.left = build(inLeft, mid - 1);
            root.right = build(mid + 1, inRight);

            return root;
        };

        return build(0, inorder.length - 1);
    }
}