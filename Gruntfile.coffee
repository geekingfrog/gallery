module.exports = (grunt) ->

  grunt.initConfig
    bower:
      install:
        options:
          targetDir: 'bower_components'

    concat:
      dev:
        src: [
          'bower_components/jquery/dist/jquery.js'
        ]
        dest: 'build/assets/vendor.js'

      prod:
        src: [
          'bower_components/jquery/dist/jquery.min.js'
        ]
        dest: 'dist/assets/vendor.min.js'

    browserify:
      dev:
        files:
          'build/app/index.js': [ 'app/index.js', 'app/**/*.js' ]

      prod:
        files:
          'dist/app/index.js': [ 'app/**/*.js' ]

    watch:

      gruntfile:
        files: ['Gruntfile.coffee']
        options: { reload: true }

      scripts:
        files: ['app/**/*.js']
        tasks: ['browserify:dev']
        options: { livereload: true }

      jade:
        files: ['app/index.jade']
        tasks: ['jade:dev']
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


  require('load-grunt-tasks')(grunt)

  grunt.registerTask 'server', [ 'watch' ]

  grunt.registerTask 'build-dev', [
    'concat:dev',
    'browserify:dev'
    'jade:dev'
  ]

  grunt.registerTask 'prod', [
    'concat:prod',
    'browserify:prod',
    'uglify'
    'jade:prod'
  ]

  grunt.registerTask 'default', [
    'bower',
    'build-dev',
    'server'
  ]
  return
