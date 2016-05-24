var async    = require('async');
var bower    = require('bower');
var colors   = require('colors');
var exec     = require('child_process').exec;
var fs       = require('fs');
var inquirer = require('inquirer');
var isRoot   = require('is-root');
var npm      = require('npm');
var path     = require('path');
var rimraf   = require('rimraf');
var which    = require('which');
var util     = require('../util');
var EventEmitter = require("events").EventEmitter;
var format   = require('util').format;

module.exports = function(args, options, callback, ee) {
  var projectName, projectFolder, framework, template, messages, directory;
  var tasks = [
    preflight, prompt, drawImg//, gitClone, folderSetup, npmInstall, bowerInstall
  ];

  // Each function below is executed in order
  async.series(tasks, finish);

  // 1. Check that the process isn't root, and that Git is installed
  function preflight(cb) {
    if (isRoot()) {
      console.log(util.mascot('face', util.messages.noRoot));
      process.exit(1);
    }

    which('git', function(er) {
      if (er) {
        console.log(util.messages.gitNotInstalled);
        process.exit(69);
      }
      cb();
    });
  }

  // 2. Find out what the user wants to do
  function prompt(cb) {
    inquirer.prompt(util.questions(options), function(answers) {
      // The variables we need either came from the prompts, or the console arguments
      projectName = answers.directory || options.directory;
      framework = answers.framework || options.framework;
      template = answers.template || options.template || null;
      projectFolder = path.join(process.cwd(), projectName);
      messages = util.messages(projectName);

      cb();
    });
  }

  function drawImg(cb){
    var hello = formatHello(messages.helloYeti, framework);
    console.log(util.mascot(framework, hello));
  }

  // 7. Finish the process with a status report
  function finish(err, results) {
    // Indexes 4 and 5 of results are the npm/Bower statuses
    // All the rest should be undefined
    console.log(results);

    var allGood = results.indexOf(false) === -1;

    if (allGood)
      console.log(messages.installSuccess);
    else
      console.log(messages.installFail);

    console.log(messages.gitCloneSuccess);

    if (results[4])
      console.log(messages.npmSuccess);
    else
      console.log(messages.npmFail);

    if (results[5])
      console.log(messages.bowerSuccess);
    else if (fs.existsSync('bower.json'))
      console.log(messages.bowerFail);

    if (allGood)
      console.log(messages.installSuccessFinal);
    else
      console.log(messages.installFailFinal);

    if (typeof(callback)!=='undefined') callback();
  }

}



function formatHello(str, framework) {
  framework = framework.charAt(0).toUpperCase() + framework.slice(1)
  str = str.join('\n');
  str = str.replace('%s', framework);
  return str.split('\n');
}
