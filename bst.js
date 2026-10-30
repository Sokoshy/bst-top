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
  if(array.length === 0) return null

  const copyArr = [...array];
  copyArr.sort((a, b) => a - b);

  for (let i = 0; i < copyArr.length; i++) {
    if (copyArr[i] === copyArr[i - 1]) {
      copyArr.splice(i, 1);
      i--;
    }
  }

  function bstRecur(copyArr, start = 0, end = copyArr.length - 1) {
    if (start > end) return null;

    let mid = Math.floor(start + (end - start) / 2);
    let root = new Node(copyArr[mid]);

    root.left = bstRecur(copyArr, start, mid - 1);
    root.right = bstRecur(copyArr, mid + 1, end);

    return root;
  }

  const root = bstRecur(copyArr);
  return root;
}

export class Tree {
  constructor(array) {
    this.root = buildTree(array);
  }

  includes(value) {
    if(this.root === null || value === null){
      return false;
    }
    let currNode = this.root;
    while(true){
      if(currNode.data === value){
        return true
      }else if(currNode.left !==null && currNode.data > value){
        currNode =  currNode.left
      }else if(currNode.right !==null && currNode.data < value){
        currNode = currNode.right
      }else{
        return false;
      }
    }
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
