const fs = require('fs');
const uglifJs = require('uglify-js');
const CleanCss = require('clean-css');

// uglifyjs - 压缩js文件
let jsresult = uglifJs.minify('./source/multiSelMail.js');
fs.writeFile('./output/multiSelMail.min.js', jsresult.code);

// cleancss - 压缩css文件
fs.readFile('./source/multiSelMail.css', function(err, data) {
  let cssresult = new CleanCss().minify(data);
  fs.writeFile('./output/multiSelMail.min.css', cssresult.styles);
});
