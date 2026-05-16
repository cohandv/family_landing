FROM nginx:1.27-alpine

COPY index.html styles.css main.js i18n.js family.js /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/

EXPOSE 80
