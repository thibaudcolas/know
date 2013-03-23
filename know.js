/**
 * know.js — v0.5.0
 * ---------------------------------------------------------------------
 * A simple tool to log stuff inside the console and beyond.
 * © 2013 @ThibWeb Released under the MIT and GPL Licenses.
 */
s
(function (factory, $) {
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

    /**
     * Parameters !
     * ---------------------------------------------------------------------
     * Ordered as follows :
     * - The ones that are consts.
     * - The ones that will be set w/ init.
     * - The ones that rule the pop-up.
     * - The ones that manage the gist creation.
     * - The log levels.
     * - The usage instructions.
     */

    self.name = 'know.js';
    self.version = 'v0.5.0';
    self.sep = '|';
    self.base = 'know';

    self.key = null;
    self.token = null;
    self.id = null;
    self.storage = window.sessionStorage;

    self.popup = {
      id: 'know-popup',
      title: self.name + ' ' + self.version + ' — know.show() :',
      css: {
        border: '1px solid DarkSlateGray',
        outline: '1px dashed LightSteelBlue',
        position: 'absolute',
        'z-index': '1001',
        top: '25%',
        right: '1%',
        'max-height': '50%',
        'max-width' : '30%',
        padding: '5px',
        overflow : 'scroll'
      }
    };

    self.gist = {
      url: 'https://api.github.com/gists',
      confirm: 'Upload logs to gist.github.com ?',
      description: 'Log file generated w/ ' + self.name + ' ' + self.version,
      'public': false,
      ext: '.json'
    };

    self.level = {
      info: 'info',
      warn: 'warn',
      error: 'error'
    };

    self.usage = {
      title: self.name + ' ' + self.version + ' — know.help() :',
      first: '- first define a key w/ know.init(key, store?)',
      secund: '- then log to console w/ know.{info,warn,error}(message)',
      third: '- your logs are stored w/ (store? local : session) + Storage',
      fourth: '- view your logs w/ know.show() - close.on(mouseleave)',
      fifth: '- share your logs w/ know.share() as GitHub gists',
      sixth: '- bookmarklet: javascript:{know.show();};void(0);'
    };

    /**
     * Functions !
     * ---------------------------------------------------------------------
     * Ordered as follows :
     * - The low-level ones, basic functionality.
     * - The starters, good to call once in a while.
     * - The logging API.
     * - The ones that manage the storage.
     * - The ones that display our logs.
     */

    self.stamp = function () {
      var now = new Date();
      var min = now.getMinutes();
      min = min < 10 ? '0' + min : min;
      var sec = now.getSeconds();
      sec = sec < 10 ? '0' + sec : sec;
      return min + ':' + sec;
    };

    self.store = function (line) {
      var raw = self.storage.getItem(self.name);
      var logs = raw ? $.parseJSON(raw) : {};
      var lines = logs[self.id] || [];

      lines.push(self.stamp() + self.sep + line);
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
          cons.log(' ' + key + ': ' + line);
          self.store(' ' + key + ': ' + line);
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
        var logs = $.parseJSON(raw);
        if (logs.hasOwnProperty(self.id)) {
          logs[self.id] = [];
          self.storage.setItem(self.name, JSON.stringify(logs));
        }
      }
    };

    var ui = {
      show: function () {
        var $display = $('<div id="' + self.popup.id + '">');
        $display.css(self.popup.css);
        var title = '<h6>' + self.popup.title + '</h6>';

        var raw = self.storage.getItem(self.name);
        var logs = raw ? $.parseJSON(raw) : {};
        var list = '<ul style="list-style-type: none;">';
        $.each(logs, function (key, val) {
          for (var i = 0; i < val.length; i++) {
            list += '<li><code>' + val[i] + '</code></li>';
          }
        });
        list += '</ul>';

        $display.html(title + list);
        $(document.body).append($display);

        $display.mouseleave(function () {
          $(this).fadeOut(100);
        });
      },
      share: function () {
        var confirm = window.confirm(self.gist.confirm);
        var raw = self.storage.getItem(self.name);
        if (confirm && raw) {
          var data = {
            'public': self.gist['public'],
            description: self.gist.description
          };
          data.files = {};
          data.files[self.id + self.gist.ext] = {
            content: raw
          };
          $.ajax({
            type: 'POST',
            dataType: 'json',
            url: self.gist.url,
            data: JSON.stringify(data),
            success: function (data) {
              var link = '<a href="' + data.html_url + '">' + data.html_url + '</a>';
              self.log(self.level.info, 'upload to ' + link);
              window.alert(data.html_url);
            }
          });
        }
      }
    };

    /**
     * Extend !
     * ---------------------------------------------------------------------
     * Everything falls into places.
     */

    $.extend(self, start);
    $.extend(self, logging);
    $.extend(self, state);
    $.extend(self, ui);
  };

  /**
   * Indeed, know.js brings new knowledge.
   */
  window.know = new Knowledge();
}, jQuery);
