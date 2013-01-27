var assert = require('assert'),
  ged = require('../lib/gedcom.js');

ged.parse('test/Case002-Repositories.ged', function(e) {
  console.log(e);
  assert.equal(e.children.length, 10);
});
