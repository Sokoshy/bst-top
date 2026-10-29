// Balanced BST — The Odin Project assignment.
// Run tests with: bun test / bun test --watch

export class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export function buildTree(array) {
  // TODO step 3
  throw new Error("Not implemented: buildTree");
}

export class Tree {
  constructor(array) {
    // TODO step 2
    throw new Error("Not implemented: Tree constructor");
  }

  includes(value) {
    // TODO step 4
    throw new Error("Not implemented: includes");
  }

  insert(value) {
    // TODO step 5
    throw new Error("Not implemented: insert");
  }

  deleteItem(value) {
    // TODO step 6
    throw new Error("Not implemented: deleteItem");
  }

  levelOrderForEach(callback) {
    // TODO step 7
    throw new Error("Not implemented: levelOrderForEach");
  }

  inOrderForEach(callback) {
    // TODO step 8
    throw new Error("Not implemented: inOrderForEach");
  }

  preOrderForEach(callback) {
    // TODO step 8
    throw new Error("Not implemented: preOrderForEach");
  }

  postOrderForEach(callback) {
    // TODO step 8
    throw new Error("Not implemented: postOrderForEach");
  }

  height(value) {
    // TODO step 9
    throw new Error("Not implemented: height");
  }

  depth(value) {
    // TODO step 10
    throw new Error("Not implemented: depth");
  }

  isBalanced() {
    // TODO step 11
    throw new Error("Not implemented: isBalanced");
  }

  rebalance() {
    // TODO step 12
    throw new Error("Not implemented: rebalance");
  }
}

// Provided — do not modify.
export const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null || node === undefined) {
    return;
  }
  prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
};
