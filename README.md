# dept

Dependencies templates management CLI to install your fixed NPM dependencies and cofing files.

## Usage

```bash
$ dept -h
Usage: dept <command> [options]

Commands:
  dept list                    show all templates                  [aliases: ls]
  dept show [templateName]     show a template in details           [aliases: s]
  dept default [templateName]  use a template by default           [aliases: df]
  dept install [templateName]  install dependencies and config files from a
                                   template                         [aliases: i]
  dept add [templateName]      add a template with '--data' or '--file'
                                   options                          [aliases: a]
  dept remove [templateName]   remove a template                    [aliases: r]

オプション:
  --version, -v  Show version                                          [boolean]
  --yarn, -y     use 'yarn' instead of 'npm'                    [default: false]
  --init, -i     initialize 'package.json'                      [default: false]
  --data, -d     specify a JSON data string with 'add' command          [string]
  --file, -f     specify a JSON template file with 'add' command        [string]
  --help, -h     Show help                                             [boolean]
```
