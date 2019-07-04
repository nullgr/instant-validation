import typescript from 'rollup-plugin-typescript';

export default {
  input: 'src/validator/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    name: 'InstantValidation'
  },
  plugins: [typescript()]
};
