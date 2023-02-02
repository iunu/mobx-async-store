module.exports = {
  extends: './tsconfig.json',
  compilerOptions: {
    module: 'CommonJS',
    target: 'es2019'
  },
  includes: ['spec/**/*.spec.ts', 'spec/**/*.spec.tsx'],
  exclude: ['e2e', 'examples', 'website']
}
