const { src, dest, watch /*для отслеживания*/, parallel/*для отслеживание за несколькими функциями одновременно*/ ,series} = require('gulp');

const scss 		   = require('gulp-sass'); //передать все возможности gulp-sass -->scss
const concat 	   = require('gulp-concat');
const browserSync  = require('browser-sync').create();//для автообнавления страницы в браузере
const uglify 	   = require('gulp-uglify-es').default;//для js
const autoprefixer = require('gulp-autoprefixer');//для совместимости с староми браузерами
const imagemin	   = require('gulp-imagemin');//для сжатия картинок
const del 		   = require('del');//для удалении всех файлов из dist

function browsersync() {
browserSync.init({
	server : {
	baseDir: 'app/'
  }
 });   
}


function cleanDist() {
	return del('dist')
}


function images() {
	return src('app/images/**/*')
	.pipe(imagemin(
		[
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg ({ quality: 75, progressive: true }),
			imagemin.optipng ({ optimizationLevel: 5}),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false}
				  ]
				})
			]
		))
	.pipe(dest('dist/images'))
}



function scripts() {
 return src([
 	'node_modules/jquery/dist/jquery.js',
 	'node_modules/slick-carousel/slick/slick.js',//slider
 	'node_modules/mixitup/dist/mixitup.js',
 	'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
 	'app/js/main.js'
 	])
	.pipe(concat('main.min.js'))
	.pipe(uglify())//для сжатия js
	.pipe(dest('app/js'))	
	.pipe(browserSync.stream())
}




function styles() {
	return src('app/scss/style.scss')
		.pipe(scss({outputStyle: 'compressed'}))//конвертировать scss в css , используя возмовнисти gulp-sass,поэтому показоваем в ()-->scss
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 version'],
			grid: true
			}))
		.pipe(dest('app/css'))//путь-куда конвертироварь,спомощю dest, поэтому передаём мощноцть gulp-->dest
		.pipe(browserSync.stream())
}

function build() {
 return src([
 	'app/css/style.min.css',
 	'app/fonts/**/*',
 	'app/js/main.min.js',
 	'app/*.html'
 	], {base: 'app'})
 		.pipe(dest('dist'))
 	}


function watching(){ //для автослежения 
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/js/**/*.js' ,'!app/js/main.min.js'], scripts);
	watch(['app/*.html']).on('change', browserSync.reload);
}




exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles,scripts,browsersync,watching);


/////enter alt+1, npm i...чтобы установились все плагины по package.json
/////enter alt+1, gulp build ... для сжатия файлов
