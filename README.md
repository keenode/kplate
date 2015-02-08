# kplate

**v0.4.0**

#### Front-End boilerplate with GulpJS build system.

"A place to get started."

Automate your web development process with ease! When changes are made to your code, **kplate** automatically compiles SASS, concat & uglifies JavaScript, minifies images & SVGs, and reloads the browser -- all in seconds!

## Features
* Run *Development* and *Production* build environments:
    * By default, *Development* mode will compile your site into a '**dev**' folder that contains unminified JavaScript & CSS (making it easier to debug).
    * By default, *Production* mode will compile your site into a '**prod**' folder that contains minified JavaScript & CSS (optimized for performance).
* Build **configuration file** to change development server port numbers, build destinations, and other build options.
* Starts up a **livereload server**, so changes are immediately apparent on your browser.
* Ruby **SASS** w/ **autoprefixer**.
* **JavaScript concat and uglify**.
* **jshint** warnings and errors to help you write clean JavaScript code.
* **Image minification** for PNGs, JPGs, and GIFs.
* **SVG minification**.
* Watches all asset folders and automatically copies those files to their corresponding destination folders.
* Powerful **Bourbon** mixin library preinstalled -- http://bourbon.io/
* Uses the **Neat grid framework** -- http://neat.bourbon.io/

## Requirements
You will need to following tools for **kplate** to operate. It is preferable that you install NodeJS via Homebrew -- http://brew.sh/

1. **NodeJS** (comes with NPM) -- http://nodejs.org/
2. **Bower** -- http://bower.io/
3. **Ruby** (already installed on Macs)

## Install
To install **kplate**, simply clone this repo, update the configuration files, and create your own repo instance. 

1. Open terminal and cd to a location where you'd like to keep your project files:

        cd ~/where/i/want/my/project

2. Clone **kplate** and cd to it:


        git clone https://github.com/keezoid/kplate.git
        cd kplate

3. Install node modules:


        npm install

4. Install bower components:

        bower install

5. Run `gulp` -- this will start **kplate** in development mode.

6. Navigate to http://localhost:8000 and you should see a default 'My Kplate' index page. You are now ready to start coding!

## Commands

* `gulp`
    Start **kplate** in *development* mode. This will launch a node server on port 8000 with unminified CSS & JavaScript.

* `gulp prod`
    Start **kplate** in *production* mode. This will launch a node server on port 8000 with minified and concatenated CSS & JavaScript. Image minification will be at a higher optimization level.

* `gulp build:dev`
    Simply builds the `dev` folder and does not launch a server.

* `gulp build:prod`
    Simply builds the `prod` folder and does not launch a server.

* `gulp serve:dev`
    Starts up a server that hosts the development directory on localhost:8000.

* `gulp serve:prod`
    Starts up a server that hosts the production directory on localhost:8000.

## Recommendations
* It is recommended that you update properties on both `package.json` and `bower.json` files to reflect your current project.
* If you are using git on your project, you can remove the hidden .git folder and run `git init` to start your own repository.
* You should update `/src/rootfiles/humans.txt` with your information.

## Warnings
* Never, ever, add new files or make changes to anything within either of the destination folders (`dev` and `prod` by default). **These folders and removed and regenerated when kplate starts, for fresh clean builds**.
* Be sure to copy over all of the hidden files if you are moving these files to your own project. The .bowerrc file is especially essential.

## Contact Me
If you have questions, comments or concerns, feel free to reach me as follows:

**Website** --- [keenanstaffieri.com](http://keenanstaffieri.com)

**Twitter** --- [@keenode](https://twitter.com/keenode)
