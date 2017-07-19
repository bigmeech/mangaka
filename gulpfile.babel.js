import gulp from 'gulp';
import help from 'gulp-help';
import babel from 'gulp-babel'

const runner = help(gulp);

runner.task('default', 'this is the default task', function() {
  console.log('Running default task!');
});

runner.task('watch', 'turn on file watcher for babel files', function (){
  console.log('Running watch task!');
});

runner.task('build', 'convert es6 to es5', function (){
  return gulp.src('lib/**/*.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('dist'))
});