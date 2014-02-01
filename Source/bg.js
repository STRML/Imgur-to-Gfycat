'use strict';
var gifRegex = /.*imgur.com\/.*\.gif(?:\?.*)?$/;

blockGifLoading();
createContextMenus();

// Use webRequests API to block eligible gifs from loading to save bandwidth.
function blockGifLoading(){
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (shouldBlock(details.url)){
        // this gif works in chrome only; see http://stackoverflow.com/a/15960901/832202
        return { redirectUrl: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' };
      }
    },
    {urls: ['*://*.imgur.com/*'], types: ['image']},
    ['blocking']);
}

function shouldBlock(url){
  return gifRegex.test(url) && url.indexOf('?ignoreGfy') === -1;
}

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

