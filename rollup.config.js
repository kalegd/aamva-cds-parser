import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/aamva-cds-parser.js',
  output: [
    {
      file: 'build/aamva-cds-parser.js',
      format: 'es',
    }
  ],
  plugins: [
    resolve(),
  ]
}; 