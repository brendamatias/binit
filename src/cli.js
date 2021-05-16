import { createProject } from '.';
import { parseArgumentsIntoOptions, promptForMissingOptions } from './lib/inquirer'

import help from './lib/help';

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);

  if(options.help) {
    return help();
  }
  
  options = await promptForMissingOptions(options);

  await createProject(options);
}