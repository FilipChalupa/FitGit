# Kolaborativní práce v Latex přes Git (Work in progress!) [![Build Status](https://travis-ci.org/Onset/git-latex.svg?branch=master)](https://travis-ci.org/Onset/git-latex) [![Build status](https://ci.appveyor.com/api/projects/status/w48htrgwosvd42eq/branch/master?svg=true)](https://ci.appveyor.com/project/Onset/git-latex/branch/master)


## Závislosti

- [Node.js](https://nodejs.org/)

## Instalace

```bash
npm install
cd app
npm install
cd ..
```

## Spuštění pro vývoj

```bash
npm start
```

## Zabalení aplikace pro deploy

```bash
npm run pack
```

## Předpřipravené balíčky s aktuálním buildem aplikace

S pushem do masteru se automaticky spouští buildy na Travis CI a AppVeyor. Hotové balíčky jsou k nalezení ve větvích s prefixem `package/`. Tedy například aktuální build pro Windows je zde: https://github.com/Onset/git-latex/tree/package/windows

## Dokument

https://github.com/Onset/git-latex-document
