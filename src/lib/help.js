import chalk from 'chalk'

export default function help() {
  console.log(`
  ${chalk.bold('binit')} [options] <input>
  ${chalk.dim('Options:')}
    --app                define app name
    -h, --help           output usage information
    -v, --version        output binit version
    -g, --git            automatically initialize git
    -y, --yes            skip prompts but it is necessary to pass the name of the app 
    -i, --install        automatically install dependencies
  `);
}