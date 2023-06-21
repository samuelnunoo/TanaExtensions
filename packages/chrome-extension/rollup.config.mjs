import path from "path"
import {chromeExtension} from "rollup-plugin-chrome-extension";
import typescript from "rollup-plugin-typescript2";
import resolve from '@rollup/plugin-node-resolve'
import {emptyDir} from "rollup-plugin-empty-dir";
import commonjs from "@rollup/plugin-commonjs";
import scss from "rollup-plugin-scss";
import replace from "@rollup/plugin-replace";

export default {
    input: 'src/manifest.json',
    output: {
        dir: 'dist',
        sourcemap:"inline",
        format: 'esm',
        chunkFileNames: path.join('chunks','[name]-[hash].js'),
    },
    plugins: [
        chromeExtension({ wrapContentScripts:false }),
        replace({ 'process.env.NODE_ENV': JSON.stringify( 'development' ) }),
        resolve(),
        commonjs(),
        typescript({
            sourceMap: false,
            tsconfig: './tsconfig.json',
            tsconfigOverride: {
                compilerOptions: {
                    types:["@types/chrome"]
                }
            }
        }),
        emptyDir(),
        scss({ fileName: 'assets/bundle.css'}),
    ]
}