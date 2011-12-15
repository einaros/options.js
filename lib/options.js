function Options(defaults) {
  var internalValues = {};
  var values = this.value = {};
  Object.keys(defaults).forEach(function(key) {
    internalValues[key] = defaults[key];
    Object.defineProperty(values, key, {
      get: function() { return internalValues[key]; },
      configurable: false,
      enumerable: true
    });
  });
  this.reset = function() {
    Object.keys(defaults).forEach(function(key) {
      internalValues[key] = defaults[key];
    });
  }
  this.merge = function(options) {
    Object.keys(options).forEach(function(key) {
      if (typeof internalValues[key] !== 'undefined') {
        internalValues[key] = options[key];
      }
    });
  }
  Object.freeze(values);
  Object.freeze(this);
}

module.exports = Options;
