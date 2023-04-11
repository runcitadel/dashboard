# Define version & use pinned images
ARG NODE_VERSION=18

# Build on the host architecture, change this if you're building on arm64
FROM amd64/node:${NODE_VERSION}-alpine@sha256:77f86133ced42635d78a2ca2ab27945f8ac9aa06ef092f52c84bb9b2a13055fc as node-builder
# Use multi-arch image for running the app
FROM node:${NODE_VERSION}-alpine@sha256:469ee26d9e00547ea91202a34ff2542f984c2c60a2edbb4007558ccb76b56df2 as node-runner

# DEPENDENCIES (production)
FROM node-builder AS dependencies
RUN apk add git

# Create app directory
WORKDIR /app

# Copy dependency management files
COPY .yarnrc.yml yarn.lock package.json ./
COPY .yarn/releases/yarn-3.5.0.cjs /app/.yarn/releases/yarn-3.5.0.cjs
# Install dependencies
RUN yarn install


# BUILD (production)
FROM dependencies AS builder

WORKDIR /app

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# Build app for production
RUN ./node_modules/.bin/vite build


# PRODUCTION
FROM node-runner AS production
RUN npm -g i serve
COPY --from=builder --chown=node:node /app/dist/ /dist
ENV NODE_ENV prodution
ENV PORT 3000
EXPOSE 3000
USER node
CMD [ "serve", "--single", "/dist" ]
