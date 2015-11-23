var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');
var fs = require('fs');
var packager = require('electron-packager');
var pkg = require('./package.json');

var distDir = 'dist';
var releaseDir  = 'release';  // directory for application packages

gulp.task('html', function () {
  return gulp.src([
    'runtime/browser/index.html',
    'runtime/browser/**/jquery*',
    'public/**/semantic/**/*'
  ])
    .pipe(gulp.dest(distDir));
});

gulp.task('host', function () {
  return gulp.src(['runtime/host/**/*.js'], { base: '.' })
    .pipe(gulp.dest(distDir));
});

gulp.task('nodeModules', function () {
  var dependencies = [
    'lodash',
    'moment',
    'q',
    'request'
  ].map(function (name) { return 'node_modules/' + name + '/**/*'; });

  return gulp.src(dependencies, { base: '.' })
    .pipe(gulp.dest(distDir));
});

// Write a package.json for distribution
gulp.task('packageJson', function () {
  var json = _.cloneDeep(pkg);
  delete(json['devDependencies']);
  delete(json['scripts']);

  return $.file('package.json', JSON.stringify(json), { src: true })
    .pipe(gulp.dest(distDir));
});

// Package for each platforms
gulp.task('package', ['win32', 'darwin'].map(function (platform) {
  var taskName = 'package:' + platform;
  gulp.task(taskName, ['build'], function (done) {
    packager({
      dir: distDir,
      name: 'Logmew',
      arch: 'x64',
      platform: platform,
      out: releaseDir + '/' + platform,
      version: '0.35.3'
    }, function (err) {
      done();
    });
  });
  return taskName;
}));

gulp.task('build', ['html', 'host', 'nodeModules', 'packageJson'], function () {
  return gulp.run('package');
});
