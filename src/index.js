import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import chalk from 'chalk';
import Listr from 'listr';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { projectInstall } from 'pkg-install';

import { initGit } from './lib/git';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function createProject(options) {
  const currentFileUrl = import.meta.url;

  options.targetDirectory = path.resolve(
    options.targetDirectory || process.cwd(), 
    options.appName
  );

  const templateDir = path.resolve(
    fileURLToPath(currentFileUrl),
    '../../templates',
    options.template.toLowerCase()
  );

  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Initialize git',
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: 'Install dependencies',
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.runInstall
          ? 'Pass --install to automatically install dependencies'
          : undefined,
    },
  ]);
  
  await tasks.run();

  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}