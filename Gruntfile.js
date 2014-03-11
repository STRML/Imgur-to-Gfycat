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
    }
  });


  grunt.loadNpmTasks('grunt-crx');
};
