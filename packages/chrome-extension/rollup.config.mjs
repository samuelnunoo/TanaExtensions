import path from "path"
import {chromeExtension} from "rollup-plugin-chrome-extension";
import typescript from "rollup-plugin-typescript2";
import resolve from '@rollup/plugin-node-resolve'
import {emptyDir} from "rollup-plugin-empty-dir";
import commonjs from "@rollup/plugin-commonjs";
import scss from "rollup-plugin-scss";
import replace from "@rollup/plugin-replace";
import externalGlobals from "rollup-plugin-external-globals";

export default {
    input: 'src/manifest.json',
    external:["react","react-dom"],
    output: {
        dir: 'dist',
        sourcemap:"inline",
        format: 'esm',
        chunkFileNames: path.join('chunks','[name]-[hash].js'),
    },
    plugins: [
        replace({ 'process.env.NODE_ENV': JSON.stringify( 'development' ) }),
        chromeExtension({ wrapContentScripts:false }),
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
        externalGlobals({
            react:"React",
            "react-dom":"ReactDOM"
        })
    ]
}