# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./

# Keep API calls on same origin through nginx reverse proxy.
ARG REACT_APP_API_BASE_URL=/api
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine AS final
WORKDIR /usr/share/nginx/html

COPY --from=build /app/build ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
