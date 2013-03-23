/**
 * know.js — v0.2.0
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

  window.know = {};

  var Knowledge = function () {
    var cons = window.console;
    var self = this;

    self.name = 'know.js';
    self.version = 'v0.2.0';
    self.sep = '|';

    self.base = 'know';
    self.key = null;
    self.token = null;
    self.id = null;

    self.storage = window.sessionStorage;
    self.popup = 'know-popup';

    self.level = {
      info: 'info',
      warn: 'warn',
      error: 'error'
    };

    self.usage = {
      title: self.name + ' ' + self.version + ' — know.help() :',
      first: '- first define a key w/ know.init(key, store?)',
      secund: '- then log to console w/ know.{info,warn,error}(message)'
    };

    self.store = function (line) {
      var raw = self.storage.getItem(self.name);
      var logs = raw ? $.parseJSON(raw) : {};
      var lines = logs[self.id] || [];

      lines.push(line);
      logs[self.id] = lines;
      self.storage.setItem(self.name, JSON.stringify(logs));
    };

    self.log = function (level, message) {
      var line = self.key + self.sep + level + self.sep + message;
      cons[level](line);
      self.store(line);
    };

    var start = {
      help: function () {
        $.each(self.usage, function (key, val) {
          cons.log(val);
        });
      },
      init: function (key, store) {
        self.key = key || self.base;
        self.token = Date.now();
        self.id = self.base + '.' + self.key;
        self.storage = store ? window.localStorage : window.sessionStorage;
      }
    };

    var logging = {
      info: function (message) {
        self.log(self.level.info, message);
      },
      warn: function (message) {
        self.log(self.level.warn, message);
      },
      error: function (message) {
        self.log(self.level.error, message);
      },
      dir: function (obj) {
        self.log(self.level.info, obj.name + ': ' + obj);
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

    var state = {
      reset: function () {
        self.storage.removeItem(self.name);
        self.storage.setItem(self.name, JSON.stringify({}));
      },
      clear: function () {
        var raw = self.storage.getItem(self.name);
        if ($.parseJSON(raw).hasOwnProperty(self.id)) {
          self.storage.setItem(self.id, JSON.stringify([]));
        }
      }
    };

    $.extend(self, start);
    $.extend(self, logging);
    $.extend(self, state);
  };

  window.know = new Knowledge();
}, jQuery);
