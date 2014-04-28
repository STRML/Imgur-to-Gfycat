'use strict';
var utils = window.imgurToGfyCatUtils;

function createContextMenus(){
  chrome.contextMenus.create({
    title: "Convert to video with GfyCat",
    onclick: doConversion,
    contexts: ["image"]
  });
  chrome.contextMenus.create({
    title: "Revert GfyCat Video to GIF",
    onclick: doReversion,
    contexts: ["video"]
  });
}

function doConversion(info, tab){
  chrome.tabs.sendMessage(tab.id, {
    "convertToGfyWithURL": info.srcUrl
  });
}

function doReversion(info, tab) {
  chrome.tabs.sendMessage(tab.id, {
    "revertToGIFWithURL": info.srcUrl
  });
}

(function init(){
  createContextMenus();
})();
