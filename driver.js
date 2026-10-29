// Driver script for the "Tie it all together" section.
// Run: bun driver.js

import { Tree, prettyPrint } from "./bst.js";

function randomArray(count = 15, max = 100) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * max));
}

function collect(tree, method) {
  const output = [];
  tree[method]((value) => output.push(value));
  return output;
}

function logTraversals(tree, label) {
  console.log(`--- ${label} ---`);
  console.log("level:", collect(tree, "levelOrderForEach").join(", "));
  console.log("pre:  ", collect(tree, "preOrderForEach").join(", "));
  console.log("post: ", collect(tree, "postOrderForEach").join(", "));
  console.log("in:   ", collect(tree, "inOrderForEach").join(", "));
}

// 1. Create a BST from random numbers < 100
const tree = new Tree(randomArray());
console.log("Initial tree:");
prettyPrint(tree.root);

// 2. Confirm balanced
console.log("isBalanced:", tree.isBalanced());

// 3. Print all elements in level, pre, post, in order
logTraversals(tree, "balanced");

// 4. Unbalance with numbers > 100
[101, 125, 150, 175, 200].forEach((value) => tree.insert(value));
console.log("\nAfter unbalancing inserts:");
prettyPrint(tree.root);

// 5. Confirm unbalanced
console.log("isBalanced:", tree.isBalanced());

// 6. Rebalance
tree.rebalance();
console.log("\nAfter rebalance:");
prettyPrint(tree.root);

// 7. Confirm balanced
console.log("isBalanced:", tree.isBalanced());

// 8. Print all elements in level, pre, post, in order
logTraversals(tree, "rebalanced");
