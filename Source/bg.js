'use strict';
var utils = window.imgurToGfyCatUtils;

function createContextMenus(){
  chrome.contextMenus.create({
    title: "Convert to video with GfyCat",
    onclick: doConversion,
    contexts: ["image"]
  });
}

function doConversion(info, tab){
  chrome.tabs.sendMessage(tab.id, {
    "convertToGfyWithURL": info.srcUrl
  });
}

(function init(){
  createContextMenus();
})();