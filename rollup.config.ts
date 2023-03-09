import typescript from "@rollup/plugin-typescript";
import {babel} from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";

export default [{
    input: "src/index.ts",
    output: [
        {
            file: "./dist/index.cjs.js",
            format: "cjs",
        },
        {
            file: "./dist/index.es.js",
            format: "es",
        },
        {
            file: "./dist/index.umd.js",
            format: "umd",
            name: "morse"
        }
    ],
    plugins: [
        babel({babelHelpers: 'bundled'}),
        typescript({
            tsconfig: "./tsconfig.lib.json",
        }),
        terser()
    ]
}, {
    input: "./dist/es/types/index.d.ts",
    output: [{file: "dist/index.d.ts", format: "es"}],
    plugins: [dts()],
}];