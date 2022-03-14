# Define version & use pinned images
ARG NODE_VERSION=16

# Build on the host architecture, change this if you're building on arm64
FROM amd64/node:${NODE_VERSION}-alpine@sha256:425c81a04546a543da824e67c91d4a603af16fbc3d875ee2f276acf8ec2b1577 as node-builder
# Use multi-arch image for running the app
FROM node:${NODE_VERSION}-alpine@sha256:2c6c59cf4d34d4f937ddfcf33bab9d8bbad8658d1b9de7b97622566a52167f2b as node-runner


# DEVELOPMENT
FROM node-builder AS development
# Create app directory
WORKDIR /app
# NOTE: Using project files from mounted volumes
ENV NODE_ENV development
ENV PORT 3004
EXPOSE 3004
USER node
CMD yarn install && yarn dev


# DEPENDENCIES (production)
FROM node-builder AS dependencies
# Create app directory
WORKDIR /app
# Copy dependency management files
COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn/releases/yarn-3.1.1.cjs /app/.yarn/releases/yarn-3.1.1.cjs
# Install dependencies
RUN yarn install


# BUILD (production)
FROM dependencies AS builder
# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .
# Build app for production
RUN yarn build


# PRODUCTION
FROM node-runner AS production
RUN npm -g i serve
COPY --from=builder --chown=node:node /app/dist/ /dist
ENV NODE_ENV prodution
ENV PORT 3004
EXPOSE 3004
USER node
CMD [ "serve", "--single", "/dist" ]
