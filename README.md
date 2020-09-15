## Explorer

### Manul Setup

If do not want to setup manul, then skip to the docker [section](#or-simply-use-docker-container). 

```bash
git clone https://github.com/hypersign-protocol/explorer #Pull the repo
cd explorer
npm i
```

### Run

#### Dev env

```bash
npm run dev
```

#### Prod env

```bash
npm run setEnv
npm run serve
```

Make sure you change the env var as per your requirement.

### Build

```bash
npm run build
```

## Or Simply Use Docker Container

### Pull the image

```bash
docker pull hypersignprotocol/explorer
```

### Run container

Cone the repo and change directory

```bash
git clone https://github.com/hypersign-protocol/explorer #Pull the repo
cd explorer
```

Now run the container. 

```bash
docker run -it -v ${PWD}:/app -v /app/node_modules -p 5001:5001 hypersignprotocol/explorer
```
We are mounting the current directory for source code and running the container. 

-- 

* On success full run, the app will run on [`http://localhost:5001/`]().
* [Ref](https://shekhargulati.com/2019/01/18/dockerizing-a-vue-js-application/)


