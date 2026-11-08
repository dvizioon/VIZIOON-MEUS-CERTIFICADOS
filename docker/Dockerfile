FROM oven/bun:1.4-debian AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM node:22-bookworm-slim

ARG APP_PORT=5560
ARG PORT=5560
ARG APP_ENV=production
ENV PORT=${PORT}
ENV APP_ENV=${APP_ENV}
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE ${PORT}
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
