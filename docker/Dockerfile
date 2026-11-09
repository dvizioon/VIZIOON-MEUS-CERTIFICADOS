FROM oven/bun:1.4-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM node:22-alpine

ARG APP_PORT=5560
ARG PORT=5560
ARG APP_ENV=production
ENV PORT=${PORT}
ENV APP_ENV=${APP_ENV}
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
  && chmod +x /usr/local/bin/docker-entrypoint.sh \
  && addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001 -G nodejs \
  && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE ${PORT}
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
