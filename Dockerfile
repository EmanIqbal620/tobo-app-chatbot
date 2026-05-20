FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npx next build --no-lint

FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 7860
CMD ["nginx", "-g", "daemon off;"]