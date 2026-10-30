// Tests for the Balanced BST assignment — The Odin Project
// Run: bun test

import { describe, test, expect } from "bun:test";
import { Node, Tree, buildTree, prettyPrint } from "./bst.js";

// Helpers — do not modify. Skip reading them if you want zero hints.
function collect(tree, forEachMethod) {
  const output = [];
  forEachMethod.call(tree, (value) => output.push(value));
  return output;
}

function inOrderValues(tree) {
  return collect(tree, tree.inOrderForEach);
}

function isBSTValid(tree) {
  const values = inOrderValues(tree);
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] >= values[i]) return false;
  }
  return true;
}

function countNodes(node) {
  if (node === null || node === undefined) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

function size(tree) {
  return countNodes(tree.root);
}

function nodeHeight(node) {
  if (node === null || node === undefined) return -1;
  return 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right));
}

function checkBalanced(node) {
  if (node === null || node === undefined) return true;
  const diff = Math.abs(nodeHeight(node.left) - nodeHeight(node.right));
  if (diff > 1) return false;
  return checkBalanced(node.left) && checkBalanced(node.right);
}

// Step 1: Node

describe("step 1 — Node", () => {
  test("Node stores data and inits left/right to null", () => {
    const node = new Node(5);
    expect(node.data).toBe(5);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
  });

  test("Node works with different values", () => {
    expect(new Node(0).data).toBe(0);
    expect(new Node(6345).data).toBe(6345);
  });
});

// Step 2: Tree

describe("step 2 — Tree (constructor + root)", () => {
  test("Tree accepts an array and exposes root", () => {
    const tree = new Tree([1, 2, 3]);
    expect(tree.root).not.toBeNull();
    expect(tree.root).toBeInstanceOf(Node);
  });

  test("Tree([]) gives a null root", () => {
    const tree = new Tree([]);
    expect(tree.root).toBeNull();
  });

  test("Tree with a single element", () => {
    const tree = new Tree([42]);
    expect(tree.root.data).toBe(42);
    expect(tree.root.left).toBeNull();
    expect(tree.root.right).toBeNull();
  });

  test("does not mutate the input array", () => {
    const input = [3, 1, 2, 3, 1];
    const snapshot = [...input];
    new Tree(input);
    expect(input).toEqual(snapshot);
  });

  test("Tree([1,2,3]) root is the middle (2)", () => {
    const tree = new Tree([1, 2, 3]);
    expect(tree.root.data).toBe(2);
    expect(tree.root.left.data).toBe(1);
    expect(tree.root.right.data).toBe(3);
  });

  test("duplicate-heavy input keeps one copy each", () => {
    const tree = new Tree([2, 2, 1, 1, 3, 3]);
    expect(size(tree)).toBe(3);
    expect(tree.root.data).toBe(2);
  });
});

// Step 3: buildTree

describe("step 3 — buildTree(array)", () => {
  test("assignment example: root is 8", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    expect(tree.root.data).toBe(8);
  });

  test("sorts and removes duplicates", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    expect(size(tree)).toBe(11);
    expect(inOrderValues(tree)).toEqual([1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]);
  });

  test("unsorted input still yields a valid BST", () => {
    const tree = new Tree([23, 1, 67, 3, 9, 4]);
    expect(isBSTValid(tree)).toBe(true);
    expect(inOrderValues(tree)).toEqual([1, 3, 4, 9, 23, 67]);
  });

  test("all-duplicate array -> single node", () => {
    const tree = new Tree([5, 5, 5, 5]);
    expect(size(tree)).toBe(1);
    expect(tree.root.data).toBe(5);
  });

  test("balanced tree: small case [1..7] -> root 4", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.root.data).toBe(4);
    expect(tree.root.left.data).toBe(2);
    expect(tree.root.right.data).toBe(6);
    expect(checkBalanced(tree.root)).toBe(true);
  });

  test("built tree is balanced (large example)", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    expect(checkBalanced(tree.root)).toBe(true);
  });

  test("exported buildTree returns the level-0 root", () => {
    const root = buildTree([1, 2, 3, 4, 5]);
    expect(root).toBeInstanceOf(Node);
    expect(root.data).toBe(3);
  });

  test("buildTree([]) returns null", () => {
    expect(buildTree([])).toBeNull();
  });

  test("does not mutate the input array", () => {
    const input = [5, 3, 5, 1, 3, 2];
    const snapshot = [...input];
    buildTree(input);
    expect(input).toEqual(snapshot);
  });

  test("even-length input picks a middle root and stays balanced", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6]);
    expect(size(tree)).toBe(6);
    expect(checkBalanced(tree.root)).toBe(true);
    expect(isBSTValid(tree)).toBe(true);
  });

  test("negative numbers are sorted like the rest", () => {
    const tree = new Tree([-3, -1, -2, 0, 2, 1]);
    expect(inOrderValues(tree)).toEqual([-3, -2, -1, 0, 1, 2]);
    expect(isBSTValid(tree)).toBe(true);
  });
});

