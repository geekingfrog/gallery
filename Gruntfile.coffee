module.exports = (grunt) ->

  grunt.initConfig
    bower:
      install:
        options:
          targetDir: 'bower_components'

    concat:
      dev:
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/lodash/dist/lodash.js',
          'bower_components/react/react-with-addons.js',
          # 'bower_components/prefixfree/prefixfree.min.js'
        ]
        dest: 'build/assets/vendor.js'

      prod:
        src: [
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/lodash/dist/lodash.min.js',
          'bower_components/react/react-with-addons.min.js',
          # 'bower_components/prefixfree/prefixfree.min.js'
        ]
        dest: 'dist/assets/vendor.min.js'

    browserify:
      options:
        transform: [ require('grunt-react').browserify ]

      dev:
        files:
          'build/app/index.js': [ 'app/index.js']

      prod:
        files:
          'dist/app/index.js': [ 'app/index.js' ]

    react:
      files:
        expand: true
        cwd: 'app/templates'
        src: '**/*.jsx'
        dest: 'build/app/templates'
        ext: '.js'

    watch:

      gruntfile:
        files: ['Gruntfile.coffee']
        tasks: ['build-dev']
        options: { reload: true }

      scripts:
        files: ['app/**/*.js']
        tasks: ['browserify:dev']
        options: { livereload: true }

      jade:
        files: ['app/index.jade']
        tasks: ['jade:dev']
        options: { livereload: true }

      copy:
        files: ['app/testreact.js']
        tasks: ['copy:dev']
        options: { livereload: true }

      sass:
        files: ['app/styles/**/*.scss']
        tasks: ['sass']
        options: { livereload: true }

      jsx:
        files: ['app/templates/**/*.jsx']
        tasks: ['browserify:dev']
        options: { livereload: true }

    uglify:
      prod:
        files: {
          'dist/app/index.min.js': ['dist/app/index.js']
        }

    jade:
      dev:
        options:
          pretty: true
          data:
            title: 'Gallery - dev'
            scripts: [
              './assets/vendor.js',
              './app/index.js'
            ]
            reactScripts: [
              './app/app.js'
            ]
        files:
          'build/index.html': ['app/index.jade']

      prod:
        options:
          data:
            title: 'Gallery - prod'
            scripts: [
              './assets/vendor.min.js',
              './app/index.min.js'
            ]
        files:
          'dist/index.html': ['app/index.jade']

    copy:
      dev:
        files: [
          expand: true
          cwd: 'app/assets'
          src: ['**']
          dest: 'build/assets/'
        ]

      prod:
        files: [
          expand: true
          src: ['app/assets/**']
          dest: 'dist/assets/'
        ]

    sass:
      dev:
        files:
          'build/assets/app.css': 'app/styles/gallery.scss'

  require('load-grunt-tasks')(grunt)

  grunt.registerTask 'server', [ 'watch' ]

  grunt.registerTask 'build-dev', [
    'concat:dev',
    'browserify:dev'
    'jade:dev',
    'sass:dev',
    'copy:dev'
  ]

  grunt.registerTask 'prod', [
    'concat:prod',
    'browserify:prod',
    'uglify'
    'jade:prod',
    'sass:dev',
    'copy:dev'
  ]

  grunt.registerTask 'default', [
    'bower',
    'build-dev',
    'server'
  ]
  return
