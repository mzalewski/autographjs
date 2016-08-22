var Autograph = require('./autograph');

module.exports = new Autograph();
module.exports.create = function() { return new Autograph(); };
