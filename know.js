/**
 * know.js — v0.1.0
 * ---------------------------------------------------------------------
 * A simple tool to log stuff inside the console and beyond.
 * © 2013 @ThibWeb Released under the MIT and GPL Licenses.
 */

!(function (factory, $) {
  if (typeof define === 'function') {
    define(['$'], factory);
  } else {
    factory($);
  }
})(function ($) {
  'use strict';

  var cons = window.console;

  window.know = {};

  var Knowledge = function () {
    var self = this;

    self.name = 'know.js';
    self.version = 'v0.0.1';
    self.sep = '|';

    self.base = 'know';
    self.key = null;
    self.token = null;

    self.level = {
      info: 'info',
      warn: 'warn',
      fail: 'fail'
    };

    self.storage = {
      key: function () {
        return self.base + '.' + self.key + '.' + self.token;
      }
    };

    self.log = function (level, message) {
      cons.log(self.key + self.sep + level + self.sep + message);
    };

    self.api = {
      help: function () {
        cons.log(self.name + ' ' + self.version + ' — help :');
        if (!self.key) {
          cons.log('- define a key w/ know.init(key)');
          cons.log('- log to console w/ know.{info,warn,fail}(message)');
        }
      },
      init: function (key) {
        self.key = key || self.base;
        self.token = Date.now();
      },
      info: function (message) {
        self.log(self.level.info, message);
      },
      warn: function (message) {
        self.log(self.level.warn, message);
      },
      fail: function (message) {
        self.log(self.level.fail, message);
      },
      dir: function (obj) {
        cons.log(obj.name + ': ' + obj);
        cons.dir(obj);
      },
      dump: function (obj) {
        self.log(self.level.info, 'dump w/ $' + $.fn.jquery);
        var line;
        $.each(obj, function (key, val) {
          line = (typeof val == 'function') ? 'function' : val;
          cons.log(key + ': ' + line);
        });
      }
    };

    $.extend(self, self.api);
  };

  window.know = new Knowledge();
}, jQuery);
