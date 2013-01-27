;(function() {
  "use strict";

  var VERSION = '0.0.1',
    Lazy = require('lazy'),
    fs = require('fs'),
    Gedcom = {
      parse : function(file, cb) {
        var element_list = [],
          element_dict = {},
          element_top = formatLine("-1 TOP"),
          lastElement = element_top;
        new Lazy(fs.createReadStream(file))
          .lines
          .map(String)
          .forEach(function(line){
            var element = formatLine(line.trim());
            element_list.push(element)
            if ( element.id ) {
              element_dict[element.id] = element;
            }
            lastElement = parseLine(element, lastElement);
          })
          .join(function() {
            cb(element_top);
          });
      },
    };

/*************************************
/* Private Functions
/*************************************/
function parseLine(element, lastElement) {
  var parent_elem = lastElement;
  while ( parent_elem.level > element.level - 1 ) {
    parent_elem = parent_elem.parent;
  }

  parent_elem.children.push(element);
  element.parent = parent_elem;
  return element
}

function formatLine(line) {
  var split = line.split(' '),
    obj = { 
      level : split.shift(),
      children : []
    },
    tmp = split.shift();

  if ( tmp.charAt(0) == '@' ) {
    // line contains an id
    obj.id = tmp;
    tmp = split.shift();
  }

  obj.tag = tmp;
  if ( split.length > 0) {
    obj.value = split.join(' ');
  }
  return obj;
}


/*************************************
/* Exports
/*************************************/
module.exports = Gedcom;
module.exports.VERSION = VERSION

}).call(this);
