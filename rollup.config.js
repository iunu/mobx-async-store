/* eslint-disable no-tabs */
import babel from '@rollup/plugin-babel'
import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default [
	// browser-friendly UMD build
	// {
	// 	input: 'src/main.ts',
	// 	output: {
	// 		name: 'artemisData',
	// 		file: pkg.browser,
	// 		format: 'cjs'
	// 	},
	// 	plugins: [
	// 		babel({
	// 			exclude: ['node_modules/**'],
	// 			runtimeHelpers: true,
	// 			plugins: [
	// 				['@babel/transform-runtime', { regenerator: false, useESModules: true }]
	// 			]
	// 		}),
	// 		resolve({
	// 			browser: true
	// 		}), // so Rollup can find `ms`
	// 		commonjs({
	// 			include: 'node_modules/**',
	// 			ignore: ['crypto', 'util', 'buffer']
	// 		}) // so Rollup can convert `ms` to an ES module
	// 	]
	// },

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/main.ts',
		external: [
			'@babel/runtime/helpers/applyDecoratedDescriptor',
			'@babel/runtime/helpers/asyncToGenerator',
			'@babel/runtime/helpers/classCallCheck',
			'@babel/runtime/helpers/createClass',
			'@babel/runtime/helpers/defineProperty',
			'@babel/runtime/helpers/getPrototypeOf',
			'@babel/runtime/helpers/inherits',
			'@babel/runtime/helpers/initializerDefineProperty',
			// '@babel/runtime/helpers/initializerWarningHelper',
			'@babel/runtime/helpers/objectSpread',
			'@babel/runtime/helpers/possibleConstructorReturn',
			'@babel/runtime/helpers/typeof',
			'@babel/runtime/regenerator',
			'@babel/runtime/helpers/assertThinitialized',
			'@babel/runtime/helpers/toConsumableArray',
			'@babel/runtime/helpers/wrapNativeSuper',
			'uuid'
		],
		output: [
			{ file: pkg.main, format: 'cjs', sourcemap: true },
			{ file: pkg.module, format: 'es', sourcemap: true }
		],
		plugins: [
			babel({
				exclude: ['node_modules/**', '/coverage'],
				runtimeHelpers: true,
				plugins: [['@babel/transform-runtime', { regenerator: true, useESModules: false }]]
			}),
			commonjs({
				ignore: ['crypto', 'util']
			}),
			typescript({
				tsconfig: './tsconfig.build.json',
				declaration: true,
				declarationDir: 'types',
				outputToFilesystem: true
			})
		]
	}
]
