```javascript
  /**
   * know.js — v0.5.1
   * ---------------------------------------------------------------------
   * A simple tool to log stuff inside the console and beyond.
   * © 2013 @ThibWeb Released under the MIT and GPL Licenses.
   */
```

## Why

This is a little weekend project which I built to try to make the [Console API](https://getfirebug.com/wiki/index.php/Console_API) [easier to work with](http://lists.w3.org/Archives/Public/public-script-coord/2013JanMar/0180.html).

## Demo

A simple demo is available [here](https://rawgithub.com/ThibWeb/know/master/index.html#). Notice the URL ? Kudos to [rawgithub.com](https://rawgithub.com) for providing this neat little trick.

## Install

Assuming you use jQuery, simply add `<script src="know.js"></script>` to your page. know.js is compatible with jQuery 1.4+.

## Usage

```javascript
  self.usage = {
    title: 'know.js ' + self.version + ' — know.help() :',
    first: '- first define a key w/ know.init(key, store?)',
    secund: '- then log to console w/ know.{info,warn,error}(message)',
    third: '- your logs are stored w/ (store? local : session) + Storage',
    fourth: '- view your logs w/ know.show() - close.on(mouseleave)',
    fifth: '- share your logs w/ know.share() as GitHub gists',
    sixth: '- bookmarklet: javascript:{know.show();};void(0);'
  };
```
