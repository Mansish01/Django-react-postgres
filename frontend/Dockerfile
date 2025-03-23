FROM node:18-alpine

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy project files
COPY frontend/ .

# Build the app
RUN npm run build

# Use a lightweight server to serve the built app
FROM nginx:alpine
COPY --from=0 /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]