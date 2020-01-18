# Builder image
FROM node:12.14.1-alpine3.9 as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

# Final image
FROM node:12.14.1-alpine3.9

WORKDIR /app

COPY dist /app
COPY config config

COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules node_modules

CMD [ "node", "main.js" ]
