# kplate

#### Front-End boilerplate with GulpJS build system.

"A place to get started."

Automate your web development process with ease! When changes are made to your code, **kplate** automatically compiles SASS, concat & uglifies JavaScript, minifies images & SVGs, and reloads the browser -- all in seconds!

## Features
* Run *Development* and *Production* build environments.
    * By default, *Development* mode will compile your site into a '**dev**' folder that contains unminified JavaScript & CSS (making it easier to debug).
    * By default, *Production* mode will compile your site into a '**prod**' folder that contains minified JavaScript & CSS (optimized for performance).
* Build **configuration file** to change development server port numbers, build destinations, and other build options.
* Starts up a livereload server, so change are immediately apparent on your browser.
* Ruby SASS w/ autoprefixer.
* JavaScript concat and uglify.
* jshint warning and errors to help you write clean JavaScript code.
* Image minification for PNGs, JPGs, and GIFs.
* SVG minification.
* Watches all asset folders and automatically copies those files to their corresponding destination folders.

## Requirements
You will need to following tools for **kplate** to operate. It is preferable that you install NodeJS via Homebrew -- http://brew.sh/

1. **NodeJS** (comes with NPM) -- http://nodejs.org/
2. **Bower** -- http://bower.io/
3. **Ruby** (already installed on Macs)

## Install
To install **kplate**, simply clone this repo, update the configuraton files, and create your own repo instance. 

1. Open terminal, and cd to a location where you'd like to keep your project files:

        cd ~/where/i/want/my/project

2. Clone **kplate**:


        git clone https://github.com/keezoid/kplate.git

3. Install node modules:


        npm install

4. Install bower components:

        bower install

## Current Issues
* Creating new SCSS or JavaScript files will require you to manually restart kplate for those files to be watched.

## Contact Me
If you have questions, comments or concerns, feel free to reach me as follows:

**Website** --- [keenanstaffieri.com](http://keenanstaffieri.com)
**Twitter** --- [@keenode](https://twitter.com/keenode)
