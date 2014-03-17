v1.4.1
------
* Doubleclicking gfycat controls will no longer cause the zoom level to change.
* Fixed a control display issue in comment threads caused by an RES change.

v1.4.0
------
* Fixed a bug where the original gif would annoyingly show up before the gfy loaded.
* Made gfycat controls much more usable and eliminated padding animation on hover.
* Fixed a bug where you would resize the gfy on right/middle click.
* Improved album performance and started caching gfy urls.

v1.3.3
------
* Further fixes to RES galleries. They should work well front to back, now.
* Tweaks to make gfy drag resizing a lot less annoying.

v1.3.2
------
* Fixed a bug where gifs would stop animating if they were not loadable from Gfycat.
* Now displaying an error when a manual conversion fails (error from Gfycat API).

v1.3.1
------
* Added support for minus.com, photobucket.com, and lots more. See
  [the complete list](https://github.com/STRML/Imgur-to-Gfycat/blob/e39509b64358514c554e1c49f22c9ce75c02d782/Source/imgur-to-gfycat.js#L12)
* Fixed RES album support.

v1.3.0
------
* Added context menu support for converting files that may have been missed, such as non-imgur gifs or
  gifs with incorrect extensions (such as the many gifs with the .jpg extension on /r/gifs)

v1.2.0
------
* Gfycat gifs/videos can now be dragged to resize, much like images in RES.
  Doubleclick to restore the original size.

v1.1.3
------
* Fix clicks on gfycat controls opening a new tab when the gfy is surrounded by an anchor (RES, etc).
* Prevented execution of gfyembed.js unless a gif needs conversion. Should fix some previous weird issues with
  other sites, e.g. YouTube.

v1.1.2
------
* Fix gfycat.com/fetch urls breaking when this extension is active.

v1.1.1
------
* Convert all eligibble anchor links to point to gfycat if a gfycat url has successfully been resolved.
* Fix gfycat controls overflowing in RES.

v1.1.0
------
* Fix some issues with incorrect navigation when using RES.
* Prevent loading of original gifs to save bandwidth if they are going to be replaced anyway.

v1.0.0
------
* Initial release.
