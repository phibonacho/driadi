import typescript from "@rollup/plugin-typescript";
import {babel} from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";

export default [{
    input: "src/index.ts",
    output: [
        {
            file: "./dist.old/index.cjs.js",
            format: "cjs",
        },
        {
            file: "./dist.old/index.es.js",
            format: "es",
        },
        {
            file: "./dist.old/index.umd.js",
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
    input: "./dist.old/es/types/index.d.ts",
    output: [{file: "dist.old/index.d.ts", format: "es"}],
    plugins: [dts()],
}];