var gifRegex = /.*imgur.com\/.*\.gif(?:\?.*)?$/;

blockGifLoading();
findUnicorns();

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


// The occasional .jpg or .png is mislabeled and is actually a gif. Check content-type
// headers and mark these things so we can gfy them.
function findUnicorns(){
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (isUnicorn(details)) {
        // this gif works in chrome only; see http://stackoverflow.com/a/15960901/832202
        return { redirectUrl: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' };
      }
    },
    {urls: ['*://*.imgur.com/*'], types: ['image']},
    ['blocking']);
}

function isUnicorn(details) {
  return !gifRegex.test(details.url) && details.responseHeaders && details.responseHeaders['content-type'] &&
          details.responseHeaders['content-type'] === 'image/gif';
}
