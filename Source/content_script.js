var request = superagent;
var gfyEndpoints = {
  transcode: 'http://upload.gfycat.com/transcode/',
  transcodeRelease: 'http://upload.gfycat.com/transcodeRelease/',
  status: 'http://gfycat.com/cajax/get/',
  checkURL: 'http://gfycat.com/cajax/checkUrl/'
};
var gifRegex = /.*imgur.com\/.*\.gif$/;

function init(){
  embedGfyCat();
  attachMutationObservers();
  scan();
}

function scan(element){
  if (!element) element = document;
  if (element.nodeType !== 1) return; // text nodes, etc
  var imgs = element.getElementsByTagName('img');
  var anchors = element.getElementsByTagName('a');

  for (var i = 0; i < imgs.length; i++){
    replaceGif(imgs[i]);
  }

  for (i = 0; i < anchors.length; i++){
    replaceAnchor(anchors[i]);
  }
}

// Listen to the page to catch any new anchors or images to convert.
function attachMutationObservers(){
  var observer = new WebKitMutationObserver(function(mutations) {
    mutations.forEach(function(m){
      Array.prototype.forEach.call(m.addedNodes, scan);
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Replacing a gif on the page is a little more complex. We need to send the fetch
// request to gfycat so it can create and convert the file. When it finishes, it will redirect
// to the gfycat link so we can embed into the page.
function replaceGif(imgNode){
  if (!isGif(imgNode.src)) return;
  var parent = imgNode.parentNode;
  imgNode.style.display = "none"; // hide while we are waiting for gfycat

  getGfyUrl(imgNode.src, function onSuccess(id){
    // Remove the image and replace with the gfycat stub so gfycat's js can handle it.
    parent.removeChild(imgNode);
    var gfyImg = document.createElement('img');
    gfyImg.setAttribute('class', 'gfyitem');
    gfyImg.setAttribute('data-id', id);
    parent.appendChild(gfyImg);
    runGfyCat();
  }, function onError(err){
    // Just show the old gif.
    imgNode.style.display = "";
  });
}

function replaceAnchor(anchorNode){
  if (!isGif(anchorNode.href)) return;
  if (anchorNode.getAttribute('data-gyffied')) return;
  anchorNode.href = '//gfycat.com/fetch/' + anchorNode.href;
  anchorNode.setAttribute('data-gyffied', true);
}

function isGif(url){
  return gifRegex.test(url);
}

// Run /transcodeRelease to get the gfyURL. If the gfy exists, it will immediately be returned
// and everybody's happy. Otherwise, we return an error which will replace the gif. The image will be transcoded
// in the background for the next user.
function getGfyUrl(url, cb, errorCb){
  var endpoint = gfyEndpoints.transcodeRelease + randomString() + "?fetchUrl=" + encodeURI(url);
  request.get(gfyEndpoints.transcodeRelease + randomString())
    .query({fetchUrl: url})
    .end(function(err, res){
      if (err) return errorCb(err);
      if (res.body.gfyName) cb(res.body.gfyName);
      else errorCb(new Error("Transcode in progress"));
    });
}

// Embed gfycat into the page.
function embedGfyCat(){
  // Skip if this has already been done
  if (document.getElementById('gfycatjs')) return;
  var script = document.createElement('script');
  script.src = chrome.extension.getURL('gfyembed.js');
  script.id = 'gfycatjs';
  (document.body || document.head || document.documentElement).appendChild(script);
}

// Run gfycat's init() function, which will find all convertable images and convert them.
function runGfyCat(){
  var script = document.createElement('script');
  script.type = "text/javascript";
  var script_innards = document.createTextNode("window.gfyCollection.init();");
  script.appendChild(script_innards);
  (document.body || document.head || document.documentElement).appendChild(script);
}

function randomString(){
  var c = "";
  var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var b = 0; b < 10; b++) {
      c += a.charAt(Math.floor(Math.random() * a.length));
  }
  return c;
}

// Kickoff
init();
