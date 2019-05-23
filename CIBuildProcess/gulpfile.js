/// <binding Clean='clean' />
//"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    htmlmin = require("gulp-htmlmin"),
    uglify = require("gulp-uglify"),
    merge = require("merge-stream"),
    del = require("del"),
    bundleconfig = require("./bundleconfig.json"),
    lessConfig = require("./bundleconfig.json"),
    less = require("gulp-less"),
    path = require("path"),
    glob = require("glob");

var regex = {
    css: /\.css$/,
    html: /\.(html|htm)$/,
    js: /\.js$/
};

//#####################
//# Clean built files #
//#####################

gulp.task("clean:ts", () => {

    // Typescript
    var tsFiles = ['_script/**/*.map', '_script/**/*.js'];

    return del(tsFiles);
});

gulp.task("clean:less", () => {

    // Less generated css
    var tsFiles = ['_style/**/*.css',"Content/Style/**/*.css"];

    return del(tsFiles);
});

gulp.task("clean:js", () => {
    //JS files from bundleconfig
    var files = bundleconfig.map(function (bundle) {
        return bundle.outputFileName;
    });

    //JS Min files
    var minFiles = bundleconfig.map(function (bundle) {
        return bundle.outputFileName.replace(".js", ".min.js");
    });

    return del(files.concat(minFiles));
});

gulp.task("clean:all", gulp.parallel("clean:ts", "clean:js", "clean:less"));


//###########################
//# Build less / typescript #
//###########################
var tsProject;
gulp.task("build:ts", () => {

    var ts = require("gulp-typescript");
    var sourcemaps = require('gulp-sourcemaps');

    if (!tsProject) {
        tsProject = ts.createProject("tsconfig.json");
    }

    var reporter = ts.reporter.fullReporter();
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject(reporter));

    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("_script"));
});

gulp.task("build:less", () => {

    var list = glob.sync("_style/**/*.less");
    console.log(list);

    return gulp.src("_style/**/*.less")
        .pipe(less({
            paths: [path.join(__dirname, "less", "includes")]
        }))
        .pipe(gulp.dest("_style"));
});


//############
//# Bundling #
//############

gulp.task("bundle:js", () => {

    var buns = getBundles(regex.js);

    var tasks = buns.map(bundle => {
        return gulp.src(bundle.inputFiles, { base: ".", allowEmpty: true })
            .pipe(concat(bundle.outputFileName))
            .pipe(gulp.dest("."));
    });

    console.log(buns);

    return merge(tasks);
});

gulp.task("min:js", () => {

    var buns = getBundles(regex.js);

    var tasks = buns.map(bundle => {
        return gulp.src(bundle.inputFiles, { base: ".", allowEmpty: true })
            .pipe(concat(bundle.outputFileName.replace(".js", ".min.js")))
            .pipe(uglify())
            .pipe(gulp.dest("."));
    });

    console.log(buns);

    return merge(tasks);
});

gulp.task("bundle:min:js", gulp.parallel("bundle:js", "min:js"));


gulp.task("bundle:css", () => {

    var buns = getBundles(regex.css);

    var tasks = buns.map(bundle => {
        return gulp.src(bundle.inputFiles, { base: ".", allowEmpty: true })
            .pipe(concat(bundle.outputFileName))
            .pipe(gulp.dest("."));
    });

    console.log(buns);

    return merge(tasks);
});

gulp.task("min:css", () => {

    var buns = getBundles(regex.css);

    var tasks = buns.map(bundle => {
        return gulp.src(bundle.inputFiles, { base: ".", allowEmpty: true })
            .pipe(concat(bundle.outputFileName.replace(".css", ".min.css")))
            .pipe(cssmin())
            .pipe(gulp.dest("."));
    });

    console.log(buns);

    return merge(tasks);
});

gulp.task("bundle:min:css", gulp.parallel("bundle:css", "min:css"));

//###############
//# Watch Tasks #
//###############

gulp.task("watch", function () {
    getBundles(regex.js).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, gulp.series("bundle"));
    });

    gulp.watch(["_script/**/*.ts"], gulp.series("buildts"));

    //getBundles(regex.css).forEach(function (bundle) {
    //    gulp.watch(bundle.inputFiles, ["min:css"]);
    //});

    //getBundles(regex.html).forEach(function (bundle) {
    //    gulp.watch(bundle.inputFiles, ["min:html"]);
    //});
});

function getBundles(regexPattern) {
    return bundleconfig.filter(bundle => {
        return regexPattern.test(bundle.outputFileName);
    });
}

