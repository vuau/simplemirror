import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import postcss from 'rollup-plugin-postcss'

const babelPlugin = babel({
  exclude: ['node_modules/@babel/**'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead'
      }
    ]
  ],
  plugins: ['@babel/plugin-proposal-class-properties']
})

const postcssPlugin = postcss({
  modules: false,
  namedExports: false,
  extract: 'dist/SimpleMirror.css'
})

export default [
  {
    input: 'src/main.js',
    output: {
      name: 'SimpleMirror',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      resolve({
        browser: true
      }),
      babelPlugin,
      postcssPlugin
    ]
  },

  {
    input: 'src/main.js',
    external: [],
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    plugins: [
      resolve(),
      babelPlugin,
      postcssPlugin
    ]
  }
]