// Step 4: includes

describe("step 4 — includes(value)", () => {
  const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

  test("returns true for every value in the tree (all 11)", () => {
    for (const v of [1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]) {
      expect(tree.includes(v)).toBe(true);
    }
  });

  test("returns true for every value in a small tree (all 7)", () => {
    const small = new Tree([1, 2, 3, 4, 5, 6, 7]);
    for (const v of [1, 2, 3, 4, 5, 6, 7]) {
      expect(small.includes(v)).toBe(true);
    }
  });

  test("finds leaves on both far ends", () => {
    expect(tree.includes(1)).toBe(true);
    expect(tree.includes(3)).toBe(true);
    expect(tree.includes(7)).toBe(true);
    expect(tree.includes(23)).toBe(true);
    expect(tree.includes(6345)).toBe(true);
  });

  test("finds inner nodes, not just the root path", () => {
    expect(tree.includes(4)).toBe(true);
    expect(tree.includes(5)).toBe(true);
    expect(tree.includes(9)).toBe(true);
    expect(tree.includes(67)).toBe(true);
    expect(tree.includes(324)).toBe(true);
  });

  test("returns false for missing values", () => {
    expect(tree.includes(0)).toBe(false);
    expect(tree.includes(2)).toBe(false);
    expect(tree.includes(6)).toBe(false);
    expect(tree.includes(10)).toBe(false);
    expect(tree.includes(100)).toBe(false);
    expect(tree.includes(9999)).toBe(false);
  });

  test("missing values between present ones are false", () => {
    const small = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(small.includes(0)).toBe(false);
    expect(small.includes(8)).toBe(false);
    expect(small.includes(2.5)).toBe(false);
  });

  test("empty tree -> false", () => {
    expect(new Tree([]).includes(1)).toBe(false);
  });

  test("single-node tree", () => {
    const single = new Tree([42]);
    expect(single.includes(42)).toBe(true);
    expect(single.includes(41)).toBe(false);
    expect(single.includes(43)).toBe(false);
  });
});

// Step 5: insert

describe("step 5 — insert(value)", () => {
  test("inserts a leaf while preserving the BST property", () => {
    const tree = new Tree([10, 20, 30]);
    tree.insert(25);
    expect(tree.includes(25)).toBe(true);
    expect(isBSTValid(tree)).toBe(true);
  });

  test("inserts smaller-than-all to the left, larger-than-all to the right", () => {
    const tree = new Tree([10, 20, 30]);
    tree.insert(5);
    tree.insert(40);
    expect(tree.includes(5)).toBe(true);
    expect(tree.includes(40)).toBe(true);
    expect(isBSTValid(tree)).toBe(true);
  });

  test("every inserted value is found afterwards", () => {
    const tree = new Tree([50]);
    for (const v of [30, 70, 20, 40, 60, 80, 10, 25, 35, 45]) {
      tree.insert(v);
    }
    for (const v of [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]) {
      expect(tree.includes(v)).toBe(true);
    }
    expect(isBSTValid(tree)).toBe(true);
  });

  test("insert goes to the correct side (left/right nesting)", () => {
    const tree = new Tree([8]);
    tree.insert(4);
    tree.insert(12);
    tree.insert(6);
    tree.insert(2);
    expect(tree.includes(6)).toBe(true);
    expect(tree.includes(2)).toBe(true);
    expect(inOrderValues(tree)).toEqual([2, 4, 6, 8, 12]);
  });

  test("duplicate -> no-op (size unchanged)", () => {
    const tree = new Tree([1, 2, 3, 4, 5]);
    const before = size(tree);
    tree.insert(3);
    tree.insert(1);
    tree.insert(5);
    expect(size(tree)).toBe(before);
    const values = inOrderValues(tree);
    expect(new Set(values).size).toBe(values.length);
  });

  test("duplicate insert keeps the same inorder set", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    const before = inOrderValues(tree);
    tree.insert(8);
    tree.insert(67);
    tree.insert(1);
    expect(inOrderValues(tree)).toEqual(before);
    expect(size(tree)).toBe(11);
  });

  test("insert into an empty tree creates the root", () => {
    const tree = new Tree([]);
    tree.insert(10);
    expect(tree.root.data).toBe(10);
    expect(tree.includes(10)).toBe(true);
  });

  test("insert into empty then more values stays valid", () => {
    const tree = new Tree([]);
    tree.insert(10);
    tree.insert(5);
    tree.insert(15);
    tree.insert(12);
    expect(isBSTValid(tree)).toBe(true);
    expect(inOrderValues(tree)).toEqual([5, 10, 12, 15]);
  });

  test("multiple inserts keep a valid BST", () => {
    const tree = new Tree([50]);
    [30, 70, 20, 40, 60, 80].forEach((value) => tree.insert(value));
    expect(isBSTValid(tree)).toBe(true);
    expect(inOrderValues(tree)).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });
});

