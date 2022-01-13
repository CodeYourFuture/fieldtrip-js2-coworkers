# CYF Learning Lab

> A GitHub App and express server built with [Probot](https://github.com/probot/probot)

## Development Notes

Proxy link: https://smee.io/ncfiNkNRMrzhpjK9

Install link: https://github.com/apps/cyf-learning-lab/installations/new

- Adds to Install and Authorized Github Apps

Login link: http://localhost:3000/app/login

- Redirects to https://github.com/login/oauth/authorize?client_id=Iv1.40c3b8ab12e6d9d3&redirect_uri=https%3A%2F%2Fsmee.io%2FncfiNkNRMrzhpjK9%2Fprobot%2Flogin%2Fcb)
- Only adds as authorized app

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t edu-bot .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> edu-bot
```

## Contributing

If you have suggestions for how edu-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

© 2022 Daniel Grant <1670902+djgrant@users.noreply.github.com>
