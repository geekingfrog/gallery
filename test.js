var gm = require('gm');
var fs = require('fs');

var path = './static/ponies/applejack0.png';

console.log(fs.readFileSync(path));

gm(path).size(function(err, size) {
  if(err)
    console.log('error: ', err);
  else
    console.log(size);
})
