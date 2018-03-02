var gulp = require('gulp'),
    less = require('gulp-less'),
    cssMin = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    path = require('path'),
    replace = require("gulp-replace"),
    fs = require("fs"),
    htmlmin = require('gulp-htmlmin');

/**
 * 常用变量
 */
const projectPath = __dirname;
const appPath = path.join(projectPath, "app");
const assetsPath = path.join(appPath, "assets");

gulp.task("makeCss", function() {
    gulp.src([
    		"less/**/*.less"
    	])
        .pipe(less())
        .pipe(concat("sections.css"))
        .pipe(gulp.dest(path.join(projectPath, "less")));
});

/**
 * 合并压缩所含有用到的css到一个文件
 */
gulp.task('handleCss', ["makeCss"], function () {
    gulp.src([
    		"./3rd/jsdifflib/diffview.css",
    		path.join(projectPath, "less", "sections.css")
    	])
        .pipe(concat("tools.css"))
        .pipe(cssMin())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(path.join(assetsPath, "css")));
});

gulp.task("handleImg", function () {
    return gulp.src("img/**/*.png")
        .pipe(gulp.dest(path.join(assetsPath, "img")));
});


/**
 * 处理html
 */
gulp.task("handleHtml", function() {
    let getHtmlSection = (sectionName) => {
        let html = fs.readFileSync(
            path.join(projectPath, "sections", sectionName + ".html"),
            "utf8"
        );
        return html;
    };
    let getSvgSection = (sectionName) => {
        let svg = fs.readFileSync(
            path.join(projectPath, "sections", "svg", sectionName + ".svg"),
            "utf8"
        );
        return svg;
    };    
    gulp.src(["./index.html"])
        .pipe(replace(
            "{JsonFormat}", getHtmlSection("JsonFormat")
        ))
        .pipe(replace(
            "{TxtDiff}", getHtmlSection("TxtDiff")
        ))
        .pipe(replace(
            "{JsonFormatSvg}", getSvgSection("JsonFormatSvg")
        ))
        .pipe(replace(
            "{TxtDiffSvg}", getSvgSection("TxtDiffSvg")
        ))
        .pipe(replace(
            "{LoadingSvg}", getSvgSection("LoadingSvg")
        ))
        .pipe(replace(
            "{SwitchSvg}", getSvgSection("SwitchSvg")
        )) 
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(appPath));
});