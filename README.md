[![Version](https://img.shields.io/github/v/release/rubcitadel/dashboard?color=%235351FB&label=version)](https://github.com/runcitadel/dashboard/releases)
[![Docker Build](https://img.shields.io/github/workflow/status/runcitadel/umbrel-dashboard/Docker%20build%20on%20push?color=%235351FB)](https://github.com/runcitadel/dashboard/actions?query=workflow%3A"Docker+build+on+push")
[![Docker Pulls](https://img.shields.io/docker/pulls/runcitadel/dashboard?color=%235351FB)](https://hub.docker.com/repository/registry-1.docker.io/runcitadel/dashboard/tags?page=1)
[![Discord Server](https://img.shields.io/badge/Community%20Chat-Discord-%235351FB)](https://discord.gg/6U3kM2cjdB)
[![Twitter](https://img.shields.io/twitter/follow/runcitadel?style=social)](https://twitter.com/runcitadel)


# 🏰 dashboard

Dashboard is the web-based user interface of [Citadel] and is accessible at `http://umbrel.local`. It runs by-default as a containerized service.

## ⚠️ Outdated information

The information below might be outdated and / or refering to Umbrel. This project is not yet fully off it's Umbrel roots.

## 🚀 Getting started

TBD

## 🛠 Running dashboard

Make sure both [`citadel-manager`](https://github.com/runcitadel/manager) and [`umbrel-middleware`](https://github.com/runcitadel/middleware) are running and available.

### Step 1. Install dependencies
```sh
yarn
```

### Step 2. Set environment variables
The following environment variables are set in `.env` file of the project's root:

| Variable | Description | Default |
| ------------- | ------------- | ------------- |
| `VUE_APP_MANAGER_API_URL` | URL of [`umbrel-manager`](https://github.com/getumbrel/umbrel-manager) API | `http://localhost:3006` |
| `VUE_APP_MIDDLEWARE_API_URL` | URL of [`umbrel-middleware`](https://github.com/getumbrel/umbrel-middleware) API | `http://localhost:3005` |

If you want to change the local development environment (e.g. to use your local Umbrel instance), create the `.env.development` with the following content:

```sh
VUE_APP_MIDDLEWARE_API_URL=http://umbrel.local/api
VUE_APP_MANAGER_API_URL=http://umbrel.local/manager-api
```

### Step 3. Run dashboard
```sh
yarn serve
```

Dashboard should now be accessible at `http://localhost:8080`.

## Building dashboard
To build dashboard for production, run:
```sh
yarn build
```
Built code will be inside `/dist`.

---

### ⚡️ Don't be too reckless

> Cidadel is still in an early stage and things are expected to break every now and then. We **DO NOT** recommend running it on the mainnet with real money just yet, unless you want to be really *#reckless*.

## ❤️ Contributing

We welcome and appreciate new contributions!


## 📜 License

### ⚠️ This information is refering Citadel's Umbrel basis, it is migrating off Umbrel to AGPL.

Umbrel (and Umbrel Dashboard) is licensed under the PolyForm Noncommercial 1.0.0 license. [...]
[![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-%235351FB)](https://github.com/getumbrel/umbrel/blob/master/LICENSE.md)