// Step 6: deleteItem

describe("step 6 — deleteItem(value)", () => {
  test("deletes a leaf node", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    tree.deleteItem(1);
    expect(tree.includes(1)).toBe(false);
    expect(isBSTValid(tree)).toBe(true);
    expect(inOrderValues(tree)).toEqual([2, 3, 4, 5, 6, 7]);
  });

  test("deletes a right-side leaf", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    tree.deleteItem(7);
    expect(tree.includes(7)).toBe(false);
    expect(isBSTValid(tree)).toBe(true);
    expect(inOrderValues(tree)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test("deletes a node with a single left child", () => {
    const tree = new Tree([10]);
    tree.insert(5);
    tree.insert(15);
    tree.insert(12);
    tree.deleteItem(15);
    expect(tree.includes(15)).toBe(false);
    expect(tree.includes(12)).toBe(true);
    expect(isBSTValid(tree)).toBe(true);
  });

  test("deletes a node with a single right child", () => {
    const tree = new Tree([10]);
    tree.insert(5);
    tree.insert(15);
    tree.insert(20);
    tree.deleteItem(15);
    expect(tree.includes(15)).toBe(false);
    expect(tree.includes(20)).toBe(true);
    expect(isBSTValid(tree)).toBe(true);
    expect(inOrderValues(tree)).toEqual([5, 10, 20]);
  });

  test("deletes a node with two children", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    tree.deleteItem(2);
    expect(tree.includes(2)).toBe(false);
    expect(isBSTValid(tree)).toBe(true);
    expect(inOrderValues(tree)).toEqual([1, 3, 4, 5, 6, 7]);
  });

  test("deletes the other inner two-children node", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    tree.deleteItem(6);
    expect(tree.includes(6)).toBe(false);
    expect(isBSTValid(tree)).toBe(true);
    expect(inOrderValues(tree)).toEqual([1, 2, 3, 4, 5, 7]);
  });

  test("deletes the root with two children", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    tree.deleteItem(4);
    expect(tree.includes(4)).toBe(false);
    expect(isBSTValid(tree)).toBe(true);
    expect(inOrderValues(tree)).toEqual([1, 2, 3, 5, 6, 7]);
    expect(size(tree)).toBe(6);
  });

  test("deletes the only node -> empty tree", () => {
    const tree = new Tree([42]);
    tree.deleteItem(42);
    expect(tree.includes(42)).toBe(false);
    expect(tree.root).toBeNull();
    expect(size(tree)).toBe(0);
  });

  test("delete from empty tree does not throw", () => {
    const tree = new Tree([]);
    expect(() => tree.deleteItem(1)).not.toThrow();
    expect(tree.root).toBeNull();
  });

  test("missing value -> no-op", () => {
    const tree = new Tree([1, 2, 3]);
    const before = inOrderValues(tree);
    tree.deleteItem(999);
    expect(inOrderValues(tree)).toEqual(before);
  });

  test("delete keeps the other values findable", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    tree.deleteItem(8);
    for (const v of [1, 3, 4, 5, 7, 9, 23, 67, 324, 6345]) {
      expect(tree.includes(v)).toBe(true);
    }
    expect(tree.includes(8)).toBe(false);
    expect(isBSTValid(tree)).toBe(true);
  });

  test("chained deletes keep a valid BST", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    tree.deleteItem(8);
    tree.deleteItem(67);
    tree.deleteItem(1);
    expect(isBSTValid(tree)).toBe(true);
    expect(tree.includes(8)).toBe(false);
    expect(tree.includes(67)).toBe(false);
    expect(tree.includes(1)).toBe(false);
  });

  test("delete everything one by one -> empty", () => {
    const tree = new Tree([1, 2, 3]);
    tree.deleteItem(2);
    tree.deleteItem(1);
    tree.deleteItem(3);
    expect(tree.root).toBeNull();
    expect(size(tree)).toBe(0);
    expect(tree.includes(1)).toBe(false);
  });
});

