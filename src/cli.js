import { createProject } from '.';
import { parseArgumentsIntoOptions, promptForMissingOptions } from './lib/inquirer'

export async function cli(args) {
 let options = parseArgumentsIntoOptions(args);
 options = await promptForMissingOptions(options);

 await createProject(options);
}