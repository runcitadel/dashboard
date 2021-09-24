FROM node:16-bullseye-slim AS umbrel-dashboard-builder

ARG STAGING_DEPLOYMENT=false

# make the 'app' folder the current working directory
WORKDIR /app


# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# install dependencies
RUN yarn

# build app for production
RUN yarn build


FROM node:16-bullseye-slim AS umbrel-dashboard

RUN yarn global add serve

COPY --from=umbrel-dashboard-builder /app/dist/ /dist

ENV PORT=3004
EXPOSE 3004

CMD [ "serve", "--single", "/dist" ]
