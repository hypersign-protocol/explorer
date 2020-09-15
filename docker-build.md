## Dockerization

### Building the image (Production Env)


* At first run `mv .env.staging .env`. 
* Now configure appTitle, appDescription etc.
* Run the docker build to build the image

```bash
docker build -f Dockerfile-prod -t hypersignprotocol/explorer:prod .
```

* This will build the container for prod env on the Nginx server.

### Running the container (Production Env)

```bash
docker run  -p 5001:80 --rm hypersignprotocol/explorer:prod
```
