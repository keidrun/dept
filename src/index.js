#!/usr/bin/env node
const yargs = require('yargs');
const cmds = require('./cmds');

const argv = yargs // eslint-disable-line
  .usage('Usage: $0 <command> [options]')
  .command({
    command: 'list',
    aliases: ['ls'],
    describe: 'show all templates',
  })
  .command({
    command: 'show [templateName]',
    aliases: ['s'],
    describe: 'show a template in details',
  })
  .command({
    command: 'default [templateName]',
    aliases: ['df'],
    describe: 'use a template by default',
  })
  .command({
    command: 'install [templateName]',
    aliases: ['i'],
    describe: 'install dependencies and config files from a template',
  })
  .command({
    command: 'add [templateName]',
    aliases: ['a'],
    describe: "add a template with '--data' or '--file' options",
  })
  .command({
    command: 'remove [templateName]',
    aliases: ['r'],
    describe: 'remove a template',
  })
  .command({
    command: 'rename [templateName] [newTemplateName]',
    aliases: ['mv'],
    describe: 'rename a template name',
  })
  .option('yarn', {
    describe: "use 'yarn' instead of 'npm'",
    alias: 'y',
    default: false,
  })
  .option('init', {
    describe: "initialize 'package.json'",
    alias: 'i',
    default: false,
  })
  .option('data', {
    alias: 'd',
    describe: "specify a JSON data string with 'add' command",
    type: 'string',
  })
  .option('file', {
    alias: 'f',
    describe: "specify a JSON template file with 'add' command",
    type: 'string',
  })
  .help()
  .alias('help', 'h')
  .alias('version', 'v').argv;

const command = argv._[0];

if (command === 'list' || command === 'ls') {
  cmds.list();
} else if (command === 'show' || command === 's') {
  cmds.show(argv.templateName);
} else if (command === 'default' || command === 'd') {
  cmds.setDefault(argv.templateName);
} else if (command === 'install' || command === 'i') {
  cmds.install(argv.templateName, argv.init, argv.yarn);
} else if (command === 'add' || command === 'a') {
  if (argv.data) {
    cmds.add(argv.templateName, argv.data);
  } else if (argv.file) {
    cmds.addFromFile(argv.templateName, argv.file);
  } else {
    console.log("Specify --data or --file options with 'add'");
  }
} else if (command === 'remove' || command === 'r') {
  cmds.remove(argv.templateName);
} else if (command === 'rename' || command === 'mv') {
  cmds.rename(argv.templateName, argv.newTemplateName);
} else if (command) {
  console.log(`Not such a command: '${command}'`);
} else {
  yargs.showHelp();
}

process.on('unhandledRejection', console.error.bind(console));
