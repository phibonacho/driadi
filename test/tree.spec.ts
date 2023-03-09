import Tree from "../src/tree";
import {assert} from "chai";
import {describe} from "mocha";

const parentNode = {label: "parent", payload: "this represent a parent node"};
const siblingNode = {label: "sibling", payload: "this represent a sibling node"};
const childNode = {label: "child", payload: "this represent a child node"};
const testNode = {label: "test", payload: "this is the node to test"};

describe("Tree", () => {
    it("should create an empty root Tree when no argument is passed to constructor", () => {
        const tree: Tree<string> = new Tree();

        assert.equal(tree.root.label, "");
        assert.equal(tree.root.payload, undefined);
    });

    describe("Tree.enumerateAll", () => {
        let tree: Tree<string>;
        beforeEach(() => {
            tree = new Tree();
        });

        it("should return 0 when only root is present", () => {
            assert.equal(tree.enumerateAll(), 0);
        });

        it("should return the number of node inserted", () => {
            tree.insert(parentNode);
            assert.equal(tree.enumerateAll(), 1);

            tree.insert(siblingNode, parentNode.label);
            assert.equal(tree.enumerateAll(), 2);

            tree.insert(testNode, parentNode.label);
            assert.equal(tree.enumerateAll(), 3);

            tree.insert(childNode, testNode.label);
            assert.equal(tree.enumerateAll(), 4);
        });
    });

    describe("Tree.search", () => {
        let tree: Tree<string>;
        beforeEach(() => {
            tree = new Tree();
            tree.insert(testNode)
        });

        it("should return true when searching for root node", () => {
            const rootNode = tree.root;

            assert.equal(tree.search(rootNode.label)?.label, "");
        });

        it("should return true when searched node is in tree", () => {
            assert.equal(tree.search(testNode.label)?.label, testNode.label);
        });

        it("should return false when searched node is not in tree", () => {
            assert.equal(tree.search("not in tree"), undefined);
        });
    });

    describe("Tree.insert", () => {
        let tree: Tree<string>;
        beforeEach(() => {
            tree = new Tree();
        });

        it("should add child to root when no label is passed", () => {
            const node = {label: "node", payload: "payload"};

            tree.insert(node);

            assert.equal(tree.root.child?.label, node.label);
        });

        it("should add child to labeled node when label is passed and target node has no child", () => {
            const parentNode = {label: "parent", payload: "payload"};
            const childNode = {label: "child", payload: "payload"};

            tree.insert(parentNode);
            const outcome = tree.insert(childNode, "parent");

            assert.equal(tree.search(childNode.label)?.label, childNode.label);
            assert.isTrue(outcome?.toRoot()[0].label === parentNode.label);
        });

        it("should add child to labeled node child when label is passed and append child as sibling when target node has child", () => {
            const parentNode = {label: "parent", payload: "payload"};
            const childNode = {label: "child", payload: "payload"};
            const siblingNode = {label: "sibling", payload: "payload"};

            const parent  = tree.insert(parentNode);
            tree.insert(childNode, "parent");
            const test = tree.insert(siblingNode, "parent");

            assert.equal(parent?.child?.label, siblingNode.label);
            assert.equal(test?.sibling?.label, childNode.label);
        });

        it("should throw error when child label is already in the tree", () => {
            const parentNode = {label: "parent", payload: "payload"};

            try {
                tree.insert(parentNode);
                tree.insert(parentNode, "parent");

                assert.fail("No error thrown");
            } catch (err) {
                assert(err);
            }
        });
    });

    describe("Tree.remove", () => {
        let tree: Tree<string>;

        beforeEach(() => {
            tree = new Tree();
            tree.insert(parentNode);
            tree.insert(siblingNode, parentNode.label);
            tree.insert(testNode, parentNode.label);
            tree.insert(childNode, testNode.label);
        });

        it("should return the removed node if in tree", () => {
            const outcome = tree.remove(siblingNode.label);

            assert.isTrue(!tree.search(siblingNode.label))
            assert(outcome);
        });

        it("should assign removed node's child to its parent", () => {
            // remove target sibling to recreate correct scenario
            tree.remove(siblingNode.label);
            const removed = tree.remove(testNode.label);

            assert(removed);

            const [parent] = removed.toRoot();

            assert.equal(parent.child, removed.child);
        });

        it("should assign removed node's child to its first sibling when removed node is first child", () => {
            const removed = tree.remove(testNode.label);

            assert(removed);

            assert.equal(removed.sibling?.child?.label, removed.child?.label);
            assert.equal(removed.sibling?.child?.payload, removed.child?.payload);
        });

        it("should assign removed node's child to its first sibling when removed node is not first child", () => {
            const previousNode = {label: "previousSibling", payload: "this represent a previous sibling node"};
            // add previous node to recreate correct scenario
            const target = tree.insert(previousNode, parentNode.label);

            const removed = tree.remove(testNode.label);

            assert(removed);

            assert.equal(target?.child?.label, removed.child?.label);
            assert.equal(target?.child?.payload, removed.child?.payload);
        });

        it("should assign removed node's sibling to its previous sibling", () => {
            const previousNode = {label: "previousSibling", payload: "this represent a previous sibling node"};
            // add previous node to recreate correct scenario
            const target = tree.insert(previousNode, parentNode.label);

            const removed = tree.remove(testNode.label);

            assert(removed);

            assert.equal(target?.sibling?.label, removed.sibling?.label);
            assert.equal(target?.sibling?.payload, removed.sibling?.payload);
        });
    });

    describe("Tree.commonAncestor", () => {
        let tree: Tree<string>;
        beforeEach(() => {
            tree = new Tree();
        });

        it("should return root when no more specific ancestor is present", () => {
            tree.insert(testNode);
            tree.insert(childNode);

            assert.equal(tree.commonAncestor(testNode.label, childNode.label), tree.root);
        });

        it("should return undefined when one of the input nodes are not in tree", () => {
            tree.insert(testNode);
            tree.insert(childNode);

            assert.equal(tree.commonAncestor(testNode.label, "notInTree"), undefined);
        });

        it("should return the first common ancestor when both nodes are in tree when common ancestor is present", () => {
            tree.insert(parentNode);
            tree.insert(testNode, parentNode.label)
            tree.insert(childNode, parentNode.label);

            assert.equal(tree.commonAncestor(testNode.label, childNode.label), tree.search(parentNode.label));
        });

        it("should return the left operand when left operand is ancestor of right operand", () => {
            tree.insert(parentNode);
            tree.insert(testNode, parentNode.label)

            assert.equal(tree.commonAncestor(testNode.label, parentNode.label), tree.search(parentNode.label));
        });
    });
});