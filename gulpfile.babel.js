
import gulp from 'gulp'
import gulpRun from 'gulp-run'
import runSequence from 'run-sequence'
import del from 'del'

gulp.task('default', () => {

})

gulp.task('run', () => {
  return gulpRun('node ./dist/index.js').exec()
})

gulp.task('compile', () => {
  return gulpRun('./node_modules/.bin/babel src -d dist').exec()
})

gulp.task('clean', () => {
  return del(['./dist'])
})

gulp.task('build', () => {
  runSequence('clean', 'compile', 'run')
})

gulp.task('dev', () => {
  gulp.watch('./src/**/*.js', ['build'])
})