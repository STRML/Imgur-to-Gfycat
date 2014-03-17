"use strict";
var utils = window.imgurToGfyCatUtils;
var activeDrag, animFrameRequest, activeDragMult;
var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
var p = Math.pow;

(function init(){
  attachMutationObservers();
  window.addEventListener('mousemove', mouseMoveHandler);
  window.addEventListener('mouseup', mouseUpHandler);
  findGfys();
})();

// Listen to the page to catch any gfy objects being converted.
function attachMutationObservers(){
  var observer = new WebKitMutationObserver(function(mutations) {
    mutations.forEach(function(m){
      forEach(m.addedNodes, findGfys);
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Find gfys on the page & make them resizable.
function findGfys(rootNode){
  rootNode = rootNode && rootNode.parentNode || document.body;
  if ([1, 9, 11].indexOf(rootNode.nodeType) === -1 ) return;
  var gfys = rootNode.getElementsByClassName('gfyitem');
  for (var i = 0; i < gfys.length; i++){
    if (gfys[i].dataset.dragToResize) return;
    if (!gfys[i].firstChild) return; // don't add draggability to stub items
    makeResizable(gfys[i]);
  }
}

// Make a gfynode resizable - adds handlers.
function makeResizable(gfyNode){
  // Flag so we don't do this again.
  gfyNode.dataset.dragToResize = true;
  // Save w/h for later restoration.
  gfyNode.dataset.originalW = gfyNode.firstChild.style.width.slice(0, -2);
  gfyNode.dataset.originalH = gfyNode.firstChild.style.height.slice(0, -2);

  // Set draggable=false on all items above this, so they don't annoyingly start dragging
  // and screw up the resize
  utils.getParents(gfyNode).forEach(function(parent){
    if (parent.nodeName === "A" || parent.nodeName === "IMG"){
      parent.setAttribute('draggable', false);
    }
  });

  // Add handlers.
  gfyNode.addEventListener('mousedown', mouseDownHandler);
  gfyNode.addEventListener('click', clickHandler);
  gfyNode.addEventListener('dblclick', doubleClickHandler);
}

// On mousedown, set this gfy object as active.
function mouseDownHandler(e){
  if (e.which !== 1) return; // left click only
  // Don't catch drags in controls
  if (utils.matchParents(e.target, '.gfyCtrlBox')) return;
  activeDrag = e.currentTarget;

  // Store distance of starting click from boundaries for a more natural feeling drag.
  var rc = e.currentTarget.getBoundingClientRect();
  activeDragMult = p(
    p((e.clientX - rc.left) / rc.width, 2) +
    p((e.clientY - rc.top) / rc.height, 2),
  0.5);
}

// Prevent page from navigating when a user lets up on the mouse.
// Keeps dragging from getting a little out of control.
function clickHandler(e){
  if (e.currentTarget.dataset.dragInProgress){
    delete e.currentTarget.dataset.dragInProgress;
    e.preventDefault();
  }
}

// End the drag.
function mouseUpHandler(e){
  if (e.which !== 1) return; // left click only
  activeDrag = null, activeDragMult = null;
  window.cancelAnimationFrame(animFrameRequest);
}

// Restore original size on doubleclick.
function doubleClickHandler(e){
  // Don't catch doubleclicks in controls
  if (utils.matchParents(e.target, '.gfyCtrlBox')) return;
  setSize(e.currentTarget,
    e.currentTarget.dataset['originalW'], e.currentTarget.dataset['originalH']);
  document.getSelection().removeAllRanges(); // prevent selection
}

// On mouse move, resize the image.
function mouseMoveHandler(e){
  if (!activeDrag) return;
  if (animFrameRequest) window.cancelAnimationFrame(animFrameRequest);
  animFrameRequest = window.requestAnimationFrame(function(){
    activeDrag.dataset.dragInProgress = true;
    var mult = getDragSize(activeDrag, e);
    if (mult !== -1){
      var originalSize = getOriginalSize(activeDrag);
      setSize(activeDrag, originalSize.width * mult, originalSize.height * mult);
    }

    document.getSelection().removeAllRanges(); // prevent selection
    animFrameRequest = null;
  });
}

// Get the original size of the gfy.
function getOriginalSize(gfyNode){
  return {width: gfyNode.dataset['originalW'], height: gfyNode.dataset['originalH']};
}

// Set gfynode size. We have to set style on the container as well as height/width attrs
// on the canvas & video.
function setSize(gfyNode, w, h){
  var container = gfyNode.firstChild;
  var vid = gfyNode.querySelector('.gfyVid') || {}; // don't crash if gfy changes classes
  var canvas = gfyNode.querySelector('.gfyPreLoadCanvas') || {};

  container.style.width = w + 'px';
  container.style.height = h + 'px';
  vid.width = w;
  vid.height = h;
  canvas.width = w;
  canvas.height = h;
}

// Returns size for image resizing relative to original size(multiplier).
function getDragSize(el, e)
{
  if (!el) return -1;
  var rc = el.getBoundingClientRect();
  var origSize = getOriginalSize(el);

  // Invalid drag
  if (rc.left > e.clientX || rc.top > e.clientY) return -1;

  return Math.max(
    p(
      p((e.clientX - rc.left) / origSize.width, 2) +
      p((e.clientY - rc.top) / origSize.height, 2),
    0.5) / activeDragMult
  , 0.25);
}
