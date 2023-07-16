export interface INode<T> {
    label: string;
    payload?: T;
    child?: INode<T>;
    sibling?: INode<T>;
    toRoot: () => INode<T>[];
}

type InnerNode<T> = Omit<INode<T>, "toRoot">;
const format = /^(?:(?<parent>\w+)\s)?(?<label>\w+)\s(?<payload>.+)$/;

export interface ITree<T = string> {
    root: INode<T>;

    enumerateAll: () => number;
    enumerateNode: (label: string) => number;
    degree: () => number;
    insert: (node: InnerNode<T>, to?: string) => INode<T> | undefined;
    remove: (label: string) => INode<T> | undefined;
    search: (label: string) => INode<T> | undefined;
    commonAncestor: (a: string, b: string) => INode<T> | undefined;
}

export default class Tree<T = string> implements ITree<T> {
    root: INode<T>;

    constructor(child?: InnerNode<T>) {
        this.root = {
            label: "",
            payload: undefined,
            toRoot: () => []
        };

        if(child)
            this.insert(child);
    }

    commonAncestor(a: string, b: string): INode<T> | undefined {
        const aNode = this.search(a);
        const bNode = this.search(b);

        if(!aNode || !bNode)
            return undefined;

        const aAncestors = Array.from(aNode.toRoot());
        const bAncestors = Array.from(bNode.toRoot());

        if(aAncestors.some(ancestor => ancestor === bNode))
            return bNode;

        if(bAncestors.some(ancestor => ancestor === aNode))
            return aNode;


        let cursor = aAncestors.length <= bAncestors.length ? aAncestors : bAncestors;
        let test = aAncestors.length >= bAncestors.length ? aAncestors : bAncestors;

        for(const c of cursor) {
            const found = test.find((t) => t === c);

            if(found)
                return found;
        }

        return this.root;
    }

    enumerateAll(): number {
        return this.enumerateSub(this.root);
    }

    enumerateNode(label: string): number {
        return this.enumerateSub(this.search(label));
    }

    insert(node: InnerNode<T>, to?: string): INode<T> | undefined {
        if (!to)
            return this.insertTo(node, this.root)
        else {
            return this.insertTo(node, this.searchBreadthFirstByLabel(to, this.root));
        }
    }

    remove(label: string): INode<T> | undefined {
        if (!label)
            return undefined;

        const toRemove = this.searchBreadthFirstByLabel(label, this.root);

        if (!toRemove || toRemove === this.root)
            return undefined;

        const [parent] = toRemove.toRoot();

        // first child case, only child case
        if (parent.child === toRemove) {
            // if first child case and no sibling push up leaf
            if (!toRemove.sibling)
                parent.child = toRemove.child
            else {
                // if node is first child and has at least a sibling, move its first child to sibling
                if (toRemove.child)
                    this.insertTo(toRemove.child, toRemove.sibling);
            }
        } else {
            // generic sibling case
            const previousSibling = this.previousSibling(parent, toRemove);

            // move child to previous sibling, if any
            if (toRemove.child)
                this.insertTo(toRemove.child, previousSibling);

            previousSibling.sibling = toRemove.sibling;
        }

        return toRemove;
    }

    search(label: string): INode<T> | undefined {
        return this.searchBreadthFirstByLabel(label, this.root);
    }

    degree(): number {
        return this.nodeDegree(this.root);
    }

    load(conf: string): void {
        conf.split("\n").forEach((line) => {
            const match = format.exec(line);
            if (match?.groups) {
                const {parent, label, payload} = match.groups;

                this.insert({label, payload: (payload as T)}, parent);
            }
        });
    }

    static parse<P>(s: string): ITree<P> {
        const tree = new Tree<P>();

        tree.load(s);

        return tree;
    }

    private enumerateSub(node?: INode<T>): number {
        if (!node)
            return 0;

        return (node === this.root ? 0 : 1) + this.enumerateSub(node.sibling) + this.enumerateSub(node.child);
    }

    private insertTo(node: InnerNode<T>, to?: INode<T>): INode<T> | undefined {
        if (!to)
            return undefined;

        const finalNode: INode<T> = {...node, toRoot: () => [to, ...to.toRoot()]};

        if (!to.child) {
            to.child = finalNode;
        } else {
            finalNode.sibling = {...to.child};
            to.child = finalNode;
        }

        return finalNode;
    }


    private previousSibling({child}: INode<T>, target: INode<T>): INode<T> {
        let cursor = child as INode<T>;
        while (cursor?.sibling) {
            if (cursor.sibling === target)
                break;

            cursor = cursor.sibling;
        }

        return cursor;
    }

    private searchBreadthFirstByLabel(target: string, current?: INode<T>): undefined | INode<T> {
        if (!current)
            return undefined;

        if (current.label === target)
            return current;

        return this.searchBreadthFirstByLabel(target, current.sibling) ?? this.searchBreadthFirstByLabel(target, current.child);
    }

    private nodeDegree(current?: INode<T>): number {
        if (!current)
            return 0;

        const siblingDegree: number = this.nodeDegree(current.sibling);
        const degree: number = this.nodeDegree(current.child) + (current === this.root ? 0 : 1);

        return Math.max(siblingDegree, degree);
    }
}