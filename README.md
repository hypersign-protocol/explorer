### Setup

```js
cd client
npm i
```

### Run

#### Dev env

```bash
npm run dev
```

On success full run, the app will run on [`http://localhost:5001/`](). You can set this port in   `vue.config.js` file.

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

## Dockerization

### Building the image (Development Env)

```bash
docker build -f Dockerfile-dev -t hypersignprotocol/explorer:dev .
```
* This will build the container for dev env.

### Building the image (Production Env)


* At first run `mv .env.staging .env`. 
* Now configure appTitle, appDescription etc.
* Run the docker build to build the image

```bash
docker build -f Dockerfile-prod -t hypersignprotocol/explorer:prod .
```

* This will build the container for prod env on the Nginx server.

### Running the container (Development Env)

```bash
docker run --env VUE_APP_TITLE="Explorer (development)" -p 5001:5001 --rm hypersignprotocol/explorer:dev
```

### Running the container (Production Env)

```bash
docker run  -p 8080:80 --rm hypersignprotocol/explorer:prod
```
