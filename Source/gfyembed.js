"use strict";

var gfyObject = function(gfyElem) {
  var gfyRootElem = gfyElem;
  var gfyId;
  var gfyFrameRate;
  var gfyWidth;
  var gfyHeight;
  var gfyWebmUrl;
  var gfyMp4Url;
  var pullTab;
  var ctrlBox;
  var ctrlPausePlay;
  var ctrlSlower;
  var ctrlFaster;
  var ctrlReverse;
  var vid;
  var nowPlaying;
  var isOverPullTab;
  var isOverCtrlRow;
  var isOverGfyArea;
  var isReverse = false;
  var isHideOrShowRunning = false;
  var isShowOpacityRunning = false;
  var isHideOpacityRunning = false;
  var self = this;
  var pullTabTimer;
  var pullTabImg;
  var opacityTimer;
  var linksTimer;
  var loading_counter = 0;
  var isVidCreated = 0;
  var gfyItem;
  var a1, a2, a3;
  var source, source2;

  function byClass(className, obj) {

    if (obj.getElementsByClassName) {
      return obj.getElementsByClassName(className);
    } else {
      var retnode = [];
      var elem = obj.getElementsByTagName('*');
      for (var i = 0; i < elem.length; i++) {
        if ((' ' + elem[i].className + ' ').indexOf(' ' + className + ' ') > -1) retnode.push(elem[i]);
      }
      return retnode;
    }
  }

  function setGfyItem(newGfyItem) {
    gfyItem = newGfyItem;
    gfyFrameRate = gfyItem.frameRate;
  }

  function createVidTag() {
    isVidCreated = 1;
    vid = document.createElement('video');
    vid.className = 'gfyVid';
    vid.autoplay = true;
    vid.loop = true;
    vid.controls = false;
    source2 = document.createElement('source');
    source2.src = gfyWebmUrl;
    source2.type = 'video/webm';
    source2.className = "webmsource";
    vid.appendChild(source2);
    source = document.createElement('source');
    source.src = gfyMp4Url;
    source.type = 'video/mp4';
    source.className = "mp4source";
    vid.appendChild(source);

    vid.style.position = 'absolute';
    vid.style.top = 0;
    vid.style.left = 0;
    vid.style.zIndex = 25;
    gfyRootElem.appendChild(vid);
    vid.onmouseover = onOverGfyArea;
    vid.onmouseout = onOutGfyArea;
  }


  function setWrapper() {
    addClass(gfyRootElem, "gfyWrapper");
    gfyRootElem.style.width = gfyWidth + 'px';
    gfyRootElem.style.position = "relative";
    gfyRootElem.style.padding = 0;
    gfyRootElem.style.zIndex = 5;
    gfyRootElem.style.display = 'inline-block';
    gfyRootElem.style.height = gfyHeight + 21 + 'px';
  }

  function createCtrlBox() {
    ctrlBox = document.createElement('div');
    ctrlBox.className = "gfyCtrlBox";
    ctrlPausePlay = document.createElement('img');
    ctrlPausePlay.className = "gfyCtrlPause";
    ctrlPausePlay.src = "http://assets.gfycat.com/img/pause.png";
    ctrlPausePlay.width = 15;
    ctrlPausePlay.height = 15;
    ctrlPausePlay.style.marginLeft = '10px';
    ctrlPausePlay.style.marginTop = '12px';
    ctrlPausePlay.style.borderStyle = 'none';
    ctrlBox.appendChild(ctrlPausePlay);
    a1 = document.createElement('a');
    ctrlReverse = document.createElement('img');
    ctrlReverse.className = "gfyCtrlReverse";
    ctrlReverse.src = "http://assets.gfycat.com/img/rev3.png";
    ctrlReverse.width = 15;
    ctrlReverse.height = 15;
    ctrlReverse.style.marginLeft = '6px';
    ctrlReverse.style.marginTop = '12px';
    ctrlReverse.style.borderStyle = 'none';
    a1.appendChild(ctrlReverse);
    ctrlBox.appendChild(a1);
    a2 = document.createElement('a');
    ctrlSlower = document.createElement('img');
    ctrlSlower.className = "gfyCtrlSlower";
    ctrlSlower.src = "http://assets.gfycat.com/img/slower.png";
    ctrlSlower.width = 15;
    ctrlSlower.height = 15;
    ctrlSlower.style.marginLeft = '13px';
    ctrlSlower.style.marginTop = '12px';
    ctrlSlower.style.borderStyle = 'none';
    a2.appendChild(ctrlSlower);
    ctrlBox.appendChild(a2);
    a3 = document.createElement('a');
    ctrlFaster = document.createElement('img');
    ctrlFaster.className = "gfyCtrlFaster";
    ctrlFaster.src = "http://assets.gfycat.com/img/faster.png";
    ctrlFaster.width = 15;
    ctrlFaster.height = 15;
    ctrlFaster.style.marginLeft = '4px';
    ctrlFaster.style.marginTop = '12px';
    ctrlFaster.style.borderStyle = 'none';
    a3.appendChild(ctrlFaster);
    ctrlBox.appendChild(a3);
    pullTab = document.createElement('div');
    pullTab.className = "gfyCtrlTabPull";
    pullTabImg = document.createElement('img');
    pullTabImg.src = "http://assets.gfycat.com/img/pulltabsmaller.png";
    pullTabImg.style.borderStyle = '0';
    pullTab.appendChild(pullTabImg);
    pullTab.style.position = 'absolute';
    pullTab.style.right = '0';
    pullTab.style.bottom = '-21px';
    pullTab.style.margin = '0';
    pullTab.style.padding = '0';
    pullTab.style.borderStyle = 'none';
    pullTab.style.width = '36px';
    pullTab.style.height = '21px';
    ctrlBox.style.position = 'absolute';
    ctrlBox.style.right = '0px';
    ctrlBox.style.bottom = '21px';
    ctrlBox.style.height = '40px';
    ctrlBox.style.width = '102px';
    ctrlBox.style.backgroundColor = '#0054a5';
    ctrlBox.style.zIndex = '10';
    ctrlBox.style.margin = '0';
    //ctrlBox.style.display = 'none';
    ctrlBox.appendChild(pullTab);
    ctrlBox.setAttribute("id", "ctr" + gfyId);
    gfyRootElem.appendChild(ctrlBox);
  }

  function deleteVidTag() {
    isVidCreated = 0;
    gfyRootElem.removeChild(vid);
  }

  function containsClass(elem, className) {
    return (" " + elem.className + " ").indexOf(" " + className + " ") > -1;
  }

  function addClass(elem, className) {
    elem.className = elem.className.replace(/(^\s+|\s+$)/g, '');
    return containsClass(elem, className) ? false : (elem.className += " " + className);
  }

  function removeClass(elem, className) {
    elem.className = (" " + elem.className + " ").replace(" " + className + " ", " ");
    return elem.className;
  }


  function getWidth() {
    if (window.outerWidth) {
      return window.outerHeight;
    } else {
      return document.body.clientWidth;
    }
  }

  function init(gfyData) {
    gfyMp4Url = gfyData.mp4Url;
    gfyWebmUrl = gfyData.webmUrl;
    gfyFrameRate = gfyData.frameRate;
    createVidTag();
    vid.load();
    vid.addEventListener("loadedmetadata", vidLoaded, false);
    vid.play();
  }

  function vidLoaded() {
    gfyWidth = vid.getBoundingClientRect().width;
    gfyHeight = vid.getBoundingClientRect().height;
    if (!ctrlBox) {
      setWrapper();
      createCtrlBox();
      pullTab.onmouseover = onOverPullTab;
      pullTab.onmouseout = onOutPullTab;
      ctrlBox.onmouseover = onOverCtrlRow;
      ctrlBox.onmouseout = onOutCtrlRow;
      gfyRootElem.onmouseover = onOverGfyArea;
      gfyRootElem.onmouseout = onOutGfyArea;
      ctrlPausePlay.onclick = pauseClick;
      ctrlSlower.onclick = slower;
      ctrlFaster.onclick = faster;
      ctrlReverse.onclick = reverse;
    }
  }

  function ieClassRefresh() {
    setTimeout(function() {
      addClass(gfyRootElem, 'foo');
      removeClass(gfyRootElem, 'foo');
    }, 10);
  }

  function onOverGfyArea() {
    isOverGfyArea = 1;
  }

  function onOutGfyArea() {
    isOverGfyArea = 0;
  }

  function onOverPullTab() {
    isOverPullTab = 1;
    showCtrl();
  }

  function onOutPullTab() {
    isOverPullTab = 0;
    setTimeout(function() {
      self.checkCtrl();
    }, 400);
  }

  function onOverCtrlRow() {
    isOverCtrlRow = 1;
  }

  function onOutCtrlRow() {
    isOverCtrlRow = 0;
    setTimeout(function() {
      self.checkCtrl();
    }, 400);
  }

  function pauseClick() {
    if (vid.paused) {
      vid.play();
      this.src = "/img/pause.png";
      ctrlFaster.src = "/img/faster.png";
      ctrlSlower.src = "/img/slower.png";
      ctrlFaster.onclick = faster;
      ctrlSlower.onclick = slower;
    } else {
      vid.pause();
      this.src = "/img/play.png";
      ctrlFaster.src = "/img/stepforward.png";
      ctrlSlower.src = "/img/stepbackward.png";
      ctrlFaster.onclick = stepForward;
      ctrlSlower.onclick = stepBackward;
    }
  }

  function jsReverse() {
    var gfyWrapper = this.parentNode.parentNode.parentNode;
    var gfyVid = gfyWrapper.getElementsByTagName('video')[0];
    var direction = -0.125;
    gfyVid.pause();
    gfyVid.setAttribute('data-playbackRate', setInterval((function playbackRate() {
      gfyVid.currentTime += direction;
      if (gfyVid.currentTime <= 0.126)
        gfyVid.currentTime = gfyVid.duration;

      return playbackRate;
    })(), 125));
  }

  function reverse() {
    ctrlPausePlay.src = "http://assets.gfycat.com/img/pause.png";
    ctrlFaster.src = "http://assets.gfycat.com/img/faster.png";
    ctrlSlower.src = "http://assets.gfycat.com/img/slower.png";
    ctrlFaster.onclick = faster;
    ctrlSlower.onclick = slower;
    vid.pause();
    var mp4src = byClass("mp4source", vid)[0];
    var webmsrc = byClass("webmsource", vid)[0];
    if (isReverse) {
      mp4src.src = mp4src.src.replace(/-reverse\.mp4/g, ".mp4");
      mp4src.src = mp4src.src.replace(/-reverse\.webm/g, ".webm");
      webmsrc.src = webmsrc.src.replace(/-reverse\.webm/g, ".webm");
      ctrlReverse.src = "http://assets.gfycat.com/img/rev3.png";
      isReverse = false;
    } else {
      mp4src.src = mp4src.src.replace(/\.mp4/g, "-reverse.mp4");
      mp4src.src = mp4src.src.replace(/\.webm/g, "-reverse.webm");
      webmsrc.src = webmsrc.src.replace(/\.webm/g, "-reverse.webm");
      ctrlReverse.src = "http://assets.gfycat.com/img/for2.png";
      isReverse = true;
    }
    vid.playbackRate = 1;
    vid.load();
    vid.play();
  }

  function slower() {
    if (vid.playbackRate <= 1)
      vid.playbackRate = vid.playbackRate / 2;
    else
      vid.playbackRate--;
  }

  function faster() {
    if (vid.playbackRate <= 1) {
      vid.playbackRate = vid.playbackRate * 2;
    } else {
      vid.playbackRate++;
    }
  }

  function stepForward() {
    if (window.opera) {
      var storeFunc = vid.onplay;
      vid.onplay = function() {
        vid.pause();
        vid.onplay = storeFunc;
      };
      vid.play();
    } else {
      vid.currentTime += (1 / gfyFrameRate);
    }
  }

  function stepBackward() {
    vid.currentTime -= (1 / gfyFrameRate);
  }

  this.checkCtrl = function() {
    if (isOverPullTab || isOverCtrlRow) {} else {
      hideCtrl();
    }
  };

  function showCtrl() {
    if (isHideOrShowRunning)
      return false;
    else {
      isHideOrShowRunning = true;
      clearTimeout(pullTabTimer);
      pullTabTimer = setTimeout(function() {
        self.showCtrlStep();
      }, 5);
    }
  }

  function hideCtrl() {
    if (isHideOrShowRunning)
      return false;
    else {
      isHideOrShowRunning = true;
      clearTimeout(pullTabTimer);
      pullTabTimer = setTimeout(function() {
        self.hideCtrlStep();
      }, 5);
    }
  }

  this.showCtrlStep = function() {
    isHideOrShowRunning = true;
    var curBottom = parseInt(ctrlBox.style.bottom);
    if (isNaN(curBottom))
      curBottom = 21;
    if (curBottom > -19) {
      curBottom = curBottom - 4;

      if (curBottom < -19)
        curBottom = -19;
      ctrlBox.style.bottom = curBottom + 'px';
      clearTimeout(pullTabTimer);
      pullTabTimer = setTimeout(function() {
        self.showCtrlStep();
      }, 5);
    } else {
      isHideOrShowRunning = false;
    }
  };

  this.hideCtrlStep = function() {
    isHideOrShowRunning = true;
    var curBottom = parseInt(ctrlBox.style.bottom);
    if (curBottom < 21) {
      curBottom = curBottom + 4;
      // if (curBottom > 21)
      //   curMargin = 21;
      ctrlBox.style.bottom = curBottom + 'px';
      clearTimeout(pullTabTimer);
      pullTabTimer = setTimeout(function() {
        self.hideCtrlStep();
      }, 5);
    } else {
      isHideOrShowRunning = false;
    }
  };

  function refresh() {
    vid.load();
    vid.play();
    loading_counter = 0;
  }

  return {
    init: init,
    refresh: refresh,
    setGfyItem: setGfyItem
  };
};

window.onload = function() {
  var ajaxObj = new AjaxKtClass();
  url = encodeURIComponent("http://i.imgur.com/R4fODtb.gif");
  ajaxObj.Create("http://gfycat.com/cajax/checkUrl/" + url, function() {
    var ret = ajaxObj.GetData();
    if (ret) {
      gfyData = JSON.parse(ret);
      gfyElem = document.getElementById('testitem');
      var gfyObj = new gfyObject(gfyElem);
      gfyObj.init(gfyData);
    }

  });
  ajaxObj.Open();
};

var AjaxKtClass = function() {
  this.xmlHttp = false;
  this.url = "";
  this.updateFun = null;

  this.Create = function(url, updateFun) {
    if (!this.xmlHttp && typeof XMLHttpRequest != 'undefined') {
      this.xmlHttp = new XMLHttpRequest();
    }

    this.url = url;
    this.updateFun = updateFun;
  };

  this.Open = function() {
    this.xmlHttp.open("GET", this.url, true);
    this.xmlHttp.onreadystatechange = this.updateFun;
    this.xmlHttp.send(null);
  };

  this.GetData = function() {
    if (this.xmlHttp.readyState == 4) {
      return this.xmlHttp.responseText;
    }
    return null;
  };
};
