var LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT }),
    mountFolder = function( connect, dir ) {
      return connect.static(require('path').resolve(dir));
    };

module.exports = function(grunt) {
  var reactify = require("reactify");

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        debug: true,
        transform: ['reactify'],
        extensions: ['.react.js']
      },
      app: {
        src: './src/index.js',
        dest: './bundled.js'
      }
    },

    watch: {
      files: [ "./src/**/*.js"],
      tasks: ['browserify'],
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: ['./*.html', './*.js', "./Style/**/*.css"]
      }
    },
    connect: {
      options: {
        port: 8000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function( connect ) {
            return [
              lrSnippet,
              mountFolder(connect, './')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('build', ['browserify']);

  grunt.registerTask('server', function() {
    grunt.task.run([
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('default', ['browserify', 'server']);
};
