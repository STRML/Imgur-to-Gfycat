'use strict';
//
// UTILS
// 

var supportedSites = ['imgur.com', 'minus.com', 'photobucket.com', 'imagsy.com', 'giffer.co', 'gifsplosion.com', 
                      'gifs-planet.com', 'googleusercontent.com', 'instagram.com', 'flickr.com', 'imageshack.com', 
                      'twitpic.com', '4chan.com', 'picasa.com'];
var utils;
window.imgurToGfyCatUtils = utils = {
  gifRegex: new RegExp(".*(" + supportedSites.join('|') + ")/.*\\.gif(?:\\?.*)?$"),
  isEligibleGif: function(url){ return utils.gifRegex.test(url); },

  randomString: function(){
    var c = '';
    var a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var b = 0; b < 10; b++) {
        c += a.charAt(Math.floor(Math.random() * a.length));
    }
    return c;
  },

  // Set gfynode size. We have to set style on the container as well as height/width attrs
  // on the canvas & video.
  setGfySize: function(gfyNode, w, h) {
    var container = gfyNode.firstChild;
    var vid = gfyNode.querySelector('.gfyVid') || {}; // don't crash if gfy changes classes
    var canvas = gfyNode.querySelector('.gfyPreLoadCanvas') || {};

    container.style.width = w + 'px';
    container.style.height = h + 'px';
    vid.width = w;
    vid.height = h;
    canvas.width = w;
    canvas.height = h;
  },

  // Get all parents of an element.
  getParents: function(el) {
    var parents = [];

    var parent = el;
    while (parent !== document) {
      parents.push(parent);
      parent = parent.parentNode;
    }
    return parents;
  },

  // Return first match in array of nodes for a selector.
  matchArray: function(array, selector){
    for(var i = 0; i < array.length; i++){
      if (utils.elementMatches(array[i], selector)) return array[i];
    }
  },

  // Return first matching parent for a selector.
  matchParents: function(el, selector) {
    return utils.matchArray(utils.getParents(el), selector);
  },

  // Proxy to element.matchesSelector.
  elementMatches: function(el, selector){
    return (el.matchesSelector ? el.matchesSelector(selector) : el.webkitMatchesSelector(selector));
  }
};
