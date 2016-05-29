/*!
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var fs = require('fs');

function Options(defaults, destroymethodname) {
  var internalValues = {};
  var values = this.value = {};
  var destroy  = (function (self) {
    return function () {
      var v;
      internalValues = null;
      for(n in values) {
        if (values.hasOwnProperty(n)) {
          v = values[n];// = null;
        }
      }
      values = null;
      defaults = null;
      destroymethodname = null;
      self.reset = null;
      self.merge = null;
      self.copy = null;
      self.read = null;
      self.isDefined = null;
      self.isDefinedAndNonNull = null;
      self.destroy = null;
      self = null;
    };
  })(this);
  Object.keys(defaults).forEach(function(key) {
    internalValues[key] = defaults[key];
    Object.defineProperty(values, key, {
      get: function() { 
        if (internalValues) {
          return internalValues[key];
        } else {
          key = null;
        }
      },
      configurable: false,
      enumerable: true
    });
  });
  if (destroymethodname) {
    values[destroymethodname] = destroy;
  }
  this.reset = function() {
    Object.keys(defaults).forEach(function(key) {
      internalValues[key] = defaults[key];
    });
    return this;
  };
  this.merge = function(options, required) {
    options = options || {};
    if (Object.prototype.toString.call(required) === '[object Array]') {
      var missing = [];
      for (var i = 0, l = required.length; i < l; ++i) {
        var key = required[i];
        if (!(key in options)) {
          missing.push(key);
        }
      }
      if (missing.length > 0) {
        if (missing.length > 1) {
          throw new Error('options ' +
            missing.slice(0, missing.length - 1).join(', ') + ' and ' +
            missing[missing.length - 1] + ' must be defined');
        }
        else throw new Error('option ' + missing[0] + ' must be defined');
      }
    }
    Object.keys(options).forEach(function(key) {
      if (key in internalValues) {
        internalValues[key] = options[key];
      }
    });
    options = null;
    return this;
  };
  this.copy = function(keys) {
    var obj = {};
    Object.keys(defaults).forEach(function(key) {
      if (keys.indexOf(key) !== -1) {
        obj[key] = values[key];
      }
    });
    return obj;
  };
  this.read = function(filename, cb) {
    if (typeof cb == 'function') {
      var self = this;
      fs.readFile(filename, function(error, data) {
        if (error) return cb(error);
        var conf = JSON.parse(data);
        self.merge(conf);
        self = null;
        cb();
      });
    }
    else {
      var conf = JSON.parse(fs.readFileSync(filename));
      this.merge(conf);
    }
    cb = null;
    return this;
  };
  this.isDefined = function(key) {
    return typeof values[key] != 'undefined';
  };
  this.isDefinedAndNonNull = function(key) {
    return typeof values[key] != 'undefined' && values[key] !== null;
  };
  this.destroy = destroy;
  Object.freeze(values);
  Object.freeze(this);
}

module.exports = Options;
