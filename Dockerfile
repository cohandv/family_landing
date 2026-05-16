FROM node:22-alpine AS manifest
WORKDIR /app
COPY scripts/generate-manifest.js scripts/
COPY images/ images/
RUN node scripts/generate-manifest.js

FROM nginx:1.27-alpine

COPY index.html styles.css main.js carousel.js i18n.js family.js /usr/share/nginx/html/
COPY --from=manifest /app/images/ /usr/share/nginx/html/images/

EXPOSE 80
