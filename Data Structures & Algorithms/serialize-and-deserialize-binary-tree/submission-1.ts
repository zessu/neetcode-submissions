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

class Codec {
    /**
     * Encodes a tree to a single string.
     *
     * @param {TreeNode} root
     * @return {string}
     */
    serialize(root: TreeNode | null): string {
        let serialized: string = "";

        const traverse = (root) => {
            if (!root) {
                serialized += `null_`;
                return;
            };
            serialized += `${root.val}_`;
            traverse(root.left);
            traverse(root.right);
        }

        traverse(root);

        return serialized;
    }

    /**
     * Decodes your encoded data to tree.
     *
     * @param {string} data
     * @return {TreeNode}
     */
    deserialize(data: string): TreeNode {
        const arr = data.split("_");
        const el = arr.shift();
        if(!parseInt(el)) return new TreeNode(null);

        const root: TreeNode = new TreeNode(parseInt(el));

        const traverse = (arr: string[]) => {
            const next = parseInt(arr.shift());
            if (!next) return null; 
            const newRoot: TreeNode = new TreeNode(next);
            newRoot.left = traverse(arr);
            newRoot.right = traverse(arr);
            return newRoot;
        };

        root.left = traverse(arr);
        root.right = traverse(arr);

        return root;
    }
}
