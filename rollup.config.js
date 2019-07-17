import typescript from 'rollup-plugin-typescript';

export default {
  input: 'src/validator/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [typescript()]
};
