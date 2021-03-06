'use strict';
const stringUtils = require('ember-cli-string-utils');

// Gathers subclasses of a certain specified base class into a hash.
//
// e.g.:
// Files:
// - ./hamster.js which exports a class of Hamster subclass of Rodent
// - ./parrot.js which exports an instance of Parrot (not a Rodent!)
//
// requireAsHash('./*.js', Rodent):
// {
//   Hamster: Hamster // Same as require('./hamster.js')
// }

const globSync = require('glob').sync;
const path = require('path');
const getCallerFile = require('get-caller-file');

module.exports = requireAsHash;
function requireAsHash(pattern, type) {
  let callerFileDir = path.dirname(getCallerFile());
  return globSync(pattern, { cwd: callerFileDir }).reduce((hash, file) => {
    const klass = require(`${callerFileDir}/${file}`);
    if (!type || klass.prototype instanceof type) {
      hash[stringUtils.classify(path.basename(file, '.js'))] = klass;
    }
    return hash;
  }, {});
}
