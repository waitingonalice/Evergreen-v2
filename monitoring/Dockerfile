FROM node:20-alpine as base

WORKDIR /app

# Install packages needed to build node modules
RUN apk add --no-cache libc6-compat libc6-compat g++ make py3-pip

FROM base as dev
ENV NODE_ENV="development"
COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base as build
COPY . .
RUN yarn build

FROM base as prod
ENV NODE_ENV="production"
COPY --from=dev /app/package.json /app/yarn.lock /app/
COPY --from=build /app/.env /app/.env
COPY --from=build /app/src/static /app/static
COPY --from=build /app/build /app

RUN yarn install --frozen-lockfile --production

EXPOSE 8001
CMD ["node", "--env-file=./.env", "server.js"]
