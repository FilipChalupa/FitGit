# Kolaborativní práce v Latex přes Git

## Závislosti

- [Node.js](https://nodejs.org/)
- [Mango-cli](http://mangocli.org/)

## Instalace

```bash
npm install
cd views
npm install -g mango-cli
mango install
cd ..
```

## Spuštění pro vývoj

```bash
cd views
mango build
cd ..
npm start
```

## Zabalení aplikace pro deploy

```bask
npm run pack
```
