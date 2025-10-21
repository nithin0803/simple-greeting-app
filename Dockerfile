FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
