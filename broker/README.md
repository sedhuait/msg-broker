# Basic message broker implementation

 - implemented a message queue using linked list with ordering / read receipts acknowledgement.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker Deploy

Build the image
`docker build -t msg-broker:latest .`

Start the container
`docker run -d -p 80:3000 --rm --name msg-broker-1  msg-broker:latest `
