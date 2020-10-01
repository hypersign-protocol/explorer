FROM node:12.6.0-buster as build-stage
WORKDIR /app

COPY package*json ./

COPY .env .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.13.8 as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY --from=build-stage /app/entrypoint.sh /
COPY --from=build-stage /app/jvjr-env.json /
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "/entrypoint.sh", "/usr/share/nginx/html/js", "app" ]
CMD ["nginx", "-g", "daemon off;"]