# Morse

Morse is a small js library to decode and encode messages in [morse code](https://en.wikipedia.org/wiki/Morse_code). It's freely inspired on [Huffman coding](https://en.wikipedia.org/wiki/Huffman_coding) binary tree to encode and decode dot/dash strings. This tree is actually hard coded and permit to decode a morse string in at last 5 passages.

## Usage

```ts
import morse from "driadi";

const encoded = morse.encode("What hath God wrought");
const decoded = morse.decode(encoded);

console.log(encoded, dedcoded);
// .-- .... .- -_.... .- - ...._--. --- -.._.-- .-. --- ..- --. .... -
// what hath god wrought
```

## Notes

- It is possible to encode/decode only alphanumeric signs (no punctuation).
- Encoding algorithm is case-insensitive.
