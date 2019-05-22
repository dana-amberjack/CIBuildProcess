/// <binding Clean='clean' />
//"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    htmlmin = require("gulp-htmlmin"),
    uglify = require("gulp-uglify"),
    merge = require("merge-stream"),
    del = require("del"),
    bundleconfig = require("./bundleconfig.json");

var regex = {
    css: /\.css$/,
    html: /\.(html|htm)$/,
    js: /\.js$/
};

gulp.task("clean:ts", () => {

    // Typescript
    var tsFiles = ['_script/**/*.map', '_script/**/*.js'];

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

gulp.task("bundle", () => {

    var buns = getBundles(regex.js);

    var tasks = buns.map(bundle => {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName))
            .pipe(gulp.dest("."));
    });

    console.log(buns);

    return merge(tasks);
});

gulp.task("min", () => {

    var buns = getBundles(regex.js);

    var tasks = buns.map(bundle => {
        return gulp.src(bundle.inputFiles, { base: "." })
            .pipe(concat(bundle.outputFileName.replace(".js", ".min.js")))
            .pipe(uglify())
            .pipe(gulp.dest("."));
    });

    console.log(buns);

    return merge(tasks);
});

gulp.task("clean:all", gulp.parallel("clean:ts", "clean:js"));

gulp.task("bundle:min", gulp.parallel("bundle", "min"));

gulp.task("watch", function () {
    getBundles(regex.js).forEach(function (bundle) {
        gulp.watch(bundle.inputFiles, gulp.series("bundle"));
    });

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