var fs = require('fs');
var path = require('path');

module.exports = function(options) {
  console.log(options);
  var questions = [];

  if (!options.framework || !options.framework.match(/(face|man|monkey)s*/)) {
    questions.push({
      type: 'list',
      name: 'framework',
      message: 'What are you Create today?',
      default: 'face',
      choices: [{
      //   name: 'A face',
      //   value: 'face'
      // }, {
        name: 'A man',
        value: 'man'
      }, {
        name: 'A monkey',
        value: 'monkey'
      }]
    });
  }

  if (!options.directory) {
    questions.push({
      type: 'input',
      name: 'directory',
      message: 'What\'s the project called? (no spaces)',
      validate: function(input) {
        var folder = path.join(process.cwd(), input);
        if (fs.existsSync(folder)) {
          return 'There\'s already a folder with that name in this directory.';
        }
        if (input.indexOf(" ") != -1) {
          return "The project name should not contain any spaces.";
        }
        return true;
      }
    });
  }

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Which face would you like to use?',
      default: 'face',
      choices: [{
        name: 'Basic face',
        value: 'face'
      }, {
        name: 'ZURB face',
        value: 'face2'
      }],
      when: function(answers) {
        return answers.framework === 'face' || options.framework === 'face';
      }
    });
  }

  return questions;
}
