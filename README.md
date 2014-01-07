# grunt-init-requirejs

> Create a requirejs module with [grunt-init][],.

[grunt-init]: http://gruntjs.com/project-scaffolding

## Installation
If you haven't already done so, install [grunt-init][].

Once grunt-init is installed, place this template in your `~/.grunt-init/` directory. It's recommended that you use git to clone this template into that directory, as follows:

```
git clone git@github.com:PeteAUK/grunt-init-requirejs.git ~/.grunt-init/requirejs
```

_(Windows users, see [the documentation][grunt-init] for the correct destination directory path - %USERPROFILE%/.grunt-init/requirejs)_

## Usage

At the command-line, cd into an empty directory, run this command and follow the prompts.

```
grunt-init requirejs
```

_Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files._

### Grunt Commands

At the command-line, cd into your project directory and run

```
grunt
```

This will build main.js (and all dependencies including almond) into dist/main-build.js

```
grunt dev
```

This will create a local Node.js web server running on http://localhost:9999 (or a different port if specified during set up)