// Step 7: levelOrderForEach

describe("step 7 — levelOrderForEach(callback)", () => {
  test("throws when no callback is given", () => {
    const tree = new Tree([1, 2, 3]);
    expect(() => tree.levelOrderForEach()).toThrow(/callback/i);
    expect(() => tree.levelOrderForEach(null)).toThrow(/callback/i);
    expect(() => tree.levelOrderForEach(undefined)).toThrow(/callback/i);
  });

  test("breadth-first order on [1..7]: [4,2,6,1,3,5,7]", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    const output = [];
    tree.levelOrderForEach((value) => output.push(value));
    expect(output).toEqual([4, 2, 6, 1, 3, 5, 7]);
  });

  test("breadth-first order on the large example", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    const output = [];
    tree.levelOrderForEach((value) => output.push(value));
    expect(output).toEqual([8, 4, 67, 1, 5, 9, 324, 3, 7, 23, 6345]);
  });

  test("single node visits once", () => {
    const tree = new Tree([42]);
    const output = [];
    tree.levelOrderForEach((value) => output.push(value));
    expect(output).toEqual([42]);
  });

  test("passes values, not Nodes", () => {
    const tree = new Tree([1, 2, 3]);
    tree.levelOrderForEach((value) => {
      expect(typeof value).toBe("number");
      expect(value).not.toBeInstanceOf(Node);
    });
  });

  test("visits every node exactly once", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    const output = [];
    tree.levelOrderForEach((value) => output.push(value));
    expect(output.length).toBe(11);
    expect([...output].sort((a, b) => a - b)).toEqual([1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]);
    expect(output[0]).toBe(8);
  });

  test("empty tree: callback never called, no error", () => {
    const tree = new Tree([]);
    let calls = 0;
    tree.levelOrderForEach(() => calls++);
    expect(calls).toBe(0);
  });
});

// Step 8: inOrder / preOrder / postOrder

describe("step 8 — inOrder / preOrder / postOrder", () => {
  test("throws when no callback is given (all three)", () => {
    const tree = new Tree([1, 2, 3]);
    expect(() => tree.inOrderForEach()).toThrow(/callback/i);
    expect(() => tree.preOrderForEach()).toThrow(/callback/i);
    expect(() => tree.postOrderForEach()).toThrow(/callback/i);
  });

  test("inOrder on [1..7]: sorted ascending", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    const output = [];
    tree.inOrderForEach((value) => output.push(value));
    expect(output).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("preOrder on [1..7]: [4,2,1,3,6,5,7]", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    const output = [];
    tree.preOrderForEach((value) => output.push(value));
    expect(output).toEqual([4, 2, 1, 3, 6, 5, 7]);
  });

  test("postOrder on [1..7]: [1,3,2,5,7,6,4]", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    const output = [];
    tree.postOrderForEach((value) => output.push(value));
    expect(output).toEqual([1, 3, 2, 5, 7, 6, 4]);
  });

  test("inOrder on the large example = sorted uniques", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    const output = [];
    tree.inOrderForEach((value) => output.push(value));
    expect(output).toEqual([1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]);
  });

  test("preOrder on the large example", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    const output = [];
    tree.preOrderForEach((value) => output.push(value));
    expect(output).toEqual([8, 4, 1, 3, 5, 7, 67, 9, 23, 324, 6345]);
  });

  test("postOrder on the large example", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    const output = [];
    tree.postOrderForEach((value) => output.push(value));
    expect(output).toEqual([3, 1, 7, 5, 4, 23, 9, 6345, 324, 67, 8]);
  });

  test("single node visits once in all three", () => {
    const tree = new Tree([42]);
    const inOrder = [];
    const preOrder = [];
    const postOrder = [];
    tree.inOrderForEach((value) => inOrder.push(value));
    tree.preOrderForEach((value) => preOrder.push(value));
    tree.postOrderForEach((value) => postOrder.push(value));
    expect(inOrder).toEqual([42]);
    expect(preOrder).toEqual([42]);
    expect(postOrder).toEqual([42]);
  });

  test("empty tree: callbacks never called, no error (all three)", () => {
    const tree = new Tree([]);
    let inCalls = 0;
    let preCalls = 0;
    let postCalls = 0;
    tree.inOrderForEach(() => inCalls++);
    tree.preOrderForEach(() => preCalls++);
    tree.postOrderForEach(() => postCalls++);
    expect(inCalls).toBe(0);
    expect(preCalls).toBe(0);
    expect(postCalls).toBe(0);
  });

  test("all three traversals visit the same set (permutation)", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    const inOrder = [];
    const preOrder = [];
    const postOrder = [];
    const levelOrder = [];
    tree.inOrderForEach((value) => inOrder.push(value));
    tree.preOrderForEach((value) => preOrder.push(value));
    tree.postOrderForEach((value) => postOrder.push(value));
    tree.levelOrderForEach((value) => levelOrder.push(value));
    const sorted = (arr) => [...arr].sort((a, b) => a - b);
    const expected = [1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345];
    expect(sorted(inOrder)).toEqual(expected);
    expect(sorted(preOrder)).toEqual(expected);
    expect(sorted(postOrder)).toEqual(expected);
    expect(sorted(levelOrder)).toEqual(expected);
  });

  test("pass values (not Nodes)", () => {
    const tree = new Tree([1, 2, 3, 4, 5]);
    for (const method of ["inOrderForEach", "preOrderForEach", "postOrderForEach"]) {
      tree[method]((value) => {
        expect(typeof value).toBe("number");
      });
    }
  });
});

