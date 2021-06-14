# JustJava API

![](https://github.com/MarkNjunge/justjava-api/workflows/dev-workflow/badge.svg)
![](https://github.com/MarkNjunge/justjava-api/workflows/release-workflow/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/MarkNjunge/justjava-api/badge.svg)](https://snyk.io/test/github/MarkNjunge/justjava-api)

Backend API for [JustJava-Android](https://github.com/MarkNjunge/JustJava-Android), a mock food ordering and delivery application for a coffee shop.

Latest development: https://dev.justjava.store/

Latest release: https://api.justjava.store/

## Prerequisites

### PostgreSQL

Used to store the API's data.

1. Create a PostgreSQL database
2. Get the url in the form `postgres://username:password@host:port/database`

### Redis

Used to store sessions.

1. Create a Redis instance
2. Get the url in the form `redis://:password@host:port/0`

### Firebase

Used for notifications.

1. Create a project on the [Firebase console](https://console.firebase.google.com)
2. Create and download a [service account key](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
3. Upload it to a public url.

### GCP Project (optional)

Used for Google Sign In and uploading product images.

1. Create a project on [GCP](https://console.cloud.google.com/projectcreate).
2. Take note of the project id.
2. Create [OAuth client ID credentials](https://console.cloud.google.com/apis/credentials) with "Web Application" as the application type.
3. Take note of the client ID.
4. Create [a bucket on Cloud Storage](https://console.cloud.google.com/storage/create-bucket)

### Safaricom Developer Account (optional)

Used for M-Pesa payments

1. Create an account on [Daraja](https://developer.safaricom.co.ke/).
2. Create an app.
3. Get the `consumerKey` and `consumeSecret`.

### JustJava worker (optional)

Used to automatically update the order status when a payment has been completed.

1. Clone the repository [MarkNjunge/justjava-worker](https://github.com/MarkNjunge/justjava-worker)
2. Follow installation instructions.

### Datadog (optional)

Used for logs

1. Create an account on [Datadog](https://app.datadoghq.com/)
2. Create an [API key](https://docs.datadoghq.com/account_management/api-app-keys/)

### Ravepay Sandbox Account (optional)

Used for card payments

1. Create an account and business on [Ravepay **sandbox**](https://ravesandbox.flutterwave.com/signup)

2. Go to [API settings](https://ravesandbox.flutterwave.com/dashboard/settings/apis) and get the pubnlic key and secret key.

### Mailgun (optional)

Used for sending password reset emails. If this is disabled, the token will be returning in the HTTP response.

1. Create an account on [Mailgun](https://www.mailgun.com/) and complete the setup.

2. Create an email template called `reset-password` that has a `name` and `token` parameter.

## Installation

1. Clone the repository

```bash
$ git clone https://github.com/MarkNjunge/justjava-api.git
```

2. Make a `./config/local.json` file based on [`./config/default.json`](./config/default.json).  
   Alternatively, make a `.env` file. See environment variable mappings in [custom-environment-variables.json](./config/custom-environment-variables.json).

```bash
$ cp ./config/default.json ./config/local.json
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
