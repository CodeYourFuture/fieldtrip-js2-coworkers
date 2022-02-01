FROM node:14-slim
WORKDIR /usr/src/app
COPY package.json yarn.lock tsconfig.json lerna.json ./
COPY apps/server apps/server/
COPY courses courses/
RUN yarn install
RUN yarn build
CMD [ "npm", "start" ]
