FROM node:18-alpine

WORKDIR /app/

COPY . /app/

RUN npm install

RUN npm run build-web

EXPOSE 3000

CMD [ "npx", "serve", "dist", "--single" ]