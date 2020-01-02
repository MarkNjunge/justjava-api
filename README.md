# [WIP] JustJava API

![](https://github.com/MarkNjunge/justjava-api/workflows/test-workflow/badge.svg)
![](https://github.com/MarkNjunge/justjava-api/workflows/deploy-dev-workflow/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/MarkNjunge/justjava-api/badge.svg)](https://snyk.io/test/github/MarkNjunge/justjava-api)

Backend API for [JustJava-Android](https://github.com/MarkNjunge/JustJava-Android).

Live develop branch: https://dev.justjava.store/

Live master branch: https://api.justjava.store/

**[See `develop` branch for latest changes](https://github.com/MarkNjunge/justjava-api/tree/develop)**

## Prerequisites

### PostgreSQL

Used to store the API's data.

1. Create a PostgreSQL database and get the url in the form `postgres://username:password@host:port/database`;

### Redis

Used to store sessions.

1. Create a Redis instance and get the url in the form `redis://:password@host:port/0`

### Firebase

Used for notifications.

1. Create a project on the [Firebase console](https://console.firebase.google.com)
2. Create and download a [service account key](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
3. Upload it to a public url.

### GCP Project (optional)

Used for Google Sign In.

1. Create an project on [GCP](https://console.cloud.google.com/projectcreate).
2. Create [OAuth client ID credentials](https://console.cloud.google.com/apis/credentials) with "Web Application" as the application type.
3. Take note of the client ID.

### Cloudinary (optional)

Used for image upload.

1. Create a [Cloudinary Account](https://cloudinary.com/users/register/free).
2. Get the "Cloud name", "API Key" and "API Secret" from the [console](https://cloudinary.com/console).

### Safaricom Developer Account (optional)

Used for M-Pesa payments

1. Create an account on [Daraja](https://developer.safaricom.co.ke/).
2. Create an app.
3. Get the `consumerKey` and `consumeSecret`.

### Ravepay Sandbox Account (optional)

Used for card payments

1. Create an account and business on [Ravepay **sandbox**](https://ravesandbox.flutterwave.com/signup)

2. Go to [API settings](https://ravesandbox.flutterwave.com/dashboard/settings/apis) and get the pubnlic key and secret key.

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

## Docker

Build docker images

```
docker build -t justjava-api .
```

or use docker-compose

```
docker-compose up -d
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
