import { assert } from "chai";
import { describe } from "mocha";
import MorseTree from "../src/morse";

describe("Morse", () => {
	let morse: MorseTree;
	beforeEach(() => {
		morse = new MorseTree();
	});

	it("should have 39 nodes (26 alphabetic + 10 digits + 3 utils)", () => {
		assert.equal(morse.enumerateAll(), 39);
	});

	context("Morse.degree", () => {
		// this means that the maximum dot/dash sequence can be 5 dot/dash long
		it("should have a degree equal to 5", () => {
			assert.equal(morse.degree(), 5);
		});
	});

	context("Morse.decode", () => {
		it("should decode all inputs with length 1", () => {
			assert.equal(morse.decode("."), "E");
			assert.equal(morse.decode("-"), "T");
		});

		it("should decode all inputs with length 2", () => {
			assert.equal(morse.decode(".."), "I");
			assert.equal(morse.decode(".-"), "A");
			assert.equal(morse.decode("-."), "N");
			assert.equal(morse.decode("--"), "M");
		});

		it("should decode all inputs with length 3", () => {
			assert.equal(morse.decode("..."), "S");
			assert.equal(morse.decode("..-"), "U");
			assert.equal(morse.decode(".-."), "R");
			assert.equal(morse.decode(".--"), "W");
			assert.equal(morse.decode("-.."), "D");
			assert.equal(morse.decode("-.-"), "K");
			assert.equal(morse.decode("--."), "G");
			assert.equal(morse.decode("---"), "O");
		});

		it("should decode some inputs with length 4", () => {
			assert.equal(morse.decode("...."), "H");
			assert.equal(morse.decode("...-"), "V");
			assert.equal(morse.decode("..-."), "F");
			assert.equal(morse.decode(".-.."), "L");
			assert.equal(morse.decode(".--."), "P");
			assert.equal(morse.decode(".---"), "J");
			assert.equal(morse.decode("-..."), "B");
			assert.equal(morse.decode("-..-"), "X");
			assert.equal(morse.decode("-.-."), "C");
			assert.equal(morse.decode("-.--"), "Y");
			assert.equal(morse.decode("--.."), "Z");
			assert.equal(morse.decode("--.-"), "Q");
		});

		it("should not decode some inputs with length 4", () => {
			assert.equal(morse.decode("..--"), "?");
			assert.equal(morse.decode(".-.-"), "?");
			assert.equal(morse.decode("---."), "?");
			assert.equal(morse.decode("----"), "?");
		});

		it("should decode only some inputs with length 5", () => {
			assert.equal(morse.decode(".----"), "1");
			assert.equal(morse.decode("..---"), "2");
			assert.equal(morse.decode("...--"), "3");
			assert.equal(morse.decode("....-"), "4");
			assert.equal(morse.decode("....."), "5");
			assert.equal(morse.decode("-...."), "6");
			assert.equal(morse.decode("--..."), "7");
			assert.equal(morse.decode("---.."), "8");
			assert.equal(morse.decode("----."), "9");
			assert.equal(morse.decode("-----"), "0");
		});

		it("should not decode random inputs with length 5", () => {
			assert.equal(morse.decode(".--.-"), "?");
			assert.equal(morse.decode("..-.-"), "?");
		});

		it("should not decode utility labels paths", () => {
			assert.equal(morse.decode("---."), "?");
			assert.equal(morse.decode("----"), "?");
			assert.equal(morse.decode("..--"), "?");
		});

		it("should decode multiple characters separated by space", () => {
			// What hath God wrought .... .- - .... --. --- -.. .-- .-. ..- --. .... -
			const decoded = morse.decode(".-- .... .- -");
			assert.equal(decoded.toLowerCase(), "what");
		});

		it("should decode multiple words separated by underscore", () => {
			const decoded = morse.decode(
				".-- .... .- -_.... .- - ...._--. --- -.._.-- .-. --- ..- --. .... -"
			);
			assert.equal(decoded.toLowerCase(), "what hath god wrought");
		});
	});

	context("Morse.encode", () => {
		it("should encode all alphabetic symbols [a-zA-Z]", () => {
			// highest in tree
			assert.equal(morse.encode("E"), ".");
			assert.equal(morse.encode("T"), "-");

			// lowest in tree
			assert.equal(morse.encode("H"), "....");
			assert.equal(morse.encode("O"), "---");
		});

		it("should encode all numeric symbols [0-9]", () => {
			assert.equal(morse.encode("0"), "-----");
			assert.equal(morse.encode("9"), "----.");
		});

		it("should encode multiple characters", () => {
			const decoded = morse.encode("what");
			assert.equal(decoded.toLowerCase(), ".-- .... .- -");
		});

		it("should decode multiple words separated by space", () => {
			const decoded = morse.encode("what hath god wrought");
			assert.equal(
				decoded.toLowerCase(),
				".-- .... .- -_.... .- - ...._--. --- -.._.-- .-. --- ..- --. .... -"
			);
		});
	});
});
