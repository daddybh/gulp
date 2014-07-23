var gulp = require('gulp');
 	spa = require('gulp-spa'),
	uglify = require('gulp-uglify'),
	htmlmin = require('gulp-htmlmin'),
	rev = require('gulp-rev'),
	concat = require('gulp-concat'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	tmodjs = require('gulp-tmod'),
	watch = require('gulp-watch'),
	spritesmith = require('gulp.spritesmith'),
	minifyCSS = require('gulp-minify-css');

gulp.task('sprite',function(){
	var spriteData = gulp.src("./images/public/*.png")
		.pipe(spritesmith({
			imgName:'sprite.png',
			cssName:'sprite.scss',
			algorithm :'binary-tree',
			cssFormat :'scss'
		}));
	spriteData.img.pipe(gulp.dest('./images'));
	spriteData.css.pipe(gulp.dest('./sass'));
});

gulp.task('watch',function(){
	gulp.watch('./tpl/*.html', ['compileTpl']);
  	gulp.watch('./sass/*.scss', ['compileSass']);
});

gulp.task('compileTpl',function(){
	return gulp.src('./tpl/*.html')
			.pipe(tmodjs({
				base: './tpl',
                combo: true,
                output: './'
			}));
})

gulp.task("cleanPublic",function(){
	return gulp.src('public')
			.pipe(clean());
});

gulp.task("compileSass",function(){
	gulp.src('./sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./css'));
});

gulp.task("build",['compileTpl','sprite','cleanPublic','compileSass'],function(){
	return gulp.src("index.html")
		.pipe(spa.html({
			assetsDir: './',
			pipelines:{
				main: function(files){
					return files.pipe(htmlmin());
				},
				js: function(files){
					return files
							.pipe(uglify())
							.pipe(concat('app.js'))
							.pipe(rev());
				},
				css : function(files){
					return files.pipe(concat('css/main.css'))
							.pipe(minifyCSS({keepBreaks:true}))
							.pipe(rev());
				}
			}
		}))
		.pipe(gulp.dest('./public/'));
});

