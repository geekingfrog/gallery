var linearPartition = require('./linear-partition').linear_partition;

// get an array of json objects representing the images
// {
//   url: 'foo/bar.png',
//   size: {
//     height: 666,
//     width: 42
//   }
// }
//
// and a viewport: { width, height }
//
// returns a new array of json objects with the data required
// to lay them on the grid.
module.exports.computeDisposition = function(images, viewport) {
  var rowHeight = viewport.height/2;

  var scaledImages = images.map(function(img) {
    return _.assign({}, img, {
      size: {
        height: rowHeight,
        width: img.size.width*rowHeight/img.size.height
      }
    })
  });

  var numRows = Math.round(scaledImages.reduce(function(totalWidth, img) {
    return totalWidth + img.size.width;
  }, 0)/viewport.width);

  var weightSet = images.map(function(img) {
    return Math.floor(100 * img.size.width / img.size.height);
  });

  var partition = linearPartition(weightSet, numRows);

  var i = 0;
  var offsetY = 0, offsetX;
  var finalImages = [];

  partition.forEach(function(row) {
    var imgRow = images.slice(i, i+row.length);
    var sumWidth = imgRow.reduce(function(total, img) {
      return total + img.size.width;
    }, 0);

    var sumAspectRatio = imgRow.reduce(function(total, img) {
      return total + img.size.width / img.size.height;
    }, 0);

    offsetX = 0;
    imgRow.forEach(function(img, idx) {
      var jsonImg = _.cloneDeep(images[i]);

      var finalWidth = viewport.width / sumAspectRatio * (img.size.width / img.size.height);
      var finalHeight = viewport.width / sumAspectRatio;

      finalImages.push(_.assign(jsonImg, {
        left: offsetX,
        top: offsetY,
        width: finalWidth,
        height: finalHeight
      }));
      offsetX += finalWidth;
      i++;
    });
    offsetY += finalImages[finalImages.length-1].height;
  });

  return finalImages;
}
