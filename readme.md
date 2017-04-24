# FitGit

[![Build Status](https://travis-ci.org/Onset/FitGit.svg?branch=master)](https://travis-ci.org/Onset/FitGit)
[![Appveyor Build Status](https://ci.appveyor.com/api/projects/status/w48htrgwosvd42eq?svg=true)](https://ci.appveyor.com/project/Onset/FitGit)
[![Dependency Status](https://david-dm.org/Onset/FitGit.svg)](https://david-dm.org/Onset/FitGit)

![](./printscreen-projects.png)

Git UI client featuring notifications about new updates in your git repository.

## Development

Install [Node.js](https://nodejs.org/) and then

```bash
$ npm install
```

### Run

```bash
$ npm start
```

### Build

```bash
$ npm run build
```

## Requirements

- Windows
	- [Git client](https://git-scm.com/download/win)
	- For https repositories: [Credential Storage](https://git-scm.com/book/gr/v2/Git-Tools-Credential-Storage) enabled (`git config --global credential.helper`)
	- For ssh: [Pageant](https://winscp.net/eng/docs/ui_pageant) configured

- Linux
	- Git client
	- For https repositories: [Credential Storage](https://git-scm.com/book/gr/v2/Git-Tools-Credential-Storage) enabled (`git config --global credential.helper`)


## Issues

- User is `unknown`
	- Run `git config --global user.name "Your name"`

- E-mail is `unknown@unknown.com`
	- Run `git config --global user.email "you@example.com"`

- Project won't synchronize with the provided remote server
	- Run `git fetch` and follow the instructions
