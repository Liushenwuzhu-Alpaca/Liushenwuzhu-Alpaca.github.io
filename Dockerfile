FROM node:22-slim AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM nginx:1.29-alpine AS runtime

RUN addgroup -S blog && adduser -S blog -G blog \
  && rm /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

RUN chown -R blog:blog /usr/share/nginx/html

COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
  listen 80;
  listen [::]:80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ $uri.html =404;
  }

  location = /404.html {
    internal;
  }

  location ~* \.(?:css|js|mjs|woff2?|ttf|otf|svg|png|jpe?g|webp|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
  }
}
EOF

USER blog

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]