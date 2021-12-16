# SUPERKODERS DevStack

The best DevStack for frontend developers.

## Getting Started

We're very happy with you – our client and also becouse you're using our DevStack. There is short description of SUPERKODERS DevStack.

### Prerequisites

The things you need to install (minimal versions). Ideal is using something like [Node Version Manager](https://github.com/nvm-sh/nvm)

```
node 12.6.0
npm	6.9.0
```

### Installing

It's easy – you need just one command :)

```
$ npm install
```

or run command from next line.

## How To Use

Command `$ npm start` will install or update all dependencies and starts a virtual server at url [http://localhost:3000/](http://localhost:3000/) with browserSync and file watcher. All templates will be automatically compiled (via. file watcher task) and refreshed in browser (via browserSync task) on every change in folder `/src/`.

### Other Commands
```
# command for build production verion of templates
$ npm run build

# command for build compressed templetes with compress to zip file
$ npm run export
```

We have also special task for production version with files watching. Use it carefully.
```
# command for build production verion of templates with file watcher and local server
$ npx gulp minwatch
```

### Directory Structure

1. **src** - Source files folder
	1. **css** – [scss](https://sass-lang.com/)
	1. **img** – Images
	1. **js** – JavaScript
	1. **tpl** – [Nunjucks](https://mozilla.github.io/nunjucks/templating.html)
	1. **fonts** – Webfonts *not required*
1. **tasks** - gulp tasks
1. **.editorconfig** - EditorConfig file
1. **.eslintignore** - ESLint config
1. **.eslintrc** - ESLint config
1. **.gitignore** - GIT ignore file
1. **.npmrc** - NPM config
1. **.stylintrc** - Stylint config
1. **config.js** – DevStack config
1. **gulpfile.js** – Gulp config file
1. **package.json** - NPM dependencies

#### Generated Folders

1. **node_modules** - NPM packages
1. **dist** - Folder with compiled static files

## Author

* **SUPERKODERS** - [www.superkoders.com](https://superkoders.com/) – [support@superkoders.com](support@superkoders.com)
