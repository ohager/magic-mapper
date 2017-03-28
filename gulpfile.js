const gulp = require('gulp');
const fs = require('fs');
const request = require('request');

function compile(srcFile, destFile) {
	const code = fs.readFileSync(srcFile, "utf8");

	const form = {
		form: {
			js_code: code,
			output_format: 'text',
			output_info: 'compiled_code'
		}
	};

	return request.post("http://closure-compiler.appspot.com/compile", form)
		.pipe(fs.createWriteStream(destFile))

}

gulp.task("default", function () {
	compile('./lib/magic-mapper.js', './lib/magic-mapper.min.js');
});