import gulp from 'gulp';
import frontmatter from 'gulp-front-matter';
import gulpsmith from 'gulpsmith';

const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const registerHelpers = require('metalsmith-register-helpers');

import {settings, useHandlebars} from '../config';

/**
 * HTML validation using the Nu HTML Checker
 */
function handlebars(done) {

	if (!useHandlebars) return done();

	return gulp.src(settings.sources.markdown)
		.pipe(frontmatter()).on('data', (file) => {
			Object.assign(file, file.frontMatter);
			delete file.frontMatter;
		})

		.pipe(gulpsmith()
			.use(registerHelpers({
				directory: 'src/handlebars/helpers'
			}))
			.use(markdown())
			.use(layouts({ // Wrap layouts around content pages
				engine: 'handlebars',
				rename: true,
				directory: 'src/handlebars/layouts',
				default: 'default.hbs',
				pattern: '*.html',
				partials: 'src/handlebars/partials',
				partialExtension: '.hbs'
			}))
		)
		.pipe(gulp.dest(settings.destinations.generatedHtml));
}

export default handlebars;
