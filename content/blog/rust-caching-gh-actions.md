+++
title = "Building a simple Rust caching workflow in GitHub Actions"
date = 2025-11-23
description = "This is a simple walkthrough on how to create a small workflow for storing compile-time artifacts and the Cargo registry for Rust projects."
authors = ["hitblast"]

[taxonomies]
tags = ["experiences"]
+++

## Backstory

So I was working on one of the projects under [Machlit](https://machlit.github.io) and I noticed something - my Rust workflows were failing. I usually double-check what I'm doing and always verify refactoring practices before committing, but the very same workflow that double-checked for me was failing. This usually doesn't happen, so I looked deeper into it, and found out it was erroring at the registry caching step:

```
Error: The template is not valid. .github/workflows/refactor.yml (Line: 47, Col: 16): hashFiles('Cargo.lock') failed. Fail to hash files under directory '/Users/runner/work/defaults-rs/defaults-rs'
```

Turns out Cargo.lock simply wasn't a reliable hashing method for cache keys anymore, so I had to resort to a simpler solution.

## Creating a new workflow

In order to create the new refactoring workflow, I first started with a minimal template:

```yaml
name: Refactor CI

on:
  push:
    branches:
      - master
  pull_request:
    branches: [master]

env:
  # todo

concurrency:
  # todo

jobs:
  # todo
```

The workflow, as you can see, will only work on `push`/`pull_request` events to the `master` branch. To start off, let's setup our environment variables:'

```yaml
env:
  CARGO_TERM_COLOR: always
  SCCACHE_GHA_ENABLED: "true"
  SCCACHE_CACHE_SIZE: 2G
  RUSTC_WRAPPER: "sccache"
```

Here:

1. `CARGO_TERM_COLOR` enables pretty-printing and colors for the Cargo environment. I usually find it easier to navigate since it feels like I'm working with the terminal output of my local machine.
2. `SCCACHE_GHA_ENABLED` is a generic flag for `sccache` to be enabled inside the GitHub Actions environment. We'll use it later with one dependency.
3. `SCCACHE_CACHE_SIZE` sets the size limit of your cache. The free plan of GitHub Actions includes 10G of cache storage, but I've set it to 2G just for minimal caching.
4. `RUSTC_WRAPPER` sets `sccache` as the primary wrapper for linking during the compilation process.

We'll also now setup the concurrency regulations:

```yaml
concurrency:
  group: "tests"
  cancel-in-progress: true
```

This separates the job into particular named groups for easy cancellation in the event of multiple commits overlapping in time.

## Writing the jobs

Since I was working with a macOS project, I had selected the runner to be `macos-latest`. You can choose it to be `ubuntu-latest`, and possibly even `windows-latest` but that might be conflicting with parts of the workflow. Windows just isn't that reliable.

Now let's write the next part of the file:

```yaml
jobs:
  tests:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v5

      - uses: actions-rs/toolchain@v1
        with:
          profile: minimal
          toolchain: stable
          override: true
          components: clippy, rustfmt
```

This workflow uses the minimal stable variant of the Rust toolchain. I recommend using this once since this requires less headroom in your runner instance and is probably faster to setup.

Some optional components which I've also added:

- `clippy`: Might not be needed explicitly unless you're working with lints and/or formatting fixes.
- `rustfmt`: Same as above - optional.

## Applying the cache!

Let's add two new steps inside our `tests` job:

```yaml
      - uses: Swatinem/rust-cache@v2
      - uses: mozilla-actions/sccache-action@v0.0.9

      # show sccache stats for cache hits/misses
      # optional; you can remove it if you don't need but it pretty-prints!
      - run: sccache --show-stats || true
```

Here:

- The first dependency here ensures that the compile-time artifacts such as registry, build artifacts and other jargon are properly cached.
- The second dependency is specifically for `sccache`. Remember how I said we'll use an arbitrary environment variable to enable wrapping with `sccache`? Well here it is.

The reason why I've used `Swatinem/rust-cache@v2` for caching registries instead of manually storing it in my previous workflow is because its much more convenient to save and restore keys using static names based on the workflow instead of hashes, and this dependency does that without fuzz.

Now to finish, we'll add our different lint/formatting checks:

```yaml
      - name: Run clippy
        run: cargo clippy --all-targets --no-deps -v -- -D warnings

      - name: Check formatting
        run: cargo fmt --all -- --check
```

## Complete workflow

Once you've followed all the steps above, you'll have a workflow which looks something like this:

```yaml
name: Refactor CI

on:
  push:
    branches:
      - master
  pull_request:
    branches: [master]

env:
  CARGO_TERM_COLOR: always
  SCCACHE_GHA_ENABLED: "true"
  SCCACHE_CACHE_SIZE: 2G
  RUSTC_WRAPPER: "sccache"

concurrency:
  group: "tests"
  cancel-in-progress: true

jobs:
  tests:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v5

      - uses: actions-rs/toolchain@v1
        with:
          profile: minimal
          toolchain: stable
          override: true
          components: clippy, rustfmt

      - uses: Swatinem/rust-cache@v2
      - uses: mozilla-actions/sccache-action@v0.0.9

      - run: sccache --show-stats || true

      - run: cargo clippy --all-targets --no-deps -v -- -D warnings
      - run: cargo fmt --all -- --check
```

## Summing it up

There you have it - a nice and tidy GitHub Actions workflow which you can directly place into your code for optimized compile-time performance using a simple caching method. This is very easily movable to a more larger workflow like making production builds, with only minor adjustments to the components being used.
