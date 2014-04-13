module.exports = function (Promise, _, gm, fs, path) {
  var ponyPath = path.resolve('app/assets/ponies');
  var ponyFiles = fs.readdirAsync(ponyPath).map(function(filename) {
    return path.resolve('app/assets/ponies', filename);
  });

  var metadata = {

    applejack: {
      kind: 'earth',
      coat: 'light brilliant gambodge',
      mare: 'pale light grayish olive',
      eyes: 'moderate sap green'
    },

    fluttershy: {
      kind: 'pegasus',
      coat: 'pale light grayish gold',
      mare: 'pale light grayish rose',
      eyes: 'moderate cyan'
    },

    pinkiePie: {
      kind: 'earth',
      coat: 'pale light grayish raspberry',
      mare: 'brilliant raspberry',
      eyes: 'light cerulean'
    },

    rainbowDash: {
      kind: 'pegasus',
      coat: 'very light cerulean',
      mare: 'rainbow',
      eyes: 'moderate cerise'
    },

    rarity: {
      kind: 'unicorn',
      coat: 'light gray',
      mare: 'moderate indigo',
      eyes: 'moderate azure'
    },

    twilightSparkle: {
      kind: 'unicorn',
      coat: 'pale light grayish mulberry',
      mare: 'moderate sapphire blue',
      eyes: 'moderate violet'
    },

  };

  function getName(file) {
    var filename = path.basename(file);
    var idx = filename.indexOf('.');
    return filename.slice(0, idx-1);
  }

  var getImageSize = Promise.coroutine(function* (file) {
    var img = gm(file);
    return yield Promise.promisify(img.size, img)();
  })

  var addMetadata = Promise.coroutine(function* (file) {
    var name = getName(file);
    var size = yield getImageSize(file);
    console.log('relative path: %s', path.relative(__dirname, file));

    var r = /.*assets\//i
    console.log('url: %s', path.relative(__dirname, file).replace(r, '/assets/'));

    return _.assign({}, {
      file: path.relative(__dirname, file).slice(3),
      url: path.relative(__dirname, file).replace(r, 'assets/')
    }, {name: name}, {size: size}, metadata[name]);
  });


  var db = Promise.all(ponyFiles.map(addMetadata));

  var findAll = Promise.coroutine(function* () {
    return yield db;
  });

  var findById = Promise.coroutine(function* (id) {
    var localdb = yield db;
    var pony = _.find(localdb, function(pony) {
      return path.basename(pony.file) === id;
    });

    if(!pony) {
      throw new Error('Cannot find pony for id '+id);
    }
    return pony;
  });

  return {
    findAll: findAll,
    findById: findById
  }

};
