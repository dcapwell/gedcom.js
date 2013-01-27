(function() {
  "use strict";

  var VERSION = '0.0.1',
    Lazy = require('lazy'),
    fs = require('fs'),
    Gedcom = {
      parse : function(file, cb) {
        var element_top = formatLine("-1 TOP"),
          lastElement = element_top;
        new Lazy(fs.createReadStream(file)).lines.map(String).forEach(function(line){
            var element = formatLine(line.trim());
            lastElement = parseLine(element, lastElement);
          }).join(function() {
            cb(element_top);
          });
      }
    };

/*************************************
/* Private Functions
/*************************************/
function parseLine(element, lastElement) {
  var parent_elem = lastElement;
  while ( parent_elem.level > element.level - 1 ) {
    parent_elem = parent_elem.parent;
  }

  var tag = parent_elem[element.tag];
  if (tag instanceof Array) {
    tag.push(element);
  } else if( tag ) {
    parent_elem[element.tag] = [tag, element];
  } else {
    parent_elem[element.tag] = element;
  }
  // parent_elem.children.push(element);
  element.parent = parent_elem;
  return element;
}

function Row(level, id, tag, value) {
  if(level) this.level = level;
  if(id) this.id = id;
  if(tag) this.tag = tag;
  if(value) this.value = value;
}

Row.prototype.simplify = function() {
  delete this.parent;
  delete this.id;
  delete this.level;
  delete this.tag;
  for(var key in this) {
    var value = this[key];
    if ( value instanceof Array ) {
      value.map(function(e) {
        if(e.simplify) {
          e.simplify();
        } 
      });
    } else {
      if(value.simplify) {
        value.simplify();
      } 
    }
  }
  // delete this.simplify();
};

function formatLine(line) {
  var split = line.split(' '),
      level = split.shift(),
      tmp = split.shift(),
      id = null,
      tag = null,
      value = null;

  if ( tmp.charAt(0) == '@' ) {
    // line contains an id
    id = tmp;
    tmp = split.shift();
  }

  tag = tmp;
  if ( split.length > 0) {
    value = split.join(' ');
    if ( value.match(/@[^@]+@/)) {
      // contains a reference...
      // Family Tree Legends seems to put id in value some times, other times it will put it in id location...
      id = value;
      value = null;
    }
  }
  return new Row(level, id, tag, value);
}


/*************************************
/* Exports
/*************************************/
module.exports = Gedcom;
module.exports.VERSION = VERSION;
})();
