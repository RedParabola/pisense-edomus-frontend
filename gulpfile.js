var gulp = require('gulp');
var { argv } = require('yargs');


// Build paths
var paths = {
  src: './platforms/browser/www/',
  releasePath: './dist-browser/',
};

/**
 * Integration of release code for different environments
 */
gulp.task('move-release-to-dist', function() {
  return gulp.src([paths.src + '**/*'], { dot: true })
    .pipe(gulp.dest(paths.releasePath + argv.environment));

});
