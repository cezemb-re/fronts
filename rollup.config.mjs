import path from 'path';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import autoprefixer from 'autoprefixer';
import postcssUrl from 'postcss-url';
import pkg from './package.json' assert { type: 'json' };
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { dependencies = {}, peerDependencies = {} } = pkg;

const externals = [...Object.keys(dependencies), ...Object.keys(peerDependencies)];

const src = path.resolve(__dirname, 'src');
const input = path.resolve(src, 'index.ts');
const assets = path.resolve(src, 'assets');
const dest = path.resolve(__dirname, 'dist');

export default [
  {
    input,
    external: (id) => externals.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      commonjs(),
      json(),
      resolve({ browser: true }),
      babel({
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
      }),
      image(),
      postcss({
        plugins: [
          autoprefixer,
          postcssUrl({
            url: 'inline',
            basePath: assets,
          }),
        ],
      }),
      copy({
        targets: [
          { src: 'src/**/_*.scss.d.ts', dest },
          { src: 'src/**/_*.scss', dest },
        ],
      }),
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      { name: pkg.name, file: pkg.module, format: 'es' },
      {
        name: pkg.name,
        file: pkg.browser,
        format: 'umd',
        globals: {
          react: 'React',
        },
      },
      {
        name: pkg.name,
        file: pkg['browser:min'],
        format: 'umd',
        globals: {
          react: 'React',
        },
        plugins: [terser()],
      },
    ],
  },
];
