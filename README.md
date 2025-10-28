# Blogfolio

This is my personal blog page and portfolio combined into one. I write stuff here, post my work and just have fun tweaking around with it.

The site is made using [zola](https://www.getzola.org) which is a static site generator. Deployed using [this workflow](./.github/workflows/deploy.yml).

## Hosting

```bash
# local deployment (install needs to be run for the first time)
mise install && mise serve
```

## Creating a new blog entry

I use [mise tasks](./mise.toml) for this:

```bash
mise create <filename> <title> <desc>
```

## License

Check [LICENSE.md](./LICENSE.md) for license information related to this repository.
