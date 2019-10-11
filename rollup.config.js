import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel';

const production = !process.env.ROLLUP_WATCH;

export default [{
  // client
	input: 'src/client.js',
	output: {
		sourcemap: true,
		format: 'cjs',
		name: 'app',
		file: 'public/client.js'
	},
	plugins: [
    postcss({extract: "public/base.css", minimize: true, sourceMap: true}),
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
      // a separate file — better for performance
      hydratable: true,
			css: css => {
				css.write('public/client.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
},
{
  // server
	input: 'src/server.js',
	output: {
		sourcemap: false,
		format: 'iife',
		name: 'render',
		file: 'dist/ssr.js'
	},
	plugins: [
    postcss({extract: false}),
		svelte({
      hydratable: true,
      generate: "ssr",
      css: false
    }),
    babel({  
      extensions: [ ".js", ".mjs", ".html", ".svelte" ]
    }),
    resolve(),
    commonjs()
	],
}];
