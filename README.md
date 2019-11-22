# [WIP] JustJava API

![](https://github.com/MarkNjunge/justjava-api/workflows/Main%20Workflow/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/MarkNjunge/justjava-api/badge.svg)](https://snyk.io/test/github/MarkNjunge/justjava-api)

Backend API for [JustJava-Android](https://github.com/MarkNjunge/JustJava-Android).

Live develop branch: https://api-dev.justjava.marknjunge.com/

Live master branch: https://api.justjava.marknjunge.com/

**[See `develop` branch for latest changes](https://github.com/MarkNjunge/justjava-api/tree/develop)**

## Prerequisites

### PostgreSQL

Used to store the API's data.

1. Create a PostgreSQL database and get the url in the form `postgres://username:password@host:port/database`;

### Redis

Used to store sessions.

1. Create a Redis instance and get the url in the form `redis://:password@host:port/0`

### GCP Project (optional)

Used for Google Sign In.

1. Create an project on [GCP](https://console.cloud.google.com/projectcreate).
2. Create [OAuth client ID credentials](https://console.cloud.google.com/apis/credentials) with "Web Application" as the application type.
3. Take not of the client ID.

### Cloudinary (optional)

Used for image upload.

1. Create a [Cloudinary Account](https://cloudinary.com/users/register/free).
2. Get the "Cloud name", "API Key" and "API Secret" from the [console](https://cloudinary.com/console).

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

5. Go to `/docs` to view routes documentation.

http://localhost:3000/docs

## Testing

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