// Step 9: height

describe("step 9 — height(value)", () => {
  test("leaf = 0", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.height(1)).toBe(0);
    expect(tree.height(3)).toBe(0);
    expect(tree.height(5)).toBe(0);
    expect(tree.height(7)).toBe(0);
  });

  test("inner node and root on [1..7]", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.height(2)).toBe(1);
    expect(tree.height(6)).toBe(1);
    expect(tree.height(4)).toBe(2);
  });

  test("large example: every height", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    expect(tree.height(8)).toBe(3);
    expect(tree.height(4)).toBe(2);
    expect(tree.height(67)).toBe(2);
    expect(tree.height(1)).toBe(1);
    expect(tree.height(5)).toBe(1);
    expect(tree.height(9)).toBe(1);
    expect(tree.height(324)).toBe(1);
    expect(tree.height(3)).toBe(0);
    expect(tree.height(7)).toBe(0);
    expect(tree.height(23)).toBe(0);
    expect(tree.height(6345)).toBe(0);
  });

  test("missing value -> undefined", () => {
    const tree = new Tree([1, 2, 3]);
    expect(tree.height(999)).toBeUndefined();
    expect(tree.height(0)).toBeUndefined();
  });

  test("empty tree -> undefined", () => {
    expect(new Tree([]).height(1)).toBeUndefined();
  });
});

// Step 10: depth

describe("step 10 — depth(value)", () => {
  test("root = 0", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.depth(4)).toBe(0);
  });

  test("children and leaves on [1..7]", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.depth(2)).toBe(1);
    expect(tree.depth(6)).toBe(1);
    expect(tree.depth(1)).toBe(2);
    expect(tree.depth(7)).toBe(2);
  });

  test("large example: every depth", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    expect(tree.depth(8)).toBe(0);
    expect(tree.depth(4)).toBe(1);
    expect(tree.depth(67)).toBe(1);
    expect(tree.depth(1)).toBe(2);
    expect(tree.depth(5)).toBe(2);
    expect(tree.depth(9)).toBe(2);
    expect(tree.depth(324)).toBe(2);
    expect(tree.depth(3)).toBe(3);
    expect(tree.depth(7)).toBe(3);
    expect(tree.depth(23)).toBe(3);
    expect(tree.depth(6345)).toBe(3);
  });

  test("missing value -> undefined", () => {
    const tree = new Tree([1, 2, 3]);
    expect(tree.depth(999)).toBeUndefined();
  });

  test("empty tree -> undefined", () => {
    expect(new Tree([]).depth(1)).toBeUndefined();
  });
});

// Step 11: isBalanced

