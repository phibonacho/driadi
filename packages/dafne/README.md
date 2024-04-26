# Dafne

Dafne is a small library that implements [The tree data structure](https://en.wikipedia.org/wiki/Tree_(data_structure))

## Usage
### Initialization
```ts
import Tree from "dafne";

// creates a new empty Tree<string>
const hazel = new Tree();

// creates a new empty Tree<number>
const oak = new Tree<number>();

// deep copies a tree
const cypress: Tree = new Tree();
const juniper: Tree = Tree.from(cypress);
```
#### Tree literals (works with Tree\<string\> only)
Driadi uses a simple syntax to define trees:
```antlr
tree ::= node | tree "\n" node
node ::= node-position " : " node-payload
node-position ::= node-label node-label | node-label
node-payload ::= string
node-label ::= string
string ::= char | string char+
char ::= [A-Za-z0-9]
```
Or something like this, my BNF is a bit rusty, anyway, if you want to define a tree as a literal you can do it like this:
```typescript
const tree = Tree.treeLit`parent : this represent a parent node
parent child : this represent a child node
parent sibling : this represent a sibling node
`;
```
or like this:
```typescript
const myTree = `parent : this represent a parent node
parent child : this represent a child node
parent sibling : this represent a sibling node
`;
const tree = Tree.parse(myTree);
```
or like this:
```typescript
const myTree = `parent : this represent a parent node
parent child : this represent a child node
parent sibling : this represent a sibling node
`;
const tree = new Tree();
tree.load(myTree);
```

Why so many methods? I was bored at home.
## Methods

### insert
```typescript
const juniper = { label: "juniper", payload: "coniferous trees and shrubs in the genus Juniperus" };
const cypress = { label: "cypress", payload: "common name for various coniferous trees or shrubs" };

const tree = new Tree();
tree.insert(juniper); // adds a child node labeled juniper to root node
tree.insert(cypress, juniper.label); // adds a node labeled cypress to juniper node
```

### remove
```typescript
const juniper = { label: "juniper", payload: "coniferous trees and shrubs in the genus Juniperus" };
const cypress = { label: "cypress", payload: "common name for various coniferous trees or shrubs" };

const tree = new Tree();
tree.insert(juniper);
tree.insert(cypress, juniper.label);

const removed = tree.remove(junper.label); // returns remove node
```
