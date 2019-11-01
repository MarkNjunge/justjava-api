# [WIP] JustJava API

![](https://github.com/MarkNjunge/justjava-api/workflows/Main%20Workflow/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/MarkNjunge/justjava-api/badge.svg)](https://snyk.io/test/github/MarkNjunge/justjava-api)

Backend API for [JustJava-Android](https://github.com/MarkNjunge/JustJava-Android).

Live develop branch: https://api-dev.justjava.marknjunge.com/
Live master branch: https://api.justjava.marknjunge.com/

## Installation

1. Clone the repository

```bash
$ git clone https://github.com/MarkNjunge/justjava-api.git
```

2. Make a `./config/local.json` or `./.env` file for configuration. See the variable mappings [./config/custom-environment-variables.json](./config/custom-environment-variables.json).

```bash
$ cp ./config/default.json ./local.json
```

3. Install dependencies

```bash
$ yarn install
```

4. Start the server

```bash
$ yarn run start

# watch mode
$ yarn run start:dev
```

## Testing

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
