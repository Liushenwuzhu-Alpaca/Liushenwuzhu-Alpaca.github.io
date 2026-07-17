# Build stage: install dependencies and generate the static site.
FROM node:22-slim AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Runtime stage: unprivileged nginx serving the static output on 8080.
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
