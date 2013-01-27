var assert = require('assert'),
  util = require('util'),
  ged = require('../lib/gedcom.js');

ged.parse('test/Case002-Repositories.ged', function(e) {
  e.simplify();
  console.log(util.inspect(e, false, null, true));
  assert.ok(e.HEAD);
  assert.ok(e.HEAD.SOUR);
  assert.ok(e.HEAD.SOUR.NAME);
  assert.ok(e.HEAD.SOUR.VERS);
  assert.equal(e.HEAD.SOUR.NAME.value, "MyCorporation Gedcom Generator");
  assert.equal(e.HEAD.SOUR.VERS.value, "5.2.18.0");
  assert.ok(e.REPO);
  assert.ok(e.INDI);
  assert.ok(e.SUBM);
});
