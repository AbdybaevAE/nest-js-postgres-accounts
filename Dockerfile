FROM node:12 AS dist
COPY package.json ./

RUN yarn install

COPY . ./

RUN yarn build

FROM node:12 AS node_modules
COPY package.json ./

RUN yarn install --prod

FROM node:12


RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules

COPY . /usr/src/app

CMD [ "yarn", "start:prod" ]
