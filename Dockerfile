ARG NODE_TAG=lts

FROM node:${NODE_TAG} as base

RUN npm install --global pnpm

WORKDIR /home/node/treasure-map

COPY package.json pnpm-lock.yaml ./

RUN pnpm fetch

RUN pnpm install --offline

COPY tsconfig.json .

COPY src src

RUN pnpm build

RUN pnpm prune --prod



FROM node:${NODE_TAG} as production

WORKDIR /home/node/treasure-map

COPY --from=base /home/node/treasure-map/node_modules ./node_modules

COPY --from=base /home/node/treasure-map/dist .

RUN chown -R node:node /home/node/treasure-map

USER node

ENTRYPOINT [ "node", "index.js" ]