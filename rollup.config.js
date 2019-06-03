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
				plugins: [
					['@babel/transform-runtime', { regenerator: false, useESModules: true }]
				]
			}),
			resolve(), // so Rollup can find `ms`
			commonjs({
				include: 'node_modules/**'
			}), // so Rollup can convert `ms` to an ES module
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
			'@babel/runtime/helpers/applyDecoratedDescriptor',
			'@babel/runtime/helpers/asyncToGenerator',
			'@babel/runtime/helpers/classCallCheck',
			'@babel/runtime/helpers/createClass',
			'@babel/runtime/helpers/defineProperty',
			'@babel/runtime/helpers/getPrototypeOf',
			'@babel/runtime/helpers/inherits',
			'@babel/runtime/helpers/initializerDefineProperty',
			'@babel/runtime/helpers/initializerWarningHelper',
			'@babel/runtime/helpers/objectSpread',
			'@babel/runtime/helpers/possibleConstructorReturn',
			'@babel/runtime/regenerator',
      '@babel/runtime/helpers/assertThisInitialized',
      '@babel/runtime/helpers/toConsumableArray',
      '@babel/runtime/helpers/wrapNativeSuper',
			'jquery-param',
			'jsonapi-serializer',
			'mobx',
			'uuid/v1'
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			babel({
				exclude: ['node_modules/**'],
				runtimeHelpers: true,
				plugins: [['@babel/transform-runtime', { regenerator: true, useESModules: false }]]
			})
		]
	}
];
