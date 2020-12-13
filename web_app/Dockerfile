FROM node:11.12.0

RUN mkdir -p /usr/src/webapp

COPY dist /usr/src/webapp/dist
COPY assets /usr/src/webapp/assets
COPY server.js /usr/src/webapp/
COPY src/data/data.json /usr/src/webapp/data.json
COPY deploy-package.json /usr/src/webapp/package.json

WORKDIR /usr/src/webapp

RUN echo "package-lock=false" >> .npmrc
RUN npm i

EXPOSE 4000

CMD ["node", "server.js"]
