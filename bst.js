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
  if (array.length === 0) return null;

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
    if (this.root === null || value === null) {
      return false;
    }
    let currNode = this.root;
    while (true) {
      if (currNode.data === value) {
        return true;
      } else if (currNode.left !== null && currNode.data > value) {
        currNode = currNode.left;
      } else if (currNode.right !== null && currNode.data < value) {
        currNode = currNode.right;
      } else {
        return false;
      }
    }
  }

  insert(value) {
    if (this.root === null) {
      this.root = new Node(value);
    }

    let currNode = this.root;
    while (true) {
      if (currNode.data === value) {
        return;
      } else if (currNode.data > value) {
        if (currNode.left === null) {
          currNode.left = new Node(value);
          return;
        }
        currNode = currNode.left;
      } else if (currNode.data < value) {
        if (currNode.right === null) {
          currNode.right = new Node(value);
          return;
        }
        currNode = currNode.right;
      }
    }
  }

  deleteItem(value) {
    function delNode(root, value) {
      if (root === null) return null;

      if (root.data > value) {
        root.left = delNode(root.left, value);
        return root;
      } else if (root.data < value) {
        root.right = delNode(root.right, value);
        return root;
      } else {
        if (root.left === null) {
          return root.right;
        }
        if (root.right === null) {
          return root.left;
        }

        const succ = getSuccessor(root);
        root.data = succ.data;
        root.right = delNode(root.right, succ.data);

        return root;
      }
    }

    function getSuccessor(curr) {
      let node = curr.right;
      while (node !== null && node.left !== null) {
        node = node.left;
      }
      return node;
    }

    this.root = delNode(this.root, value);
  }

  levelOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback is required");
    }
    if (this.root === null) return;

    let queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift(); // je garde le nœud
      callback(node.data);
      if (node.left !== null) {
        queue.push(node.left);
      }
      if (node.right !== null) {
        queue.push(node.right);
      }
    }
  }

  inOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback is required");
    }

    if (this.root === null) return;

    function visit(root) {
      if (root === null) return;
      visit(root.left);
      callback(root.data);
      visit(root.right);
    }

    let root = visit(this.root);
  }

  preOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback is required");
    }

    if (this.root === null) return;

    function visit(root) {
      if (root === null) return;
      callback(root.data);
      visit(root.left);
      visit(root.right);
    }

    let root = visit(this.root);
  }

  postOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback is required");
    }

    if (this.root === null) return;

    function visit(root) {
      if (root === null) return;
      visit(root.left);
      visit(root.right);
      callback(root.data);
    }

    let root = visit(this.root);
  }

  height(value) {
    function search(value, root) {
      if (root === null || value === null) {
        return undefined;
      }
      let currNode = root;
      while (true) {
        if (currNode.data === value) {
          return currNode;
        } else if (currNode.left !== null && currNode.data > value) {
          currNode = currNode.left;
        } else if (currNode.right !== null && currNode.data < value) {
          currNode = currNode.right;
        } else {
          return undefined;
        }
      }
    }

    let node = search(value, this.root);

    if (node === undefined) return undefined;

    function calcHeight(node) {
      if (node === null) {
        return -1;
      }

      return 1 + Math.max(calcHeight(node.left), calcHeight(node.right));
    }

    return calcHeight(node);
  }

  depth(value) {
    if (this.root === null || value === null) return undefined;

    let depth = 0;

    let currNode = this.root;
    while (true) {
      if (currNode.data === value) {
        return depth;
      } else if (currNode.left !== null && currNode.data > value) {
        currNode = currNode.left;
        depth++;
      } else if (currNode.right !== null && currNode.data < value) {
        currNode = currNode.right;
        depth++;
      } else {
        return undefined;
      }
    }
  }

  isBalanced() {
    if (this.root === null) return true;

    let node = this.root;

    function check(node) {
      if (node === null) return true;
      if (
        calcHeight(node.left) - calcHeight(node.right) > 1 ||
        calcHeight(node.right) - calcHeight(node.left) > 1
      ) {
        return false;
      } else {
        return check(node.left) && check(node.right);
      }
    }

    function calcHeight(node) {
      if (node === null) {
        return -1;
      }

      return 1 + Math.max(calcHeight(node.left), calcHeight(node.right));
    }

    return check(node);
  }

  rebalance() {
    const values = [];
    this.inOrderForEach((v) => values.push(v));
    this.root = buildTree(values);
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
