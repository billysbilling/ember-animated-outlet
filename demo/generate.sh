#!/bin/bash

if [ ! -f "src/js/animated-container-view.js" ]; then
    echo "This script must be called from within the ember-animated-outlet folder."
    exit 1
fi

#
echo "Running grunt..."
grunt

#
echo "Preparing temp dir..."
rm -rf temp
mkdir temp
cd temp

#
echo "Cloning git repo..."
git clone git@github.com:billysbilling/ember-animated-outlet.git .
git checkout --orphan gh-pages
git rm -rf .

#
echo "Adding content..."
mkdir demo
mkdir dist
mkdir vendor
cp ../demo/index.html index.html
cp ../demo/style.css demo/style.css
cp ../demo/app.js demo/app.js
cp ../dist/ember-animated-outlet.css dist/ember-animated-outlet.css
cp ../dist/ember-animated-outlet.js dist/ember-animated-outlet.js
cp ../vendor/ember.js vendor/ember.js
cp ../vendor/ember-data.js vendor/ember-data.js
cp ../vendor/handlebars-1.0.rc.3.js vendor/handlebars-1.0.rc.3
cp ../vendor/jquery-1.9.0.js vendor/jquery-1.9.0.js

#
echo "Pushing to GitHub Pages..."
git add -A
git commit -a -m "Generate demo"
git push origin gh-pages

#
echo "Cleaning up..."
cd ..
rm -rf temp