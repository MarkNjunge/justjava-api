# 1.4.0

- Add [helmet](https://helmetjs.github.io/).
- Fix logging request data
- Change validation response format
- Set to Node 14.15.3

# 1.3.0

- Fix logging request/response bodies while removing sensitive parameters.

# 1.2.3

- Prevent checking for `session-id` header in `/orders/verify`

# 1.2.2

- Fix bug with authentication (1a89bf3)  
  `removeSensitiveParams(data)` has a side effect of modifying the response body.
  This causes "session-id" returned during login to change to "REDACTED",
  making authentication fail.

# 1.2.1

- Improve logging

# 1.2.0

- Update images endpoint to be under /admin
- Remove mobile number requirement
- Remove restriction to pay using the initial payment method
- Add endpoint to change payment method
- Change order to confirmed after payment is compelted
- Update card payments endpoints
  - Add endpoint to check card verification method
  - Add endpoint for address verified cards
  - Deprecate payments/card/initiate
- Save notifications to db
- Add admin api to update order status
- Add auto-updating of order status
- Periodically check status of pending M-Pesa payments

# 1.1.1

- Ignore ETIMEDOUT error from IoRedis.

  Error still occurs when connection is successful.

# 1.1.0

- Create smaller dockerfiles

- Use db migrations iinstead of synchronize

- Add endpoint to change password

- Add password reset via email

- Add reconnect strategy to redis

# 1.0.1

- Add logging to datadog

# 1.0.0

Initial version
