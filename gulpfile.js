'use strict';

let args = require('yargs').argv;
let browserSync = require('browser-sync');
let del = require('del');
let gulp = require('gulp');
let $ = require('gulp-load-plugins')({
    lazy: true
});
let path = require('path');
let _ = require('lodash');

let config = require('./gulp.config.js')();
let port = process.env.PORT || config.defaultPort;

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * @desc Lint the code
 */

gulp.task('vet', () => {
    log('Analyzing JSHint and JSCS');

    return gulp
        .src(config.allJs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe($.jshint.reporter('fail'));

});

/**
 * @desc Clean build and Temp
 */

gulp.task('clean', function (done) {
    var delconfig = [].concat(config.build, config.temp);
    clean(delconfig, done);
});

gulp.task('clean-code', function (done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    clean(files, done);
});

/**
 * @desc Create $templateCache from the html templates
 */

gulp.task('templatecache', ['clean-code'], function () {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({
            empty: true
        }))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});

gulp.task('wiredep', ['templatecache'], () => {
    log('Wire up the bower css js and our app js into the html');

    let options = config.getWiredepDefaultOptions();
    let wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));

});

/**
 * @desc Minify and bundle the app's JavaScript and CSS
 */

gulp.task('optimize', ['wiredep'], function () {
    log('Optimizing the javascript, css, html');

    var assets = $.useref.assets({
        searchPath: './'
    });

    var templateCache = config.temp + config.templateCache.file;
    var cssFilter = $.filter('**/*.css', {
        restore: true
    });
    var jsLibFilter = $.filter('**/' + config.optimized.lib, {
        restore: true
    });
    var jsAppFilter = $.filter('**/' + config.optimized.app, {
        restore: true
    });

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(
            gulp.src(templateCache, {
                read: false
            }), {
                starttag: '<!-- inject:templates:js -->'
            }))
        .pipe(assets)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe(jsLibFilter)
        .pipe($.uglify())
        .pipe(jsLibFilter.restore)
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsAppFilter.restore)
        .pipe($.print())
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.build));

});

gulp.task('build', ['optimize'], function () {
    log('Building everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp build`'
    };
    del(config.temp);
    log(msg);
    notify(msg);
});

gulp.task('serve-dev', ['vet', 'wiredep'], () => {
    serve('dev');
});

gulp.task('serve-build', function () {
    serve('build');
});

/////

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
    done();
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}

function serve(env) {
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': env
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', function (evt) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + evt);

            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({
                    stream: false
                });
            }, config.browserReloadDelay);

        }).on('start', function () {
            log('*** nodemon started');
            startBrowserSync('dev');
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });

}

function startBrowserSync(env) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: env = 'dev' ? [
            config.client + '**/*.*',
            config.temp + '**/*.css'
        ] : [],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true,
        reloadDelay: 0 //1000
    };

    browserSync(options);
}