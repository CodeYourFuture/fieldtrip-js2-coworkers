# CYF Learning Lab

An experimental platform to facilate simulations of group projects using GitHub bots.

## Local development

Creating your own development environment requires a fair bit of set up.

- First, `cp .env.example .env`
- Use ngrok (pro version with custom domains) or cloudflare tunnels to create two tunnels that proxy HTTP requests to the client and server. The session model requires that `HOST` and `CLIENT_HOST` are subdomains, and `COOKIE_DOMAIN` is the apex domain. Note: the apex domain needs to be a custom domain as domains like ngrok.io appear in https://publicsuffix.org/list/public_suffix_list.dat.
- You will need to create your own GitHub Apps at https://github.com/settings/apps/new, providing an _Setup URL_ for the auth flow and a _Webhook URL_
- For _Setup URL_, provide a URL in the form `{api_host}/auth/install/amber/cb`
- For _Webhook URL_, create a webhook proxy for each GitHub app at https://smee.io/new.
- Finally, you will need a Postgres database running, setting its connection string as `DATABASE_URL`

With that all set up, run:

```sh
yarn
yarn dev
```

## Deployment

Deployments are made to fly.io. After setting up their CLI tools and authenticating:

```
yarn deploy:client:staging
yarn deploy:client:prod
yarn deploy:server:staging
yarn deploy:server:prod
```

## Contributing

If you have suggestions for how Learning Lab could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

© 2022 Daniel Grant <1670902+djgrant@users.noreply.github.com>
