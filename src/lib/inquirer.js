
import arg from 'arg';
import inquirer from 'inquirer';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '--help': Boolean,
      '--app': String,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
      '-h': '--help',
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false,
    help: args['--help'] || false,
    appName: args['--app'] || '',
  };
}
 
async function promptForMissingOptions(options) {
  const defaultTemplate = 'JavaScript';
 
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }
 
  const questions = [];
 
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['JavaScript', 'TypeScript'],
      default: defaultTemplate,
    });
  }
 
  if (!options.appName) {
    questions.push({
      type: 'input',
      name: 'appName',
      message: 'What is the name of your app?',
      validate: ( value ) => {
        if (value.length) {
          return true;
        } else {
          return 'Please enter app name.';
        }
      }
    });
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false,
    });
  }
 
  const answers = await inquirer.prompt(questions);
 
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    appName: options.appName || answers.appName,
  };
}

 export { parseArgumentsIntoOptions, promptForMissingOptions }