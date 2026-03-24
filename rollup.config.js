import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import postcssPresetEnv from 'postcss-preset-env';

const production = process.env.BUILD === 'production';

export default {
  input: 'assets/js/main.js',
  output: {
    file: 'assets/built/main.js',
    format: 'iife',
    sourcemap: !production,
  },
  plugins: [
    resolve(),
    postcss({
      extract: 'assets/built/screen.css',
      minimize: production,
      plugins: [
        postcssPresetEnv({ stage: 2 }),
      ],
    }),
    !production && livereload({ watch: 'assets/built' }),
    production && terser(),
  ],
};
