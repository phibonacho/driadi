import Tree, { INode } from "danae";

const morseTreeConfig = `E : .
T : -
E I : .
E A : -
T N : .
T M : -
I S : .
I U : -
A R : .
A W : -
N D : .
N K : -
M G : .
M O : -
S H : .
S V : -
U F : .
R L : .
W P : .
W J : -
D B : .
D X : -
K C : .
K Y : -
G Z : .
G Q : -
J 1 : -
V 3 : -
H 4 : -
H 5 : .
B 6 : .
Z 7 : .
O L1 : .
O L2 : -
U L3 : -
L1 8 : .
L2 9 : .
L2 0 : -
L3 2 : -
`;

type DotDash = "." | "-";

export interface IMorseTree {
	decode: (s: string) => string;
	encode: (s: string) => string;
}

export default class MorseTree extends Tree<DotDash> implements IMorseTree {
	constructor() {
		super();
		this.load(morseTreeConfig);
	}

	decode(s: string) {
		const words = s.split("_");
		return words.map((word) => this.decodeWord(word)).join(" ");
	}

	encode(s: string): string {
		const words = s.split(" ");
		return words.map((word) => this.encodeWord(word)).join("_");
	}

	private encodeWord(w: string): string {
		const chars = w.split("");

		return chars.map((char) => this.encodeChar(char)).join(" ");
	}

	private encodeChar(c: string): string {
		const encodeNode = this.search(c.toUpperCase());

		if (!encodeNode) return "?";

		return (
			encodeNode
				.toRoot()
				.map(({ payload }) => payload)
				.reverse()
				.join("") + encodeNode.payload
		);
	}

	private decodeWord(s: string) {
		return s
			.split(" ")
			.map((char) => this.decodeChar(char.split(""), this.root))
			.join("");
	}

	private decodeChar(path: string[], current: INode<string>): string {
		if (!path.length)
			return current.label.match(/L\d+/) ? "?" : current.label;

		const { child } = current;

		if (child) {
			const { sibling } = child;

			if (sibling && sibling.payload === path[0])
				return this.decodeChar(path.slice(1), sibling);
			else if (child.payload === path[0])
				return this.decodeChar(path.slice(1), child);
		}

		return "?";
	}
}
