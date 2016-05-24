var colors = require('colors');

var helpText = {
  // Each command is an array of strings
  // To print the command, the array is joined into one string, and a line break is added
  // between each item. Basically, each comma you see becomes a line break.
  'default': [
    'Commands:',
    '  info'.cyan + '      Show, Who is creator ?',
    '  new'.cyan + '       Create a what you want',
    '  -v'.cyan + '        Display the CLI\'s version',
    '',
    'To learn more about a specific command, type ' + 'creator help <command>'.cyan,
    '',
    'Need more help? Ask a question on the creator Forum: ' + 'Coming soon'.cyan
  ],
  'info':[
    'Nothing to say'.red
  ],
  'new':[
    'type the following command'.green,
    'creator new'.inverse
  ]
}

module.exports = function(args, options) {
  var say;
  if (typeof args === 'undefined' || args.length === 0) {
    say = 'default'
  }
  else {
    say = args[0]
  }
  // A line break is added before and after the help text for good measure
  say = '\n' + helpText[say].join('\n') + '\n\n'

  process.stdout.write(say);
}