describe("step 11 — isBalanced()", () => {
  test("freshly built tree is balanced", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    expect(tree.isBalanced()).toBe(true);
  });

  test("empty and single-node trees are balanced", () => {
    expect(new Tree([]).isBalanced()).toBe(true);
    expect(new Tree([1]).isBalanced()).toBe(true);
  });

  test("two-node tree is balanced", () => {
    expect(new Tree([1, 2]).isBalanced()).toBe(true);
  });

  test("unbalanced after ascending inserts", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.isBalanced()).toBe(true);
    tree.insert(8);
    tree.insert(9);
    tree.insert(10);
    tree.insert(11);
    tree.insert(12);
    expect(tree.isBalanced()).toBe(false);
  });

  test("single deep insert can unbalance a small tree", () => {
    const tree = new Tree([1, 2, 3]);
    tree.insert(4);
    tree.insert(5);
    expect(tree.isBalanced()).toBe(false);
  });

  test("pitfall: must check every node, not just the root (deep imbalance)", () => {
    const deep = new Node(10);
    deep.left = new Node(5);
    deep.left.left = new Node(4);
    deep.left.left.left = new Node(3);
    deep.left.left.left.left = new Node(2);
    deep.right = new Node(20);
    const tree = new Tree([]);
    tree.root = deep;
    expect(tree.isBalanced()).toBe(false);

    const skewedLeft = new Tree([1, 2, 3, 4, 5, 6, 7]);
    skewedLeft.insert(0);
    skewedLeft.insert(-1);
    skewedLeft.insert(-2);
    skewedLeft.insert(-3);
    expect(skewedLeft.isBalanced()).toBe(false);
  });
});

// Step 12: rebalance

describe("step 12 — rebalance()", () => {
  test("rebalances an unbalanced tree", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    tree.insert(8);
    tree.insert(9);
    tree.insert(10);
    tree.insert(11);
    expect(tree.isBalanced()).toBe(false);
    tree.rebalance();
    expect(tree.isBalanced()).toBe(true);
  });

  test("rebalance keeps every value (valid BST + same set)", () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    [8, 9, 10, 101, 102, 103].forEach((value) => tree.insert(value));
    const before = [];
    tree.inOrderForEach((value) => before.push(value));
    tree.rebalance();
    const after = [];
    tree.inOrderForEach((value) => after.push(value));
    expect(after).toEqual([...before].sort((a, b) => a - b));
    expect(isBSTValid(tree)).toBe(true);
    expect(tree.isBalanced()).toBe(true);
  });

  test("rebalance on an already balanced tree keeps it balanced", () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
    tree.rebalance();
    expect(tree.isBalanced()).toBe(true);
    expect(inOrderValues(tree)).toEqual([1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345]);
  });

  test("rebalance empty and single-node trees does not throw", () => {
    const empty = new Tree([]);
    expect(() => empty.rebalance()).not.toThrow();
    expect(empty.isBalanced()).toBe(true);
    const single = new Tree([42]);
    single.rebalance();
    expect(single.isBalanced()).toBe(true);
    expect(single.root.data).toBe(42);
  });
});

// Tie it all together (driver logic)

describe("tie it all together — driver scenario", () => {
  function randomArray(count = 15, max = 100) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * max));
  }

  test("full flow: random <100 -> balanced -> unbalance >100 -> rebalance", () => {
    const tree = new Tree(randomArray());
    expect(tree.isBalanced()).toBe(true);

    const level = [];
    const pre = [];
    const post = [];
    const inorder = [];
    tree.levelOrderForEach((value) => level.push(value));
    tree.preOrderForEach((value) => pre.push(value));
    tree.postOrderForEach((value) => post.push(value));
    tree.inOrderForEach((value) => inorder.push(value));
    expect(level.length).toBeGreaterThan(0);
    expect([...level].sort((a, b) => a - b)).toEqual([...inorder].sort((a, b) => a - b));
    expect([...pre].sort((a, b) => a - b)).toEqual([...inorder].sort((a, b) => a - b));
    expect([...post].sort((a, b) => a - b)).toEqual([...inorder].sort((a, b) => a - b));

    [101, 102, 103, 104, 105, 106, 107].forEach((value) => tree.insert(value));
    expect(tree.isBalanced()).toBe(false);

    tree.rebalance();
    expect(tree.isBalanced()).toBe(true);

    const levelAfter = [];
    tree.levelOrderForEach((value) => levelAfter.push(value));
    expect(isBSTValid(tree)).toBe(true);
    expect(levelAfter.length).toBe(inOrderValues(tree).length);
  });
});

// prettyPrint (provided)

describe("utility — prettyPrint", () => {
  test("prettyPrint exists and does not throw", () => {
    expect(typeof prettyPrint).toBe("function");
    const tree = new Tree([1, 2, 3]);
    expect(() => prettyPrint(tree.root)).not.toThrow();
  });
});
