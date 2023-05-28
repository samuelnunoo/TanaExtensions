import path from "path"
import {chromeExtension, simpleReloader} from "rollup-plugin-chrome-extension";
import typescript from "rollup-plugin-typescript2";
import resolve from '@rollup/plugin-node-resolve'
import {emptyDir} from "rollup-plugin-empty-dir";
import commonjs from "@rollup/plugin-commonjs";
import sourcemaps from 'rollup-plugin-sourcemaps';
import scss from "rollup-plugin-scss";
export default {
    input: 'src/manifest.json',
    output: {
        dir: 'dist',
        format: 'esm',
        chunkFileNames: path.join('chunks','[name]-[hash].js'),
    },
    plugins: [
        chromeExtension({
            wrapContentScripts:false,
        }),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: '../../tsconfig.json',
            tsconfigOverride: {
                compilerOptions: {
                    types:["@types/chrome"]
                }
            }
        }),
        emptyDir(),
        scss({ fileName: 'assets/bundle.css'}),
        sourcemaps()
    ]
}