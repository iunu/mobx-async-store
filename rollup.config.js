import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'artemisData',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			babel({
				exclude: ['node_modules/**'],
				runtimeHelpers: true,
				plugins: [['@babel/transform-runtime', { regenerator: false, useESModules: true }]]
			}),
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/main.js',
		external: [
			'@babel/runtime/helpers/esm/asyncToGenerator',
			'@babel/runtime/helpers/esm/classCallCheck',
			'@babel/runtime/helpers/esm/createClass',
			'@babel/runtime/helpers/esm/defineProperty',
			'@babel/runtime/helpers/esm/getPrototypeOf',
			'@babel/runtime/helpers/esm/inherits',
			'@babel/runtime/helpers/esm/initializerDefineProperty',
			'@babel/runtime/helpers/esm/objectSpread',
			'@babel/runtime/helpers/esm/possibleConstructorReturn',
      '@babel/runtime/helpers/esm/applyDecoratedDescriptor',
      '@babel/runtime/helpers/esm/initializerWarningHelper',
			'mobx',
			'uuid'
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			babel({
				exclude: ['node_modules/**'],
				runtimeHelpers: true,
				plugins: [['@babel/transform-runtime', { regenerator: false, useESModules: true }]]
			})
		]
	}
];
