'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    crx: {
      gfy: {
        "src": "Source/",
        "dest": "imgur-to-gfycat.crx",
        "exclude": [ ".git" ],
        "privateKey": "imgur-to-gfycat.pem",
        "options": {
          "maxBuffer": 3000 * 1024 //build extension with a weight up to 3MB
        }
      }
    },
    bump: {
      options: {

      },
      files: ['package.json', 'Source/manifest.json']
    }
  });


  grunt.loadNpmTasks('grunt-crx');
  grunt.loadNpmTasks('grunt-bumpx');
};
