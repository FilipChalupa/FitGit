#!/bin/bash

GH_REPO="@github.com/Onset/git-latex.git"
FULL_REPO="https://$GH_TOKEN$GH_REPO"
cd dist
git init
git config user.email "chalupa.filip@gmail.com"
git config user.name "Filip Chalupa"
git add .
git commit -m "Deploy"
git push --force --quiet $FULL_REPO master:package/$TRAVIS_OS_NAME
