(function($) {
  'use strict';

  var imagesP = $.getJSON('/api/ponies')
  var viewport = {
    width: 900,
    height: $(window).height()
  };

  var rowHeight = viewport.height/2;

  var computeGalery = function(images) {
    images = _.shuffle(images);
    console.log('images: ', images);

    var scaledImages = images.map(function(img) {
      return _.extend({}, img, {
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

    var linearPartition = require('./linear-partition').linear_partition;
    var partition = linearPartition(weightSet, numRows);
    console.log('partition: ', partition);

    var i = 0;
    var offsetY = 0, offsetX;
    var finalImages = [];

    partition.forEach(function(row) {
      var domRow = document.createElement('div');
      domRow.classList.add('row');
      var imgRow = images.slice(i, i+row.length);
      var sumWidth = imgRow.reduce(function(total, img) {
        return total + img.size.width;
      }, 0);

      var sumAspectRatio = imgRow.reduce(function(total, img) {
        return total + img.size.width / img.size.height;
      }, 0);

      offsetX = 0;
      imgRow.forEach(function(img, idx) {
        var jsonImg = images[i];
        // var domImg = document.createElement('img');
        var domImg = jsonImg.el;
        if(!domImg) {
          domImg = document.createElement('img');
          domImg.src = img.url;
        }

        // cannot rely on the image dimension for the offset because of transitions
        var finalWidth = viewport.width / sumAspectRatio * (img.size.width / img.size.height);
        domImg.width = finalWidth;

        var finalHeight = viewport.width / sumAspectRatio;
        domImg.height = finalHeight;

        domImg.style.position = 'absolute';
        $(domImg).animate({
          left: offsetX+'px',
          top: offsetY+'px',
          transform: 'scale(1)'
        }, 700);

        offsetX += finalWidth;
        finalImages.push(_.extend({}, jsonImg, {
          finalWidth: finalWidth,
          finalHeight: finalHeight,
          el: domImg
        }));
        i++;
      });
      offsetY += finalImages[finalImages.length-1].finalHeight;
    });

    return finalImages;
  };

  window.jsonGalery = null;
  imagesP.then(function(images) {
  //   return images.filter(function(i, idx) { return idx % 2 !== 0; });
  // }).then(function(images) {
    jsonGalery = computeGalery(images);
    $('#galery').append(jsonGalery.map(function(i) {
      return i.el;
    }));
  });

  // change the visible images every two seconds
  var count = 0;
  var interval = setInterval(function() {
    if(count++ > 5) {
      clearInterval(interval);
    }

    var visible = [], invisible = [];
    jsonGalery.forEach(function(img) {
      if(Math.random() < .5) {
        visible.push(img);
      } else {
        invisible.push(img);
      }
    });

    invisible.forEach(function(img) {
      $(img.el).animate({'-webkit-transform': 'scale(0)'});
    });

    computeGalery(visible);

  }, 2000);

})(jQuery);
