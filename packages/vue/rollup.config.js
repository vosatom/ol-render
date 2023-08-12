import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.ts',
  output: [
    {
      name: pkg.name,
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: '../../tsconfig.json',
      
      compilerOptions: {
        outDir: './dist',
        declaration: true,
        // paths: {
        //   '@ol-render/*': ['packages/*/src'],
        // },
      },
      // include: ['./'],
      // exclude: ['@ol-render/core'],
    }),
  ],
}
