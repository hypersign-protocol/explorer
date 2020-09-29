# Explorer

## Manual

### Install

If do not want to setup manul, then skip to the docker [section](#or-simply-use-docker-container). 

```bash
git clone https://github.com/hypersign-protocol/explorer #Pull the repo
cd explorer
npm i
```

### Build & Run

#### Prod

```bash
npm run build
npm run serve
```

#### Dev

```bash
npm run serve
```

## Using docker container

### Build

```bash
docker build -t hypersignprotocol/explorer:test .
```

### Pull

```bash
docker pull hypersignprotocol/explorer:test
```

### Run

```bash
docker run -it -p 5001:80 hypersignprotocol/explorer:test
```

### Enviroments Vars

* `VUE_APP_TITLE`: Title of application
* `VUE_APP_VERSION`: Version of application
* `VUE_APP_STUDIO_BASE_URL`: Base url of studio app
* `VUE_APP_NODE_SERVER_BASE_URL`: Base url of HS blockchain node
* `VUE_APP_RECAPTCHA_SITE_KEY`: Recaptcha site key

```bash
docker run -it \
--env VUE_APP_TITLE="Identity Explorer" \
--env VUE_APP_VERSION=v1.0 \
--env VUE_APP_STUDIO_BASE_URL=http://localhost:9001/ \
--env VUE_APP_NODE_SERVER_BASE_URL=http://localhost:5000/ \
--env VUE_APP_RECAPTCHA_SITE_KEY="re captcha site key" \
-p 5001:80 hypersignprotocol/explorer:test
```

Note: If you do not pass `--env` options then all envs are taken from `.env` file.

-- 

* On success full run, the app will run on [`http://localhost:5001/`]().
* [Ref](https://shekhargulati.com/2019/01/18/dockerizing-a-vue-js-application/)


