imgur-to-gfycat
===============

Works with Reddit Enhancement Suite!

Chrome extension that replaces gifs hosted by imgur to HTML5-optimized video converted and hosted
by gfycat.

This extension will modify anchor links to gfycat.com/fetch links, which transcode & show the gif
after transcoding. `img` tags with a gif hosted on imgur will trigger a `transcodeRelease` action, 
which will cause the gif to be transcoded on gfycat's servers if it hasn't already. 

To improve the user experience, gifs are only replaced with gfycat videos if they are already transcoded
on gfycat's servers. Otherwise, the original gif is shown. As soon as one user - anywhere - views that gif 
on gfycat, all users will see the transcoded version when using this extension.
