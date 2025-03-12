# Use Node.js 20 as base image
FROM node:20 AS base
WORKDIR /app
RUN echo "Current working directory:" && pwd && ls -l
COPY . .
ARG APP
ARG PORT=3000
ENV PORT=${PORT}
RUN echo "Building for ${APP}"
RUN yarn install
RUN yarn global add @nestjs/cli
RUN echo ls -R
EXPOSE ${PORT}
RUN chmod +x ./run_container.sh
ENV APP=${APP}
ENTRYPOINT ["/bin/bash", "./run_container.sh"]
