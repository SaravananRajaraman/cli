var colors       = require('colors')
var multiline    = require('multiline');
var paint        = require('paint-by-number');
var stringLength = require('string-length');

var family = {
  man : multiline(function(){/*

              /***\
             /-----\
            }(*) (*){
     ||---\   |(-)|   /---||
           \---------/
            \-------/
             \-----/
              |   |
             |     |
           _|       |_
          |_|       |_|

  */}),

  monkey : multiline(function(){/*

               /***\
              /-----\
      _      }(*) (*){      _
     |_|---\   |(-)|   /---|_|
            \---------/
             \-------/
              \-----/
               |   | \
              |     | \__/
            _|       |_
           |_|       |_|

  */})

};
var colors = {
  man : multiline(function(){/*

              /***\
             /-----\
            }(*) (*){
     ||---\   |(-)|   /---||
           \---------/
            \-------/
             \-----/
              |   |
             |     |
           _|       |_
          |_|       |_|

  */}),

  monkey : multiline(function(){/*

               /***\
              /-----\
      _      }(*) (*){      _
     |_|---\   |(-)|   /---|_|
            \---------/
             \-------/
              \-----/
               |   | \
              |     | \__/
            _|       |_
           |_|       |_|

  */})

};
var palette = {
  0: 'grey',
  1: 'cyan',
  2: 'magenta',
  3: 'yellow'
}

module.exports = mascot;

// This function takes an array of text messages and places them next to the ASCII mascot
function mascot(mascot, text) {
  if (!mascot.match(/^(man|monkey|face|face2|face3)$/)) {
    mascot = 'men';
  }
  if (typeof text === 'string') {
    text = text.split('\n');
  }

  var colorScheme = colors[mascot].split('\n');

  // The mascot image is split into an array of lines, and colored
  var yeti = family[mascot];
  yeti = yeti.split('\n');
  yeti = paint(yeti, colorScheme, palette);

  // Distance between the mascot and the text
  var baseTextOffset = 5;
  // Number of lines in the mascot image
  var yetiHeight  = yeti.length - 1;
  // Number of lines in the message
  var textHeight  = text.length;
  // Vertical offset for message
  var textOffset  = Math.floor((yetiHeight - textHeight) / 2);
  // Longest line length in the mascot image
  var longestLine = getLongestLine(yeti);

  // Prepend a newline to each line of the mascot image
  for (var i in yeti) {
    yeti[i] = '\n ' + yeti[i];
  }

  // Append each line of the text message to the mascot image
  for (var i = 0; i < text.length; i++) {
    var offset = textOffset + i;
    var newLine = i > 0 ? '\n' : '';
    var spaceCount = longestLine - stringLength(yeti[offset]) + baseTextOffset;

    yeti[offset] = yeti[offset] + repeatChar(' ', spaceCount) + text[i];
  }

  return yeti.join('') + '\n';
}

// Find the longest line in an array of strings
function getLongestLine(yeti) {
  var highest = 0;
  for (var i = 0; i < yeti.length; i++) {
    var len = stringLength(yeti[i]);
    if (len > highest) highest = len;
  }
  return highest;
}

// Thank you: http://stackoverflow.com/a/5450113/492553
function repeatChar(pattern, count) {
  if (count < 1) return '';
  var result = '';
  while (count > 1) {
    if (count & 1) result += pattern;
    count >>= 1, pattern += pattern;
  }
  return result + pattern;
}
